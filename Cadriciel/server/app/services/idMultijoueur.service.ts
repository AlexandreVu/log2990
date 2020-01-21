import { injectable } from "inversify";
import { Collection } from "mongodb";
import { TypeDePartie } from "../../../client/src/app/Partie";
import { Ids } from "../../../common/communication/ids";
import { BaseDeDonnees } from "../mango/mangoClient";

@injectable()
export class IdMultijoueurService {
    public async getId(type: TypeDePartie): Promise<number> {
        const collection: Collection = await BaseDeDonnees.getCollection("idsMulti");
        await this.incrementerId(type);

        return collection.findOne({id: 0}).then(
            (doc: Ids) => {
                return !type ? doc.idSimple : doc.idLibre;
            });
    }

    private async incrementerId(type: TypeDePartie): Promise<void> {
        const idsTemp: Ids = {id: 0, idSimple: -1, idLibre: -1};
        const collection: Collection = await BaseDeDonnees.getCollection("idsMulti");

        return collection.findOne({id: 0}).then(
            async (ids: Ids) => {
                idsTemp.id = 0;
                !type ? idsTemp.idSimple = ids.idSimple + 1 : idsTemp.idLibre = ids.idLibre + 1;
                !type ? idsTemp.idLibre = ids.idLibre : idsTemp.idSimple = ids.idSimple;
                await collection.findOneAndUpdate({id: 0}, idsTemp);
            });
    }
}
