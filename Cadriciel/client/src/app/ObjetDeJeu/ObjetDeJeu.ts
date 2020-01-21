import * as THREE from "three";
import { ComposanteObjetJeu } from "./ComposanteObjetDeJeu";

export class ObjetDeJeu {
    public position: THREE.Vector3;
    protected composantes: ComposanteObjetJeu[];
    public constructor() {
        this.position = new THREE.Vector3();
        this.composantes = new Array();
    }
    public ajouterComposante(composante: ComposanteObjetJeu): void {
        this.composantes.push(composante);
    }
    public miseAJour(): void {
        this.composantes.forEach((composante) => {
            composante.miseAJour();
        });
    }
    public ajouterDansUneScene(scene: THREE.Scene): void {
        this.composantes.forEach((composante) => {
            composante.ajouterDansUneScene(scene);
        });
    }
}
