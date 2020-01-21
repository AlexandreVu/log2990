import { assert } from "chai";
import { Collection } from "mongodb";
import "reflect-metadata";
import { Partie, TypeDePartie } from "../../../client/src/app/Partie";
import { PartieLibre } from "../../../client/src/app/PartieLibre";
import { Score } from "../../../client/src/app/Score";
import { InterfacePartie } from "../../../common/communication/partieInterface";
import { InterfacePartieLibre } from "../../../common/communication/partieLibreInterface";
import { BaseDeDonnees } from "../mango/mangoClient";
import { FicheJeuService } from "./fiche-jeu.service";

let service: FicheJeuService;
const collectionSimple: string = "partiesSimples";
const collectionLibre: string = "partiesLibres";

beforeEach(async () => {
    service = new FicheJeuService;
    await BaseDeDonnees.connecter();
});

after(async () => {
    await BaseDeDonnees.deconnecter();
});

it("Devrait ajouter une partie simple, test egalement le getid", async () => {
    // tslint:disable-next-line:no-console --> afin d'afficher dans le terminal à quel fichier du serveur nous sommes rendu pour les tests
    console.log("-----Test service fiche jeu-----");

    const idP: number = await service.getIdDisponible(TypeDePartie.SIMPLE);
    const partie: Partie = new Partie(idP, "test", TypeDePartie.SIMPLE);
    await service.ajouterFicheSimple(partie);

    const collection: Collection = await BaseDeDonnees.getCollection(collectionSimple);

    const partieInterface: InterfacePartie | null = await collection.findOne({id: idP});

    if (partieInterface !== null) {
        assert.isTrue(partie.nom === partieInterface.nom);
        assert.isTrue(partie.id === partie.id);
    } else {
        assert.fail();
    }

    await service.supprimerFiche(partie);
});

it ("Devrait supprimer une partieSimple", async () => {
    const idP: number = await service.getIdDisponible(TypeDePartie.SIMPLE);
    const partie: Partie = new Partie(idP, "test", TypeDePartie.SIMPLE);
    await service.ajouterFicheSimple(partie);

    const collection: Collection = await BaseDeDonnees.getCollection(collectionSimple);

    await service.supprimerFiche(partie);

    const partieInterface: InterfacePartie | null = await collection.findOne({id: idP});
    if (partieInterface == null) {
        assert.isTrue(true);
    } else {
        assert.fail();
    }
});

it ("Devrait ajouter une partieLibre, test aussi le getId", async() => {
    const idP: number = await service.getIdDisponible(TypeDePartie.LIBRE);
    const partie: PartieLibre = new PartieLibre(idP, "test");
    await service.ajouterFicheLibre(partie);

    const collection: Collection = await BaseDeDonnees.getCollection(collectionLibre);

    const partieInterface: InterfacePartieLibre | null = await collection.findOne({id: idP});

    if (partieInterface !== null) {
        assert.isTrue(partie.nom === partieInterface.nom);
        assert.isTrue(partie.id === partie.id);
    } else {
        assert.fail();
    }

    await service.supprimerFiche(partie);
});

it ("Devrait supprimer une partieLibre", async () => {
    const idP: number = await service.getIdDisponible(TypeDePartie.LIBRE);
    const partie: PartieLibre = new PartieLibre(idP, "test");
    await service.ajouterFicheLibre(partie);

    const collection: Collection = await BaseDeDonnees.getCollection(collectionLibre);

    await service.supprimerFiche(partie);

    const partieInterface: InterfacePartieLibre | null = await collection.findOne({id: idP});
    if (partieInterface === null) {
        assert.isTrue(true);
    } else {
        assert.fail();
    }
});

it ("Devrait recalculer les scores d'une partie simple", async () => {
    const idP: number = await service.getIdDisponible(TypeDePartie.SIMPLE);
    const partie: Partie = new Partie(idP, "test", TypeDePartie.SIMPLE);
    await service.ajouterFicheSimple(partie);

    const collection: Collection = await BaseDeDonnees.getCollection(collectionSimple);

    await service.calculerScore({id: idP, type: TypeDePartie.SIMPLE});
    const partieInterface: InterfacePartie | null = await collection.findOne({id: idP});

    if (partieInterface !== null) {
        const nbScores: number = 3;
        for (let i: number = 0; i < nbScores; i++) {
            assert.isTrue(partie.scoresSolo[i].temps !== partieInterface.scoreSolo[0].temps);
            assert.isTrue(partie.scores1v1[i].temps !== partieInterface.score1v1[0].temps);
        }
    } else {
        assert.fail();
    }

    await service.supprimerFiche(partie);
});

it ("Devrait recalculer les scores d'une partie libre", async () => {
    const idP: number = await service.getIdDisponible(TypeDePartie.LIBRE);
    const partie: PartieLibre = new PartieLibre(idP, "test");
    await service.ajouterFicheLibre(partie);

    const collection: Collection = await BaseDeDonnees.getCollection(collectionLibre);

    await service.calculerScore({id: idP, type: TypeDePartie.LIBRE});
    const partieInterface: InterfacePartieLibre | null = await collection.findOne({id: idP});

    if (partieInterface !== null) {
        const nbScores: number = 3;
        for (let i: number = 0; i < nbScores; i++) {
            assert.isTrue(partie.scoresSolo[i].temps !== partieInterface.scoreSolo[0].temps);
            assert.isTrue(partie.scores1v1[i].temps !== partieInterface.score1v1[0].temps);
        }
    } else {
        assert.fail();
    }

    await service.supprimerFiche(partie);
});

it ("Devrait remplacer l'ancienne partie par la nouvelle", async () => {
    const idP: number = await service.getIdDisponible(TypeDePartie.SIMPLE);
    const partie: Partie = new Partie(idP, "ancien nom", TypeDePartie.SIMPLE);
    await service.ajouterFicheSimple(partie);
    const nouveauNom: String = "nouveau nom";
    partie.nom = nouveauNom;
    const nouveauScore: Score = new Score(1, "testJoueur");
    partie.scoresSolo[0] = nouveauScore;

    await service.updatePartie(partie);

    const partieRecue: Partie = await service.getPartieSimple(partie.id);
    assert.equal(partieRecue.nom, nouveauNom, "Nom de la partie devrait avoir changé.");
    assert.equal(partieRecue.scoresSolo[0].temps, nouveauScore.temps, "Temps du score devrait avoir changé.");
    assert.equal(partieRecue.scoresSolo[0].nomDuJoueur, nouveauScore.nomDuJoueur, "Nom du score devrait avoir changé.");
    await service.supprimerFiche(partie);
});
