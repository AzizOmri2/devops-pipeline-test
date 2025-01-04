import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AfficherProjectComponent } from './admin/afficher-project/afficher-project.component';
import { AjouterProjectComponent } from './admin/ajouter-project/ajouter-project.component';
import { ModifierProjectComponent } from './admin/modifier-project/modifier-project.component';

const routes: Routes = [

  {
    path: 'dashboard',
    component: AdminComponent,
    children: [
      { path: 'projects', component: AfficherProjectComponent },
      { path: 'projects/add', component: AjouterProjectComponent },
      { path: 'projects/update/:id', component: ModifierProjectComponent }
    ]
  },
  
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Default to login page
  { path: '**', redirectTo: 'dashboard' } // Handle any unknown routes
  
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
