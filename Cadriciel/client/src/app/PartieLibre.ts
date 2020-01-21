import { Partie, TypeDePartie } from "./Partie";
import { Proprietes } from "./objet3-d/objet3-d";

export class PartieLibre extends Partie {
    public typeObjets: String;
    public quantiteObjets: number;
    public typeModifications: string[];
    public listeObjets: ListeObjets;

    public constructor(unId: number, unNom: String) {
        super(unId, unNom, TypeDePartie.LIBRE);
        this.listeObjets = { liste: new Array() };
    }
}

export interface ListeObjets {
    liste: Proprietes[];
}
