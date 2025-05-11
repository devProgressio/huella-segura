import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LostPetService, LostPetReport } from './lost-pet.service';
import { MapComponent } from '../map/map';
import { CommonModule } from '@angular/common';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ReportService } from '../../services/report.service';
import { IReport } from '../../models/report';

@Component({
  selector: 'app-lost-pet',
  standalone: true,
  imports: [CommonModule, FormsModule, MapComponent, FormsModule, TextareaModule, ButtonModule, InputTextModule],
  template: `
    <form (ngSubmit)="submit()">
      <app-map (pinPlaced)="onPin($event)"></app-map>
      <div *ngIf="location">
        <p>Ubicación: {{ location.lat | number:'1.4-4' }}, {{ location.lng | number:'1.4-4' }}</p>
      </div>
      <label> 
        Nombre de la mascota:
      </label>
      <input type="text" [(ngModel)]="report.nombre" name="name" required pInputText/>
      <!--<label> Tipo de mascota: </label>
       <input type="text" [(ngModel)]="report.tipoMascota" name="type" required pInputText/>
      <label> Raza: </label>
      <input type="text" [(ngModel)]="report.raza" name="breed" required pInputText/>
      <label> Color: </label>
      <input type="text" [(ngModel)]="report.color" name="color" required pInputText/> -->
      <label> Teléfono: </label>
      <input type="text" [(ngModel)]="report.telefono" name="phone" required pInputText/>
      <label> Dirección: </label>
      <input type="text" [(ngModel)]="report.direccion" name="address" required pInputText/>

      <label>
        Descripción:
        </label>
        <textarea [(ngModel)]="report.descripcion" name="desc" required pTextarea rows="7" cols="60"></textarea>
      <button type="submit" pButton>Reportar mascota perdida</button>
    </form>
  `,
  styles: [
    `form { display: flex; flex-direction: column; gap: 1rem; }
     textarea { width: 100%; height: 5rem; }`
  ]
})
export class LostPetComponent {
  location?: { lat: number; lng: number };

  report: IReport = {
    nombre: '',
    direccion: '',
    telefono: '',
    descripcion: '',
    latitud: 0,
    longitud: 0
  };
  constructor(private readonly reportService: ReportService) {}

  onPin(coords: { lat: number; lng: number }) {
    this.location = coords;
    this.report.latitud = coords.lat;
    this.report.longitud = coords.lng;
  }

  submit() {
    if (!this.location) {
      alert('Debe fijar una ubicación');
      return;
    }

    this.reportService.createReport(this.report).subscribe(() => {
      alert('Reporte enviado con éxito');
      this.report = {
        nombre: '',
        direccion: '',
        telefono: '',
        descripcion: '',
        latitud: 0,
        longitud: 0
      };
      this.location = undefined;
    });
  }
}