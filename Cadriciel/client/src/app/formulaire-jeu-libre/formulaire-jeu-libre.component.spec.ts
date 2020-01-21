import { ComponentFixture, TestBed } from "@angular/core/testing";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { of } from "rxjs";
import * as THREE from "three";

import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Cube } from "../objet3-d/cube";
import { Proprietes } from "../objet3-d/objet3-d";
import { FormulaireService } from "../services/formulaire.service";
import { GestionFormulaireService } from "../services/gestion-formulaire.service";
import { FormulaireJeuLibreComponent } from "./formulaire-jeu-libre.component";

const ROTATION_DE_REFERENCE: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
const POSITION_DE_REFERENCE: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
const COULEUR: number = 0xFFFFFF;
const TAILLE: number = 30;
const PROPRIETES: Proprietes = {
    Forme: "Cube",
    Rayon: TAILLE,
    Hauteur: TAILLE,
    Position: POSITION_DE_REFERENCE,
    Rotation: ROTATION_DE_REFERENCE,
    Couleur: COULEUR,
    Ajout: false,
    Retrait: false,
    ModCouleur: false,
    CouleurAlt: COULEUR,
};

describe("FormulaireJeuLibreComponent", () => {
    let component: FormulaireJeuLibreComponent;
    let fixture: ComponentFixture<FormulaireJeuLibreComponent>;
    let formulaireSpy: jasmine.SpyObj<FormulaireService>;

    beforeEach(() => {
        formulaireSpy = jasmine.createSpyObj("FormulaireService", ["getIdDisponible", "envoyerPartieLibre"]);
    });

    beforeEach(() => TestBed.configureTestingModule({
        declarations: [FormulaireJeuLibreComponent],
        imports: [FormsModule,
                  HttpClientModule,
                  ReactiveFormsModule,
                  MatFormFieldModule,
                  MatButtonModule,
                  MatCheckboxModule,
                  MatSelectModule,
                  MatInputModule,
                 ],
        providers: [FormulaireJeuLibreComponent, GestionFormulaireService, {provide: FormulaireService, useValue: formulaireSpy}],
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FormulaireJeuLibreComponent);
        component = fixture.componentInstance;
    });

    it("Vérifie que l'on peut créer FormulaireJeuLibreComponent", () => {
        expect(component).toBeTruthy();
    });

    it("Devrait enlever une modification avec ajouterModifications()", () => {
        const MODIFICATION: string = "modifications";
        component.modificationsSelectionnees[0] = "ajout";
        component.nomModifications("ajout");
        component.ajouterModifications(MODIFICATION);
        expect(component.modificationsSelectionnees.length).toEqual(0);
    });

    it("Devrait ajouter une modification avec ajouterModifications()", () => {
        const MODIFICATIONS: string = "modifications";
        component.getControles()[MODIFICATIONS].setValue(true);
        component.nomModifications("ajout");
        component.ajouterModifications(MODIFICATIONS);
        expect(component.modificationsSelectionnees[0]).toEqual("ajout");
    });

    it("Devrait montrer que le formulaire est invalide et qu'on ne fait rien avec valider()", () => {
        component.valider();
        expect(component.creationConfirme).toEqual(false);
    });

    it("Devrait affirmer qu'un formulaire est valide avec valider()", () => {
        const QUANTITE_OBJETS: number = 12;
        const MODIFICATIONS: string = "modifications";
        component.getControles()["nomJeu"].setValue("TEST1");
        component.getControles()["quantiteObjets"].setValue(QUANTITE_OBJETS);
        component.getControles()["typeObjetSelectionne"].setValue("Formes géométriques");
        component.getControles()[MODIFICATIONS].setValue(true);
        component.nomModifications("ajout");
        component.ajouterModifications(MODIFICATIONS);
        formulaireSpy.getIdDisponible.and.returnValue(of(0));
        formulaireSpy.envoyerPartieLibre.and.returnValue(of(true));
        component.valider();
        expect(component.creationConfirme).toEqual(true);
        expect(component.envoye).toEqual(true);
    });

    it("Devrait montrer qu'il y a une erreur avec la récupération du nom du jeu dans un formulaire avec valider()", () => {
        const MODIFICATIONS: string = "modifications";
        component.getControles()["nomJeu"].disable();
        component.getControles()["nomJeu"].setValue(null);
        component.getControles()["quantiteObjets"].disable();
        component.getControles()["typeObjetSelectionne"].setValue("Formes géométriques");
        component.getControles()[MODIFICATIONS].setValue(true);
        component.nomModifications("ajout");
        component.ajouterModifications(MODIFICATIONS);
        formulaireSpy.getIdDisponible.and.returnValue(of(0));
        formulaireSpy.envoyerPartieLibre.and.returnValue(of(true));
        component.valider();
        expect(component.creationConfirme).toEqual(false);
    });

    it("Devrait montrer qu'il y a une erreur avec la récupération de la quantité d'objets dans un formulaire avec valider()", () => {
        const MODIFICATIONS: string = "modifications";
        component.getControles()["quantiteObjets"].disable();
        component.getControles()["quantiteObjets"].setValue(null);
        component.getControles()["nomJeu"].disable();
        component.getControles()["typeObjetSelectionne"].setValue("Formes géométriques");
        component.getControles()[MODIFICATIONS].setValue(true);
        component.nomModifications("ajout");
        component.ajouterModifications(MODIFICATIONS);
        formulaireSpy.getIdDisponible.and.returnValue(of(0));
        formulaireSpy.envoyerPartieLibre.and.returnValue(of(true));
        component.valider();
        expect(component.creationConfirme).toEqual(false);
    });

    it("Devrait pouvoir appliquer les modifications de suppressions et de changements de couleurs pour un jeu libre avec valider()", () => {
        const QUANTITE_OBJETS: number = 12;
        const MODIFICATIONS: string = "modifications";
        component.getControles()["nomJeu"].setValue("TEST1");
        component.getControles()["quantiteObjets"].setValue(QUANTITE_OBJETS);
        component.getControles()["typeObjetSelectionne"].setValue("Formes géométriques");
        component.getControles()[MODIFICATIONS].setValue(true);
        component.nomModifications("suppression");
        component.ajouterModifications(MODIFICATIONS);
        component.nomModifications("changementCouleur");
        component.ajouterModifications(MODIFICATIONS);
        formulaireSpy.getIdDisponible.and.returnValue(of(0));
        formulaireSpy.envoyerPartieLibre.and.returnValue(of(true));
        component.valider();
        expect(component.creationConfirme).toEqual(true);
    });

    it("Devrait pouvoir créer un jeu libre avec des formes thématiques avec valider()", () => {
        const QUANTITE_OBJETS: number = 12;
        const MODIFICATIONS: string = "modifications";
        component.getControles()["nomJeu"].setValue("TEST1");
        component.getControles()["quantiteObjets"].setValue(QUANTITE_OBJETS);
        component.getControles()["typeObjetSelectionne"].setValue("Formes thématiques");
        component.typeObjetSelectionne = "Formes thématiques";
        component.getControles()[MODIFICATIONS].setValue(true);
        component.nomModifications("ajout");
        component.ajouterModifications(MODIFICATIONS);
        formulaireSpy.getIdDisponible.and.returnValue(of(0));
        formulaireSpy.envoyerPartieLibre.and.returnValue(of(true));
        component.valider();
        expect(component.creationConfirme).toEqual(true);
    });

    it("Devrait réinitialiser un formulaire avec reinitialiser()", () => {
        component.essaiEnvoi = true;
        component.envoye = true;
        component.creationConfirme = true;
        component.reinitialiser();

        let verification: boolean;
        verification = component.essaiEnvoi;
        verification = component.envoye;
        verification = component.creationConfirme;
        expect(verification).toEqual(false);
    });

    it("Devrait cahcer la scène de jeu libre avec ngAfterViewInit()", () => {
        component.ngAfterViewInit();
        expect(component.cacherScene).toEqual(true);
    });

    it("Devrait envoyer la partie vers le serveur", () => {
        formulaireSpy.getIdDisponible.and.returnValue(of(0));
        formulaireSpy.envoyerPartieLibre.and.returnValue(of(true));

        component.serviceRendu.sceneOriginale = new THREE.Scene();
        component.serviceRendu.sceneOriginale.add(new Cube(PROPRIETES, COULEUR).getMesh().clone());
        component.serviceRendu.sceneModifiee = new THREE.Scene();
        component.serviceRendu.sceneModifiee.add(new Cube(PROPRIETES, COULEUR).getMesh().clone());
        component.captureScene();
        expect(formulaireSpy.envoyerPartieLibre).toHaveBeenCalled();
    });

    it("Devrait avoir des valeurs par défaut après l'envoi d'une partie", () => {
        formulaireSpy.getIdDisponible.and.returnValue(of(0));
        formulaireSpy.envoyerPartieLibre.and.returnValue(of(true));
        component.serviceRendu.sceneOriginale = new THREE.Scene();
        component.serviceRendu.sceneModifiee = new THREE.Scene();
        component.captureScene();
        expect(component.modificationsSelectionnees).toEqual([]);
        expect(component.gestionnaireDeParties.getAjout()).toEqual(false);
        expect(component.gestionnaireDeParties.getRetrait()).toEqual(false);
        expect(component.gestionnaireDeParties.getModCouleur()).toEqual(false);
    });
});
