import { assert } from "chai";
import * as fs from "fs";
import { ObjectId } from "mongodb";
import { join } from "path";
import { BitmapCouleur } from "../bitmapCouleur";
import { BitmapNoirBlanc } from "../bitmapNoirBlanc";
import { BaseDeDonnees } from "../mango/mangoClient";
import { GenerateurDifferencesService } from "./generateur-differences.service";

const cheminImgRelatif: string = join(__dirname, "..", "..", "assets");
const nomImageDifferences: string = "imageDifferencesTest.bmp";
const buffers: Buffer[] = [];
let service: GenerateurDifferencesService;

before(async () => {
    service = new GenerateurDifferencesService();
    await BaseDeDonnees.connecter();

    // On insère les images de test dans mongodb
    const fichiers: string[] = ["test.bmp", "test_erreur_format.bmp", "test_erreur_taille.bmp",
                                "test_erreur_nb_differences.bmp", "test_differences.bmp"];
    for (let i: number = 0; i < fichiers.length; i++) {
        buffers[i] = fs.readFileSync(join(cheminImgRelatif, fichiers[i]));
    }
});

after(async () => {
    await BaseDeDonnees.deconnecter();
});

it("Devrait retourner une erreur si une des deux images n'est pas du bon format.", (done: Function) => {
    // tslint:disable-next-line:no-console --> afin d'afficher dans le terminal à quel fichier du serveur nous sommes rendus pour les tests
    console.log("-----Test generateur de differences-----");
    const posBase: number = 0;
    const posTest: number = 1;
    service.genererImageDifferences(buffers[posBase], buffers[posTest], nomImageDifferences).then(() => {
        assert.fail();
        done();
    }).catch((error: Error) => {
        done();
    });
});

it("Devrait retourner une erreur si une des deux images n'a pas la bonne taille.", (done: Function) => {
    const posBase: number = 0;
    const posTest: number = 2;
    service.genererImageDifferences(buffers[posBase], buffers[posTest], nomImageDifferences).then(() => {
        assert.fail();
        done();
    }).catch((error: Error) => {
        done();
    });
});

it("Devrait retourner une erreur si une des deux images n'a pas le bon nombre de différences.", (done: Function) => {
    const posBase: number = 0;
    const posTest: number = 3;
    service.genererImageDifferences(buffers[posBase], buffers[posTest], nomImageDifferences).then(() => {
        assert.fail();
        done();
    }).catch((error: Error) => {
        done();
    });
});

it("Devrait correctement créer l'image si les deux images d'entrées sont correctes.", async() => {
    const posBase: number = 0;
    const posTest: number = 4;
    const id: ObjectId = await service.genererImageDifferences(buffers[posBase], buffers[posTest], nomImageDifferences);

    const buffer: Buffer = await BaseDeDonnees.lireFichier(id, GenerateurDifferencesService.COLLECTION_SORTIE);

    assert.exists(buffer);
    await BaseDeDonnees.effacerFichier(id, GenerateurDifferencesService.COLLECTION_SORTIE);
});

it("Devrait compter le bon nombre de differences", async () => {
    const posBase: number = 0;
    const posTest: number = 4;
    const id: ObjectId = await service.genererImageDifferences(buffers[posBase], buffers[posTest], nomImageDifferences);
    const buffer: Buffer = await BaseDeDonnees.lireFichier(id, GenerateurDifferencesService.COLLECTION_SORTIE);
    const bitmap: BitmapNoirBlanc = new BitmapNoirBlanc(BitmapNoirBlanc.LARGEUR_ATTENDUE, BitmapNoirBlanc.HAUTEUR_ATTENDUE);
    bitmap.buffer = buffer;
    const differencesAttendues: number = 7;
    const differences: number = service.compterDifferences(bitmap);

    assert.equal(differences, differencesAttendues, `Il devrait y avoir ${differencesAttendues} différences.`);
    await BaseDeDonnees.effacerFichier(id, GenerateurDifferencesService.COLLECTION_SORTIE);
});

it("Devrait enlever la différence identifiée.", async () => {
    const posBase: number = 0, posTest: number = 4;
    const id: ObjectId = await service.genererImageDifferences(buffers[posBase], buffers[posTest], nomImageDifferences);
    const imageDifferences: BitmapNoirBlanc = new BitmapNoirBlanc(BitmapNoirBlanc.LARGEUR_ATTENDUE, BitmapNoirBlanc.HAUTEUR_ATTENDUE);
    imageDifferences.buffer = await BaseDeDonnees.lireFichier(id, GenerateurDifferencesService.COLLECTION_SORTIE);
    const imageOriginale: BitmapCouleur = new BitmapCouleur(buffers[posBase]);
    const imageModifiee: BitmapCouleur = new BitmapCouleur(buffers[posTest]);
    const rangeeDifference: number = 235, colonneDifference: number = 390;
    const differencesDepart: number = service.compterDifferences(imageDifferences);
    assert.notEqual(imageOriginale.getPixel(rangeeDifference, colonneDifference),
                    imageModifiee.getPixel(rangeeDifference, colonneDifference),
                    `Les deux images devraient être différentes à (${rangeeDifference},${colonneDifference}) avant de l'enlever.`);

    const trouve: boolean = service.identifierDifference(imageOriginale, imageModifiee, imageDifferences,
                                                         rangeeDifference, colonneDifference);

    assert.isTrue(trouve, "Il devrait trouver une différence.");
    assert.equal(imageOriginale.getPixel(rangeeDifference, colonneDifference),
                 imageModifiee.getPixel(rangeeDifference, colonneDifference), "Il devrait retourner la différence à l'image originale.");
    assert.equal(imageDifferences.getPixel(rangeeDifference, colonneDifference), 0,
                 "L'image de différence devrait retourner blanc pour toute la différence.");
    assert.equal(service.compterDifferences(imageDifferences), differencesDepart - 1, "Il devrait y avoir une différence de moins.");
    await BaseDeDonnees.effacerFichier(id, GenerateurDifferencesService.COLLECTION_SORTIE);
});

it("Ne devrait pas enlever de différence ", async () => {
    const posBase: number = 0, posTest: number = 4;
    const id: ObjectId = await service.genererImageDifferences(buffers[posBase], buffers[posTest], nomImageDifferences);
    const imageDifferences: BitmapNoirBlanc = new BitmapNoirBlanc(BitmapNoirBlanc.LARGEUR_ATTENDUE, BitmapNoirBlanc.HAUTEUR_ATTENDUE);
    imageDifferences.buffer = await BaseDeDonnees.lireFichier(id, GenerateurDifferencesService.COLLECTION_SORTIE);
    const imageOriginale: BitmapCouleur = new BitmapCouleur(buffers[posBase]);
    const imageModifiee: BitmapCouleur = new BitmapCouleur(buffers[posTest]);
    const rangeeDifference: number = 2, colonneDifference: number = 2;
    const differencesDepart: number = service.compterDifferences(imageDifferences);
    assert.equal(imageOriginale.getPixel(rangeeDifference, colonneDifference),
                 imageModifiee.getPixel(rangeeDifference, colonneDifference),
                 `Les deux images devraient être pareilles à (${rangeeDifference},${colonneDifference}).`);

    const trouve: boolean = service.identifierDifference(imageOriginale, imageModifiee, imageDifferences,
                                                         rangeeDifference, colonneDifference);

    assert.isFalse(trouve, "Il ne devrait pas trouver de différence.");
    assert.equal(service.compterDifferences(imageDifferences), differencesDepart, "Il devrait y avoir le même nombre de différences.");
    await BaseDeDonnees.effacerFichier(id, GenerateurDifferencesService.COLLECTION_SORTIE);
});
