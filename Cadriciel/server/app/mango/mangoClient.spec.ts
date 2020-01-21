import { assert } from "chai";
import { readFileSync } from "fs";
import { Db, ObjectId } from "mongodb";
import { join } from "path";
import "reflect-metadata";
import { BaseDeDonnees } from "./mangoClient";

const collectionSortie: string = "testCollection";
const cheminImgRelatif: string = join(__dirname, "..", "..", "assets", "test.bmp");

beforeEach(async () => {
    await BaseDeDonnees.connecter();
});

after(async () => {
    await (BaseDeDonnees.db as Db).collection(collectionSortie + ".chunks").drop();
    await (BaseDeDonnees.db as Db).collection(collectionSortie + ".files").drop();
    await BaseDeDonnees.deconnecter();
});

it("Devrait arriver à se connecter à la bdd", async () => {
    // tslint:disable-next-line:no-console --> afin d'afficher dans le terminal à quel fichier du serveur nous sommes rendus dans les tests
    console.log("-----Test client mongodb-----");
    BaseDeDonnees.db = undefined;

    await BaseDeDonnees.connecter();

    assert.exists(BaseDeDonnees.db, "La base de donnée devrait être assignée à BaseDeDonnees.db");
});

it("Devrait arriver à se déconnecter de la bdd", async () => {
    assert.exists(BaseDeDonnees.db, "La base de donnée devrait être connectée avant le test.");
    await BaseDeDonnees.deconnecter();

    assert.isUndefined(BaseDeDonnees.db, "La base de donnée devrait être déconnectée.");
});

it("Devrait uploader une image et lire cette image de la bdd", async () => {
    const bufferEcrit: Buffer = readFileSync(cheminImgRelatif);

    const id: ObjectId = await BaseDeDonnees.uploadFichier(bufferEcrit, "testFichier", collectionSortie);
    const bufferRecu: Buffer = await BaseDeDonnees.lireFichier(id, collectionSortie);

    assert.equal(bufferEcrit.compare(bufferRecu), 0, "Le buffer écrit et lu de la bdd devrait être le même.");
    await BaseDeDonnees.effacerFichier(id, collectionSortie);
});

it("Devrait effacer l'image de la bdd", (done: Function) => {
    const bufferEcrit: Buffer = readFileSync(cheminImgRelatif);
    BaseDeDonnees.uploadFichier(bufferEcrit, "testFichier", collectionSortie).then((id: ObjectId) => {
        BaseDeDonnees.effacerFichier(id, collectionSortie).then(() => {
            BaseDeDonnees.lireFichier(id, collectionSortie).then((bufferLu: Buffer) => {
                assert.fail("Le fichier devrait être effacé.");
                done();
            }).catch((error: Error) => {
                done();
            });
        }).catch((error: Error) => {
            assert.fail(error.message);
            done();
        });
    }).catch((error: Error) => {
        assert.fail(error.message);
        done();
    });
});
