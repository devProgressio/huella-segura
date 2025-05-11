import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IReport } from '../../models/report';

export interface LostPetReport {
  lat: number;
  lng: number;
  description: string;
}

@Injectable({ providedIn: 'root' })
export class LostPetService {
  private readonly api = 'http://localhost:3000/api/lost-pets';

  constructor(private readonly http: HttpClient) {}

  reportLostPet(data: IReport): Observable<any> {
    return this.http.post(this.api, data);
  }
}