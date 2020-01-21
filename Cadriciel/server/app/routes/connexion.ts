import { Request, Response} from "express";
import {  inject, injectable} from "inversify";
import "reflect-metadata";
import { Confirmation } from "../../../common/communication/confirmation";
import { VueInitialeService } from "../services/vue-initiale.service";
import Types from "../types";

export module Connexion {
    @injectable()
    export class Connect {
        public constructor(@inject(Types.VueInitialeService) private service: VueInitialeService) {
        }

        public verifierConnexion( res: Response, req: Request): void {
            const reponse: Confirmation = {
                nom: req.body.nom,
                ajoute: this.service.verifierConnexion(req.body.nom),
            };
            res.send(JSON.stringify(reponse));
        }

        public deconnecterUtilisateur(res: Response, req: Request): void {
            const reponse: Confirmation = {
                nom: req.body.nom,
                ajoute: this.service.deconnecterUtilisateur(req.body.nom),
            };
            res.send(JSON.stringify(reponse));
        }
    }
}
