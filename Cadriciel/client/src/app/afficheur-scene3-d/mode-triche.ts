import * as THREE from "three";

const NOMBRE_DE_CLIGNOTEMENTS_PAR_SECONDE: number = 4;
const NOMBRE_ACTIVATION_PAR_CLIGNOTEMENT: number = 2;
const CONVERSION_MILLISECONDES: number = 1000;
const TEMPS_DE_CLIGNOTEMENT: number = (1 / (NOMBRE_DE_CLIGNOTEMENTS_PAR_SECONDE * NOMBRE_ACTIVATION_PAR_CLIGNOTEMENT))
                                      * CONVERSION_MILLISECONDES;

export class ModeTriche {
    private sceneOriginale: THREE.Scene;
    private sceneModifiee: THREE.Scene;
    private temps: THREE.Clock;
    private estVisible: boolean;

    public intervalle: number;
    public estActif: boolean;
    public objetsAClignoter: THREE.Object3D[];

    public constructor(sceneOriginale: THREE.Scene, sceneModifiee: THREE.Scene) {
        this.sceneOriginale = sceneOriginale;
        this.sceneModifiee = sceneModifiee;
        this.estActif = false;
        this.estVisible = false;
        this.objetsAClignoter = new Array();
        this.temps = new THREE.Clock;
        this.temps.start();
    }

    public activerModeTriche(): void {
        if (this.estActif) {
            this.trouverDifferences();
            this.intervalle = window.setInterval(() => {
                this.faireClignoterDifferences(this.estVisible);
                this.estVisible = !this.estVisible;
            },                                   TEMPS_DE_CLIGNOTEMENT);
        } else {
            window.clearInterval(this.intervalle);
            this.faireClignoterDifferences(true);
        }
    }
    public faireClignoterDifferences(visible: boolean): void {
        for (const objet of this.objetsAClignoter) {
            objet.visible = visible;
        }
    }
    private trouverDifferences(): void {
        this.objetsAClignoter.length = 0;
        this.comparerScene(this.sceneOriginale, this.sceneModifiee);
        this.comparerScene(this.sceneModifiee, this.sceneOriginale);
    }
    private comparerScene(sceneA: THREE.Scene, sceneB: THREE.Scene): void {
        sceneA.traverse((objet: THREE.Object3D) => {
            if (this.estUneMeshPhong(objet)) {
                if (!this.existeDansScene(objet, sceneB)) {
                    this.objetsAClignoter.push(objet);
                }
            }
        });
    }
    private existeDansScene(objet: THREE.Object3D, scene: THREE.Scene): boolean {
        let estPresent: boolean = false;
        scene.traverse((objetPresent: THREE.Object3D) => {
            if (this.estUneMeshPhong(objetPresent)) {
                if (this.sontObjetsIdentiques(objet, objetPresent)) {
                    estPresent = true;
                }
            }
        });

        return estPresent;
    }
    private sontPositionsIdentiques(positionA: THREE.Vector3, positionB: THREE.Vector3): boolean {
        return (positionA.x === positionB.x &&
                positionA.y === positionB.y &&
                positionA.z === positionB.z);
    }
    private sontCouleursIdentiques(couleurA: THREE.Color, couleurB: THREE.Color): boolean {
        return (couleurA.r === couleurB.r &&
                couleurA.g === couleurB.g &&
                couleurA.b === couleurB.b);
    }
    private obtenirMateriel(objet: THREE.Object3D): THREE.MeshPhongMaterial {
        const mesh: THREE.Mesh = objet as THREE.Mesh;

        return (mesh.material as THREE.MeshPhongMaterial);
    }
    private sontObjetsIdentiques(objetA: THREE.Object3D, objetB: THREE.Object3D): boolean {
        const positionGlobaleA: THREE.Vector3 = new THREE.Vector3();
        const positionGlobaleB: THREE.Vector3 = new THREE.Vector3();
        objetA.getWorldPosition(positionGlobaleA);
        objetB.getWorldPosition(positionGlobaleB);

        return this.sontPositionsIdentiques(positionGlobaleA, positionGlobaleB) &&
               this.sontCouleursIdentiques(this.obtenirMateriel(objetA).color, this.obtenirMateriel(objetB).color);
    }
    private estUneMeshPhong(objet: THREE.Object3D): boolean {
        const mesh: THREE.Mesh = objet as THREE.Mesh;
        const material: THREE.Material = mesh.material as THREE.Material;

        return objet.type === "Mesh" && material.type === "MeshPhongMaterial";
    }
}
