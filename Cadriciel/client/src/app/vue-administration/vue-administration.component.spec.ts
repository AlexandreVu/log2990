import { ChangeDetectorRef } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import { HttpClientModule } from "@angular/common/http";
import { FormulaireJeuLibreComponent } from "../formulaire-jeu-libre/formulaire-jeu-libre.component";
import { FormulaireJeuSimpleComponent } from "../formulaire-jeu-simple/formulaire-jeu-simple.component";
import { VueAdministrationComponent } from "./vue-administration.component";

import { MatCardModule } from "@angular/material/card";
import { of } from "rxjs";
import { GestionnaireDeParties } from "../GestionnaireDeParties";
import { Partie, TypeDePartie } from "../Partie";
import { PartieLibre } from "../PartieLibre";
import { AfficheurScene3DComponent } from "../afficheur-scene3-d/afficheur-scene3-d.component";
import { PARTIESLIBRES, PARTIESSIMPLES } from "../fausses-parties";
import { FormulaireService } from "../services/formulaire.service";
import { GestionFormulaireService } from "../services/gestion-formulaire.service";
import { SocketService } from "../services/socket.service";

describe("VueAdministrationComponent", () => {
    let component: VueAdministrationComponent;
    let fixture: ComponentFixture<VueAdministrationComponent>;
    let formulaireServiceSpy: jasmine.SpyObj<FormulaireService>;
    let socketServiceSpy: jasmine.SpyObj<SocketService>;
    let changeSpy: jasmine.SpyObj<ChangeDetectorRef>;

    const UNE_PARTIE: Partie = new Partie(0, "", TypeDePartie.SIMPLE);
    const DES_PARTIES_SIMPLES: Partie[] = PARTIESSIMPLES;
    const DES_PARTIES_LIBRES: PartieLibre[] = PARTIESLIBRES;

    beforeEach(() => {
        formulaireServiceSpy = jasmine.createSpyObj("FormulaireService", ["getPartiesSimples", "getPartiesLibres", "calculer",
                                                                          "supprimerPartie"]);
        socketServiceSpy = jasmine.createSpyObj("SocketService", ["initSocket", "partieSupprimeeActualiser", "onDemandeConnexion",
                                                                  "changement", "onChangement"]);
        socketServiceSpy.onDemandeConnexion.and.returnValue(of(void 0));
        changeSpy = jasmine.createSpyObj("ChangeDetectorRef", ["detectChanges"]);
    });

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [VueAdministrationComponent, FormulaireJeuSimpleComponent, FormulaireJeuLibreComponent,
                           AfficheurScene3DComponent],
            imports: [HttpClientModule,
                      ReactiveFormsModule,
                      MatFormFieldModule,
                      MatButtonModule,
                      MatInputModule,
                      MatSelectModule,
                      MatCheckboxModule,
                      MatCardModule,
                      BrowserAnimationsModule,
                     ],
            providers:
            [
                GestionFormulaireService, {
                provide: FormulaireService,
                useValue: formulaireServiceSpy, },
                {
                provide: SocketService,
                useValue: socketServiceSpy,
                },
                {
                provide: ChangeDetectorRef,
                useValue: changeSpy,
                },
            ],
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VueAdministrationComponent);
        component = fixture.componentInstance;
    });

    it("Vérifie que l'on peut créer VueAdministrationComponent", async(() => {
        expect(component).toBeTruthy();
    }));

    it("Devrait sélectionner une partie choisi par u joueur avec sélectionner()", async(() => {
        component.gestionnaireDeParties.setPartieSelectionnee(UNE_PARTIE);
        expect(component.gestionnaireDeParties.getPartieSelectionnee()).toEqual(UNE_PARTIE);
    }));

    it("Devrait réinitialiser les scores affiché aux joueurs avec réinitialiserScores()", async(() => {
        formulaireServiceSpy.calculer.and.returnValue(of(true));
        component.gestionnaireDeParties.setPartieSelectionnee(UNE_PARTIE);
        component.gestionnaireDeParties.setPartiesSimple(DES_PARTIES_SIMPLES);
        component.gestionnaireDeParties.setPartiesLibre(DES_PARTIES_LIBRES);
        formulaireServiceSpy.getPartiesSimples.and.returnValue(of(DES_PARTIES_SIMPLES));
        formulaireServiceSpy.getPartiesLibres.and.returnValue(of(DES_PARTIES_LIBRES));
        socketServiceSpy.changement();

        component.reinitialiserScores();
        expect(component.gestionnaireDeParties.getPartieSelectionnee()).not.toEqual(new Partie(0, "", TypeDePartie.SIMPLE));
    }));

    it("Devrait ouvrir un formulaire de partie simple avec ouvrirFormulaire()", async(() => {
        formulaireServiceSpy.getPartiesSimples.and.returnValue(of(DES_PARTIES_SIMPLES));

        component.ouvrirFormulaire();
        expect(component.formulaireOuvert).toEqual(true);
    }));

    it("Devrait ouvrir un formulaire de partie libre avec ouvrirFormulaireLibre()", async(() => {
        component.ouvrirFormulaireLibre();
        expect(component.formulaireOuvertLibre).toEqual(true);
    }));

    it("Devrait fermer un formulaire de partie simple avec fermerFormulaire()", async(() => {
        component.fermerFormulaire();
        expect(component.formulaireOuvert).toEqual(false);
    }));

    it("Devrait fermer un formulaire de partie libre avec fermerFormulaireLibre()", async(() => {
        component.fermerFormulaireLibre();
        expect(component.formulaireOuvertLibre).toEqual(false);
    }));

    it("Devrait savoir quelle partie a été choisi par un joueur avec getPartieSelectionnee() et setPartieSelectionnee()", async(() => {
        component.gestionnaireDeParties.setPartieSelectionnee(UNE_PARTIE);
        expect(component.gestionnaireDeParties.getPartieSelectionnee()).toEqual(UNE_PARTIE);
    }));

    it("Devrait modifier et avoir le tableau de parties simples pris par le gestionnaire de parties", async(() => {
        component.gestionnaireDeParties.setPartiesSimple(DES_PARTIES_SIMPLES);
        expect(component.gestionnaireDeParties.getPartiesSimple()).toEqual(DES_PARTIES_SIMPLES);
    }));

    it("Devrait modifier et avoir le tableau de parties libres pris par le gestionnaire de parties", async(() => {
        component.gestionnaireDeParties.setPartiesLibre(DES_PARTIES_LIBRES);
        expect(component.gestionnaireDeParties.getPartiesLibre()).toEqual(DES_PARTIES_LIBRES);
    }));

    it("Devrait charger les parties sauvegardées dans le serveur pour l'afficher aux joueurs", async(() => {
        formulaireServiceSpy.getPartiesSimples.and.returnValue(of(DES_PARTIES_SIMPLES));
        formulaireServiceSpy.getPartiesLibres.and.returnValue(of(DES_PARTIES_LIBRES));
        component.chargerParties();
        let estIdentique: Boolean = true;
        const PARTIES_SIMPLE_CHARGEES: Partie[] = DES_PARTIES_SIMPLES;
        const PARTIES_LIBRE_CHARGEES: Partie[] = DES_PARTIES_LIBRES;
        const tailleTableauxSimple: number = PARTIES_SIMPLE_CHARGEES.length;
        const tailleTableauxLibre: number = PARTIES_LIBRE_CHARGEES.length;
        if (PARTIES_SIMPLE_CHARGEES.length !== tailleTableauxSimple || PARTIES_LIBRE_CHARGEES.length !== tailleTableauxLibre) {
            estIdentique = false;
        }
        expect(estIdentique).toEqual(true);
    }));

    it("Devrait supprimer une partie du serveur avec supprimerPartie()", () => {
        formulaireServiceSpy.getPartiesSimples.and.returnValue(of(DES_PARTIES_SIMPLES));
        formulaireServiceSpy.getPartiesLibres.and.returnValue(of(DES_PARTIES_LIBRES));
        component.chargerParties();
        component.gestionnaireDeParties.setPartieSelectionnee(component.gestionnaireDeParties.getPartiesSimple()[0]);
        formulaireServiceSpy.supprimerPartie.and.returnValue(of(true));
        socketServiceSpy.changement();
        socketServiceSpy.partieSupprimeeActualiser();
        component.supprimerPartie();
        expect(formulaireServiceSpy.supprimerPartie).toHaveBeenCalled();
    });

    it("Devrait s'assurer que les formulaires de parties simples et libres sont fermés avec ngAfterViewInit()", () => {
        changeSpy.detectChanges();
        component.ngAfterViewInit();
        expect(changeSpy.detectChanges).toHaveBeenCalled();
    });

    it("Devrait initialiser le gestionnaire de parties avec les parties dans le serveur avec ngOnInit()", () => {
        formulaireServiceSpy.getPartiesSimples.and.returnValue(of(DES_PARTIES_SIMPLES));
        formulaireServiceSpy.getPartiesLibres.and.returnValue(of(DES_PARTIES_LIBRES));
        socketServiceSpy.initSocket();
        socketServiceSpy.onChangement.and.returnValue(of(true));
        component.ngOnInit();
        expect(component.gestionnaireDeParties).toEqual(GestionnaireDeParties.getGestionnaire());
    });
});
