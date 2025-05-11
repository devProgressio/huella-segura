import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AppMenuitem } from './app.menuitem';

@Component({
    selector: 'app-menu',
    standalone: true,
    imports: [CommonModule, AppMenuitem, RouterModule],
    template: `<ul class="layout-menu">
        <ng-container *ngFor="let item of model; let i = index">
            <li app-menuitem *ngIf="!item.separator" [item]="item" [index]="i" [root]="true"></li>
            <li *ngIf="item.separator" class="menu-separator"></li>
        </ng-container>
    </ul> `
})
export class AppMenu {
    model: MenuItem[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Reportes de Mascotas',
                icon: 'pi pi-fw pi-home',
                items: [{ label: 'Reportar Mascota', icon: 'pi pi-fw pi-plus-circle', routerLink: ['/pages/map'] },
                        { label: 'Mascotas Reportadas', icon: 'pi pi-fw pi-exclamation-triangle', routerLink: ['/pages/map/list'] }]
            },
            {
                label: 'Usuarios',
                items: [{
                        label: 'Lista de Usuarios',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['/pages/user']
                    },]
                
            },
        ];
    }
}
