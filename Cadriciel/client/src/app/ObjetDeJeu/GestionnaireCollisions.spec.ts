import * as THREE from "three";
import { CollisionneurSpherique } from "./CollisionneurSpherique";
import { GestionnaireCollisions } from "./GestionnaireCollisions";
import { ObjetDeJeu } from "./ObjetDeJeu";

const TAILLE_COLLIDER: number = 50;

describe("GestionnaireCollisions", () => {
    let objetCollisionneurDynamique: ObjetDeJeu;
    let collisionneurDynamique: CollisionneurSpherique;

    const GESTIONNAIRE: GestionnaireCollisions = GestionnaireCollisions.obtenirGestionnaire();
    GestionnaireCollisions.initialiser();

    const objetCollisionneurStatique: ObjetDeJeu = new ObjetDeJeu();
    objetCollisionneurStatique.position = new THREE.Vector3(0, 0, 1);
    const collisionneurStatique: CollisionneurSpherique = new CollisionneurSpherique(objetCollisionneurStatique, TAILLE_COLLIDER);

    beforeEach(() => {
        GestionnaireCollisions.initialiser();
        objetCollisionneurDynamique = new ObjetDeJeu();
        collisionneurDynamique = new CollisionneurSpherique(objetCollisionneurDynamique, TAILLE_COLLIDER);
    });
    it("Vérifie que les collisionneurs deviennent visibles", () => {
        GESTIONNAIRE.ajouterCollisionneur(collisionneurDynamique);
        GESTIONNAIRE.rendreCollisionneursVisible();

        expect(collisionneurDynamique.sphereVisible.visible).toEqual(true);
    });
    it("Vérifie que la collision entre la prochaine position et les collisionneurs de la scène est bien détectée", () => {
        GESTIONNAIRE.ajouterCollisionneur(collisionneurStatique);
        const positionEnCollision: THREE.Vector3 = new THREE.Vector3(0, 0, 1);
        const positionPasCollision: THREE.Vector3 = new THREE.Vector3(0, 0, TAILLE_COLLIDER + TAILLE_COLLIDER + 1);
        collisionneurDynamique.mouvement = positionEnCollision;
        expect(GESTIONNAIRE.estEnCollision(collisionneurDynamique)).toEqual(true);
        collisionneurDynamique.mouvement = positionPasCollision;
        expect(GESTIONNAIRE.estEnCollision(collisionneurDynamique)).toEqual(false);
    });
    it("Vérifie que la collision n'a plus lieu suite à la résolution de la collision", () => {
        GESTIONNAIRE.ajouterCollisionneur(collisionneurStatique);
        objetCollisionneurDynamique.position.set(0, 0, TAILLE_COLLIDER - 1);
        const positionEnCollision: THREE.Vector3 = new THREE.Vector3(0, 0, objetCollisionneurDynamique.position.z - 1);
        collisionneurDynamique.mouvement = positionEnCollision;
        expect(GESTIONNAIRE.estEnCollision(collisionneurDynamique)).toEqual(true);
        GESTIONNAIRE.resoudreCollision(positionEnCollision);
        objetCollisionneurDynamique.position.set(positionEnCollision.x, positionEnCollision.y, positionEnCollision.z);
        expect(GESTIONNAIRE.estEnCollision(collisionneurDynamique)).toEqual(false);
    });
});
