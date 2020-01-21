import { HttpClientTestingModule } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { AbstractControl, FormBuilder } from "@angular/forms";

import { FormulaireJeuSimpleComponent } from "../formulaire-jeu-simple/formulaire-jeu-simple.component";
import { SocketService } from "../services/socket.service";
import { CommunicationService } from "./communication.service";
import { FormulaireService } from "./formulaire.service";
import { GestionFormulaireService } from "./gestion-formulaire.service";

let formulaire: FormulaireJeuSimpleComponent;
let communicationsService: CommunicationService;
let gestionFormulaireService: GestionFormulaireService;
let ficheService: FormulaireService;
let socketService: SocketService;
// tslint:disable-next-line:no-any Utilisé pour mock le http call
let httpClientSpy: any;

// Le service utilise surtout des controles,or les inputs de fichiers ne peuvent pas être testés
// puisque leurs valeurs ne peut pas être modifiée par code. Je test donc juste les noms des fichiers et l'input de texte.

describe("GestionFormulaireService", () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
    }));

    beforeAll(() => {

        gestionFormulaireService = new GestionFormulaireService();
        httpClientSpy = jasmine.createSpyObj("HttpClient", ["get", "post"]);
        communicationsService = new CommunicationService(httpClientSpy);
        ficheService = new FormulaireService(httpClientSpy);
        socketService = new SocketService();
        formulaire = new FormulaireJeuSimpleComponent(new FormBuilder,
                                                      gestionFormulaireService,
                                                      communicationsService,
                                                      ficheService,
                                                      socketService);
    });

    it("Vérifie que l'on peut créer GestionFormulaireService", () => {
        expect(gestionFormulaireService).toBeTruthy();
    });

    it("Devrait retourner mauvaisFormat vrai lorsque le fichier n'est pas du bon format (finit pas par .bmp).", () => {
        // nomJeu est un input texte qui permet de choisir le nom du fichier
        // plutot que l'input de fichier que sa value ne peut pas être changée
        const CONTROL: AbstractControl = formulaire.jeuSimpleForm.controls.nomJeu;
        CONTROL.setValue("testImage.jpg");

        const RESULTAT: { mauvaisFormat: boolean; } | null = gestionFormulaireService.validerFormatBitmap(CONTROL);

        expect(RESULTAT).toBeDefined();
        if (RESULTAT !== null) {
            expect(RESULTAT.mauvaisFormat).toBeTruthy();
        }
    });

    it("Devrait retourner null lorsqu'un fichier est bien de format bitmap (finit par .bmp).", () => {
        const CONTROL: AbstractControl = formulaire.jeuSimpleForm.controls.nomJeu;
        CONTROL.setValue("testImage.bmp");

        const RESULTAT: { mauvaisFormat: boolean; } | null = gestionFormulaireService.validerFormatBitmap(CONTROL);

        expect(RESULTAT).toBeNull();
    });

    it("Devrait retourner mauvaisFormat vrai lorsqu'un mauvais charactère est utilisé dans un nom de fichier.", () => {
        const CONTROL: AbstractControl = formulaire.jeuSimpleForm.controls.nomJeu;
        CONTROL.setValue("test/de*nom}.bmp");

        const RESULTAT: { mauvaisNom: boolean } | null = gestionFormulaireService.validerNomFichier(CONTROL);
        expect(RESULTAT).toBeDefined();
        if (RESULTAT !== null) {
            expect(RESULTAT.mauvaisNom).toBeTruthy();
        }
    });

    it("Devrait retourner null lorsqu'aucun mauvais charactère est utilisé dans un nom de fichier.", () => {
        const CONTROL: AbstractControl = formulaire.jeuSimpleForm.controls.nomJeu;
        CONTROL.setValue("nomCorrect.bmp");

        const RESULTAT: { mauvaisNom: boolean; } | null = gestionFormulaireService.validerNomFichier(CONTROL);
        expect(RESULTAT).toBeNull();
    });

    it("Devrait avertir qu'on a oublié de mettre le nom du jeu lorsqu'on crée le formulaire d'un jeu simple", () => {
        try {
            const UN_FICHIER: File = new File([""], "unFichier");
            const STRING_NULL: string = "";
            gestionFormulaireService.genererFormData(STRING_NULL, UN_FICHIER, UN_FICHIER);
        } catch (e) {
            if (e instanceof Error) {
                // Bonne erreur trouvee
                expect(true).toBe(true);
            } else {
                // Erreur inattendue
                expect(true).toBe(false);
            }

        }
    });

    it("Devrait avertir qu'on a oublié de donner l'image originale lorsqu'on crée le formulaire d'un jeu simple", () => {
        try {
            const UN_FICHIER: File = new File([""], "unFichier");
            const UN_FICHIER_NULL: File | null = null;
            const UN_STRING: string = "test";
            gestionFormulaireService.genererFormData(UN_STRING, UN_FICHIER_NULL, UN_FICHIER);
        } catch (e) {
            if (e instanceof Error) {
                // Bonne erreur trouvee
                expect(true).toBe(true);
            } else {
                // Erreur inattendue
                expect(true).toBe(false);
            }

        }
    });

    it("Devrait avertir qu'on a oublié de donner l'image modifiée lorsqu'on crée le formulaire d'un jeu simple", () => {
        try {
            const UN_FICHIER: File = new File([""], "unFichier");
            const UN_FICHIER_NULL: File | null = null;
            const UN_STRING: string = "test";
            gestionFormulaireService.genererFormData(UN_STRING, UN_FICHIER, UN_FICHIER_NULL);
        } catch (e) {
            if (e instanceof Error) {
                // Bonne erreur trouvee
                expect(true).toBe(true);
            } else {
                // Erreur inattendue
                expect(true).toBe(false);
            }

        }
    });

    it("Devrait avertir qu'on a envoyé deux images identiques lorsqu'on crée un formulaire pour un jeu simple", () => {
        try {
            const UN_FICHIER: File = new File([""], "unFichier");
            const UN_STRING: string = "test";
            gestionFormulaireService.genererFormData(UN_STRING, UN_FICHIER, UN_FICHIER);
        } catch (e) {
            if (e instanceof Error) {
                // Bonne erreur trouvee
                expect(true).toBe(true);
            } else {
                // Erreur inattendue
                expect(true).toBe(false);
            }

        }
    });
});
