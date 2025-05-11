// src/app/shared/map/map.component.ts
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { tileLayer, latLng, marker, icon, Marker, Map, LeafletMouseEvent } from 'leaflet';
import { LeafletModule } from '@bluehalo/ngx-leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [LeafletModule, CommonModule],
  template: `
    <div
      style="height: 600px; width: 100%;"
      leaflet
      [leafletOptions]="options"
      [leafletLayers]="markers"
      (leafletMapReady)="onMapReady($event)">
    </div>
  `,
  styles: [
    `:host ::ng-deep .leaflet-container {
       height: 100%;
       width: 100%;
     }`
  ]
})
export class MapComponent {
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap'
      })
    ],
    zoom: 13,
    center: latLng(-33.4489, -70.6693)
  };

  markers: Marker[] = [];
  @Output() pinPlaced = new EventEmitter<{ lat: number; lng: number }>();

  onMapReady(map: Map) {
    map.on('click', (e: LeafletMouseEvent) => {
      this.addMarker(e.latlng.lat, e.latlng.lng);
    });
  }

  private addMarker(lat: number, lng: number) {
    // Limpia marcadores anteriores
    this.markers = [];
    // Crea un marcador draggable
    const m = marker([lat, lng], {
      draggable: true,
      icon: icon({
        iconUrl: 'assets/marker-icon.png',
        shadowUrl: 'assets/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      })
    });
    // Emitir al colocar
    m.on('dragend', () => {
      const pos = m.getLatLng();
      this.pinPlaced.emit({ lat: pos.lat, lng: pos.lng });
    });
    // Emitir la primera vez
    this.pinPlaced.emit({ lat, lng });
    this.markers.push(m);
  }
}