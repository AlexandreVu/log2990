import { TestBed } from "@angular/core/testing";

import { HttpClientModule } from "@angular/common/http";
import { of } from "rxjs";
import { Partie, TypeDePartie } from "../Partie";
import { PartieLibre } from "../PartieLibre";
import { FormulaireService } from "./formulaire.service";

// tslint:disable-next-line:no-any Utilisé pour mock le http call
let httpClientSpy: any;
let formulaireService: FormulaireService;
let partieFiche: Partie;
let partieLibre: PartieLibre;

describe("FormulaireService", () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
        });

        httpClientSpy = jasmine.createSpyObj("HttpClient", ["post", "put", "get"]);
        formulaireService = new FormulaireService(httpClientSpy);
    });

    it("Vérifie que l'on peut créer FormulaireService", () => {
        const SERVICE: FormulaireService = TestBed.get(FormulaireService);
        expect(SERVICE).toBeTruthy();
    });

    it("Devrait envoyer une partie simple créée par un joueur dans le serveur", () => {
        const BOOL: boolean = true;
        httpClientSpy.post.and.returnValue(of(BOOL));
        partieFiche = new Partie(0, "", TypeDePartie.SIMPLE);
        formulaireService.envoyerPartieSimple(partieFiche).subscribe(
            (reponse: boolean) => {
                expect(reponse).toEqual(BOOL);
            },
            fail,
        );
    });

    it("Devrait envoyer une partie libre créée par un joueur dans le serveur", () => {
        const BOOL: boolean = true;
        httpClientSpy.post.and.returnValue(of(BOOL));
        partieLibre = new PartieLibre(0, "");
        formulaireService.envoyerPartieLibre(partieLibre).subscribe(
            (reponse: boolean) => {
                expect(reponse).toEqual(BOOL);
            },
            fail,
        );
    });

    it("Devrait supprimer une partie dans le serveur", () => {
        const BOOL: boolean = true;

        httpClientSpy.put.and.returnValue(of(BOOL));
        formulaireService.supprimerPartie(0, TypeDePartie.SIMPLE, "", "", "").subscribe(
            (reponse: boolean) => {
            expect(reponse).toEqual(BOOL);
            },
            fail,
        );
    });

    it("Devrait prendre les parties sauvegardées dans le serveur", () => {
      const PARTIE_SIMPLE: Partie = new Partie(1, "partieTest", TypeDePartie.SIMPLE);
      const DES_PARTIES: Partie[] = [PARTIE_SIMPLE];

      httpClientSpy.get.and.returnValue(of(DES_PARTIES));
      formulaireService.getPartiesSimples().subscribe(
        (reponse: Partie[]) => {
          expect(reponse).toEqual(DES_PARTIES);
        },
        fail,
      );
    });

    it("Devrait vérifier si l'id de la partie est disponible", () => {
        const PARTIE_SIMPLE: Partie = new Partie(1, "partieTest", TypeDePartie.SIMPLE);

        httpClientSpy.put.and.returnValue(of(PARTIE_SIMPLE.getId()));
        formulaireService.getIdDisponible(PARTIE_SIMPLE).subscribe(
          (reponse: {id: number}) => {
            PARTIE_SIMPLE.setId(reponse.id);
            expect(reponse.id).toEqual(PARTIE_SIMPLE.getId());
          },
          fail,
        );
      });
});
