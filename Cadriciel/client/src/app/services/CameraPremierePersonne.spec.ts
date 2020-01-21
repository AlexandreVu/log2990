import * as THREE from "three";
import { CameraPremierePersonne, DISTANCE_MAXIMALE } from "./CameraPremierePersonne";

describe("CameraPremierePersonne", () => {
    const ASPECT_RATIO: number = 0.5;
    const NOMBRE_DE_MISES_A_JOUR: number = 10;
    let uneCamera: CameraPremierePersonne = new CameraPremierePersonne(ASPECT_RATIO);

    beforeEach(() => {
        uneCamera = new CameraPremierePersonne(ASPECT_RATIO);
    });
    it("Vérifie que l'on peut créer CameraPremierePersonne", () => {
        expect(uneCamera).toBeTruthy();
    });

    it("Devrait permettre de modifier sa rotation", () => {
        const rotationActiveeInitiale: boolean = uneCamera.rotationCameraActive;
        uneCamera.alternerActivationRotation(true);

        expect(uneCamera.rotationCameraActive).toEqual(!rotationActiveeInitiale);
    });
    it("Devrait permettre un mouvement unidirectionnel pour l'axe Y", () => {
        const rotationInitiale: THREE.Euler = uneCamera.camera.rotation.clone();
        uneCamera.rotationCameraActive = true;
        const positionInitialeSouris: MouseEvent = new MouseEvent("mousemove", {screenX: 1000, screenY: 433});
        const positionFinaleSouris: MouseEvent = new MouseEvent("mousemove", {screenX: 1328, screenY: 433});
        const movementX: number = positionInitialeSouris.screenX - positionFinaleSouris.screenX;
        uneCamera.effectuerRotation(movementX, 0);
        expect(rotationInitiale.y > uneCamera.camera.rotation.y).toEqual(true);
    });
    it("Devrait permettre un mouvement unidirectionnel pour l'axe X", () => {
        const rotationInitiale: THREE.Euler = uneCamera.camera.rotation.clone();
        uneCamera.rotationCameraActive = true;
        const positionInitialeSouris: MouseEvent = new MouseEvent("mousemove", {screenX: 1328, screenY: 100});
        const positionFinaleSouris: MouseEvent = new MouseEvent("mousemove", {screenX: 1328, screenY: 433});
        const movementY: number = positionInitialeSouris.screenY - positionFinaleSouris.screenY;
        uneCamera.effectuerRotation(0, movementY);
        expect(rotationInitiale.x > uneCamera.camera.rotation.x).toEqual(true);
    });
    it("Devrait permettre d'activer la translation avant avec la touche W", () => {
        const toucheEnfonceeW: KeyboardEvent = new KeyboardEvent("keydown", {key : "w"});
        const translationAvantActive: boolean = uneCamera.translationAvantActive;
        uneCamera.alternerActivationTranslation(toucheEnfonceeW, true);

        expect(uneCamera.translationAvantActive).toEqual(!translationAvantActive);
    });
    it("Devrait permettre d'activer la translation à gauche avec la touche A", () => {
        const toucheEnfonceeA: KeyboardEvent = new KeyboardEvent("keydown", {key : "a"});
        const translationGaucheActive: boolean = uneCamera.translationGaucheActive;
        uneCamera.alternerActivationTranslation(toucheEnfonceeA, true);

        expect(uneCamera.translationGaucheActive).toEqual(!translationGaucheActive);
    });
    it("Devrait permettre d'activer la translation arrière avec la touche S", () => {
        const toucheEnfonceeS: KeyboardEvent = new KeyboardEvent("keydown", {key : "s"});
        const translationArriereActive: boolean = uneCamera.translationArriereActive;
        uneCamera.alternerActivationTranslation(toucheEnfonceeS, true);

        expect(uneCamera.translationArriereActive).toEqual(!translationArriereActive);
    });
    it("Devrait permettre d'activer la translation à droite avec la touche D", () => {
        const toucheEnfonceeD: KeyboardEvent = new KeyboardEvent("keydown", {key : "d"});
        const translationDroiteActive: boolean = uneCamera.translationDroiteActive;
        uneCamera.alternerActivationTranslation(toucheEnfonceeD, true);

        expect(uneCamera.translationDroiteActive).toEqual(!translationDroiteActive);
    });
    it("Devrait activer aucune translation avec une touche autre que WASD", () => {
        const toucheEnfonceeQuelconque: KeyboardEvent = new KeyboardEvent("keydown", {key : "f"});
        const translationAvantActive: boolean = uneCamera.translationAvantActive;
        const translationGaucheActive: boolean = uneCamera.translationGaucheActive;
        const translationArriereActive: boolean = uneCamera.translationArriereActive;
        const translationDroiteActive: boolean = uneCamera.translationDroiteActive;
        uneCamera.alternerActivationTranslation(toucheEnfonceeQuelconque, true);

        expect(uneCamera.translationAvantActive).toEqual(translationAvantActive);
        expect(uneCamera.translationGaucheActive).toEqual(translationGaucheActive);
        expect(uneCamera.translationArriereActive).toEqual(translationArriereActive);
        expect(uneCamera.translationDroiteActive).toEqual(translationDroiteActive);
    });
    it("Devrait avancer avec la touche W", () => {
        const toucheEnfonceeW: KeyboardEvent = new KeyboardEvent("keydown", {key : "w"});
        const positionInitiale: THREE.Vector3 = uneCamera.camera.position.clone();
        uneCamera.alternerActivationTranslation(toucheEnfonceeW, true);
        uneCamera.miseAJour();

        expect(positionInitiale.z > uneCamera.camera.position.z).toEqual(true);
    });
    it("Devrait aller à gauche avec la touche A", () => {
        const toucheEnfonceeA: KeyboardEvent = new KeyboardEvent("keydown", {key : "a"});
        const positionInitiale: THREE.Vector3 = uneCamera.camera.position.clone();
        uneCamera.alternerActivationTranslation(toucheEnfonceeA, true);
        uneCamera.miseAJour();

        expect(positionInitiale.x > uneCamera.camera.position.x).toEqual(true);
    });
    it("Devrait reculer avec la touche S", () => {
        const toucheEnfonceeS: KeyboardEvent = new KeyboardEvent("keydown", {key : "s"});
        const positionInitiale: THREE.Vector3 = uneCamera.camera.position.clone();
        uneCamera.alternerActivationTranslation(toucheEnfonceeS, true);
        uneCamera.miseAJour();

        expect(positionInitiale.z < uneCamera.camera.position.z).toEqual(true);
    });
    it("Devrait aller à droite avec la touche D", () => {
        const toucheEnfonceeA: KeyboardEvent = new KeyboardEvent("keydown", {key : "d"});
        const positionInitiale: THREE.Vector3 = uneCamera.camera.position.clone();
        uneCamera.alternerActivationTranslation(toucheEnfonceeA, true);
        uneCamera.miseAJour();

        expect(positionInitiale.x < uneCamera.camera.position.x).toEqual(true);
    });
    it("Devrait demeurer immobile avec une touche autre que WASD", () => {
        const toucheEnfonceeQuelconque: KeyboardEvent = new KeyboardEvent("keydown", {key : "f"});
        const positionInitiale: THREE.Vector3 = uneCamera.camera.position.clone();
        uneCamera.alternerActivationTranslation(toucheEnfonceeQuelconque, true);
        uneCamera.miseAJour();

        expect(positionInitiale.x).toEqual(uneCamera.camera.position.x);
        expect(positionInitiale.y).toEqual(uneCamera.camera.position.y);
        expect(positionInitiale.z).toEqual(uneCamera.camera.position.z);
    });
    it("Devrait rester à une certaine distance du centre", () => {
        const toucheEnfonceeW: KeyboardEvent = new KeyboardEvent("keydown", {key : "w"});
        uneCamera.position = new THREE.Vector3(0, 0, DISTANCE_MAXIMALE);
        uneCamera.alternerActivationTranslation(toucheEnfonceeW, true);
        for (let i: number = 0; i < NOMBRE_DE_MISES_A_JOUR; i++) {
            uneCamera.miseAJour();
        }
        expect(uneCamera.position.length()).toBeLessThanOrEqual(DISTANCE_MAXIMALE);
    });
});
