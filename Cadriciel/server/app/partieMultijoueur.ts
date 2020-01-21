import { injectable } from "inversify";
import { TypeDePartie } from "../../client/src/app/Partie";

@injectable()
export class PartiesMultijoueur {

    public idsSimples: number[] = [];
    public idsLibres: number[] = [];

    public ajouterIdSimple(id: number): boolean {
        if (this.verifierId(TypeDePartie.SIMPLE, id)) {
            this.idsSimples.push(id);

            return true;
        }

        return false;
    }

    public ajouterIdLibre(id: number): boolean {
        if (this.verifierId(TypeDePartie.LIBRE, id)) {
            this.idsLibres.push(id);

            return true;
        }

        return false;
    }

    private verifierId(type: TypeDePartie, id: number): boolean {
        const ids: number[] = !type ? this.idsSimples : this.idsLibres;

        for (const identifiant of ids) {
            if (identifiant === id) {
                return false;
            }
        }

        return true;
    }
}
