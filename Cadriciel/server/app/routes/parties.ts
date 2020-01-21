import { Request, Response } from "express";
import * as fs from "fs";
import { inject, injectable } from "inversify";
import { Collection, ObjectId } from "mongodb";
import { resolve } from "path";
import "reflect-metadata";
import { Partie, TypeDePartie } from "../../../client/src/app/Partie";
import { PartieLibre } from "../../../client/src/app/PartieLibre";
import { Confirmation } from "../../../common/communication/confirmation";
import { ReponseDifferences } from "../../../common/communication/differences";
import { BitmapCouleur } from "../bitmapCouleur";
import { BitmapNoirBlanc } from "../bitmapNoirBlanc";
import { BaseDeDonnees } from "../mango/mangoClient";
import { FicheJeuService } from "../services/fiche-jeu.service";
import { GenerateurDifferencesService } from "../services/generateur-differences.service";
import { IdentificationDifferencesLibre } from "../services/identification-differences-libre";
import Types from "../types";

export module Parties {

    export interface ImageStockee {
        id: ObjectId;
        buffer: Buffer;
    }

    // Permet de garder les valeurs de la bdd temporairement pour de meilleures performances
    @injectable()
    export class Donnees {
        public partiesSimples: Partie[];
        public partiesLibres: PartieLibre[];
        public imagesUploads: ImageStockee[] = [];
        public imagesDiffs: ImageStockee[] = [];
        public constructor(@inject(Types.FicheVueService) private service: FicheJeuService) {
        }

        public async initialiserDonnees(): Promise<void> {
            this.partiesSimples = await this.service.getPartiesSimple();
            this.partiesLibres = await this.service.getPartiesLibres();

            const collectionUploads: Collection = await BaseDeDonnees.getCollection("imagesUploads.files");
            const docUploads: Object[] = await collectionUploads.find().toArray();
            for (const upload of docUploads) {
                const id: ObjectId = upload["_id"];
                const buffer: Buffer = await BaseDeDonnees.lireFichier(id, "imagesUploads");
                const image: ImageStockee = {id: id, buffer: buffer};
                this.imagesUploads.push(image);
            }

            const collectionDifferences: Collection = await BaseDeDonnees.getCollection("imagesDifferences.files");
            const docDifferences: Object[] = await collectionDifferences.find().toArray();
            for (const difference of docDifferences) {
                const id: ObjectId = difference["_id"];
                const buffer: Buffer = await BaseDeDonnees.lireFichier(id, "imagesDifferences");
                const image: ImageStockee = {id: id, buffer: buffer};
                this.imagesDiffs.push(image);
            }
        }

        public updateScores(partie: Partie, type: TypeDePartie): void {
            const parties: Partie[] = type === TypeDePartie.SIMPLE ? this.partiesSimples : this.partiesLibres;
            const partieAUpdate: Partie | undefined = parties.find((element: Partie) => {
                return element.id === partie.id;
            });

            if (partieAUpdate !== undefined) {
                partieAUpdate.scoresSolo = partie.scoresSolo;
                partieAUpdate.scores1v1 = partie.scores1v1;
            }
        }
        public supprimerPartie(id: number, type: TypeDePartie): void {
            const parties: Partie[] = type === TypeDePartie.SIMPLE ? this.partiesSimples : this.partiesLibres;
            parties.splice(parties.findIndex((partie: Partie) => partie.id === id), 1);
        }

        public supprimerImages(idImageOriginale: ObjectId, idImageModifiee: ObjectId, idImageDifferences: ObjectId): void {
            this.imagesUploads.splice(this.imagesUploads.findIndex((image: ImageStockee) => image.id.equals(idImageOriginale)), 1);
            this.imagesUploads.splice(this.imagesUploads.findIndex((image: ImageStockee) => image.id.equals(idImageModifiee)), 1);
            this.imagesDiffs.splice(this.imagesDiffs.findIndex((image: ImageStockee) => image.id.equals(idImageDifferences)), 1);
        }

        public getPartieSimple(id: number): Partie | undefined {
            return this.partiesSimples.find((element: Partie) => {
                return element.id === id;
            });
        }

        public getPartieLibre(id: number): Partie | undefined {
            return this.partiesLibres.find((element: Partie) => {
                return element.id === id;
            });
        }

        public getImageUploads(id: string): Buffer | undefined {
            const image: ImageStockee | undefined = this.imagesUploads.find((element: ImageStockee) => {
                return element.id.equals(new ObjectId(id));
            });

            return image === undefined ? undefined : image.buffer;
        }
    }

    @injectable()
    export class Jeu {

        private static readonly CHEMIN_JEUX: string = "../../../../jeux/";
        public static readonly COLLECTION_IMG_UPLOADS: string = "imagesUploads";
        public static readonly COLLECTION_IMG_DIFF: string = "imagesDifferences";

        private readonly TYPE_DE_CONTENU: string = "Content-Type";
        private readonly FORMAT_IMAGE: string = "image/bmp";
        private readonly ERREUR_LECTURE_FICHIER: string = "Erreur lors de la lecture de l'image: ";
        private readonly BASE64: string = "base64";
        private readonly IMAGE_DIFFERENCES: string = "imageDifferences.bmp";
        private readonly IMAGE_MODIFIEE: string = "imageModifiee.bmp";
        private readonly IMAGE_ORIGINALE: string = "imageOriginale.bmp";

        public constructor(@inject(Types.GenerateurDifferencesService) private serviceSimple: GenerateurDifferencesService,
                           @inject(Types.IdentificationDifferencesLibreService) private serviceLibre: IdentificationDifferencesLibre,
                           @inject(Types.FicheVueService) private serviceFiches: FicheJeuService,
                           @inject(Types.Donnees) private donnees: Donnees) {
        }

        public async creerJeuSimple(req: Request, res: Response): Promise<void> {
            const idImageOriginale: ObjectId = req.files["imageOriginale"][0].id;
            const idImageModifiee: ObjectId = req.files["imageModifiee"][0].id;

            try {
                const idDiff: ObjectId = await this.initialiserImages(idImageOriginale, idImageModifiee, req.body.nomJeu);

                const reponse: ReponseDifferences = {
                    ajoute: true,
                    erreur: "",
                    idImageOriginale: idImageOriginale.toHexString(),
                    idImageModifiee: idImageModifiee.toHexString(),
                    idImageDifferences: idDiff.toHexString(),
                };
                res.send(JSON.stringify(reponse));
            } catch (e) {
                await BaseDeDonnees.effacerFichier(idImageOriginale, Jeu.COLLECTION_IMG_UPLOADS);
                await BaseDeDonnees.effacerFichier(idImageModifiee, Jeu.COLLECTION_IMG_UPLOADS);
                const reponse: ReponseDifferences = {
                    ajoute: false,
                    erreur: e.message,
                    idImageOriginale: "",
                    idImageModifiee: "",
                    idImageDifferences: "",
                };
                res.send(JSON.stringify(reponse));
            }
        }

        private async initialiserImages(idImageOriginale: ObjectId, idImageModifiee: ObjectId, nomJeu: string): Promise<ObjectId> {
            const donneeImageOriginale: Buffer = await BaseDeDonnees.lireFichier(idImageOriginale, Parties.Jeu.COLLECTION_IMG_UPLOADS);
            const donneeImageModifiee: Buffer = await BaseDeDonnees.lireFichier(idImageModifiee, Parties.Jeu.COLLECTION_IMG_UPLOADS);

            const idDiff: ObjectId = await this.serviceSimple.genererImageDifferences(donneeImageOriginale, donneeImageModifiee, nomJeu);
            this.donnees.imagesUploads.push({id: idImageOriginale, buffer: donneeImageOriginale});
            this.donnees.imagesUploads.push({id: idImageModifiee, buffer: donneeImageModifiee});
            const donneeImageDifferences: Buffer = await BaseDeDonnees.lireFichier(idDiff, Parties.Jeu.COLLECTION_IMG_DIFF);
            this.donnees.imagesDiffs.push({id: idDiff, buffer: donneeImageDifferences});

            return idDiff;
        }

        public async effacerImagesBDD(idImageOriginale: ObjectId, idImageModifiee: ObjectId, idImageDifferences: ObjectId): Promise<void> {
            await BaseDeDonnees.effacerFichier(idImageOriginale, Parties.Jeu.COLLECTION_IMG_UPLOADS);
            await BaseDeDonnees.effacerFichier(idImageModifiee, Parties.Jeu.COLLECTION_IMG_UPLOADS);
            await BaseDeDonnees.effacerFichier(idImageDifferences, Parties.Jeu.COLLECTION_IMG_DIFF);
            this.donnees.supprimerImages(idImageOriginale, idImageModifiee, idImageDifferences);

            return Promise.resolve();
        }

        public envoyerImageStockee(req: Request, res: Response): void {
            res.header(this.TYPE_DE_CONTENU, this.FORMAT_IMAGE);
            res.send(this.donnees.getImageUploads(req.params.idImage));
        }

        public envoyerImageJeu(req: Request, res: Response): void {
            const cheminJeu: string = resolve(__dirname, Jeu.CHEMIN_JEUX, req.params.idJeu + req.params.nomImage);
            res.header(this.TYPE_DE_CONTENU, this.FORMAT_IMAGE);
            fs.readFile(cheminJeu, (err: Error, data: Buffer) => {
                if (err) {
                    res.end(this.ERREUR_LECTURE_FICHIER);
                }
                res.send(data);
                });
        }

        // Copie l'image de différence et l'image modifiée dans un dossier temporaire pour la durée du jeu.
        // Req besoin de idJeu, nomJeu, imageModifiee
        public async commencerJeu(req: Request, res: Response): Promise<void> {
            const cheminJeu: string = resolve(__dirname, Jeu.CHEMIN_JEUX, req.body.nom, req.body.idJeu);

            try {
                if (!fs.existsSync(cheminJeu)) {
                    fs.mkdirSync(cheminJeu, {recursive: true});
                }
                const image: BitmapNoirBlanc = new BitmapNoirBlanc(BitmapNoirBlanc.LARGEUR_ATTENDUE, BitmapNoirBlanc.HAUTEUR_ATTENDUE);
                image.buffer = await BaseDeDonnees.lireFichier(new ObjectId(req.body.idImageDifferences), Parties.Jeu.COLLECTION_IMG_DIFF);
                image.sauvegarderFichier(resolve(cheminJeu, this.IMAGE_DIFFERENCES));

                let buffer: Buffer = await BaseDeDonnees.lireFichier(new ObjectId(req.body.idImageModifiee),
                                                                     Parties.Jeu.COLLECTION_IMG_UPLOADS);
                new BitmapCouleur(buffer).sauvegarderFichier(resolve(cheminJeu, this.IMAGE_MODIFIEE));

                buffer = await BaseDeDonnees.lireFichier(new ObjectId(req.body.idImageOriginale), Parties.Jeu.COLLECTION_IMG_UPLOADS);
                new BitmapCouleur(buffer).sauvegarderFichier(resolve(cheminJeu, this.IMAGE_ORIGINALE));

                res.send();
            } catch {
                res.send();
            }
        }

        // Req besoin de idJeu, imageOriginale, x, y
        public async verifierDifferenceSimple(req: Request, res: Response): Promise<void> {
            const cheminJeu: string = resolve(__dirname, Jeu.CHEMIN_JEUX, req.body.nom, req.body.idJeu);
            const cheminImageModifiee: string = resolve(__dirname, cheminJeu, this.IMAGE_MODIFIEE);
            const cheminImageDifferences: string = resolve(__dirname, cheminJeu, this.IMAGE_DIFFERENCES);
            const cheminImageOriginale: string = resolve(__dirname, cheminJeu, this.IMAGE_ORIGINALE);

            const buffer: Buffer = fs.readFileSync(cheminImageOriginale);
            const imageOriginale: BitmapCouleur = new BitmapCouleur(buffer);
            const imageModifiee: BitmapCouleur = new BitmapCouleur(fs.readFileSync(cheminImageModifiee));
            const imageDifferences: BitmapNoirBlanc = new BitmapNoirBlanc
            (BitmapNoirBlanc.LARGEUR_ATTENDUE, BitmapNoirBlanc.HAUTEUR_ATTENDUE);
            imageDifferences.buffer = fs.readFileSync(cheminImageDifferences);
            const y: number = imageModifiee.hauteur - req.body.y;
            const differenceTrouvee: boolean =
            this.serviceSimple.identifierDifference(imageOriginale, imageModifiee, imageDifferences, y, req.body.x);

            if (differenceTrouvee) {
                imageDifferences.sauvegarderFichier(cheminImageDifferences);
                imageModifiee.sauvegarderFichier(cheminImageModifiee);
                const base: string = fs.readFileSync(cheminImageModifiee).toString(this.BASE64);
                res.send(JSON.stringify(base));
            } else {
                res.send(undefined);
            }
        }

        public async verifierDifferenceLibre(req: Request, res: Response): Promise<void> {
            const partieLibre: PartieLibre = await this.serviceFiches.getPartieLibre(req.body.idJeu);
            const differenceTrouvee: boolean = this.serviceLibre.differenceExiste(partieLibre, req.body.x, req.body.y, req.body.z);
            res.send(differenceTrouvee);
        }

        // Efface le dossier d'id jeu temporaire
        public terminerJeu(req: Request, res: Response): void {
            const reussi: boolean = this.effacerFichierJeu(req.body.nom, req.body.idJeu);

            const reponse: Confirmation = {
                nom: req.body.idJeu,
                ajoute: reussi,
            };
            res.send(JSON.stringify(reponse));
        }

        /*public effacerFichiersJeux(): void {
            const cheminJeu: string = resolve(__dirname, Jeu.CHEMIN_JEUX);
            fs.readdirSync(cheminJeu).forEach((id: string) => {
                this.effacerFichierJeu(id);
            });
        }*/

        private effacerFichierJeu(nom: string, id: string): boolean {
            const cheminJeu: string = resolve(__dirname, Jeu.CHEMIN_JEUX, nom, id);
            try {
                fs.readdirSync(cheminJeu).forEach((file: string) => {
                    const chemin: string = resolve(cheminJeu, file);
                    fs.unlinkSync(chemin);
                });
                fs.rmdirSync(cheminJeu);

                return true;
            } catch {
                return false;
            }
        }
    }
}
