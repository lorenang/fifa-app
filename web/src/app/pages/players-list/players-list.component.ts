import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PlayerService } from '../../core/player.service';

@Component({
  selector: 'app-players-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
  <h2>Jugadores</h2>
  <form (ngSubmit)="search()">
    <input [(ngModel)]="filters.name" name="name" placeholder="Nombre">
    <input [(ngModel)]="filters.club" name="club" placeholder="Club">
    <input [(ngModel)]="filters.position" name="position" placeholder="Posición">
    <input type="number" [(ngModel)]="filters.year" name="year" placeholder="Año (2015-2023)">
    <input type="number" [(ngModel)]="filters.limit" name="limit" placeholder="Límite">
    <button>Buscar</button>
    <a [href]="exportUrl()" target="_blank" rel="noopener">Export XLSX</a>
  </form>

  <table border="1" cellpadding="6">
    <thead><tr><th>Nombre</th><th>Posición</th><th>Club</th><th>OVR</th><th></th></tr></thead>
    <tbody>
      <tr *ngFor="let p of data">
        <td>{{p.long_name}}</td>
        <td>{{p.player_positions}}</td>
        <td>{{p.club_name}}</td>
        <td>{{p.overall}}</td>
        <td>
          <a [routerLink]="['/players', p.id]">Ver</a>
          <a [routerLink]="['/admin/edit', p.id]">Editar</a>
        </td>
      </tr>
    </tbody>
  </table>

  <p>Total: {{meta?.total}} | Mostrando: {{data.length}}</p>
  `
})
export class PlayersListComponent implements OnInit {
  data:any[]=[]; meta:any;
  filters:any={ limit:20 };
  constructor(private api:PlayerService){}
  ngOnInit(){ this.search(); }
  search(){ this.api.list(this.filters).subscribe(r=>{ this.data=r.data; this.meta=r.meta; }); }
  exportUrl(){ return this.api.exportXlsx(this.filters); }
}
