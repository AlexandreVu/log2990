export class ErreurEffacementFichier extends Error {
    public constructor() {
        super();
        this.name = "ErreurEffacementFichier";
        this.message = "Erreur lors de l'effacement du fichier dans la bdd.";
    }
}
