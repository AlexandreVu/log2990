import * as fs from "fs";
import { dirname } from "path";

export abstract class Bitmap {
    protected static readonly IDENTITE_OFFSET: number = 0;
    protected static readonly TAILLE_OFFSET: number = 2;
    protected static readonly DATA_ADRESSE_OFFSET: number = 10;
    protected static readonly IMAGE_ENTETE_OFFSET: number = 14;
    protected static readonly LARGEUR_OFFSET: number = 18;
    protected static readonly HAUTEUR_OFFSET: number = 22;
    protected static readonly PLANS_COULEUR_OFFSET: number = 26;
    protected static readonly BITS_OFFSET: number = 28;
    protected static readonly METHODE_COMPRESSION_OFFSET: number = 30;
    protected static readonly TAILLE_DATA_OFFSET: number = 34;

    public static readonly IDENTITE_ATTENDUE: number = 0x4D42;
    public static readonly LARGEUR_ATTENDUE: number = 640;
    public static readonly HAUTEUR_ATTENDUE: number = 480;
    public static readonly BITS_ATTENDUS: number;

    protected static readonly BITS_PAR_OCTET: number = 8;

    private _buffer: Buffer;
    private _largeur: number;
    private _hauteur: number;
    private _bits: number;
    protected donneesParPixel: number;
    protected longueurRangee: number;
    protected _tailleFichier: number;
    protected tailleEntete: number;
    private _identite: number;

    protected constructor(largeur: number, hauteur: number, nbBits: number, identite: number) {
        this._largeur = largeur;
        this._hauteur = hauteur;
        this._bits = nbBits;
        this._identite = identite;
    }

    public get buffer(): Buffer {
        return this._buffer;
    }
    public set buffer(buffer: Buffer) {
        this._buffer = buffer;
    }

    public get identite(): number {
        return this._identite;
    }

    public get largeur(): number {
        return this._largeur;
    }

    public get hauteur(): number {
        return this._hauteur;
    }

    public abstract getPixel(rangee: number, colonne: number): number;

    public get bits(): number {
        return this._bits;
    }

    public get tailleFichier(): number {
        return this._tailleFichier;
    }
    // Retourne la longueur d'une rangée en Octet.
    // Chaque rangée doit avoir un nombre de bits de multiple de 4.
    protected calculerLongueurRangee(): number {
        let longueurRangeeBits: number = this.bits * this.largeur;
        const alignement: number = 4;
        const modulo: number = longueurRangeeBits % alignement;
        if (modulo !== 0) {
            longueurRangeeBits += (alignement - modulo);
        }

        return Math.ceil(longueurRangeeBits / Bitmap.BITS_PAR_OCTET);
    }

    // Exporte le fichier avec un path selon nomFichier
    public sauvegarderFichier(nomFichier: string): void {
        if (!fs.existsSync(dirname(nomFichier))) {
            fs.mkdirSync(dirname(nomFichier), {recursive: true});
        }
        fs.writeFileSync(nomFichier, this.buffer);
    }

}
