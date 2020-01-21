import { Bitmap } from "./bitmap";

export class BitmapNoirBlanc extends Bitmap {
    protected static readonly TAILLE_ENTETE: number = 62;
    protected static readonly IMAGE_ENTETE: number = 40;
    protected static readonly PLANS_COULEUR: number = 1;
    protected static readonly METHODE_COMPRESSION: number = 0;
    protected static readonly COULEUR_NOIR: number = 0xFFFFFF;
    protected static readonly COULEUR_BLANC: number = 0x000000;
    protected static readonly OFFSET_COULEUR_NOIR: number = 54;
    protected static readonly OFFSET_COULEUR_BLANC: number = 58;

    public static readonly BITS_ATTENDUS: number = 1;

    public constructor(largeur: number, hauteur: number) {
        super(largeur, hauteur, BitmapNoirBlanc.BITS_ATTENDUS, BitmapNoirBlanc.IDENTITE_ATTENDUE);
        this.tailleEntete = BitmapNoirBlanc.TAILLE_ENTETE;
        this.longueurRangee = this.calculerLongueurRangee();
        this.donneesParPixel = this.bits / BitmapNoirBlanc.BITS_PAR_OCTET;
        this._tailleFichier = this.tailleEntete + this.longueurRangee * this.hauteur;
        this.buffer = Buffer.from(new Uint8Array(this.tailleFichier));
        this.creerEntete();
    }

    public copieBitmap(): BitmapNoirBlanc {
        const nouvImage: BitmapNoirBlanc = new BitmapNoirBlanc(this.largeur, this.hauteur);
        this.buffer.copy(nouvImage.buffer);

        return nouvImage;
    }

    private creerEntete(): void {
        this.buffer.writeUInt16LE(Bitmap.IDENTITE_ATTENDUE, Bitmap.IDENTITE_OFFSET);
        this.buffer.writeUInt32LE(this.tailleFichier, Bitmap.TAILLE_OFFSET);
        this.buffer.writeUInt32LE(this.tailleEntete, Bitmap.DATA_ADRESSE_OFFSET);
        this.buffer.writeUInt32LE(BitmapNoirBlanc.IMAGE_ENTETE, Bitmap.IMAGE_ENTETE_OFFSET);
        this.buffer.writeUInt32LE(this.largeur, BitmapNoirBlanc.LARGEUR_OFFSET);
        this.buffer.writeUInt32LE(this.hauteur, BitmapNoirBlanc.HAUTEUR_OFFSET);
        this.buffer.writeUInt16LE(BitmapNoirBlanc.PLANS_COULEUR, Bitmap.PLANS_COULEUR_OFFSET);
        this.buffer.writeUInt16LE(this.bits, BitmapNoirBlanc.BITS_OFFSET);
        this.buffer.writeUInt32LE(BitmapNoirBlanc.METHODE_COMPRESSION, BitmapNoirBlanc.METHODE_COMPRESSION_OFFSET);
        this.buffer.writeUInt32LE(this.tailleFichier - this.tailleEntete, BitmapNoirBlanc.TAILLE_DATA_OFFSET);
        this.buffer.writeUInt32LE(BitmapNoirBlanc.COULEUR_NOIR, BitmapNoirBlanc.OFFSET_COULEUR_NOIR);
        this.buffer.writeUInt32LE(BitmapNoirBlanc.COULEUR_BLANC, BitmapNoirBlanc.OFFSET_COULEUR_BLANC);
    }

    // Rangée commence à 0 et finit à (hauteur - 1), même principe pour colonne.
    // Noir représente une couleur de 1 et blanc de 0.
    public setPixel(rangee: number, colonne: number, couleur: number): void {
        const octetPos: number = this.tailleEntete + Math.floor(rangee * this.longueurRangee + colonne * this.donneesParPixel);
        let octet: number = this.buffer.readUInt8(octetPos);
        const posMaxOctet: number = 7;
        const bitPos: number = posMaxOctet - colonne % BitmapNoirBlanc.BITS_PAR_OCTET;
        if (couleur) {
            // tslint:disable-next-line:no-bitwise --> afin de manipuler les octets d'un pixel
            octet |= (1 << bitPos);
        } else {
            // tslint:disable-next-line:no-bitwise --> afin de manipuler les octets d'un pixel
            octet &= ~(1 << bitPos);
        }

        this.buffer.writeUInt8(octet, octetPos);
    }

    // Recoit un pixel à (rangee,colonne) qui commence à (0,0).
    // Si retourne 0, alors blanc, sinon noir.
    public getPixel(rangee: number, colonne: number): number {
        const octetPos: number = this.tailleEntete +
        Math.floor(rangee * this.longueurRangee + colonne * this.donneesParPixel);

        const octet: number = this.buffer.readUInt8(octetPos);
        const posMaxOctet: number = 7;
        const bitPos: number = posMaxOctet - colonne % BitmapNoirBlanc.BITS_PAR_OCTET;

        // tslint:disable-next-line:no-bitwise --> afin de manipuler les octets d'un pixel
        return octet & (1 << bitPos) ? 1 : 0;
    }
}
