import { injectable } from "inversify";
import { Partie } from "../../../client/src/app/Partie";
import { PartieLibre } from "../../../client/src/app/PartieLibre";
import { Score } from "../../../client/src/app/Score";

@injectable()
export class GestionTempsService {

    public updateTemps(tempsSecondes: number, partie: Partie | PartieLibre, nomJoueur: String, modeSolo: boolean): number {
        const scores: Score[] = modeSolo ? partie.scoresSolo : partie.scores1v1;
        const POSITION_TROIS: number = 2;
        if (tempsSecondes < scores[POSITION_TROIS].temps) {
            scores[POSITION_TROIS].setTemps(tempsSecondes);
            scores[POSITION_TROIS].setNomDuJoeur("scoreInsere");

            scores.sort((a: Score, b: Score) => a.temps - b.temps);

            for (let i: number = 0; i < scores.length; i++) {
                if (scores[i].nomDuJoueur === "scoreInsere") {

                    scores[i].setNomDuJoeur(nomJoueur);

                    return i + 1;
                }
            }
        }

        return 0;
    }
}
