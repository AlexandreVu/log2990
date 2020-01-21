import { injectable } from "inversify";
import { Collection } from "mongodb";
import { Partie, TypeDePartie } from "../../../client/src/app/Partie";
import { PartieLibre } from "../../../client/src/app/PartieLibre";
import { Score } from "../../../client/src/app/Score";
import { Ids } from "../../../common/communication/ids";
import { InterfacePartie } from "../../../common/communication/partieInterface";
import { InterfacePartieLibre } from "../../../common/communication/partieLibreInterface";
import { BaseDeDonnees } from "../mango/mangoClient";

@injectable()
export class FicheJeuService {

    public async ajouterFicheSimple(fiche: Partie): Promise<boolean> {
        const res: boolean = await this.verifierFiche(fiche);
        if (res) {
            const collection: Collection = await BaseDeDonnees.getCollection("partiesSimples");
            await collection.insertOne(this.partieVersInterface(fiche));
            await this.incrementerIds(fiche.type);

            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
    }

    private async verifierFiche(fiche: Partie | PartieLibre): Promise<boolean> {
        let valeurRetour: boolean = false;
        const nomCollection: string = !fiche.type ? "partiesSimples" : "partiesLibres";
        const collection: Collection = await BaseDeDonnees.getCollection(nomCollection);

        return collection.find({ id: fiche.id }).count().then(
                (value: number) => {
                    if (value === 0) {
                        valeurRetour = true;
                    }

                    return valeurRetour;
            },  (err: Error) => {throw(err); });
    }

    private async incrementerIds(type: TypeDePartie): Promise<void> {
        const idsTemp: Ids = {id: 0, idSimple: -1, idLibre: -1};
        const collection: Collection = await BaseDeDonnees.getCollection("ids");

        return collection.findOne({id: 0}).then(
            async (ids: Ids) => {
                idsTemp.id = 0;
                !type ? idsTemp.idSimple = ids.idSimple + 1 : idsTemp.idLibre = ids.idLibre + 1;
                !type ? idsTemp.idLibre = ids.idLibre : idsTemp.idSimple = ids.idSimple;
                await collection.findOneAndUpdate({id: 0}, idsTemp);
            });
    }

    public async ajouterFicheLibre(fiche: PartieLibre): Promise<boolean> {
        const res: boolean = await this.verifierFiche(fiche);
        if (res) {
            const collection: Collection = await BaseDeDonnees.getCollection("partiesLibres");
            await collection.insertOne(this.partieLibreVersInterface(fiche));
            await this.incrementerIds(fiche.type);

            return Promise.resolve(true);
        } else {
            return Promise.resolve(false);
        }
    }

    public async supprimerFiche(fiche: {id: number, type: TypeDePartie}): Promise<boolean> {
        const nomCollection: string = !fiche.type ? "partiesSimples" : "partiesLibres";
        const collection: Collection = await BaseDeDonnees.getCollection(nomCollection);
        await collection.deleteOne({id: Number(fiche.id)});

        return Promise.resolve(true);
    }

    public async calculerScore(fiche: {id: number, type: TypeDePartie}): Promise<Partie> {
        const nomCollection: string = !fiche.type ? "partiesSimples" : "partiesLibres";
        const collection: Collection = await BaseDeDonnees.getCollection(nomCollection)  ;

        if (fiche.type === TypeDePartie.SIMPLE) {
            return collection.findOne({id: Number(fiche.id)}).then(
                async (interfacePartie: InterfacePartie ) => {
                    const partie: Partie = this.interfaceVersPartie(interfacePartie);

                    partie.scoresAleatoires(partie.scoresSolo);
                    partie.scoresAleatoires(partie.scores1v1);

                    await collection.findOneAndUpdate({id: Number(fiche.id)}, this.partieVersInterface(partie));

                    return partie;
                });
        } else {
            return collection.findOne({id: Number(fiche.id)}).then(
                async (interfacePartie: InterfacePartieLibre ) => {
                    const partie: PartieLibre = this.interfaceVersPartieLibre(interfacePartie);
                    partie.scoresAleatoires(partie.scoresSolo);
                    partie.scoresAleatoires(partie.scores1v1);

                    await collection.findOneAndUpdate({id: Number(fiche.id)}, this.partieLibreVersInterface(partie));

                    return partie;
                });
        }

    }

    private partieVersInterface(partie: Partie): InterfacePartie {
        const inter: InterfacePartie = {
            id: partie.id,
            nom: partie.nom,
            idImageOriginale: partie.idImageOriginale,
            idImageModifiee: partie.idImageModifiee,
            idImageDifferences: partie.idImageDifferences,
            scoreSolo: [],
            score1v1: [],
            type: TypeDePartie.SIMPLE,
        };

        for (let i: number = 0; i < partie.scores1v1.length; i++) {
            inter.scoreSolo.push({temps: partie.scoresSolo[i].temps, nomJoueur: partie.scoresSolo[i].nomDuJoueur});
            inter.score1v1.push({temps: partie.scores1v1[i].temps, nomJoueur: partie.scores1v1[i].nomDuJoueur});
        }

        return inter;
    }

    private partieLibreVersInterface(fiche: PartieLibre): InterfacePartieLibre {
        const inter: InterfacePartieLibre = {
            id: fiche.id,
            nom: fiche.nom,
            idImageOriginale: fiche.idImageOriginale,
            idImageModifiee: fiche.idImageModifiee,
            idImageDifferences: fiche.idImageDifferences,
            scoreSolo: [],
            score1v1: [],
            type: TypeDePartie.LIBRE,
            typeObjets: fiche.typeObjets,
            quantiteObjets: fiche.quantiteObjets,
            typeModifications: fiche.typeModifications,
            listeObjets: fiche.listeObjets,
        };

        for (let i: number = 0; i < fiche.scores1v1.length; i++) {
            inter.scoreSolo.push({temps: fiche.scoresSolo[i].temps, nomJoueur: fiche.scoresSolo[i].nomDuJoueur});
            inter.score1v1.push({temps: fiche.scores1v1[i].temps, nomJoueur: fiche.scores1v1[i].nomDuJoueur});
        }

        return inter;
    }

    public async getPartiesSimple(): Promise<Partie[]> {
        const collection: Collection = await BaseDeDonnees.getCollection("partiesSimples");

        return collection.find().toArray().then(
            (doc: InterfacePartie[]) => {
                const parties: Partie[] = [];
                for (const interfacePartie of doc) {

                    parties.push(this.interfaceVersPartie(interfacePartie));

                }

                return parties;
            });
    }

    public async getPartieSimple(id: number): Promise<Partie> {
        const collection: Collection = await BaseDeDonnees.getCollection("partiesSimples");

        return collection.findOne({id: Number(id)}).then(
            (doc: InterfacePartie ) => {
                return this.interfaceVersPartie(doc);
        });
    }

    public async getPartieLibre(id: number): Promise<PartieLibre> {
        const collection: Collection = await BaseDeDonnees.getCollection("partiesLibres");

        return collection.findOne({id: Number(id)}).then(
            (doc: InterfacePartieLibre ) => {
                return this.interfaceVersPartieLibre(doc);
        });
    }

    private interfaceVersPartie(interfacePartie: InterfacePartie): Partie {
        const partie: Partie = new Partie(interfacePartie.id, interfacePartie.nom, interfacePartie.type);
        partie.setIdImageOriginale(interfacePartie.idImageOriginale);
        partie.setIdImageDifferences(interfacePartie.idImageDifferences);
        partie.setIdImageModifiee(interfacePartie.idImageModifiee);

        for (let i: number = 0; i < partie.scores1v1.length; i++) {
            partie.scoresSolo[i] = new Score(interfacePartie.scoreSolo[i].temps, interfacePartie.scoreSolo[i].nomJoueur);
            partie.scores1v1[i] = new Score(interfacePartie.score1v1[i].temps, interfacePartie.score1v1[i].nomJoueur);
        }

        return partie;
    }

    public async getPartiesLibres(): Promise<PartieLibre[]> {
        const collection: Collection = await BaseDeDonnees.getCollection("partiesLibres");

        return collection.find().toArray().then(
            (doc: InterfacePartieLibre[]) => {
                const parties: PartieLibre[] = [];
                for (const interfacePartie of doc) {
                    parties.push(this.interfaceVersPartieLibre(interfacePartie));

                }

                return parties;
            });
    }

    public async updatePartie(partie: Partie): Promise<void> {
        return new Promise(async (resolve: Function, reject: Function) => {
            const nomCollection: string = partie.type === TypeDePartie.SIMPLE ? "partiesSimples" : "partiesLibres";
            const collection: Collection = await BaseDeDonnees.getCollection(nomCollection);
            const interfacePartie: InterfacePartie | InterfacePartieLibre = partie.type === TypeDePartie.SIMPLE
                ? this.partieVersInterface(partie) : this.partieLibreVersInterface(partie as PartieLibre);
            await collection.replaceOne({id: Number(partie.id)}, interfacePartie);
            resolve();
        });
    }

    private interfaceVersPartieLibre(interfacePartie: InterfacePartieLibre): PartieLibre {
        const partie: PartieLibre = new PartieLibre(interfacePartie.id, interfacePartie.nom);
        partie.setIdImageOriginale(interfacePartie.idImageOriginale);
        partie.setIdImageDifferences(interfacePartie.idImageDifferences);
        partie.setIdImageModifiee(interfacePartie.idImageModifiee);
        const nbScores: number = 3;
        for (let i: number = 0; i < nbScores; i++) {
            partie.scoresSolo[i] = new Score(interfacePartie.scoreSolo[i].temps, interfacePartie.scoreSolo[i].nomJoueur);
            partie.scores1v1[i] = new Score(interfacePartie.score1v1[i].temps, interfacePartie.score1v1[i].nomJoueur);
        }
        partie.typeObjets = interfacePartie.typeObjets;
        partie.quantiteObjets = interfacePartie.quantiteObjets;
        partie.typeModifications = interfacePartie.typeModifications;
        partie.listeObjets = interfacePartie.listeObjets;

        return partie;
    }

    public async getIdDisponible(type: TypeDePartie): Promise<number> {
        const collection: Collection = await BaseDeDonnees.getCollection("ids");

        return collection.findOne({id: 0}).then(
            (doc: Ids) => {
                return !type ? doc.idSimple + 1 : doc.idLibre + 1;
        });
    }

}
