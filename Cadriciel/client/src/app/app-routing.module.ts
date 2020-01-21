import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { FormulaireJeuSimpleComponent } from "./formulaire-jeu-simple/formulaire-jeu-simple.component";
import { ListePartiesComponent } from "./liste-parties/liste-parties.component";
import { VueAdministrationComponent } from "./vue-administration/vue-administration.component";
import { VueAttenteComponent } from "./vue-attente/vue-attente.component";
import { VueInitialeComponent } from "./vue-initiale/vue-initiale.component";
import { VueJeuComponent } from "./vue-jeu/vue-jeu.component";

const routes: Routes = [
    { path: "", redirectTo: "/connexion", pathMatch: "full" },
    { path: "connexion", component: VueInitialeComponent },
    { path: "admin", component: VueAdministrationComponent },
    { path: "selection", component: ListePartiesComponent },
    { path: "formulaire", component: FormulaireJeuSimpleComponent },
    { path: "jeu/:type/:id/:mode/:idVS", component: VueJeuComponent},
    { path: "jeu/:type/:id/:mode", component: VueJeuComponent},
    { path: "attente/:type/:id", component: VueAttenteComponent },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }
