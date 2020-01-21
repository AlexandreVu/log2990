import { Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import * as multer from "multer";
import { BaseDeDonnees } from "./mango/mangoClient";
import { Connexion } from "./routes/connexion";
import { TransmissionIds } from "./routes/idsMultiTransmission";
import { Parties } from "./routes/parties";
import { TransmissionFiche } from "./routes/transmissionFiche";
import Types from "./types";

@injectable()
export class Routes {

    public upload: multer.Instance;
    public constructor(@inject(Types.Connexion) private connexion: Connexion.Connect,
                       @inject(Types.TransmissionFiche) private transmission: TransmissionFiche.Transmission,
                       @inject(Types.Parties) private parties: Parties.Jeu,
                       @inject(Types.BaseDeDonnees) private base: BaseDeDonnees,
                       @inject(Types.TransmissionIds) private transmissionIds: TransmissionIds.Ids) {}

    public get routes(): Router {
        const router: Router = Router();

        router.post("/connexion", (req: Request, res: Response) => this.connexion.verifierConnexion(res, req));
        router.put("/deconnexion", (req: Request, res: Response) => this.connexion.deconnecterUtilisateur(res, req));

        router.post("/ajoutFicheSimple", (req: Request, res: Response) =>
        this.transmission.ajouterFicheSimple(res, req));
        router.post("/ajoutFicheLibre", (req: Request, res: Response) =>
        this.transmission.ajouterFicheLibre(res, req));
        router.put("/supprimerPartie", (req: Request, res: Response) => this.transmission.supprimerFiche(res, req));
        router.get("/getPartiesLibre", (req: Request, res: Response) => this.transmission.recevoirPartiesLibres(res));
        router.get("/getPartiesSimple", (req: Request, res: Response) => this.transmission.recevoirPartiesSimples(res));
        router.put("/calculer", (req: Request, res: Response) => this.transmission.calculerScores(req, res));
        router.put("/id", (req: Request, res: Response) => this.transmission.getIdDisponible(req, res));
        router.get("/partiesSimples/:id", (req: Request, res: Response) => this.transmission.recevoirPartieSimple(req, res));
        router.get("/partiesLibres/:id", (req: Request, res: Response) => this.transmission.recevoirPartieLibre(req, res));

        router.post("/formulaire", this.upload.fields([{ name: "imageOriginale", maxCount: 1 }, { name: "imageModifiee", maxCount: 1 }]),
                    async (req: Request, res: Response) => this.parties.creerJeuSimple(req, res));
        router.get("/server/uploads/:idImage", (req: Request, res: Response) => this.parties.envoyerImageStockee(req, res));
        router.get("/server/:idJeu/:idImage", (req: Request, res: Response) => this.parties.envoyerImageJeu(req, res));

        router.post("/commencerJeu", async (req: Request, res: Response) => this.parties.commencerJeu(req, res));
        router.post("/verifierDifferenceSimple", async (req: Request, res: Response) => this.parties.verifierDifferenceSimple(req, res));
        router.post("/verifierDifferenceLibre", async (req: Request, res: Response) => this.parties.verifierDifferenceLibre(req, res));
        router.post("/terminerJeu", (req: Request, res: Response) => this.parties.terminerJeu(req, res));
        router.post("/updateScore",  async (req: Request, res: Response) => this.transmission.updateScore(req, res));

        router.post("/VS", async (req: Request, res: Response) => this.transmissionIds.recevoirId(res, req));

        router.get("/connecterBDD", (req: Request, res: Response) => this.base.connexion(res));

        return router;
    }
}
