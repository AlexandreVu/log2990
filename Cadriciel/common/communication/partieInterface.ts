import {TypeDePartie} from "../../client/src/app/Partie";

export interface InterfacePartie {
    id: number;
    nom: String;
    idImageOriginale: string;
    idImageModifiee: string;
    idImageDifferences: string;
    scoreSolo: {temps: number, nomJoueur: String}[];
    score1v1: {temps: number, nomJoueur: String}[];
    type: TypeDePartie;
}