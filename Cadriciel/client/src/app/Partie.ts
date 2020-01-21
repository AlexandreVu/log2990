import { Score } from "./Score";

export enum TypeDePartie {
    SIMPLE,
    LIBRE,
}

export class Partie {
    private readonly NOMS_JOUEUR: string[] = ["Moi", "Cool Guy", "Les autres"];
    private readonly NOMBRE_DE_SCORES: number = 2;

    public id: number;
    public nom: String;
    public idImageOriginale: string;
    public idImageModifiee: string;
    public idImageDifferences: string;
    public scoresSolo: Score[];
    public scores1v1: Score[];
    public type: TypeDePartie;

    public partieEnLigne: boolean;

    public constructor(unId: number, unNom: String, unType: TypeDePartie) {
        this.id = unId;
        this.nom = unNom;
        this.scoresSolo = [new Score(0, this.NOMS_JOUEUR[0]), new Score(0, this.NOMS_JOUEUR[1]),
                           new Score(0, this.NOMS_JOUEUR[this.NOMBRE_DE_SCORES])];
        this.scores1v1 = [new Score(0, this.NOMS_JOUEUR[0]), new Score(0, this.NOMS_JOUEUR[1]),
                          new Score(0, this.NOMS_JOUEUR[this.NOMBRE_DE_SCORES])];
        this.scoresAleatoires(this.getScoresSolo());
        for (const score of this.scoresSolo) {
            score.tempsMinSec();
        }
        this.scoresAleatoires(this.getScores1v1());
        for (const score of this.scores1v1) {
                score.tempsMinSec();
            }
        this.type = unType;
        this.partieEnLigne = false;
    }

    public scoresAleatoires(unTableauDeScores: Score[]): void {
        const NOMBRE_ALEATOIRE_MAXIMUM: number = 598;
        const NOMBRE_ALEATOIRE_MINIMUM: number = 180;
        let index: number = 0;
        for (const item of unTableauDeScores) {
          item.setTemps(Math.floor(Math.random() * NOMBRE_ALEATOIRE_MAXIMUM) + NOMBRE_ALEATOIRE_MINIMUM);
          item.setNomDuJoeur(this.NOMS_JOUEUR[index]);
          index++;
        }
        unTableauDeScores.sort((score1: Score, score2: Score) => {
          return (score1.getTemps() > score2.getTemps() ? 1 : (score1.getTemps() < score2.getTemps()) ? -1 : 0);
        });

    }
    public estIdentique(partieAComparer: Partie): boolean {
        return (partieAComparer.id === this.id && partieAComparer.type === this.type);
    }
    // Accesseurs
    public getId(): number {
        return this.id;
    }

    public getNom(): String {
        return this.nom;
    }

    public getIdImageOriginale(): string {
        return this.idImageOriginale;
    }

    public getIdImageModifiee(): string {
        return this.idImageModifiee;
    }

    public getIdImageDifferences(): string {
        return this.idImageDifferences;
    }

    public getScoresSolo(): Score[] {
        return this.scoresSolo;
    }

    public getScores1v1(): Score[] {
        return this.scores1v1;
    }

    public getType(): TypeDePartie {
        return this.type;
    }

    public getPartieCreeEnLigne(): boolean {
        return this.partieEnLigne;
    }

    // Mutateurs
    public setId(unId: number): void {
        this.id = unId;
    }

    public setNom(unNom: String): void {
        this.nom = unNom;
    }

    public setIdImageOriginale(idImageOriginale: string): void {
        this.idImageOriginale = idImageOriginale;
    }

    public setIdImageModifiee(idImageModifiee: string): void {
        this.idImageModifiee = idImageModifiee;
    }

    public setIdImageDifferences(idImageDifferences: string): void {
        this.idImageDifferences = idImageDifferences;
    }

    public setScoresSolo(unScoresSolo: Score[]): void {
        this.scoresSolo = unScoresSolo;
    }

    public setScores1v1(unScores1v1: Score[]): void {
        this.scores1v1 = unScores1v1;
    }

    public setType(unType: TypeDePartie): void {
        this.type = unType;
    }

}
