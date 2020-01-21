import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

import { AppComponent } from "./app.component";
import { FormulaireJeuSimpleComponent } from "./formulaire-jeu-simple/formulaire-jeu-simple.component";
import { ListePartiesComponent } from "./liste-parties/liste-parties.component";
import { FormulaireService } from "./services/formulaire.service";
import { GestionFormulaireService } from "./services/gestion-formulaire.service";
import { VueAdministrationComponent } from "./vue-administration/vue-administration.component";
import { VueInitialeComponent } from "./vue-initiale/vue-initiale.component";

import { RouterModule, Routes } from "@angular/router";

import {MatCardModule} from "@angular/material/card";
import {MatToolbarModule} from "@angular/material/toolbar";
import { AfficheurScene3DComponent } from "./afficheur-scene3-d/afficheur-scene3-d.component";
import { AppRoutingModule } from "./app-routing.module";
import { ChronometreComponent } from "./chronometre/chronometre.component";
import { FormulaireJeuLibreComponent } from "./formulaire-jeu-libre/formulaire-jeu-libre.component";
import { CommunicationService } from "./services/communication.service";
import { VueAttenteComponent } from "./vue-attente/vue-attente.component";
import { VueJeuComponent } from "./vue-jeu/vue-jeu.component";

const appRoutes: Routes = [
  {path: "connexion", component: VueInitialeComponent},
  {path: "jeu", component: VueJeuComponent},
  {path: "", component: VueInitialeComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    VueInitialeComponent,
    VueAdministrationComponent,
    ListePartiesComponent,
    FormulaireJeuSimpleComponent,
    FormulaireJeuLibreComponent,
    AfficheurScene3DComponent,
    VueJeuComponent,
    ChronometreComponent,
    VueAttenteComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    AppRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCheckboxModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatToolbarModule,
  ],
  providers: [
    CommunicationService,
    GestionFormulaireService,
    FormulaireService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
