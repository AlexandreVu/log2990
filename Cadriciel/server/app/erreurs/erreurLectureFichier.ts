export class ErreurLectureFichier extends Error {
    public constructor() {
        super();
        this.name = "ErreurLectureFichier";
        this.message = "Erreur lors de la lecture du fichier dans la base de donnée.";
    }
}
