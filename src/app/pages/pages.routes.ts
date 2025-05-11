import { Routes } from '@angular/router';
import { UserCrud } from './user/user-crud';
import { MapContainerComponent } from './map/map-container';
import { ReportListComponent } from './map/pages/report-list/report-list';


export default [
    { path: 'user', component: UserCrud },
    { path: 'map', component: MapContainerComponent },
    { path: 'map/list', component: ReportListComponent },
    { path: '**', redirectTo: '/notfound' }
] as Routes;
