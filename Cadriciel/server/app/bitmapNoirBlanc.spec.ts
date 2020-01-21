import { assert } from "chai";
import * as fs from "fs";
import { join } from "path";
import { BitmapNoirBlanc } from "./bitmapNoirBlanc";

const cheminFichiersTest: string = "tempTest";
const nomFichierTest: string = "fichierTest.bmp";
const nomFichierTest2: string = "fichierTest2.bmp";

after( () => {
    if (fs.existsSync(cheminFichiersTest)) {
        fs.readdirSync(cheminFichiersTest).forEach((file: string) => {
            const chemin: string = join(cheminFichiersTest, file);
            fs.unlinkSync(chemin);
        });
        if (fs.existsSync(cheminFichiersTest)) {
            fs.rmdirSync(cheminFichiersTest);
        }
    }
});

it("Devrait creer un bitmap blanch vide de 1 pixel", () => {
    // tslint:disable-next-line:no-console --> afin d'afficher dans le terminal à quel fichier du serveur nous sommes rendus dans les tests
    console.log("-----Tests bitmaps N&B-----");
    const bitmap: BitmapNoirBlanc =  new BitmapNoirBlanc(1, 1);

    assert.equal(bitmap.identite, BitmapNoirBlanc.IDENTITE_ATTENDUE, "Le fichier devrait contenir une structure de bitmap.");
    assert.equal(bitmap.bits, BitmapNoirBlanc.BITS_ATTENDUS, `Le bitmap devrait être de ${BitmapNoirBlanc.BITS_ATTENDUS}`);
    assert.equal(bitmap.hauteur, 1, "Le bitmap devrait avoir une hauteur de 1.");
    assert.equal(bitmap.largeur, 1, "Le bitmap devrait avoir une largeur de 1.");
    assert.equal(bitmap.getPixel(0, 0), 0, "Le pixel (0,0) devrait être blanc.");
});

it("Devrait creer un bitmap de 999x999 pixels", () => {
    const nbPixelsTest: number = 999;
    const bitmap: BitmapNoirBlanc =  new BitmapNoirBlanc(nbPixelsTest, nbPixelsTest);

    assert.equal(bitmap.hauteur, nbPixelsTest, `Le bitmap devrait avoir une hauteur de ${nbPixelsTest}.`);
    assert.equal(bitmap.largeur, nbPixelsTest, `Le bitmap devrait avoir une largeur de ${nbPixelsTest}.`);
});

it("Devrait changer la couleur d'un pixel avec setPixel", () => {
    const tailleTest: number = 200;
    const bitmap: BitmapNoirBlanc =  new BitmapNoirBlanc(tailleTest, tailleTest);
    const positionTest1: number = 0;
    const positionTest2: number = 100;
    const positionTest3: number = tailleTest - 1;
    const noir: number = 1;
    const blanc: number = 0;

    bitmap.setPixel(positionTest1, positionTest1, noir);
    bitmap.setPixel(positionTest2, positionTest2, blanc);
    bitmap.setPixel(positionTest3, positionTest3, noir);

    assert.equal(bitmap.getPixel(positionTest1, positionTest1), noir, "Le pixel à (0,0) devrait être noir.");
    assert.equal(bitmap.getPixel(positionTest2, positionTest2), blanc,
                 `Le pixel à (${positionTest2},${positionTest2}) devrait être blanc.`);
    assert.equal(bitmap.getPixel(positionTest3, positionTest3), noir,
                 `Le pixel à (${positionTest3},${positionTest3}) devrait être noir.`);
});

it("Devrait sauvegarder un fichier d'image", () => {
    const bitmap: BitmapNoirBlanc =  new BitmapNoirBlanc(BitmapNoirBlanc.LARGEUR_ATTENDUE, BitmapNoirBlanc.HAUTEUR_ATTENDUE);
    const cheminFichierTest: string = cheminFichiersTest + "\\" + nomFichierTest;
    bitmap.sauvegarderFichier(cheminFichierTest);

    const buffer: Buffer = fs.readFileSync(cheminFichierTest);
    assert.exists(buffer, `Le fichier devrait être sauvegardé à ${cheminFichierTest}.`);
});

it("Devrait créer un bitmap exactement pareil (copie).", () => {
    const bitmap: BitmapNoirBlanc =  new BitmapNoirBlanc(BitmapNoirBlanc.LARGEUR_ATTENDUE, BitmapNoirBlanc.HAUTEUR_ATTENDUE);
    const cheminFichier1: string = cheminFichiersTest + "\\" + nomFichierTest;
    const cheminFichier2: string = cheminFichiersTest + "\\" + nomFichierTest2;
    const hasardNum: number = 3;
    for (let rangee: number = 0; rangee < BitmapNoirBlanc.HAUTEUR_ATTENDUE; rangee++) {
        for (let colonne: number = 0; colonne < BitmapNoirBlanc.LARGEUR_ATTENDUE; colonne++) {
            bitmap.setPixel(rangee, colonne, (rangee + colonne) % hasardNum); // Crée un bitmap random
        }
    }
    bitmap.sauvegarderFichier(cheminFichier1);

    const bitmapCopie: BitmapNoirBlanc = bitmap.copieBitmap();

    bitmapCopie.sauvegarderFichier(cheminFichier2);
    const data1: Buffer = fs.readFileSync(cheminFichier1);
    const data2: Buffer = fs.readFileSync(cheminFichier2);
    assert.equal(data1.compare(data2), 0, "Les deux fichiers devraient être pareils.");
});
