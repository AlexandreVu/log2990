import * as THREE from "three";
import { RESOLUTION_CIRCULAIRE } from "../Constantes";
import { Objet3D, Proprietes } from "./objet3-d";

export class Cone extends Objet3D {
    public constructor(proprietes: Proprietes, couleur: number) {
        super(proprietes, couleur);
        this.geometry = new THREE.ConeGeometry(this.proprietes.Rayon, this.proprietes.Hauteur, RESOLUTION_CIRCULAIRE);
        this.construireForme();
        this.initialiserCollisionneur(Math.max(this.proprietes.Rayon, this.proprietes.Hauteur));
    }
}
