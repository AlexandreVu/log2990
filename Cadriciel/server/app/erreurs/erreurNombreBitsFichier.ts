export class Erreur24Bits extends Error {
    public constructor(numFichier: string) {
        super();
        this.name = "Erreur24Bits";
        this.message = "Le fichier n'a pas le bon nombre de bits (24). (Fichier " + numFichier + ")";
    }
}
