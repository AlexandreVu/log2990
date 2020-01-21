import * as THREE from "three";

import { GestionnaireDeParties } from "../GestionnaireDeParties";
import { ListeObjets } from "../PartieLibre";
import { Proprietes } from "../objet3-d/objet3-d";

export const NOMBRE_DIFFERENCES: number = 7;
export const NOMBRE_RESTRICTIONS: number = 3;

export const TAILLE_REFERENCE: number = 30;
export const FACTEUR_TAILLE_MIN: number = 0.5;
export const FACTEUR_TAILLE_MAX: number = 1.5;
export const COULEUR_MAX: number = 0xFFFFFF;
export const POSITION_MIN: number = -300;
export const POSITION_MAX: number = 500;
export const ROTATION_MIN: number = -45;
export const ROTATION_MAX: number = 45;
export const NOMBRE_OBJETS_MINIMAL: number = 10;
export const NOMBRE_OBJETS_MAXIMAL: number = 200;

export enum TypeDeDifference {
    AJOUT = 0,
    RETRAIT = 1,
    MODIFICATION_COULEUR = 2,
}

export abstract class GenerateurScene {
    public constructor() {
        this.gestionnaire = GestionnaireDeParties.getGestionnaire();
    }

    protected nbObjets: number;
    protected gestionnaire: GestionnaireDeParties;

    public static creerVector3(x: number, y: number, z: number): THREE.Vector3 {
        return new THREE.Vector3(x, y, z);
    }

    public genererScene(): ListeObjets {
        const listeObjets: ListeObjets = { liste: new Array() };
        this.nbObjets = this.gestionnaire.getNbObjets();
        if (this.nbObjets < NOMBRE_OBJETS_MINIMAL) { this.nbObjets = NOMBRE_OBJETS_MINIMAL; }
        if (this.nbObjets > NOMBRE_OBJETS_MAXIMAL) { this.nbObjets = NOMBRE_OBJETS_MAXIMAL; }
        for (let i: number = 0; i < this.nbObjets; i++) {
            listeObjets.liste[listeObjets.liste.length] = this.genererProprietes();
        }
        this.genererDifferences(listeObjets);

        return listeObjets;
    }

    public chargerScene(listeObjets: ListeObjets, sceneOriginale: THREE.Scene, sceneModifiee: THREE.Scene): void {
        const proprietes: Proprietes[] = listeObjets.liste;
        this.gestionnaire.objetsDansLaScene = listeObjets.liste;
        for (const propriete of proprietes) {
            this.ajouterOriginal(propriete, sceneOriginale);
            this.ajouterModifie(propriete, sceneModifiee);
        }
    }

    protected genererNombreEntier(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    public genererTaille(): number {
        return this.genererNombreEntier(TAILLE_REFERENCE * FACTEUR_TAILLE_MIN,
                                        TAILLE_REFERENCE * FACTEUR_TAILLE_MAX);
    }

    protected genererVector3(min: number, max: number): THREE.Vector3 {
        return new THREE.Vector3(this.genererNombreEntier(min, max),
                                 this.genererNombreEntier(min, max),
                                 this.genererNombreEntier(min, max));
    }

    protected genererCouleur(): number {
        return this.genererNombreEntier(0, COULEUR_MAX);
    }

    protected verificationDifference(propriete: Proprietes): boolean {
        return !(propriete.Ajout || propriete.Retrait || propriete.ModCouleur);
    }
    protected genererProprieteBase(nomObjet: string): Proprietes {
        let proprietes: Proprietes;
        proprietes = {
            Forme: nomObjet,
            Rayon: this.genererTaille(),
            Hauteur: this.genererTaille(),
            Position: this.genererVector3(POSITION_MIN, POSITION_MAX),
            Rotation: this.genererVector3(ROTATION_MIN, ROTATION_MAX),
            Couleur: this.genererCouleur(),
            Ajout: false,
            Retrait: false,
            ModCouleur: false,
            CouleurAlt: this.genererCouleur(),
        };

        return proprietes;
    }

    protected genererDifferences(listeObjets: ListeObjets): void {
        const proprietes: Proprietes[] = listeObjets.liste;
        let iterator: number = 0;
        let position: number;
        if (this.verifierPresenceDifferences()) {
            iterator = NOMBRE_DIFFERENCES;
        }
        while (iterator < NOMBRE_DIFFERENCES) {
            position = this.genererNombreEntier(0, this.nbObjets - 1);
            const type: number = this.genererNombreEntier(0, NOMBRE_RESTRICTIONS - 1);
            switch (type) {
                case TypeDeDifference.AJOUT:
                    if (this.differenceAjout(proprietes)) {
                        iterator++;
                    }
                    break;
                case TypeDeDifference.RETRAIT:
                    if (this.differenceRetrait(proprietes, position)) {
                        iterator++;
                    }
                    break;
                case TypeDeDifference.MODIFICATION_COULEUR:
                    if (this.differenceCouleur(proprietes, position)) {
                        iterator++;
                    }
                    break;
                default:
            }
        }
    }

    private verifierPresenceDifferences(): boolean {
        return !this.gestionnaire.getAjout() && !this.gestionnaire.getRetrait() && !this.gestionnaire.getModCouleur();
    }

    private differenceAjout(proprietes: Proprietes[]): boolean {
        if (this.gestionnaire.getAjout()) {
            proprietes[proprietes.length] = this.genererProprietes();
            proprietes[proprietes.length - 1].Ajout = true;

            return true;
        }

        return false;
    }

    private differenceRetrait(proprietes: Proprietes[], position: number): boolean {
        if (this.gestionnaire.getRetrait() && this.verificationDifference(proprietes[position])) {
            proprietes[position].Retrait = true;

            return true;
        }

        return false;
    }

    private differenceCouleur(proprietes: Proprietes[], position: number): boolean {
        if (this.gestionnaire.getModCouleur() && this.verificationDifference(proprietes[position])) {
            proprietes[position].ModCouleur = true;

            return true;
        }

        return false;
    }

    protected abstract genererProprietes(): Proprietes;
    protected abstract ajouterOriginal(propriete: Proprietes, scene: THREE.Scene): void;
    protected abstract ajouterModifie(propriete: Proprietes, scene: THREE.Scene): void;
}
