import * as THREE from "three";
import { AJUSTEMENT_COLLIDER, RESOLUTION_CIRCULAIRE } from "../Constantes";
import { Objet3D, Proprietes } from "./objet3-d";

export class Cylindre extends Objet3D {
    public constructor(proprietes: Proprietes, couleur: number) {
        super(proprietes, couleur);
        this.geometry = new THREE.CylinderGeometry(this.proprietes.Rayon,
                                                   this.proprietes.Rayon,
                                                   this.proprietes.Hauteur,
                                                   RESOLUTION_CIRCULAIRE);
        this.construireForme();
        this.initialiserCollisionneur(Math.max(this.proprietes.Rayon, this.proprietes.Hauteur) + AJUSTEMENT_COLLIDER);
    }
}
