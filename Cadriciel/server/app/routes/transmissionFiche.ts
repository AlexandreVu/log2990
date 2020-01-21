import { Request, Response} from "express";
import { inject, injectable} from "inversify";
import { ObjectId } from "mongodb";
import "reflect-metadata";
import { Partie, TypeDePartie } from "../../../client/src/app/Partie";
import { FicheJeuService } from "../services/fiche-jeu.service";
import { GestionTempsService } from "../services/gestion-temps";
import Types from "../types";
import { Parties } from "./parties";

export module TransmissionFiche {
    @injectable()
    export class Transmission {
        public constructor(@inject(Types.FicheVueService) private ficheJeuService: FicheJeuService,
                           @inject(Types.Parties) private parties: Parties.Jeu,
                           @inject(Types.Donnees) private donnees: Parties.Donnees,
                           @inject(Types.GestionTempsService) private gestionTempsService: GestionTempsService) {
        }

        public ajouterFicheSimple( res: Response, req: Request): void {
            this.ficheJeuService.ajouterFicheSimple(req.body).then(
                (resultat: Boolean) => {
                    if (resultat) {
                        this.donnees.partiesSimples.push(req.body);
                    }
                    res.send(resultat);
                }).catch(() => {
                    res.send(true);
                });
        }

        public ajouterFicheLibre(res: Response, req: Request): void {
            this.ficheJeuService.ajouterFicheLibre(req.body).then(
                (resultat: Boolean) => {
                    if (resultat) {
                        this.donnees.partiesLibres.push(req.body);
                    }
                    res.send(resultat);
                }).catch(() => {
                    res.send(true);
                });
        }

        public supprimerFiche(res: Response, req: Request): void {
            this.donnees.supprimerPartie(req.body.id, req.body.type);
            this.ficheJeuService.supprimerFiche({id: req.body.id, type: req.body.type}).then().catch();
            if (req.body.type === TypeDePartie.SIMPLE) {
                this.parties.effacerImagesBDD(new ObjectId(req.body.idImageOriginale), new ObjectId(req.body.idImageModifiee),
                                              new ObjectId(req.body.idImageDifferences)).then().catch();
            }
            res.send(true);
        }

        public recevoirPartiesSimples(res: Response): void {
            res.send(this.donnees.partiesSimples);
        }

        public recevoirPartiesLibres(res: Response): void {
            res.send(this.donnees.partiesLibres);
        }

        public recevoirPartieSimple(req: Request, res: Response): void {
            res.send(this.donnees.getPartieSimple(+req.params.id));
        }

        public recevoirPartieLibre(req: Request, res: Response): void {
            res.send(this.donnees.getPartieLibre(+req.params.id));
        }

        public calculerScores( req: Request, res: Response): void {
            this.ficheJeuService.calculerScore(req.body).then(
                (partie: Partie) => {
                    this.donnees.updateScores(partie, req.body.type);
                    res.send(partie);
                }).catch();
        }

        public async updateScore(req: Request, res: Response): Promise<void> {
            const partie: Partie = req.body.type === TypeDePartie.SIMPLE
                ? await this.ficheJeuService.getPartieSimple(req.body.idPartie)
                : await this.ficheJeuService.getPartieLibre(req.body.idPartie);

            const position: number = this.gestionTempsService.updateTemps(req.body.temps, partie, req.body.nom, req.body.modeSolo);

            this.ficheJeuService.updatePartie(partie).then(() => {
                this.donnees.updateScores(partie, req.body.type);
                res.send("" + position);
                }).catch(() => res.send("-1"));
        }

        public getIdDisponible(req: Request, res: Response): void {
           this.ficheJeuService.getIdDisponible(req.body.type).then(
               (id: number) => {
                   res.send({id: id});
            }).catch();
        }
    }
}
