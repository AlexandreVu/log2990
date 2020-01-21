import { injectable } from "inversify";
import { ObjectId } from "mongodb";
import "reflect-metadata";
import { Bitmap } from "../bitmap";
import { BitmapCouleur } from "../bitmapCouleur";
import { BitmapNoirBlanc } from "../bitmapNoirBlanc";
import { ErreurTailleFichier } from "../erreurs/ErreurTailleFichier";
import { ErreurFichierBitmap } from "../erreurs/erreurFichierBitmap";
import { Erreur24Bits } from "../erreurs/erreurNombreBitsFichier";
import { BaseDeDonnees } from "../mango/mangoClient";

@injectable()
export class GenerateurDifferencesService {
    public static readonly COLLECTION_SORTIE: string = "imagesDifferences";
    private static readonly PIXELS_HORIZONTAUX2: number = 2;
    private static readonly PIXELS_HORIZONTAUX3: number = 3;
    private static readonly PIXELS_ELARGISSEMENT_HORIZONTAUX: number[] = [
        1, GenerateurDifferencesService.PIXELS_HORIZONTAUX2, GenerateurDifferencesService.PIXELS_HORIZONTAUX3,
        GenerateurDifferencesService.PIXELS_HORIZONTAUX3,
        GenerateurDifferencesService.PIXELS_HORIZONTAUX3, GenerateurDifferencesService.PIXELS_HORIZONTAUX2, 1];
    private static readonly PIXELS_VERTICAUX: number = 3;

    // Retourne un string contenant l'erreur si l'image n'est pas correcte
    private verificationImage(image: BitmapCouleur, numFichier: string): void {
        if (!(this.verifierFormat(image))) {
            // return "Le fichier n'est pas un bitmap.";
            throw new ErreurFichierBitmap(numFichier);
        }
        if (!(this.verifierTaille(image))) {
            // return "Le fichier n'a pas la bonne taille (640x480).";
            throw new ErreurTailleFichier(numFichier);
        }
        if (!(this.verifier24Bits(image))) {
            throw new Erreur24Bits(numFichier);
        }
    }

    private verifierTaille(image: BitmapCouleur): boolean {
        return image.largeur === BitmapCouleur.LARGEUR_ATTENDUE && image.hauteur === BitmapCouleur.HAUTEUR_ATTENDUE;
    }

    private verifier24Bits(image: BitmapCouleur): boolean {
        return image.bits === BitmapCouleur.BITS_ATTENDUS;
    }

    private verifierFormat(image: BitmapCouleur): boolean {
        return image.identite === Bitmap.IDENTITE_ATTENDUE;
    }

    // Vérifie et crée l'image de différences dans (nomResultat) à partir de image1 et image2
    public async genererImageDifferences(imageOriginale: Buffer, imageModifiee: Buffer, nomResultat: string): Promise<ObjectId> {

        return this.generationImage(new BitmapCouleur(imageOriginale), new BitmapCouleur(imageModifiee), nomResultat);
    }

    private async generationImage(donnee1: BitmapCouleur, donnee2: BitmapCouleur, nomResultat: string): Promise<ObjectId> {
        return new Promise((resolve: Function, reject: Function) => {
            // Part 1: Vérification
            this.verificationImage(donnee1, "1");
            this.verificationImage(donnee2, "2");

            // Part 2: Créer image des différences
            const imageDifferences: BitmapNoirBlanc = this.creerImageDifferences(donnee1, donnee2);
            const imageElargie: BitmapNoirBlanc = this.elargirDifferences(imageDifferences);

            // Part 3: Compter différences
            const nbDifferencesAttendues: number = 7;
            const nbDifferences: number = this.compterDifferences(imageElargie);
            if (nbDifferences !== nbDifferencesAttendues) {
                reject(new Error(`Vous devez avoir exactement ${nbDifferencesAttendues} différences!
                                  Vous en avez ${nbDifferences}.`));
            }
            resolve(imageElargie);
        }).then(async (imageElargie: BitmapNoirBlanc) => {
            return BaseDeDonnees.uploadFichier(imageElargie.buffer, nomResultat, GenerateurDifferencesService.COLLECTION_SORTIE);
        });
    }

    // Trouve chaque pixel noir et transforme sa différence correspondante en blanc sur une copie pour ne pas la compter une deuxième fois
    public compterDifferences(image: BitmapNoirBlanc): number {
        const imageComptageDifferences: BitmapNoirBlanc = image.copieBitmap();
        let nbDifferences: number = 0;
        for (let rangee: number = 0; rangee < Bitmap.HAUTEUR_ATTENDUE; rangee++) {
            for (let colonne: number = 0; colonne < Bitmap.LARGEUR_ATTENDUE; colonne++) {
                if (imageComptageDifferences.getPixel(rangee, colonne)) {
                    this.enleverDifference(rangee, colonne, imageComptageDifferences);
                    nbDifferences++;
                }
            }
        }

        return nbDifferences;
    }

    // Transforme un pixel noir en blanc, ainsi que ses pixels autour et ainsi de suite
    // afin de faire complètement disaparaitre la différence
    private enleverDifference(rangee: number, colonne: number, image: BitmapNoirBlanc): void {
        for (let i: number = -1; i <= 1; i++) {
            for (let j: number = -1; j <= 1; j++) {
                const x: number = colonne + i;
                const y: number = rangee + j;
                if (image.getPixel(y, x)) {
                    // mettre pixel blanc
                    image.setPixel(y, x, 0);
                    this.enleverDifference(y, x, image);
                }
            }
        }
    }

    // Retourne le bitmapNoirBlanc qui représente l'image de différence sans être élargie
    private creerImageDifferences(image1: BitmapCouleur, image2: BitmapCouleur): BitmapNoirBlanc {
        const imageDifferences: BitmapNoirBlanc = new BitmapNoirBlanc(Bitmap.LARGEUR_ATTENDUE, Bitmap.HAUTEUR_ATTENDUE);
        for (let rangee: number = 0; rangee < Bitmap.HAUTEUR_ATTENDUE; rangee++) {
            for (let colonne: number = 0; colonne < Bitmap.LARGEUR_ATTENDUE; colonne++) {
                imageDifferences.setPixel(rangee, colonne, image1.getPixel(rangee, colonne) !== image2.getPixel(rangee, colonne) ? 1 : 0);
            }
        }

        return imageDifferences;
    }

    // Retourne l'image de différence élargie à partir de imageDifferences ou une string s'il n'y a pas le bon nombre de différences
    private elargirDifferences(imageDifferences: BitmapNoirBlanc): BitmapNoirBlanc {
        const imageElargie: BitmapNoirBlanc = new BitmapNoirBlanc(Bitmap.LARGEUR_ATTENDUE, Bitmap.HAUTEUR_ATTENDUE);
        for (let rangee: number = 0; rangee < Bitmap.HAUTEUR_ATTENDUE; rangee++) {
            for (let colonne: number = 0; colonne < Bitmap.LARGEUR_ATTENDUE; colonne++) {
                if (imageDifferences.getPixel(rangee, colonne)) {
                    this.elargirPixel(imageElargie, rangee, colonne);
                }
            }
        }

        return imageElargie;
    }

    // Élargie un pixel dans imageElargie et retourne si ce pixel correspond à une nouvelle différence
    private elargirPixel(imageElargie: BitmapNoirBlanc, rangee: number, colonne: number): boolean {
        let nouvelleDifference: boolean = true;

        for (let y: number = -GenerateurDifferencesService.PIXELS_VERTICAUX; y <= GenerateurDifferencesService.PIXELS_VERTICAUX; y++) {
            const rangeeElargie: number = rangee + y;
            if (rangeeElargie >= 0 && rangeeElargie < imageElargie.hauteur) {
                const dx: number = GenerateurDifferencesService.PIXELS_ELARGISSEMENT_HORIZONTAUX[
                    y + GenerateurDifferencesService.PIXELS_VERTICAUX];
                for (let x: number = -dx; x <= dx; x++) {
                    const colonneElargie: number = colonne + x;
                    if (colonneElargie >= 0 && colonneElargie < imageElargie.largeur) {
                        if (imageElargie.getPixel(rangeeElargie, colonneElargie)) {
                            nouvelleDifference = false;
                        } else {
                            imageElargie.setPixel(rangeeElargie, colonneElargie, 1);
                        }
                    }
                }
            }
        }

        return nouvelleDifference;
    }

    public identifierDifference(imageOriginale: BitmapCouleur, imageModifiee: BitmapCouleur, imageDifferences: BitmapNoirBlanc,
                                rangee: number, colonne: number): boolean {
        const differenceTrouvee: boolean = imageDifferences.getPixel(rangee, colonne) === 1;
        if (differenceTrouvee) {
            this.restaurerDifference(imageOriginale, imageModifiee, imageDifferences, rangee, colonne);
        }

        return differenceTrouvee;
    }

    private restaurerDifference(orig: BitmapCouleur, modif: BitmapCouleur, diff: BitmapNoirBlanc, rangee: number, colonne: number): void {
        for (let i: number = -1; i <= 1; i++) {
            const y: number = rangee + i;
            if (y >= 0 && y < orig.hauteur) {
                for (let j: number = -1; j <= 1; j++) {
                    const x: number = colonne + j;
                    if (x >= 0 && x < orig.largeur && diff.getPixel(y, x)) {
                        diff.setPixel(y, x, 0);
                        modif.setPixel(y, x, orig.getPixel(y, x));
                        this.restaurerDifference(orig, modif, diff, y, x);
                    }
                }
            }

        }
    }
}
