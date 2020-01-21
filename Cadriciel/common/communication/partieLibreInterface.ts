import { TypeDePartie } from "../../client/src/app/Partie";
import { ListeObjets } from "../../client/src/app/PartieLibre";

export interface InterfacePartieLibre {
    id: number;
    nom: String;
    idImageOriginale: string;
    idImageModifiee: string;
    idImageDifferences: string;
    scoreSolo: {temps: number, nomJoueur: String}[];
    score1v1: {temps: number, nomJoueur: String}[];
    type: TypeDePartie;
    typeObjets: String;
    quantiteObjets: number;
    typeModifications: string[];
    listeObjets: ListeObjets;
}