import * as THREE from "three";
import { Objet3D, Proprietes } from "./objet3-d";

export class Cube extends Objet3D {
    public constructor(proprietes: Proprietes, couleur: number) {
        super(proprietes, couleur);
        this.geometry = new THREE.BoxGeometry(this.proprietes.Hauteur, this.proprietes.Hauteur, this.proprietes.Hauteur);
        this.construireForme();
        this.initialiserCollisionneur(this.proprietes.Hauteur);
    }
}
