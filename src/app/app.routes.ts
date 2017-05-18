import { Routes } from '@angular/router';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { ExportComponent } from './export';
import { CreditsComponent } from './credits';
import { NoContentComponent } from './no-content';
import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'select-photo',  component: HomeComponent },
  { path: 'select-font', component: AboutComponent },
  { path: 'export', component: ExportComponent },
  { path: 'about', component: CreditsComponent },
  { path: 'detail', loadChildren: './+detail#DetailModule'},
  { path: 'barrel', loadChildren: './+barrel#BarrelModule'},
  { path: '**',    component: NoContentComponent },
];
