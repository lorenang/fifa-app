import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  base = '/api';
  constructor(private http: HttpClient) {}

  list(q:any) {
    let p = new HttpParams();
    Object.entries(q||{}).forEach(([k,v]) => { if(v!=='' && v!=null) p = p.set(k, String(v)); });
    return this.http.get<{data:any[], meta:any}>(`${this.base}/players`, { params: p });
  }
  get(id:number){ return this.http.get<any>(`${this.base}/players/${id}`); }
  create(payload:any){ return this.http.post<any>(`${this.base}/players`, payload); }
  update(id:number, payload:any){ return this.http.put<any>(`${this.base}/players/${id}`, payload); }
  exportXlsx(q:any){
    let p = new HttpParams();
    Object.entries(q||{}).forEach(([k,v]) => { if(v!=='' && v!=null) p = p.set(k, String(v)); });
    return `${this.base}/players/export.xlsx?${p.toString()}`;
  }
}
