import * as THREE from "three";
import { CollisionneurSpherique, ProprietesCollisionneur } from "./CollisionneurSpherique";

export class GestionnaireCollisions {
    private static instanceUnique: GestionnaireCollisions;
    private static estInstancie: boolean = false;
    private collisionneurs: CollisionneurSpherique[];
    private collision: Collision;
    public collisionsVisibles: boolean;

    private constructor() {
        GestionnaireCollisions.instanceUnique = this;
        this.collisionneurs = new Array();
        this.collisionsVisibles = false;
    }

    public static obtenirGestionnaire(): GestionnaireCollisions {
        if (!this.estInstancie) {
            this.initialiser();
        }

        return this.instanceUnique;
    }
    public static initialiser(): void {
        this.instanceUnique = new GestionnaireCollisions();
        this.estInstancie = true;
    }
    public ajouterCollisionneur(collisionneur: CollisionneurSpherique): void {
        this.collisionneurs.push(collisionneur);
    }
    public estEnCollision(collisionneur: CollisionneurSpherique): boolean {
        const proprietesCollisionneur: ProprietesCollisionneur = collisionneur.obtenirProprietes();
        let proprietesAutreCollisionneur: ProprietesCollisionneur;

        for (const collisionneurStatique of this.collisionneurs) {
            proprietesAutreCollisionneur = collisionneurStatique.obtenirProprietes();
            if (this.sontSuperposes(proprietesCollisionneur, collisionneurStatique.obtenirProprietes())) {
                proprietesCollisionneur.Centre = collisionneur.mouvement;
                this.collision = { CollisionneurDynamique: proprietesCollisionneur, CollisionneurStatique: proprietesAutreCollisionneur };

                return true;
            }
        }

        return false;
    }
    private sontSuperposes(collisionneurA: ProprietesCollisionneur, collisionneurB: ProprietesCollisionneur): boolean {
        return (collisionneurA.Mouvement.distanceTo(collisionneurB.Centre) < (collisionneurA.Taille + collisionneurB.Taille));
    }
    public resoudreCollision(position: THREE.Vector3): void {
        const vecteurD: THREE.Vector3 = new THREE.Vector3(this.collision.CollisionneurDynamique.Centre.x, );
        vecteurD.set(this.collision.CollisionneurDynamique.Centre.x - this.collision.CollisionneurStatique.Centre.x,
                     this.collision.CollisionneurDynamique.Centre.y - this.collision.CollisionneurStatique.Centre.y,
                     this.collision.CollisionneurDynamique.Centre.z - this.collision.CollisionneurStatique.Centre.z);
        vecteurD.setLength(this.collision.CollisionneurDynamique.Taille + this.collision.CollisionneurStatique.Taille + 1);
        vecteurD.add(this.collision.CollisionneurStatique.Centre);
        position.set(vecteurD.x, vecteurD.y, vecteurD.z);
    }
    public rendreCollisionneursVisible(): void {
        this.collisionsVisibles = !this.collisionsVisibles;
        this.collisionneurs.forEach((collisionneur) => {
            collisionneur.sphereVisible.visible = this.collisionsVisibles;
        });
    }
}
export interface Collision {
    CollisionneurDynamique: ProprietesCollisionneur;
    CollisionneurStatique: ProprietesCollisionneur;
}
