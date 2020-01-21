export class ErreurConnexionClient extends Error {
    public constructor() {
        super();
        this.name = "ErreurConnexionClient";
        this.message = "Le client n'est pas connecté à la base de donnée.";
    }
}

export class ErreurConnexionBDD extends Error {
    public constructor() {
        super();
        this.name = "ErreurConnexionBDD";
        this.message = "Erreur lors de la connexion à la bdd.";
    }
}
