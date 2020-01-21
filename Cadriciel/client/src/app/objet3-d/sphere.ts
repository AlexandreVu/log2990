import * as THREE from "three";
import { RESOLUTION_SPHERIQUE } from "../Constantes";
import { Objet3D, Proprietes } from "./objet3-d";

export class Sphere extends Objet3D {
    public constructor(proprietes: Proprietes, couleur: number) {
        super(proprietes, couleur);
        this.geometry = new THREE.SphereGeometry(this.proprietes.Rayon, RESOLUTION_SPHERIQUE, RESOLUTION_SPHERIQUE);
        this.construireForme();
        this.initialiserCollisionneur(this.proprietes.Rayon);
    }
}
