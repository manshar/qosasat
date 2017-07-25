import { Routes } from '@angular/router';
import { SingleStepEditorComponent } from './single-step-editor';
import { ClipsDirectExporterComponent } from './clips-direct-exporter';
import { CreditsComponent } from './credits';
import { NoContentComponent } from './no-content';
import { DataResolver } from './app.resolver';

export const ROUTES: Routes = [
  { path: '', component: SingleStepEditorComponent},
  { path: 'download', component: ClipsDirectExporterComponent},
  { path: 'about', component: CreditsComponent },
  { path: '**',    component: NoContentComponent },
];
