import { Component } from '@angular/core';
import { LostPetComponent } from './pages/lost-pet/lost-pet';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [LostPetComponent],
  template: `
    <div class="container">
      <h1>Reportar Mascota Perdida</h1>
      <app-lost-pet></app-lost-pet>
    </div>
  `,
  styles: [`.container { max-width: 800px; margin: auto; padding: 1rem; }`]
})
export class MapContainerComponent {}