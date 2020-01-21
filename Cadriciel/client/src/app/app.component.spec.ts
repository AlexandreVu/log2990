import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { RouterModule } from "@angular/router";
import { AfficheurScene3DComponent } from "./afficheur-scene3-d/afficheur-scene3-d.component";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { ChronometreComponent } from "./chronometre/chronometre.component";
import { FormulaireJeuLibreComponent } from "./formulaire-jeu-libre/formulaire-jeu-libre.component";
import { FormulaireJeuSimpleComponent } from "./formulaire-jeu-simple/formulaire-jeu-simple.component";
import { ListePartiesComponent } from "./liste-parties/liste-parties.component";
import { VueAttenteComponent } from "./vue-attente/vue-attente.component";
import { VueInitialeComponent } from "./vue-initiale/vue-initiale.component";

import { MatCardModule } from "@angular/material/card";
import { MatToolbarModule } from "@angular/material/toolbar";
import { VueAdministrationComponent } from "./vue-administration/vue-administration.component";
import { VueJeuComponent } from "./vue-jeu/vue-jeu.component";
describe("AppComponent", () => {
    let fixture: ComponentFixture<AppComponent>;
    let component: AppComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                VueAdministrationComponent,
                ListePartiesComponent,
                VueInitialeComponent,
                FormulaireJeuSimpleComponent,
                FormulaireJeuLibreComponent,
                VueJeuComponent,
                AfficheurScene3DComponent,
                ChronometreComponent,
                VueAttenteComponent,
            ],
            imports: [
                HttpClientModule,
                RouterModule,
                AppRoutingModule,
                FormsModule,
                ReactiveFormsModule,
                MatCardModule,
                MatToolbarModule,
                MatFormFieldModule,
                MatButtonModule,
                MatCheckboxModule,
                MatInputModule,
                MatSelectModule,
            ],
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
    });
    it("Vérifie que l'on peut créer Appcomponent", () => {
        expect(component).toBeTruthy();
    });
    it("Devrait avoir comme attribut titre LOG2990", () => {
        expect(component.title).toEqual("LOG2990");
    });

});
