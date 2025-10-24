import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PlayerService } from '../../core/player.service';

@Component({
  selector: 'app-player-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
  <h2>{{id ? 'Editar' : 'Nuevo'}} jugador</h2>
  <form [formGroup]="form" (ngSubmit)="submit()">
    <input formControlName="long_name" placeholder="Nombre completo">
    <input formControlName="player_positions" placeholder="Posiciones (ej: ST, RW)">
    <input formControlName="club_name" placeholder="Club">
    <input formControlName="nationality_name" placeholder="Nacionalidad">
    <input formControlName="fifa_version" placeholder="FIFA (2015-2023)">

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:10px 0">
      <label>OVR <input type="number" formControlName="overall"></label>
      <label>PAC <input type="number" formControlName="pace"></label>
      <label>SHO <input type="number" formControlName="shooting"></label>
      <label>PAS <input type="number" formControlName="passing"></label>
      <label>DRI <input type="number" formControlName="dribbling"></label>
      <label>DEF <input type="number" formControlName="defending"></label>
      <label>PHY <input type="number" formControlName="physic"></label>
    </div>

    <button [disabled]="form.invalid">{{id ? 'Guardar' : 'Crear'}}</button>
    <button type="button" (click)="cancel()">Cancelar</button>
  </form>
  `
})
export class PlayerFormComponent implements OnInit {
  id?: number;
  form = this.fb.group({
    long_name: ['', [Validators.required, Validators.maxLength(255)]],
    player_positions: ['', [Validators.required, Validators.maxLength(255)]],
    club_name: [''],
    nationality_name: [''],
    fifa_version: ['2023'],
    overall: [50, [Validators.min(0), Validators.max(99)]],
    pace: [50, [Validators.min(0), Validators.max(99)]],
    shooting: [50, [Validators.min(0), Validators.max(99)]],
    passing: [50, [Validators.min(0), Validators.max(99)]],
    dribbling: [50, [Validators.min(0), Validators.max(99)]],
    defending: [50, [Validators.min(0), Validators.max(99)]],
    physic: [50, [Validators.min(0), Validators.max(99)]],
  });

  constructor(private fb:FormBuilder, private api:PlayerService, private route:ActivatedRoute, private router:Router){}

  ngOnInit(){
    const maybe = this.route.snapshot.paramMap.get('id');
    if (maybe) {
      this.id = Number(maybe);
      this.api.get(this.id).subscribe(p => this.form.patchValue(p));
    }
  }

  submit(){
    const payload = this.form.value;
    if (this.id) {
      this.api.update(this.id, payload).subscribe(()=> this.router.navigate(['/players']));
    } else {
      this.api.create(payload).subscribe(()=> this.router.navigate(['/players']));
    }
  }
  cancel(){ this.router.navigate(['/players']); }
}
