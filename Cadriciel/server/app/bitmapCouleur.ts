import { Bitmap } from "./bitmap";

export class BitmapCouleur extends Bitmap {
    public static readonly BITS_ATTENDUS: number = 24;

    public constructor(buffer: Buffer) {
        super(buffer.readUInt16LE(Bitmap.LARGEUR_OFFSET),
              buffer.readUInt16LE(Bitmap.HAUTEUR_OFFSET),
              buffer.readUInt16LE(Bitmap.BITS_OFFSET),
              buffer.readInt16LE(Bitmap.IDENTITE_OFFSET));
        this.buffer = Buffer.from(buffer);
        this.tailleEntete = buffer.readUInt32LE(Bitmap.DATA_ADRESSE_OFFSET);
        this.longueurRangee = this.calculerLongueurRangee();
        this.donneesParPixel = this.bits / BitmapCouleur.BITS_PAR_OCTET;
    }

    // Recoit un pixel à (rangee,colonne) qui commence à (0,0).
    // Retourne un nombre à 6 chiffres représentant les RGB en little endian.
    public getPixel(rangee: number, colonne: number): number {
        const debutPixel: number = this.tailleEntete + rangee * this.longueurRangee + colonne * this.donneesParPixel;
        let resultat: number = 0;
        const nbValeursOctet: number = 256;
        for (let i: number = 0; i < this.donneesParPixel; i++) {
            resultat = this.buffer.readUInt8(debutPixel + i) + resultat * nbValeursOctet;
        }

        return resultat;
    }

    public setPixel(rangee: number, colonne: number, couleur: number): void {
        const debutPixel: number = this.tailleEntete + rangee * this.longueurRangee + colonne * this.donneesParPixel;
        const nbValeursOctet: number = 256;
        const octet: number = 0xFF;
        for (let i: number = this.donneesParPixel - 1; i >= 0; i--) {
            // tslint:disable-next-line:no-bitwise --> afin de créer des pixels avec des bits
            this.buffer.writeUInt8(couleur & octet, debutPixel + i);
            couleur = couleur / nbValeursOctet;
        }
    }

}
