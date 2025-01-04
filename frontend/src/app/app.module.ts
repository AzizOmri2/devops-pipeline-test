import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AfficherProjectComponent } from './admin/afficher-project/afficher-project.component';
import { AjouterProjectComponent } from './admin/ajouter-project/ajouter-project.component';
import { ModifierProjectComponent } from './admin/modifier-project/modifier-project.component';



@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AfficherProjectComponent,
    AjouterProjectComponent,
    ModifierProjectComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
