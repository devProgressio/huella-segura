import { Routes } from '@angular/router';
import { Documentation } from './documentation/documentation';
import { Crud } from './crud/crud';
import { Empty } from './empty/empty';
import { UserCrud } from './user/user-crud';
import { MapContainerComponent } from './map/map-container';
import { ReportListComponent } from './map/pages/report-list/report-list';


export default [
    { path: 'documentation', component: Documentation },
    { path: 'crud', component: Crud },
    { path: 'empty', component: Empty },
    { path: 'user', component: UserCrud },
    { path: 'map', component: MapContainerComponent },
    { path: 'map/list', component: ReportListComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
