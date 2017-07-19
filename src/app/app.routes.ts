import { Routes } from '@angular/router';
import { SingleStepEditorComponent } from './single-step-editor';
import { ClipsDirectExporterComponent } from './clips-direct-exporter';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { ExportComponent } from './export';
import { CreditsComponent } from './credits';
import { NoContentComponent } from './no-content';
import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '', component: SingleStepEditorComponent},
  { path: 'download', component: ClipsDirectExporterComponent},
  // { path: '',      component: HomeComponent },
  { path: 'select-photo',  component: HomeComponent },
  // { path: 'select-font', component: AboutComponent },
  { path: 'export', component: ExportComponent },
  { path: 'about', component: CreditsComponent },
  { path: 'detail', loadChildren: './+detail#DetailModule'},
  { path: 'barrel', loadChildren: './+barrel#BarrelModule'},
  { path: '**',    component: NoContentComponent },
];
