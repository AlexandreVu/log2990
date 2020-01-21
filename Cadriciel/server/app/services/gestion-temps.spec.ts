import { assert } from "chai";
import "reflect-metadata";
import { Partie, TypeDePartie } from "../../../client/src/app/Partie";
import { PartieLibre } from "../../../client/src/app/PartieLibre";
import { Score } from "../../../client/src/app/Score";
import { GestionTempsService } from "./gestion-temps";

let service: GestionTempsService;

before(async () => {
    service = new GestionTempsService();
});

// tslint:disable:no-magic-numbers AL: Nombres magiques pour les tests sur les scores aléatoires

it("Devrait mettre à jour le score solo lorsque le temps est meilleur", () => {
    // tslint:disable-next-line:no-console --> afin d'afficher dans le terminal à quel fichier du serveur nous sommes rendus pour les tests
    console.log("-----Test gestion-temps service-----");
    const partie: Partie = new Partie(0, "nomPartie", TypeDePartie.SIMPLE);
    const ancienScores: Score[] = partie.scoresSolo;
    const nouveauTemps: number = 10;
    const nouveauNom: String = "player1";
    service.updateTemps(nouveauTemps, partie, nouveauNom, true);

    assert.equal(partie.scoresSolo[0].temps, nouveauTemps, "Devrait avoir changer le meilleur temps.");
    assert.equal(partie.scoresSolo[0].nomDuJoueur, nouveauNom, "Devrait avoir changer le nom du joueur ayant le meilleur score.");
    assert.equal(partie.scoresSolo[1], ancienScores[1], "Ne devrait pas avoir changé les autres scores.");
    assert.equal(partie.scoresSolo[2], ancienScores[2], "Ne devrait pas avoir changé les autres scores.");
});

it("Ne devrait pas mettre à jour le score solo lorsque le temps n'est pas meilleur", () => {
    const partie: Partie = new Partie(0, "nomPartie", TypeDePartie.SIMPLE);
    const ancienScores: Score[] = partie.scoresSolo;
    const nouveauTemps: number = 100000;
    const nouveauNom: String = "player1";
    service.updateTemps(nouveauTemps, partie, nouveauNom, true);

    assert.equal(partie.scoresSolo[0], ancienScores[0], "Ne devrait pas avoir changé le score.");
    assert.equal(partie.scoresSolo[1], ancienScores[1], "Ne devrait pas avoir changé le score.");
    assert.equal(partie.scoresSolo[2], ancienScores[2], "Ne devrait pas avoir changé le score.");
});

it("Devrait mettre à jour le score 1v1 lorsque le temps est meilleur", () => {
    const partie: PartieLibre = new PartieLibre(0, "nomPartie");
    const ancienScores: Score[] = partie.scores1v1;
    const nouveauTemps: number = 10;
    const nouveauNom: String = "player1";
    service.updateTemps(nouveauTemps, partie, nouveauNom, false);

    assert.equal(partie.scores1v1[0].temps, nouveauTemps, "Devrait avoir changer le meilleur temps.");
    assert.equal(partie.scores1v1[0].nomDuJoueur, nouveauNom, "Devrait avoir changer le nom du joueur ayant le meilleur score.");
    assert.equal(partie.scores1v1[1], ancienScores[1], "Ne devrait pas avoir changé les autres scores.");
    assert.equal(partie.scores1v1[2], ancienScores[2], "Ne devrait pas avoir changé les autres scores.");
});

it("Ne devrait pas mettre à jour le score 1v1 lorsque le temps n'est pas meilleur", () => {
    const partie: Partie = new Partie(0, "nomPartie", TypeDePartie.SIMPLE);
    const ancienScores: Score[] = partie.scores1v1;
    const nouveauTemps: number = 100000;
    const nouveauNom: String = "player1";
    service.updateTemps(nouveauTemps, partie, nouveauNom, false);

    assert.equal(partie.scores1v1[0], ancienScores[0], "Ne devrait pas avoir changé le score.");
    assert.equal(partie.scores1v1[1], ancienScores[1], "Ne devrait pas avoir changé le score.");
    assert.equal(partie.scores1v1[2], ancienScores[2], "Ne devrait pas avoir changé le score.");
});
