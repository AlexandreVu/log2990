import { Request, Response} from "express";
import {  inject, injectable} from "inversify";
import "reflect-metadata";
import { IdMultijoueurService } from "../services/idMultijoueur.service";
import Types from "../types";

export module TransmissionIds {
    @injectable()
    export class Ids {
        public constructor(@inject(Types.IdMultijoueurService) private service: IdMultijoueurService) {}

        public recevoirId(res: Response, req: Request): void {
            let id: number = -1;
            this.service.getId(req.body.type).then(
                (rep: number) => {
                    id = rep;
                    res.send(JSON.stringify(id));
            }).catch(() => {
                res.end(JSON.stringify(-1));
            });

        }
    }
}
