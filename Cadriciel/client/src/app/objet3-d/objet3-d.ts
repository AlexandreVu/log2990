import * as THREE from "three";
import { CollisionneurSpherique } from "../ObjetDeJeu/CollisionneurSpherique";
import { GestionnaireCollisions } from "../ObjetDeJeu/GestionnaireCollisions";
import { ObjetDeJeu } from "../ObjetDeJeu/ObjetDeJeu";

const ANGLE_LIMITE: number = 20;
const ECHELLE_DEMARCATION: number = 1.02;

export abstract class Objet3D extends ObjetDeJeu {
    private gestionnaire: GestionnaireCollisions;
    protected geometry: THREE.Geometry;
    protected mesh: THREE.Mesh;
    protected demarcationFace: THREE.LineSegments;
    protected demarcationForme: THREE.Mesh;
    protected collisionneur: CollisionneurSpherique;
    protected couleurPrincipale: number;
    public proprietes: Proprietes;

    public constructor(proprietes: Proprietes, couleur: number) {
        super();
        this.proprietes = {...proprietes};
        this.couleurPrincipale = couleur;
        this.gestionnaire = GestionnaireCollisions.obtenirGestionnaire();
        this.position.set(this.proprietes.Position.x, this.proprietes.Position.y, this.proprietes.Position.z);
    }
    protected initialiserCollisionneur(taille: number): void {
        this.collisionneur = new CollisionneurSpherique(this, taille);
        this.gestionnaire.ajouterCollisionneur(this.collisionneur);
    }
    private genererDemarcationFace(): void {
        const demarcation: THREE.EdgesGeometry = new THREE.EdgesGeometry(this.geometry, ANGLE_LIMITE);
        this.demarcationFace = new THREE.LineSegments(demarcation, new THREE.LineBasicMaterial({color: 0xFFFFFF}));
        this.demarcationFace.rotation.setFromVector3(this.proprietes.Rotation);
        this.demarcationFace.position.set(this.proprietes.Position.x, this.proprietes.Position.y, this.proprietes.Position.z);
    }

    private genererDemarcationForme(): void {
        const matiere: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({color: 0xFFFFFF, side: THREE.BackSide});
        this.demarcationForme = new THREE.Mesh(this.geometry, matiere);
        this.demarcationForme.rotation.setFromVector3(this.proprietes.Rotation);
        this.demarcationForme.position.set(this.proprietes.Position.x, this.proprietes.Position.y, this.proprietes.Position.z);
        this.demarcationForme.scale.multiplyScalar(ECHELLE_DEMARCATION);
    }

    protected construireForme(): void {
        if (this.mesh === undefined) {
            this.genererDemarcationFace();
            this.genererDemarcationForme();
            this.mesh = new THREE.Mesh(this.geometry, new THREE.MeshPhongMaterial({color: this.couleurPrincipale}));
        }
        this.mesh.position.set(this.proprietes.Position.x, this.proprietes.Position.y, this.proprietes.Position.z);
        this.mesh.rotation.setFromVector3(this.proprietes.Rotation);
        this.mesh.receiveShadow = true;
        this.mesh.castShadow = true;
    }

    public ajouterDansUneScene(scene: THREE.Scene): void {
        scene.add(this.getMesh().clone());
        this.collisionneur.sphereVisible.position.set(this.mesh.position.x, this.mesh.position.y, this.mesh.position.z);
        scene.add(this.collisionneur.sphereVisible);
        scene.add(this.getDemarcationFace().clone());
        scene.add(this.getDemarcationForme().clone());
    }

    public getMesh(): THREE.Mesh {
        return this.mesh;
    }

    public getDemarcationFace(): THREE.LineSegments {
        return this.demarcationFace;
    }

    public getDemarcationForme(): THREE.Mesh {
        return this.demarcationForme;
    }
}

export interface Proprietes {
    Forme: String;
    Rayon: number;
    Hauteur: number;
    Position: THREE.Vector3;
    Rotation: THREE.Vector3;
    Couleur: number;
    Ajout: boolean;
    Retrait: boolean;
    ModCouleur: boolean;
    CouleurAlt: number;
}
