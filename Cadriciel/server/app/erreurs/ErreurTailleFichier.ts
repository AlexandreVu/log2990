export class ErreurTailleFichier extends Error {
    public constructor(numFichier: string) {
        super();
        this.name = "ErreurTailleFichier";
        this.message = "Le fichier n'a pas la bonne taille (640x480). (Fichier " + numFichier + ")";
    }
}
