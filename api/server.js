// server.js — API FIFA
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { Op } = require('sequelize');
const ExcelJS = require('exceljs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { sequelize } = require('./db');
const Player = require('./models/player');

const app = express();
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(express.json());

// ---------- Auth helpers ----------
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret'; // usa variable de entorno en prod

// usuario demo (en producción usarías tabla users)
const DEMO_USER = {
  id: 1,
  email: 'admin@example.com',
  // password: admin123
  passwordHash: bcrypt.hashSync('admin123', 10),
  name: 'Admin'
};

const signToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '8h' });

function requireAuth(req, res, next) {
  const h = req.headers.authorization || '';
  const token = h.startsWith('Bearer ') ? h.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

// ---------- Utils ----------
function buildFilters(q) {
  const where = {};
  if (q.name) where.long_name = { [Op.like]: `%${q.name}%` };
  if (q.club) where.club_name = { [Op.like]: `%${q.club}%` };
  if (q.position) where.player_positions = { [Op.like]: `%${q.position}%` };
  if (q.year) where.fifa_version = String(q.year);
  return where;
}

// ---------- Públicas ----------
app.get('/health', (req, res) => res.json({ ok: true }));

// Listado paginado + filtros
app.get('/players', async (req, res) => {
  try {
    const page  = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 200);
    const offset = (page - 1) * limit;

    const { rows, count } = await Player.findAndCountAll({
      where: buildFilters(req.query),
      limit,
      offset,
      order: [['overall', 'DESC'], ['id', 'ASC']]
    });

    res.json({ data: rows, meta: { page, limit, total: count } });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error fetching players' });
  }
});

// Detalle por id
app.get('/players/:id', async (req, res) => {
  try {
    const p = await Player.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error fetching player' });
  }
});

// Login (devuelve token)
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'email & password required' });
  if (email !== DEMO_USER.email) return res.status(401).json({ message: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, DEMO_USER.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = signToken({ sub: DEMO_USER.id, email: DEMO_USER.email, name: DEMO_USER.name });
  res.json({ token, user: { id: DEMO_USER.id, email: DEMO_USER.email, name: DEMO_USER.name } });
});

// ---------- Protegidas (requiere Bearer token) ----------
app.use(requireAuth);

// Crear jugador (incluye “vos como jugador”)
const { body, validationResult } = require('express-validator');
const validate = (rules) => [
  ...rules,
  (req, res, next) => {
    const e = validationResult(req);
    if (!e.isEmpty()) return res.status(422).json({ errors: e.array() });
    next();
  }
];

app.post('/players', validate([
  body('long_name').isString().isLength({ min: 1, max: 255 }),
  body('player_positions').isString().isLength({ min: 1, max: 255 }),
  body('club_name').optional().isString(),
  body('nationality_name').optional().isString(),
  ...['overall','pace','shooting','passing','dribbling','defending','physic']
    .map(f => body(f).isInt({ min: 0, max: 99 })),
  body('fifa_version').optional().isString()
]), async (req, res) => {
  try {
    const payload = { fifa_version: req.body.fifa_version || '2023', ...req.body };
    const created = await Player.create(payload);
    res.status(201).json(created);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error creating player' });
  }
});

// Editar jugador
app.put('/players/:id', validate([
  body('long_name').optional().isString().isLength({ min: 1, max: 255 }),
  body('player_positions').optional().isString().isLength({ min: 1, max: 255 }),
  body('club_name').optional().isString().isLength({ max: 255 }),
  body('nationality_name').optional().isString().isLength({ max: 255 }),
  ...['overall','pace','shooting','passing','dribbling','defending','physic']
    .map(f => body(f).optional().isInt({ min: 0, max: 99 }))
]), async (req, res) => {
  try {
    const p = await Player.findByPk(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    await p.update(req.body);
    res.json(p);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error updating player' });
  }
});

// Export CSV
app.get('/players/export.csv', async (req, res) => {
  try {
    const rows = await Player.findAll({
      where: buildFilters(req.query),
      attributes: [
        'id','fifa_version','long_name','player_positions','club_name','nationality_name',
        'overall','pace','shooting','passing','dribbling','defending','physic'
      ],
      order: [['overall','DESC'],['id','ASC']]
    });

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="players.csv"');

    const headers = ['id','fifa_version','long_name','player_positions','club_name',
      'nationality_name','overall','pace','shooting','passing','dribbling','defending','physic'];
    res.write(headers.join(',') + '\n');

    for (const r of rows) {
      const v = headers.map(h => {
        const val = r.get(h);
        if (val == null) return '';
        const s = String(val).replace(/"/g, '""');
        return /[",\n]/.test(s) ? `"${s}"` : s;
      });
      res.write(v.join(',') + '\n');
    }
    res.end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error exporting CSV' });
  }
});

// Export XLSX
app.get('/players/export.xlsx', async (req, res) => {
  try {
    const rows = await Player.findAll({
      where: buildFilters(req.query),
      attributes: [
        'id','fifa_version','long_name','player_positions','club_name','nationality_name',
        'overall','pace','shooting','passing','dribbling','defending','physic'
      ],
      order: [['overall','DESC'],['id','ASC']]
    });

    const wb = new ExcelJS.Workbook();
    const ws = wb.addWorksheet('Players');
    ws.columns = [
      { header: 'ID', key: 'id' },
      { header: 'FIFA', key: 'fifa_version' },
      { header: 'Name', key: 'long_name' },
      { header: 'Positions', key: 'player_positions' },
      { header: 'Club', key: 'club_name' },
      { header: 'Nation', key: 'nationality_name' },
      { header: 'OVR', key: 'overall' },
      { header: 'PAC', key: 'pace' },
      { header: 'SHO', key: 'shooting' },
      { header: 'PAS', key: 'passing' },
      { header: 'DRI', key: 'dribbling' },
      { header: 'DEF', key: 'defending' },
      { header: 'PHY', key: 'physic' }
    ];
    rows.forEach(r => ws.addRow(r.toJSON()));

    res.setHeader('Content-Type','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition','attachment; filename="players.xlsx"');
    await wb.xlsx.write(res);
    res.end();
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: 'Error exporting XLSX' });
  }
});

// ---------- Arranque ----------
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST, () => console.log(`API listening on ${HOST}:${PORT}`));
