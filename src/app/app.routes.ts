import { Routes } from '@angular/router';
import { ListComponent } from './components/list-component/list-component';
import { DetailComponent } from './components/detail-component/detail-component';
import { FormComponent } from './components/form-component/form-component/form-component';


export const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ListComponent },
  { path: 'list/:status', component: ListComponent },
  { path: 'detail/:id', component: DetailComponent },
  { path: 'form', component: FormComponent },
  { path: 'form/:id', component: FormComponent },
  { path: '**', redirectTo: 'list', pathMatch: 'full' },
];
