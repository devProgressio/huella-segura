import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IReport } from '../models/report';

@Injectable({ providedIn: 'root' })
export class ReportService {
  private readonly api = 'http://localhost:3000/reports/';

  constructor(private readonly http: HttpClient) {}

  getReports(): Observable<IReport[]> {
    return this.http.get<IReport[]>(this.api);
  }

  getReportById(id: string): Observable<IReport> {
    return this.http.get<IReport>(`${this.api}/${id}`);
  }

  createReport(report: IReport): Observable<IReport> {
    return this.http.post<IReport>(this.api, report);
  }

  updateReport(id: string, report: IReport): Observable<IReport> {
    return this.http.put<IReport>(`${this.api}/${id}`, report);
  }

  deleteReport(id: string): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }

  getImageRandom(): Observable<any> {
    return this.http.get('https://dog.ceo/api/breeds/image/random');
  }
}