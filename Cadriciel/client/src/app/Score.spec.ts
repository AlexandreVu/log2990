import { Score } from "./Score";

/* tslint:disable:no-magic-numbers --> afin de pouvoir créer des scores pour les tests */
describe("Score", () => {
    const UN_SCORE: Score = new Score(0, "");

    it("Vérifie que l'on peut créer Score", () => {
        expect(UN_SCORE).toBeTruthy();
    });

    it("Devrait transformer un score inférieur à 60 secondes en format minuterie (0:XX) avec tempsMinSec()", () => {
        UN_SCORE.setTemps(32);
        UN_SCORE.tempsMinSec();
        expect(UN_SCORE.tempsString).toEqual("0:32");
    });

    it("Devrait transformer le score de 60 secondes en format minuterie de 1:00 avec tempsMinSec()", () => {
        UN_SCORE.setTemps(60);
        UN_SCORE.tempsMinSec();
        expect(UN_SCORE.tempsString).toEqual("1:00");
    });

    it("Devrait transformer un score quelconque supérieur à 120 secondes en format minuterie (2:XX) avec tempsMinSec()", () => {
        UN_SCORE.setTemps(135);
        UN_SCORE.tempsMinSec();
        expect(UN_SCORE.tempsString).toEqual("2:15");
    });

    it("Devrait transformer un score quelconque supérieur à 300 seconde en format minuterie (5:XX) avec tempsMinSec()", () => {
        UN_SCORE.setTemps(323);
        UN_SCORE.tempsMinSec();
        expect(UN_SCORE.tempsString).toEqual("5:23");
    });

    it("Devrait modifier et avoir le nom d'un joueur relié à un score avec de getNomDuJoueur() et setNomDuJoueur()", () => {
        UN_SCORE.setNomDuJoeur("test");
        expect(UN_SCORE.getNomDuJoueur()).toEqual("test");
    });
});
