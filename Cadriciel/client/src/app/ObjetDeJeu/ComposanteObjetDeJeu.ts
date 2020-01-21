import * as THREE from "three";
import { ObjetDeJeu } from "./ObjetDeJeu";

export abstract class ComposanteObjetJeu {
    protected positionParent: THREE.Vector3;
    protected positionLocale: THREE.Vector3;
    public constructor(objetParent: ObjetDeJeu) {
        this.positionParent = objetParent.position;
        this.positionLocale = new THREE.Vector3();
    }

    protected calculerPositionMonde(): THREE.Vector3 {
        const positionMonde: THREE.Vector3 = new THREE.Vector3();
        positionMonde.setX(this.positionParent.x + this.positionLocale.x);
        positionMonde.setY(this.positionParent.y + this.positionLocale.y);
        positionMonde.setZ(this.positionParent.z + this.positionLocale.z);

        return positionMonde;
    }
    public abstract ajouterDansUneScene(scene: THREE.Scene): void;
    public abstract miseAJour(): void;
}
