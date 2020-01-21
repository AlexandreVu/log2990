import { TestBed } from "@angular/core/testing";

import { HttpClientModule } from "@angular/common/http";
import { of } from "rxjs";
import { Confirmation } from "../../../../common/communication/confirmation";
import { ReponseDifferences } from "../../../../common/communication/differences";
import { Partie, TypeDePartie } from "../Partie";
import { CommunicationService } from "./communication.service";

// tslint:disable-next-line:no-any Utilisé pour mock le http call
let httpClientEspion: any;
let communication: CommunicationService;
let nomTest: string;
let messageConfirmationVoulue: Confirmation;

describe("CommunicationService", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
        });

        httpClientEspion = jasmine.createSpyObj("HttpClient", ["post", "put", "get"]);
        communication = new CommunicationService(httpClientEspion);
    });
    it("Vérifie que l'on peut créer CommunicationService", () => {
        const SERVICE: CommunicationService = TestBed.get(CommunicationService);
        expect(SERVICE).toBeTruthy();
    });
    it("Devrait verifier un nom acceptable ne contenant que des lettres entrée par le joueur", () => {
        nomTest = "Bonjour";
        expect(communication.verifierNom(nomTest)).toEqual(true);
    });
    it("Devrait verifier un nom acceptable ne contenant que des chiffres entrée par le joueur", () => {
        nomTest = "12345";
        expect(communication.verifierNom(nomTest)).toEqual(true);
    });
    it(" Devrait verifier un nom acceptable contenant des lettres et des chiffres entrée par le joueur", () => {
        nomTest = "Bonjour123";
        expect(communication.verifierNom(nomTest)).toEqual(true);
    });
    it("Devrait verifier un mauvais nom de moins de 4 lettres entrée par le joueur", () => {
        nomTest = "Bon";
        expect(communication.verifierNom(nomTest)).toEqual(false);
    });
    it("Devrait verifier un nom de plus de 12 lettres entrée par le joueur", () => {
        nomTest = "DavidEtAlexandre";
        expect(communication.verifierNom(nomTest)).toEqual(false);
    });
    it("Devrait verifier nom qui contient des caractères qui ne font pas parties des caractères alphanumériques", () => {
        nomTest = "!David_Et_Alexandre?";
        expect(communication.verifierNom(nomTest)).toEqual(false);
    });

    it("Devrait envoyer un nom vers le serveur", () => {
        nomTest = "Alex";
        messageConfirmationVoulue = { nom: nomTest, ajoute: true };

        httpClientEspion.post.and.returnValue(of(messageConfirmationVoulue));

        communication.envoyerNom(nomTest).subscribe(
            (reponse: Confirmation) => {
                expect(reponse.nom).toEqual(messageConfirmationVoulue.nom);
                expect(reponse.ajoute).toEqual(messageConfirmationVoulue.ajoute);
            },
            fail,
        );
    });

    it("Devrait se rappeler du nom même si le service est recréé", () => {
        nomTest = "Alex";

        communication.nom = nomTest;
        // location.reload();
        communication = new CommunicationService(httpClientEspion);

        expect(window.localStorage["nom"]).toEqual(communication.nom);
        expect(communication.nom).toEqual(nomTest);

    });

    it("Devrait ne pas envoyer un nom qui existe déjà dans le serveur", () => {
        nomTest = "David";
        messageConfirmationVoulue = { nom: nomTest, ajoute: false };

        httpClientEspion.post.and.returnValue(of(messageConfirmationVoulue));

        communication.envoyerNom(nomTest).subscribe(
            (reponse: Confirmation) => {
                expect(reponse.nom).toEqual(messageConfirmationVoulue.nom);
                expect(reponse.ajoute).toEqual(messageConfirmationVoulue.ajoute);
            },
            fail,
        );
    });

    it("Devrait deconnecter un utilisateur de notre serveur", () => {
        nomTest = "David";
        const MESSAGE_DECONNEXION_VOULUE: Confirmation = { nom: nomTest, ajoute: true };
        httpClientEspion.put.and.returnValue(of(MESSAGE_DECONNEXION_VOULUE));

        communication.deconnecter(nomTest).subscribe(
            (reponse: Confirmation) => {
                expect(reponse.nom).toEqual(MESSAGE_DECONNEXION_VOULUE.nom);
                expect(reponse.ajoute).toEqual(MESSAGE_DECONNEXION_VOULUE.ajoute);
            },
            fail,
        );
    });

    it("Devrait envoyer un formulaire vers le serveur", () => {
        const UN_FORMULAIRE: FormData = new FormData();
        const UN_MESSAGE: ReponseDifferences = { ajoute: true, erreur: "test" , idImageOriginale: "abc123",
                                                 idImageModifiee: "test2", idImageDifferences: "xyz456"};

        httpClientEspion.post.and.returnValue(of(UN_MESSAGE));

        communication.envoyerFormulaire(UN_FORMULAIRE).subscribe(
            (reponse: ReponseDifferences) => {
                expect(reponse).toEqual(UN_MESSAGE);
            },
            fail,
        );
    });

    it("Devrait ajouter un score qui se place dans le tableau", () => {
        const UN_TEMPS: number = 10;

        httpClientEspion.post.and.returnValue(of("1"));

        communication.updateScore(UN_TEMPS, 1, TypeDePartie.SIMPLE, true).subscribe(
            (reponse: string) => {
                expect(reponse).toEqual("1");
        });
    });

    it("Devrait pas ajouter un temps qui ne se place pas dans le tableau", () => {
        const UN_TEMPS: number = 99999;

        httpClientEspion.post.and.returnValue(of("0"));

        communication.updateScore(UN_TEMPS, 1, TypeDePartie.SIMPLE, true).subscribe(
            (reponse: string) => {
                expect(reponse).toEqual("0");
        });
    });

    it("Devrait commencer une partie", () => {
        httpClientEspion.post.and.returnValue(of(""));

        communication.commencerJeu("0", "", "", "").subscribe(
            (reponse: string) => {
                expect(reponse).toEqual("");
            });
    });

    it("Devrait envoyer un clique de partie simple vers le serveur", () => {
        httpClientEspion.post.and.returnValue(of(""));

        communication.envoyerClickSimple(0, 0, 0, "").subscribe(
            (reponse: string) => {
                expect(reponse).toEqual("");
            });
    });

    it("Devrait envoyer un clique de partie libre vers le serveur", () => {
        httpClientEspion.post.and.returnValue(of(true));

        communication.envoyerClickLibre(0, 0, 0, 0).subscribe(
            (reponse: boolean) => {
                expect(reponse).toEqual(true);
            });
    });

    it("Devrait aller chercher la partie libre demandée dans le serveur", () => {
        const UNE_PARTIE: Partie = new Partie(0, "", TypeDePartie.LIBRE);
        httpClientEspion.get.and.returnValue(of(UNE_PARTIE));

        communication.getPartieLibre(0).subscribe(
            (reponse: Partie) => {
                expect(reponse).toEqual(UNE_PARTIE);
            });
    });

    it("Devrait aller chercher la partie simple demandée dans le serveur", () => {
        const UNE_PARTIE: Partie = new Partie(0, "", TypeDePartie.LIBRE);
        httpClientEspion.get.and.returnValue(of(UNE_PARTIE));

        communication.getPartieSimple(0).subscribe(
            (reponse: Partie) => {
                expect(reponse).toEqual(UNE_PARTIE);
            });
    });

    it("Devrait terminé la partie dont l'id est envoyé vers le serveur", () => {
        nomTest = "Victor";
        messageConfirmationVoulue = { nom: nomTest, ajoute: true };

        httpClientEspion.post.and.returnValue(of(messageConfirmationVoulue));

        communication.terminerJeu(0).subscribe(
            (reponse: Confirmation) => {
                expect(reponse).toEqual(messageConfirmationVoulue);
            });
    });

    it("Devrait recevoir un id de partie simple", () => {
        httpClientEspion.post.and.returnValue(of("0"));

        communication.getIdVS({type: TypeDePartie.SIMPLE}).subscribe(
            (reponse: string)  => {
                expect(reponse).toEqual("0");
            });
    });

    it("Devrait recevoir un id de partie libre", () => {
        httpClientEspion.post.and.returnValue(of("0"));

        communication.getIdVS({type: TypeDePartie.LIBRE}).subscribe(
            (reponse: string)  => {
                expect(reponse).toEqual("0");
            });
    });
});
