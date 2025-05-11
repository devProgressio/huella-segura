import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../services/report.service';
import { CardModule } from 'primeng/card';
import { RouterModule } from '@angular/router';
import { IReport } from '../../models/report';

@Component({
  selector: 'app-report-list',
  standalone: true,
  imports: [CommonModule, CardModule, RouterModule],
  template: `
    <h2>Reportes de Mascotas Perdidas</h2>
    <div class="report-cards">
      <p-card *ngFor="let rpt of reports" [header]="rpt.nombre">
        <ng-template pTemplate="title">
          <img alt="Card" class="w-full mb-2" [src]="image" width="30" height="30"/>
          <h3>{{ rpt?.nombre }}</h3>
        </ng-template>
        <ng-template pTemplate="subtitle">
          {{ rpt?.direccion }}
        </ng-template>
        <div class="p-card-content">
          <p><strong>Teléfono:</strong> {{ rpt?.telefono }}</p>
          <p><strong>Descripción:</strong> {{ rpt?.descripcion }}</p>
                    <p><strong>Ubicación:</strong></p>
          <a [href]="'https://www.openstreetmap.org/?mlat='+rpt.latitud+'&mlon='+rpt.longitud+'#map=15/'+rpt.latitud+'/'+rpt.longitud" target="_blank" rel="noopener">
            <img [src]="'https://staticmap.openstreetmap.de/staticmap?center='+rpt.latitud+','+rpt.longitud+'&zoom=15&size=200x100&markers='+rpt.latitud+','+rpt.longitud+',red-pushpin'" alt="Mapa" class="map-thumb" />
          </a>
        </div>
      </p-card>
    </div>
  `,
  styles: [
    `.report-cards {
       display: grid;
       grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
       gap: 1rem;
     }
     p-card { width: 100%; }
     .p-card-content p { margin: .5rem 0; }`
  ]
})
export class ReportListComponent implements OnInit {
  reports: IReport[] = [];

  image: string = '';

  constructor(private readonly svc: ReportService) {}

  ngOnInit() {
    this.svc.getReports().subscribe({
      next: (data: any) => this.reports = data.data,
      error: err => console.error('Error loading reports', err)
    });

    this.svc.getImageRandom().subscribe({
      next: (data: any) => this.image = data.message,
      error: err => console.error('Error loading image', err)
    });
    
  }
}
