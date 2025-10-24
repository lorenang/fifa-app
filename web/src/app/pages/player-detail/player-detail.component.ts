import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from '../../core/player.service';
import { Chart, ChartConfiguration, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

@Component({
  selector: 'app-player-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div *ngIf="p">
    <h2>{{p.long_name}} ({{p.fifa_version}})</h2>
    <img *ngIf="p.player_face_url" [src]="p.player_face_url" alt="face" style="max-height:120px">
    <p>{{p.player_positions}} - {{p.club_name}} - {{p.nationality_name}}</p>

    <div style="max-width:520px">
      <canvas #radar></canvas>
    </div>
  </div>
  `
})
export class PlayerDetailComponent implements OnInit, OnDestroy {
  p:any;
  @ViewChild('radar') radarRef!: ElementRef<HTMLCanvasElement>;
  chart?: Chart<'radar'>;

  constructor(private route:ActivatedRoute, private api:PlayerService) {}
  ngOnInit(){
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.get(id).subscribe(p=>{
      this.p = p;
      setTimeout(()=> this.drawChart(), 0);
    });
  }
  drawChart(){
    if (!this.p || !this.radarRef) return;
    const data = [this.p.pace,this.p.shooting,this.p.passing,this.p.dribbling,this.p.defending,this.p.physic];
    const cfg: ChartConfiguration<'radar'> = {
      type: 'radar',
      data: {
        labels: ['Pace','Shooting','Passing','Dribbling','Defending','Physic'],
        datasets: [{ label: this.p.long_name, data }]
      },
      options: { responsive: true, scales: { r: { suggestedMin: 0, suggestedMax: 99 } } }
    };
    this.chart?.destroy();
    this.chart = new Chart(this.radarRef.nativeElement.getContext('2d')!, cfg);
  }
  ngOnDestroy(){ this.chart?.destroy(); }
}
