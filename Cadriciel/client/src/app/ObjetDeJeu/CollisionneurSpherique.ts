import * as THREE from "three";
import { RESOLUTION_SPHERIQUE } from "../Constantes";
import { ComposanteObjetJeu } from "./ComposanteObjetDeJeu";
import { ObjetDeJeu } from "./ObjetDeJeu";

export class CollisionneurSpherique extends ComposanteObjetJeu {
    private centre: THREE.Vector3;
    public mouvement: THREE.Vector3;
    public taille: number;
    public sphereVisible: THREE.Mesh;
    public constructor(objetParent: ObjetDeJeu, taille: number) {
        super(objetParent);
        this.centre = new THREE.Vector3;
        this.mouvement = new THREE.Vector3;
        this.centre = this.calculerPositionMonde();
        this.taille = taille;
        this.sphereVisible = new THREE.Mesh(new THREE.SphereGeometry(taille, RESOLUTION_SPHERIQUE, RESOLUTION_SPHERIQUE),
                                            new THREE.MeshBasicMaterial({color: 0xFF5555, wireframe: true}));
        this.sphereVisible.visible = false;
        this.miseAJour();
    }
    public ajouterDansUneScene(scene: THREE.Scene): void {
        scene.add(this.sphereVisible);
    }
    public miseAJour(): void {
        this.centre = this.positionParent;
        this.sphereVisible.position.set(this.centre.x, this.centre.y, this.centre.z);
    }
    public obtenirProprietes(): ProprietesCollisionneur {
        return { Centre: this.centre.clone(), Taille: this.taille, Mouvement: this.mouvement.clone() };
    }
}
export interface ProprietesCollisionneur {
    Centre: THREE.Vector3;
    Taille: number;
    Mouvement: THREE.Vector3;
}
