import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { VueInitialeComponent } from "./vue-initiale.component";

import { HttpClientModule } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { Confirmation } from "../../../../common/communication/confirmation";
import { CommunicationService } from "../services/communication.service";

describe("VueInitialeComponent", () => {
    let component: VueInitialeComponent;
    let fixture: ComponentFixture<VueInitialeComponent>;
    let communicationSpy: jasmine.SpyObj<CommunicationService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let confirmationVoulue: Confirmation;
    const MOCK_PROMESSE_CATCH: {} = {catch: () => "catch"};
    const MOCK_PROMESSE: {} = {then: () => MOCK_PROMESSE_CATCH};

    beforeEach(() => {
        communicationSpy
 = jasmine.createSpyObj("CommunicationService", ["envoyerNom", "deconnecter", "verifierNom"]);
        routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [VueInitialeComponent],
            imports: [FormsModule,
                      HttpClientModule,
                      MatFormFieldModule,
                      MatButtonModule,
                      MatInputModule,
                      BrowserAnimationsModule,
                     ],
            providers:
                [{
                    provide: CommunicationService,
                    useValue: communicationSpy
            ,
                },
                 {
                    provide: Router,
                    useValue: routerSpy,
                }],
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VueInitialeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("Vérifie que l'on peut créer VueInitialeComponent", () => {
        expect(component).toBeTruthy();
    });

    it("Devrait avertir que le nom entré ne suit pas le format alphanumérique", () => {
        component.nomInput = "Alexandre";
        confirmationVoulue = { nom: component.nomInput, ajoute: false };
        communicationSpy.verifierNom.and.returnValue(false);
        communicationSpy.envoyerNom.and.returnValue(of(confirmationVoulue));

        component.entrer();
        expect(component.message).toEqual("Le format du nom n'est pas respecté. (Longueur : 4-12 caractères alphanumériques)");
    });

    it("Devrait avertir que le nom concorde avec nomInput juste", () => {
        component.nomInput = "Alex";
        confirmationVoulue = { nom: component.nomInput, ajoute: true };
        communicationSpy.verifierNom.and.returnValue(true);
        communicationSpy.envoyerNom.and.returnValue(of(confirmationVoulue));
        routerSpy.navigate.and.returnValue(MOCK_PROMESSE);

        component.entrer();
        expect(component.nom).toEqual("Alex");
    });

    it("Devrait avertir que le nom ne concorde pas avec nomInput juste", () => {
        component.nomInput = "Bob";
        confirmationVoulue = { nom: component.nomInput, ajoute: false };
        communicationSpy.verifierNom.and.returnValue(true);
        communicationSpy.envoyerNom.and.returnValue(of(confirmationVoulue));
        component.entrer();
        expect(component.nom).toEqual("");
    });

});
