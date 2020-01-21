import { TestBed } from "@angular/core/testing";
import { IdentificateurObjet } from ".//identificateur-objet";

describe("IdentificateurObjet", () => {
    let identificateur: IdentificateurObjet;

    beforeAll(() => {
        identificateur = new IdentificateurObjet();
    });

    beforeEach(() => TestBed.configureTestingModule({}));

    it("Vérifie que l'on peut créer IdentificateurObjet", async() => {
        expect(identificateur).toBeTruthy();
    });

});
