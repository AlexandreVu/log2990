import * as THREE from "three";
import { CollisionneurSpherique } from "../ObjetDeJeu/CollisionneurSpherique";
import { GestionnaireCollisions } from "../ObjetDeJeu/GestionnaireCollisions";
import { ObjetDeJeu } from "../ObjetDeJeu/ObjetDeJeu";

export const PLAN_COUPE_DISTANT: number = 4000;
export const DISTANCE_MAXIMALE: number = 1500;
export const PLAN_COUPE_AVANT: number = 0.1;
const POSITION_Z_INITIALE: number = 400;
const FACTEUR_ROTATION: number = 500;
const ANGLE_DE_VISION: number = 90;
const TAILLE_COLLIDER: number = 15;
const VITESSE_CAMERA: number = 3;
export const TOUCHE_A: string = "a";
export const TOUCHE_D: string = "d";
export const TOUCHE_S: string = "s";
export const TOUCHE_W: string = "w";
export const TOUCHE_CLICK_DROIT: number = 2;
export const TOUCHE_CLICK_GAUCHE: number = 0;
const DEPLACEMENT_FRONTAL: THREE.Vector3 = new THREE.Vector3(0, 0, -VITESSE_CAMERA);
const DEPLACEMENT_LATERAL: THREE.Vector3 = new THREE.Vector3(VITESSE_CAMERA, 0, 0);

export class CameraPremierePersonne extends ObjetDeJeu {
    private gestionnaire: GestionnaireCollisions;
    private collisionneur: CollisionneurSpherique;
    public mouvement: THREE.Vector3;
    public camera: THREE.PerspectiveCamera;
    public rotationCameraActive: boolean;
    public translationArriereActive: boolean;
    public translationAvantActive: boolean;
    public translationDroiteActive: boolean;
    public translationGaucheActive: boolean;
    public vecteurCameraFrontal: THREE.Vector3;
    public vecteurCameraLateral: THREE.Vector3;

    public constructor(aspectRatio: number) {
        super();
        this.camera = new THREE.PerspectiveCamera(ANGLE_DE_VISION, aspectRatio, PLAN_COUPE_AVANT, PLAN_COUPE_DISTANT);
        this.mouvement = new THREE.Vector3;
        this.camera.position.z = POSITION_Z_INITIALE;
        this.rotationCameraActive = false;
        this.translationArriereActive = false;
        this.translationAvantActive = false;
        this.translationDroiteActive = false;
        this.translationGaucheActive = false;
        this.vecteurCameraFrontal = DEPLACEMENT_FRONTAL;
        this.vecteurCameraLateral = DEPLACEMENT_LATERAL;
        this.position = this.camera.position;
        this.ajouterCollider();
    }
    private ajouterCollider(): void {
        this.collisionneur = new CollisionneurSpherique(this, TAILLE_COLLIDER);
        this.ajouterComposante(this.collisionneur);
        this.gestionnaire = GestionnaireCollisions.obtenirGestionnaire();
    }
    private ajusterVecteursDeplacement(): void {
        this.vecteurCameraFrontal = DEPLACEMENT_FRONTAL.clone().applyQuaternion(this.camera.quaternion);
        this.vecteurCameraLateral = DEPLACEMENT_LATERAL.clone().applyQuaternion(this.camera.quaternion);
    }
    public effectuerRotation(movementX: number, movementY: number): void {
        if (this.rotationCameraActive) {
            this.camera.rotateOnAxis(new THREE.Vector3(0, 1, 0), movementX / FACTEUR_ROTATION);
            this.camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), movementY / FACTEUR_ROTATION);
            this.ajusterVecteursDeplacement();
        }
    }
    public alternerActivationRotation(activation: boolean): void {
        this.rotationCameraActive = activation;
    }
    public alternerActivationTranslation(event: KeyboardEvent, activation: boolean): void {
        switch (event.key) {
            case TOUCHE_A:
                this.translationGaucheActive = activation;
                break;
            case TOUCHE_D:
                this.translationDroiteActive = activation;
                break;
            case TOUCHE_S:
                this.translationArriereActive = activation;
                break;
            case TOUCHE_W:
                this.translationAvantActive = activation;
                break;
            default:
                break;
        }
    }
    public miseAJour(): void {
        this.mouvement.setScalar(0);
        if (this.translationAvantActive) {
            this.mouvement.add(this.vecteurCameraFrontal);
        }
        if (this.translationArriereActive) {
            this.mouvement.add(this.vecteurCameraFrontal.clone().negate());
        }
        if (this.translationDroiteActive) {
            this.mouvement.add(this.vecteurCameraLateral);
        }
        if (this.translationGaucheActive) {
            this.mouvement.add(this.vecteurCameraLateral.clone().negate());
        }
        if (this.mouvement.length() !== 0) {
            this.mouvement.add(this.camera.position);
            this.collisionneur.mouvement = this.mouvement;
            while (this.gestionnaire.estEnCollision(this.collisionneur)) {
                this.gestionnaire.resoudreCollision(this.mouvement);
            }
            if (this.mouvement.length() < DISTANCE_MAXIMALE) {
                this.camera.position.set(this.mouvement.x, this.mouvement.y, this.mouvement.z);
            }
        }
        super.miseAJour();
    }
}
