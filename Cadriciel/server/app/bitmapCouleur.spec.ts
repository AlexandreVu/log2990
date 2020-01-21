import { assert } from "chai";
import * as fs from "fs";
import { BitmapCouleur } from "./bitmapCouleur";

const cheminImgRelatif: string = "../client/src/assets/img/";
const blanc: number = 0xFFFFFF;
const rouge: number = 0x241CED;
const noir: number = 0x000000;

it("Devrait creer un bitmapCouleur à partir d'un fichier .bmp", () => {
    // tslint:disable-next-line:no-console --> afin d'afficher dans le terminal à quel fichier du serveur nous sommes rendus dans les tests
    console.log("-----Tests bitmaps couleur-----");
    const nomFichier: string = cheminImgRelatif + "test.bmp";
    const data: Buffer = fs.readFileSync(nomFichier);
    const bitmap: BitmapCouleur = new BitmapCouleur(data);
    assert.equal(bitmap.identite, BitmapCouleur.IDENTITE_ATTENDUE, "Le fichier devrait contenir une structure de bitmap.");
    assert.equal(bitmap.bits, BitmapCouleur.BITS_ATTENDUS, `Le bitmap devrait être de ${BitmapCouleur.BITS_ATTENDUS} bits.`);
    assert.equal(bitmap.hauteur, BitmapCouleur.HAUTEUR_ATTENDUE,
                 `Le bitmap devrait avoir une hauteur de ${BitmapCouleur.HAUTEUR_ATTENDUE}.`);
    assert.equal(bitmap.hauteur, BitmapCouleur.HAUTEUR_ATTENDUE,
                 `Le bitmap devrait avoir une hauteur de ${BitmapCouleur.LARGEUR_ATTENDUE}.`);
});

it("Devrait retourner les bonnes couleurs par getPixel", () => {
    const testPixelHauteur: number = 83;
    const testPixelLargeur: number = 297;
    const nomFichier: string = cheminImgRelatif + "test_differences.bmp";
    const data: Buffer = fs.readFileSync(nomFichier);
    const bitmap: BitmapCouleur = new BitmapCouleur(data);
    assert.equal(bitmap.getPixel(0, 0), blanc, "Le pixel à la position (0,0) devrait être blanc.");
    assert.equal(bitmap.getPixel(testPixelHauteur, testPixelLargeur), rouge,
                 "Le pixel à la position (55,90) devrait être noir.");
});

it("Devrait changer la couleur d'un pixel à noir", () => {
    const nomFichier: string = cheminImgRelatif + "test.bmp";
    const data: Buffer = fs.readFileSync(nomFichier);
    const bitmap: BitmapCouleur = new BitmapCouleur(data);

    bitmap.setPixel(0, 0, noir);

    assert.equal(bitmap.getPixel(0, 0), noir, "Le pixel à la position (0,0) devrait être noir.");
});

it("Devrait garder la même couleur", () => {
    const nomFichier: string = cheminImgRelatif + "test_differences.bmp";
    const data: Buffer = fs.readFileSync(nomFichier);
    const bitmap: BitmapCouleur = new BitmapCouleur(data);
    const testPixelHauteur: number = 83;
    const testPixelLargeur: number = 297;
    const couleur: number = bitmap.getPixel(testPixelHauteur, testPixelLargeur);

    bitmap.setPixel(testPixelHauteur, testPixelLargeur, couleur);

    assert.equal(bitmap.getPixel(testPixelHauteur, testPixelLargeur), couleur, "Le pixel devrait garder sa couleur.");
});
