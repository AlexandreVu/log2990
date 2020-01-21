import * as THREE from "three";
import { Objet3D, Proprietes } from "./objet3-d";

const REPERTOIRE_ASSETS: string = "../../assets/";
const COULEUR_BLANCHE: number = 0xFFFFFF;
const AJUTEMENT_COLLIDER: number = 2;
const AJUTEMENT_COLLIDER_PETIT: number = 1.55;
const AJUTEMENT_COLLIDER_ASTEROIDE_B: number = 1.2;

export class Modele3D extends Objet3D {
    private sceneAjout: THREE.Scene;
    public constructor(proprietes: Proprietes, couleur: number, scene: THREE.Scene) {
        super(proprietes, couleur);
        this.sceneAjout = scene;
        this.chargerModele3D(proprietes.Forme.valueOf());
    }
    private creerMaterielEnfant(indice: number, couleur: number): void {
        const meshEnfant: THREE.Mesh = this.mesh.children[indice] as THREE.Mesh;
        (meshEnfant.material as THREE.Material) =
        new THREE.MeshPhongMaterial({color: couleur});
    }
    private initialiserModele(objet: THREE.Object3D): void {
        if (this.proprietes.Forme.valueOf() === "VaisseauCombat") {
            this.mesh = (objet as THREE.Mesh);
            this.creerMaterielEnfant(0, this.couleurPrincipale);
            this.creerMaterielEnfant(1, COULEUR_BLANCHE);
        } else {
            this.geometry = (objet.children[0] as THREE.Mesh).geometry as THREE.Geometry;
        }
        this.construireForme();
        this.mesh.scale.set(this.proprietes.Hauteur, this.proprietes.Hauteur, this.proprietes.Hauteur);
        this.sceneAjout.add(this.mesh);
        this.initialiserCollisionneurModele();
    }
    private initialiserCollisionneurModele(): void {
        const boiteContour: THREE.Box3 = new THREE.Box3().setFromObject(this.mesh);
        const taille: THREE.Vector3 = new THREE.Vector3();
        boiteContour.getSize(taille);
        taille.divideScalar(AJUTEMENT_COLLIDER);
        if (this.proprietes.Forme.valueOf() === "Jupiter") { taille.divideScalar(AJUTEMENT_COLLIDER); }
        if (this.proprietes.Forme.valueOf() === "VaisseauMaitreAlien" || this.proprietes.Forme.valueOf() === "Asteroide") {
            taille.divideScalar(AJUTEMENT_COLLIDER_PETIT);
        }
        if (this.proprietes.Forme.valueOf() === "AsteroideB") { taille.divideScalar(AJUTEMENT_COLLIDER_ASTEROIDE_B); }
        this.initialiserCollisionneur(taille.length());
        this.sceneAjout.add(this.collisionneur.sphereVisible);
    }
    public chargerModele3D(nomFichier: string): void {
        const chargeurObjet: THREE.ObjectLoader = new THREE.ObjectLoader();
        chargeurObjet.load(REPERTOIRE_ASSETS + nomFichier + ".json", (objet) => {
                this.initialiserModele(objet);
            },
        );
    }
}
