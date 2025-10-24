import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from '../../core/player.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartType, ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  template: `
  <div *ngIf="p">
    <h2>{{p.long_name}} ({{p.fifa_version}})</h2>
    <img *ngIf="p.player_face_url" [src]="p.player_face_url" alt="face">
    <p>{{p.player_positions}} - {{p.club_name}} - {{p.nationality_name}}</p>

    <div style="max-width:520px">
      <canvas baseChart [type]="radarType" [data]="radarData" [options]="radarOptions"></canvas>
    </div>
  </div>
  `
})
export class PlayerDetailComponent implements OnInit {
  p:any;
  radarType: ChartType = 'radar';
  radarData: ChartData<'radar'> = { labels: ['Pace','Shooting','Passing','Dribbling','Defending','Physic'], datasets: [] };
  radarOptions: ChartConfiguration['options'] = { responsive: true, scales: { r: { suggestedMin: 0, suggestedMax: 99 } } };

  constructor(private route:ActivatedRoute, private api:PlayerService) {}
  ngOnInit(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.get(id).subscribe(p=>{
      this.p = p;
      this.radarData = {
        labels: ['Pace','Shooting','Passing','Dribbling','Defending','Physic'],
        datasets: [{ label: p.long_name, data: [p.pace,p.shooting,p.passing,p.dribbling,p.defending,p.physic] }]
      };
    });
  }
}
