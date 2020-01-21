import { Injectable } from "@angular/core";
import * as THREE from "three";
import { GestionnaireDeParties } from "../GestionnaireDeParties";
import { ObjetDeJeu } from "../ObjetDeJeu/ObjetDeJeu";
import { Proprietes } from "../objet3-d/objet3-d";
import { CameraPremierePersonne, PLAN_COUPE_AVANT, PLAN_COUPE_DISTANT } from "./CameraPremierePersonne";
import { IdentificateurObjet } from "./identificateur-objet";

const COULEUR_INITIALE: number = 0xCAFEFA;
const COULEUR_BLANCHE: number = 0xFFFFFF;

const INTENSITE_LUMIERE_AMBIANTE: number = 0.8;
const INTENSITE_LUMIERE_CAMERA: number = 0.8;
const PORTEE_LUMIERE_CAMERA: number = 5000;

@Injectable({
    providedIn: "root",
})
export class AfficheurScene3dService {
    public sceneOriginale: THREE.Scene;
    public sceneModifiee: THREE.Scene;
    public cameraAmovible: CameraPremierePersonne;
    public sceneGeneree: boolean;

    private conteneurModifiee: HTMLDivElement;
    private conteneurOriginale: HTMLDivElement;
    private gestionnaireRenduModifiee: THREE.WebGLRenderer;
    private gestionnaireRenduOriginale: THREE.WebGLRenderer;
    private gestionnaireDeParties: GestionnaireDeParties;
    private identificateurObjetSceneOriginale: IdentificateurObjet;
    private identificateurObjetSceneModifiee: IdentificateurObjet;
    private objetsSceneOriginale: THREE.Object3D[];
    private objetsSceneModifiee: THREE.Object3D[];
    private lumiereCamera: THREE.PointLight;
    private lumiereAmbiante: THREE.AmbientLight;
    private objetsDynamiques: ObjetDeJeu[];

    public constructor() {
        this.gestionnaireRenduOriginale = new THREE.WebGLRenderer({preserveDrawingBuffer: true});
        this.gestionnaireRenduModifiee = new THREE.WebGLRenderer();
        this.lumiereAmbiante = new THREE.AmbientLight(COULEUR_BLANCHE, INTENSITE_LUMIERE_AMBIANTE);
        this.lumiereCamera = new THREE.PointLight(COULEUR_BLANCHE, INTENSITE_LUMIERE_CAMERA, PORTEE_LUMIERE_CAMERA);
        this.identificateurObjetSceneOriginale = new IdentificateurObjet();
        this.identificateurObjetSceneModifiee = new IdentificateurObjet();
        this.gestionnaireDeParties = GestionnaireDeParties.getGestionnaire();
        this.objetsSceneOriginale = Array();
        this.objetsSceneModifiee = Array();
        this.objetsDynamiques = Array();
        this.sceneGeneree = false;
    }
    public changerCouleurFond(couleur: THREE.Color): void {
        this.sceneOriginale.background = couleur;
        this.sceneModifiee.background = couleur;
    }
    public getGestionnaireDeRendu(): THREE.WebGLRenderer {
        return this.gestionnaireRenduOriginale;
    }
    public initialiserAffichage(conteneurOriginal: HTMLDivElement, conteneurModifiee: HTMLDivElement): void {
        this.conteneurOriginale = conteneurOriginal;
        this.conteneurModifiee = conteneurModifiee;
        this.initialiserGestionnaireRendu(this.gestionnaireRenduOriginale, this.conteneurOriginale);
        this.initialiserGestionnaireRendu(this.gestionnaireRenduModifiee, this.conteneurModifiee);

        this.sceneOriginale = this.composerLaScene();
        this.sceneModifiee = this.composerLaScene();

        this.cameraAmovible.ajouterDansUneScene(this.sceneOriginale);
        this.cameraAmovible.ajouterDansUneScene(this.sceneModifiee);

        this.changerCouleurFond(new THREE.Color(COULEUR_INITIALE));
        this.afficher();
    }

    public identifierObjet(event: MouseEvent): THREE.Vector3 | undefined {
        this.objetsSceneOriginale = this.recupererObjetsScene(this.sceneOriginale);
        this.objetsSceneModifiee = this.recupererObjetsScene(this.sceneModifiee);

        return this.identifierObjetSceneModifiee(event, this.objetsSceneOriginale, this.objetsSceneModifiee);
    }

    private recupererObjetsScene(scene: THREE.Scene): THREE.Object3D[] {
        const objetsScene: THREE.Object3D[] = new Array();
        if (scene !== undefined) {
            scene.traverse((children: THREE.Object3D) => {
                objetsScene.push(children);
            });
        }

        return objetsScene;
    }

    private identifierObjetSceneModifiee(event: MouseEvent, objetSceneOriginale: THREE.Object3D[],
                                         objetSceneModifie: THREE.Object3D[]): THREE.Vector3 | undefined {
        let obj: THREE.Object3D | undefined;
        if (this.identificateurObjetSceneOriginale.identifierObjet(event, this.gestionnaireRenduOriginale,
                                                                   objetSceneOriginale, this.cameraAmovible.camera) ) {
            obj = this.identificateurObjetSceneOriginale.obtenirObjetIdentifie();
        } else if (this.identificateurObjetSceneModifiee.identifierObjet(event, this.gestionnaireRenduModifiee,
                                                                         objetSceneModifie, this.cameraAmovible.camera)) {
            obj = this.identificateurObjetSceneModifiee.obtenirObjetIdentifie();
        }

        return obj === undefined ? undefined : this.getPosition(obj);
    }

    private getPosition(obj: THREE.Object3D): THREE.Vector3 {
        const positionGlobale: THREE.Vector3 = new THREE.Vector3();
        obj.getWorldPosition(positionGlobale);

        return positionGlobale;
    }
    public enleverDifference(pos: THREE.Vector3): void {
        this.objetsSceneOriginale = this.recupererObjetsScene(this.sceneOriginale);
        this.objetsSceneModifiee = this.recupererObjetsScene(this.sceneModifiee);

        const objAChanger: Proprietes | undefined = this.gestionnaireDeParties.objetsDansLaScene.find((obj: Proprietes) => {
            return this.memePosition(obj.Position, pos);
        });
        if (objAChanger !== undefined) {
            if (objAChanger.Ajout) {
                this.retablirAjout(pos, this.objetsSceneModifiee);
                objAChanger.Ajout = false;
            }
            if (objAChanger.Retrait) {
                this.retablirRetrait(pos, this.objetsSceneOriginale);
                objAChanger.Retrait = false;
            }
            if (objAChanger.ModCouleur) {
                this.retablirCouleur(pos, this.objetsSceneModifiee, objAChanger.Couleur);
                objAChanger.ModCouleur = false;
            }
        }
    }

    public memePosition(pos1: THREE.Vector3, pos2: THREE.Vector3): boolean {
        return pos1.x === pos2.x && pos1.y === pos2.y && pos1.z === pos2.z;
    }

    private retablirAjout(pos: THREE.Vector3, objetsSceneModifiee: THREE.Object3D[]): void {
        objetsSceneModifiee.filter((element: THREE.Object3D) => {
            return this.memePosition(this.getPosition(element), pos);
        }).forEach((element: THREE.Object3D) => {
            this.sceneModifiee.remove(element);
        });
    }

    private retablirRetrait(pos: THREE.Vector3, objetsSceneOriginale: THREE.Object3D[]): void {
        objetsSceneOriginale.filter((element: THREE.Object3D) => {
            return this.memePosition(this.getPosition(element), pos);
        }).forEach((element: THREE.Object3D) => {
            this.sceneModifiee.add(element.clone());
        });
    }

    private retablirCouleur(pos: THREE.Vector3, objetsSceneModifiee: THREE.Object3D[], couleur: number): void {
        const obj: THREE.Object3D | undefined = objetsSceneModifiee.find((element: THREE.Object3D) => {
            return this.memePosition(this.getPosition(element), pos)
            && element.type === "Mesh"
            && ((element as THREE.Mesh).material as THREE.Material).type === "MeshPhongMaterial";
        });
        ((obj as THREE.Mesh).material as THREE.MeshPhongMaterial) = new THREE.MeshPhongMaterial({color: couleur});
    }

    private initialiserGestionnaireRendu(gestionnaire: THREE.WebGLRenderer, conteneur: HTMLDivElement): void {
        gestionnaire.setPixelRatio(devicePixelRatio);
        gestionnaire.setSize(conteneur.clientWidth, conteneur.clientHeight);
        gestionnaire.shadowMap.enabled = true;
        gestionnaire.shadowMap.type = THREE.BasicShadowMap;
        conteneur.appendChild(gestionnaire.domElement);
    }
    private composerLaScene(): THREE.Scene {
        const scene: THREE.Scene = new THREE.Scene();
        if (this.cameraAmovible === undefined) {
            this.cameraAmovible = new CameraPremierePersonne(this.getRatioAffichage());
            this.mettreAJourPositionLumiere();
            this.lumiereCamera.shadow.camera.near = PLAN_COUPE_AVANT;
            this.lumiereCamera.shadow.camera.far = PLAN_COUPE_DISTANT;
            this.objetsDynamiques.push(this.cameraAmovible);
        }
        this.ajouterLumiere(scene);

        return scene;
    }
    private ajouterLumiere(scene: THREE.Scene): void {
        scene.add(this.lumiereCamera.clone());
        scene.add(this.lumiereAmbiante.clone());
    }
    private getRatioAffichage(): number {
        return this.conteneurOriginale.clientWidth / this.conteneurOriginale.clientHeight;
    }
    private mettreAJourPositionLumiere(): void {
        this.lumiereCamera.position.set(this.cameraAmovible.camera.position.x,
                                        this.cameraAmovible.camera.position.y,
                                        this.cameraAmovible.camera.position.z);
    }
    private afficher(): void {
        this.objetsDynamiques.forEach((objets) => {
            objets.miseAJour();
        });
        this.gestionnaireRenduOriginale.render(this.sceneOriginale, this.cameraAmovible.camera);
        this.gestionnaireRenduModifiee.render(this.sceneModifiee, this.cameraAmovible.camera);
        requestAnimationFrame(() => this.afficher());
    }
    public reinitialiser(): void {
        while (this.sceneOriginale.children.length > 0) {
            this.sceneOriginale.remove(this.sceneOriginale.children[0]);
        }
        while (this.sceneModifiee.children.length > 0) {
            this.sceneModifiee.remove(this.sceneModifiee.children[0]);
        }
        this.ajouterLumiere(this.sceneOriginale);
        this.ajouterLumiere(this.sceneModifiee);
    }
}
