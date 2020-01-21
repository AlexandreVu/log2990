import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";

import { HttpClientModule } from "@angular/common/http";
import { MatCardModule } from "@angular/material/card";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { Partie, TypeDePartie } from "../Partie";
import { PartieLibre } from "../PartieLibre";
import { PARTIESLIBRES, PARTIESSIMPLES } from "../fausses-parties";
import { FormulaireService } from "../services/formulaire.service";
import { SocketService } from "../services/socket.service";
import { ListePartiesComponent } from "./liste-parties.component";

describe("ListePartiesComponent", () => {
    let component: ListePartiesComponent;
    let fixture: ComponentFixture<ListePartiesComponent>;
    let formulaireServiceSpy: jasmine.SpyObj<FormulaireService>;
    let socketServiceSpy: jasmine.SpyObj<SocketService>;
    let routerSpy: jasmine.SpyObj<Router>;

    const UNE_PARTIE: Partie = new Partie(0, "", TypeDePartie.SIMPLE);
    const DES_PARTIES_SIMPLES: Partie[] = PARTIESSIMPLES;
    const DES_PARTIES_LIBRES: PartieLibre[] = PARTIESLIBRES;
    const MOCK_PROMESSE_CATCH: {} = {catch: () => "catch"};
    const MOCK_PROMESSE: {} = {then: () => MOCK_PROMESSE_CATCH};

    beforeEach(() => {
        formulaireServiceSpy = jasmine.createSpyObj("FormulaireService", ["getPartiesSimples", "getPartiesLibres"]);
        socketServiceSpy = jasmine.createSpyObj("SocketService", ["initSocket", "onActualiserBouton",
                                                                  "demandeConnexion", "onReponseConnexion",
                                                                  "onAnullerCreation", "onChangement",
                                                                  "commencerPartie", "annulerCreation",
                                                                  "joindreSalle"]);
        routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
        socketServiceSpy.onActualiserBouton.and.returnValue(of({id: 0, type: "0", ajout: true, idVs: "0"}));
        socketServiceSpy.demandeConnexion.and.returnValue(of(void 0));
        socketServiceSpy.onReponseConnexion.and.returnValue(of({id: 0, type: "0", idVs: "0"}));
    });
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [ListePartiesComponent],
            imports: [HttpClientModule, RouterTestingModule, MatCardModule],
            providers: [
                {
                    provide: FormulaireService,
                    useValue: formulaireServiceSpy,
                },
                {
                    provide: SocketService,
                    useValue: socketServiceSpy,
                },
                {
                    provide: Router,
                    useValue: routerSpy,
                },
            ],
        });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ListePartiesComponent);
        component = fixture.componentInstance;
    });

    it("Vérifie que l'on peut créer ListePartiesComponent", () => {
        expect(component).toBeTruthy();
    });

    it("Devrait créer une partie simple en mode un contre un avec creerPartiesUnContreUnSimple()", () => {
        component.gestionnaireDeParties.setPartieSelectionnee(UNE_PARTIE);
        component.gestionnaireDeParties.setPartiesSimple(DES_PARTIES_SIMPLES);
        routerSpy.navigate.and.returnValue(MOCK_PROMESSE);
        component.creerPartieUnContreUnSimple(0);
        expect(component.gestionnaireDeParties.getPartiesSimple()[0].getPartieCreeEnLigne()).toEqual(true);
    });

    it("Devrait créer une partie libre en mode un contre un avec creerPartiesUnContreUnLibres()", () => {
        component.gestionnaireDeParties.setPartieSelectionnee(UNE_PARTIE);
        component.gestionnaireDeParties.setPartiesLibre(DES_PARTIES_LIBRES);
        routerSpy.navigate.and.returnValue(MOCK_PROMESSE);
        component.creerPartieUnContreUnLibre(0);
        expect(component.gestionnaireDeParties.getPartiesLibre()[0].getPartieCreeEnLigne()).toEqual(true);
    });

    it("Devrait savoir quelle partie a été sélectionnée par un joueur avec setPartieSelectionnee() et getPartieSelectionnee()", () => {
        component.gestionnaireDeParties.setPartieSelectionnee(UNE_PARTIE);
        expect(component.getPartieSelectionnee()).toEqual(UNE_PARTIE);
    });

    it("Devrait modifier et avoir le tableau de parties simples pris par le gestionnaire de parties", () => {
        component.gestionnaireDeParties.setPartiesSimple(DES_PARTIES_SIMPLES);
        expect(component.gestionnaireDeParties.getPartiesSimple()).toEqual(DES_PARTIES_SIMPLES);
    });

    it("Devrait modifier et avoir le tableau de parties libres pris par le gestionnaire de parties", () => {
        component.gestionnaireDeParties.setPartiesLibre(DES_PARTIES_LIBRES);
        expect(component.gestionnaireDeParties.getPartiesLibre()).toEqual(DES_PARTIES_LIBRES);
    });

    it("Devrait afficher les parties simples et libres qui sont dans le serveur", async(() => {
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

    it("Devrait se connecter avec le serveur pour charger les parties avec ngOnInit()", () => {
        formulaireServiceSpy.getPartiesSimples.and.returnValue(of(DES_PARTIES_SIMPLES));
        formulaireServiceSpy.getPartiesLibres.and.returnValue(of(DES_PARTIES_LIBRES));
        socketServiceSpy.initSocket();
        socketServiceSpy.onActualiserBouton.and.returnValue(of({id: 0, type: "0"}));
        socketServiceSpy.onAnullerCreation.and.returnValue(of({id: 0, type: "0"}));
        socketServiceSpy.onChangement.and.returnValue(of(true));
        component.ngOnInit();
        expect(component.gestionnaireDeParties.getPartiesLibre()).toEqual(DES_PARTIES_LIBRES);
    });

    it("Devrait débuter un jeu de partie simple qui existe dans le serveur avec jouer()", () => {
        component.gestionnaireDeParties.setPartieSelectionnee(DES_PARTIES_SIMPLES[0]);
        routerSpy.navigate.and.returnValue(MOCK_PROMESSE);
        component.jouer();
        expect(routerSpy.navigate).toHaveBeenCalledWith(["jeu", "simple", 0, "solo"]);
    });

    it("Devrait débuter un jeu de partie libre qui existe dans le serveur avec jouer()", () => {
        component.gestionnaireDeParties.setPartieSelectionnee(DES_PARTIES_LIBRES[0]);
        routerSpy.navigate.and.returnValue(MOCK_PROMESSE);
        component.jouer();
        expect(routerSpy.navigate).toHaveBeenCalledWith(["jeu", "libre", 0, "solo"]);
    });

    it("Devrait ajouter un id dans le tableau des idVS simples", () => {
        const partie: Partie = new Partie(1, "test", TypeDePartie.SIMPLE);
        component.gestionnaireDeParties.getPartiesSimple().push(partie);
        component.ajouterId(1, TypeDePartie.SIMPLE.toString(), "1");
        expect(component.idVsSimple[0].idVs).toEqual("1");
    });

    it("Devrait ajouter un id dans le tableau des idVS libre", () => {
        const partie: PartieLibre = new PartieLibre(1, "test");
        component.gestionnaireDeParties.getPartiesLibre().push(partie);
        component.ajouterId(1, TypeDePartie.LIBRE.toString(), "1");
        expect(component.idVsLibre[0].idVs).toEqual("1");
    });

    it("Devrait modifier un idVs simple deja contenu", () => {
        const partie: Partie = new Partie(1, "test", TypeDePartie.SIMPLE);
        component.gestionnaireDeParties.getPartiesSimple().push(partie);
        component.ajouterId(1, TypeDePartie.SIMPLE.toString(), "1");
        component.ajouterId(1, TypeDePartie.SIMPLE.toString(), "2");

        expect(component.idVsSimple[0].idVs).toEqual("2");
    });

    it("Devrait modifier un idVs libre deja contenu", () => {
        const partie: PartieLibre = new PartieLibre(1, "test");
        component.gestionnaireDeParties.getPartiesLibre().push(partie);
        component.ajouterId(1, TypeDePartie.LIBRE.toString(), "1");
        component.ajouterId(1, TypeDePartie.LIBRE.toString(), "2");
        expect(component.idVsLibre[0].idVs).toEqual("2");
    });

    it("Devrait commencer une partie simple", () => {
        component.gestionnaireDeParties.setPartieSelectionnee(UNE_PARTIE);
        component.idVsSimple.push({id: 0, idVs: "0"});
        socketServiceSpy.commencerPartie({cle: "0"});
        socketServiceSpy.annulerCreation(0, TypeDePartie.SIMPLE);
        socketServiceSpy.joindreSalle(0, "0", true, 0);
        routerSpy.navigate.and.returnValue(MOCK_PROMESSE);
        component.joindrePartieSimple(0);

        expect(routerSpy.navigate).toHaveBeenCalledWith(["jeu", "simple", 0, "1v1", "0"]);
    });

    it("Ne Devrait pas commencer une partie simple, parce qu'elle n'est pas trouvée", () => {
        socketServiceSpy.commencerPartie({cle: "0"});
        socketServiceSpy.annulerCreation(0, TypeDePartie.SIMPLE);
        socketServiceSpy.joindreSalle(0, "0", true, 0);
        routerSpy.navigate.and.returnValue(MOCK_PROMESSE);
        component.joindrePartieSimple(0);

        expect(routerSpy.navigate).toHaveBeenCalledWith(["attente", "simple", 0]);
    });

    it("Devrait commencer une partie libre", () => {
        component.gestionnaireDeParties.setPartieSelectionnee(new PartieLibre(0, "0"));
        component.idVsLibre.push({id: 0, idVs: "0"});
        socketServiceSpy.commencerPartie({cle: "0"});
        socketServiceSpy.annulerCreation(0, TypeDePartie.LIBRE);
        socketServiceSpy.joindreSalle(0, "0", true, 0);
        routerSpy.navigate.and.returnValue(MOCK_PROMESSE);
        component.joindrePartieLibre(0);

        expect(routerSpy.navigate).toHaveBeenCalledWith(["jeu", "libre", 0, "1v1", "0"]);
    });

    it("Ne Devrait pas commencer une partie libre, parce qu'elle n'est pas trouvée", () => {
        socketServiceSpy.commencerPartie({cle: "0"});
        socketServiceSpy.annulerCreation(0, TypeDePartie.LIBRE);
        socketServiceSpy.joindreSalle(0, "0", true, 0);
        routerSpy.navigate.and.returnValue(MOCK_PROMESSE);
        component.joindrePartieLibre(0);

        expect(routerSpy.navigate).toHaveBeenCalledWith(["attente", "libre", 0]);
    });
});
