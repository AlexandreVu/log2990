export class ErreurFichierBitmap extends Error {
    public constructor(numFichier: string) {
        super();
        this.name = "ErreurFichierBitmap";
        this.message = "Le fichier n'est pas un bitmap. (Fichier " + numFichier + ")";
    }
}
