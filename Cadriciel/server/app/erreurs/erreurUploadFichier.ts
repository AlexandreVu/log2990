export class ErreurUploadFichier extends Error {
    public constructor(nomFichier: string) {
        super();
        this.name = "ErreurUploadFichier";
        this.message = "Erreur dans l'upload du fichier " + nomFichier + " dans la bdd.";
    }
}
