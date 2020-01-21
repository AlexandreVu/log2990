export class Score {
    public temps: number; // Le temps doit être en secondes
    public nomDuJoueur: String;
    public tempsString: String;

    public constructor(unTemps: number, unNomDeJoueur: String) {
        this.temps = unTemps;
        this.nomDuJoueur = unNomDeJoueur;
        this.tempsMinSec();
    }

    // Méthode qui converti le temps en minutes et en secondes
    public tempsMinSec(): void {
        let minutes: number, secondes: number;
        const DUREE_MINUTE: number = 60, DEUX_CHARACTERES: number = 10;

        minutes = Math.floor(this.temps / DUREE_MINUTE);
        secondes = this.temps - minutes * DUREE_MINUTE;

        this.tempsString = (secondes < DEUX_CHARACTERES) ? minutes + ":" + "0" + secondes : minutes + ":" + secondes;
    }

    // Accesseurs
    public getTemps(): number {
        return this.temps;
    }

    public getNomDuJoueur(): String {
        return this.nomDuJoueur;
    }

    // Mutateurs
    public setTemps(unTemps: number): void {
        this.temps = unTemps;
        this.tempsMinSec();
    }

    public setNomDuJoeur(unNomDeJoueur: String): void {
        this.nomDuJoueur = unNomDeJoueur;
    }
}
