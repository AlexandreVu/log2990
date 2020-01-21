import { injectable } from "inversify";
import { PartieLibre } from "../../../client/src/app/PartieLibre";
import { Proprietes } from "../../../client/src/app/objet3-d/objet3-d";

@injectable()
export class IdentificationDifferencesLibre {
    public differenceExiste(partie: PartieLibre, x: number, y: number, z: number): boolean {
        const objet: Proprietes | undefined = partie.listeObjets.liste.find((proprietes: Proprietes) => {
            return proprietes.Position.x === x && proprietes.Position.y === y && proprietes.Position.z === z;
        });
        if (objet !== undefined) {
            // verifier difference de objet
            return objet.Ajout || objet.Retrait || objet.ModCouleur;
        }

        return false;
    }

}
