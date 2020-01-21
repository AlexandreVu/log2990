import { Partie, TypeDePartie } from "./Partie";
import { Score } from "./Score";

/* tslint:disable:no-magic-numbers --> afin de pouvoir créer des scores pour les tests*/
describe("Partie", () => {
    const UNE_PARTIE: Partie = new Partie(0, "", TypeDePartie.SIMPLE);
    const IMG1: string = "abc123xyz";
    const SCORES: Score[] =  [new Score(32, "Moi"), new Score(60, "Cool Guy"), new Score(135, "Les autres")];

    it("Vérifie que l'on peut créer Partie", () => {
        expect(UNE_PARTIE).toBeTruthy();
    });

    it("Devrait modifier et d'avoir l'id d'une partie avec getId() et setId()", () => {
        UNE_PARTIE.setId(1);
        expect(UNE_PARTIE.getId()).toEqual(1);
    });

    it("Devrait modifier et avoir le nom d'une partie avec getNom() et setNom()", () => {
        UNE_PARTIE.setNom("test");
        expect(UNE_PARTIE.getNom()).toEqual("test");
    });

    it("Devrait modifier et avoir l'image originale d'une partie simple avec getIdImageOriginale() et setIdImageOriginale()", () => {
        UNE_PARTIE.setIdImageOriginale(IMG1);
        expect(UNE_PARTIE.getIdImageOriginale()).toEqual(IMG1);
    });

    it("Devrait modifier et avoir l'image modifiée d'une partie simple avec getIdImageModifiee() et setIdImageModifiee()", () => {
        UNE_PARTIE.setIdImageModifiee(IMG1);
        expect(UNE_PARTIE.getIdImageModifiee()).toEqual(IMG1);
    });

    it("Devrait modifier et avoir l'image des différences d'une partie avec getIdImageDifferences() et setIdImageDifferences()", () => {
        UNE_PARTIE.setIdImageDifferences(IMG1);
        expect(UNE_PARTIE.getIdImageDifferences()).toEqual(IMG1);
    });

    it("Devrait modifier et avoir les meilleurs scores solo d'une partie avec getScoresSolo() et setScoresSolo()", () => {
        UNE_PARTIE.setScoresSolo(SCORES);
        expect(UNE_PARTIE.getScoresSolo()).toEqual(SCORES);
    });

    it("Devrait modifier et avoir les meilleurs scores 1v1 d'une partie avec getScores1v1() et setScores1v1()", () => {
        UNE_PARTIE.setScores1v1(SCORES);
        expect(UNE_PARTIE.getScores1v1()).toEqual(SCORES);
    });

    it("Devrait modifier et avoir le tyoe de partie d'une partie avec getType() et setType()", () => {
        UNE_PARTIE.setType(TypeDePartie.LIBRE);
        expect(UNE_PARTIE.getType()).toEqual(TypeDePartie.LIBRE);
    });

    it("Devrait modifier l'attribut partieEnLigne d'une partie et d'avoir sa valeur avec getPartieCree()", () => {
        UNE_PARTIE.partieEnLigne = true;
        expect(UNE_PARTIE.getPartieCreeEnLigne()).toEqual(true);
    });

    it("Devrait retourner true car les 2 parties sont identiques avec estIdentique()", () => {
        expect(UNE_PARTIE.estIdentique(UNE_PARTIE)).toEqual(true);
    });

    it("Devrait retourner false car les 2 parties sont différentes avec estIdentique()", () => {
        expect(UNE_PARTIE.estIdentique(new Partie(0, "", TypeDePartie.SIMPLE))).toEqual(false);
    });
});
