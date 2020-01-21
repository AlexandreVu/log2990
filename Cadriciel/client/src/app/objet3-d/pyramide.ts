import * as THREE from "three";
import { Objet3D, Proprietes } from "./objet3-d";

const NB_FACES: number = 3;

export class Pyramide extends Objet3D {
    public constructor(proprietes: Proprietes, couleur: number) {
        super(proprietes, couleur);
        this.geometry = new THREE.ConeGeometry(this.proprietes.Rayon, this.proprietes.Hauteur, NB_FACES);
        this.construireForme();
        this.initialiserCollisionneur(Math.max(this.proprietes.Rayon, this.proprietes.Hauteur));
    }
}
