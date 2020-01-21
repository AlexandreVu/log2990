import * as THREE from "three";

import { Cube } from "../objet3-d/cube";
import { Proprietes } from "../objet3-d/objet3-d";
import { ModeTriche } from "./mode-triche";

const ROTATION_DE_REFERENCE: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
const POSITION_DE_REFERENCE: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
const COULEUR: number = 0xFFFFFF;
const TAILLE: number = 30;
const PROPRIETES: Proprietes = {
    Forme: "Cube",
    Rayon: TAILLE,
    Hauteur: TAILLE,
    Position: POSITION_DE_REFERENCE,
    Rotation: ROTATION_DE_REFERENCE,
    Couleur: COULEUR,
    Ajout: false,
    Retrait: false,
    ModCouleur: false,
    CouleurAlt: COULEUR,
};

describe("ModeTriche", () => {
    const sceneOriginale: THREE.Scene = new THREE.Scene();
    const sceneModifiee: THREE.Scene = new THREE.Scene();
    const modeTriche: ModeTriche = new ModeTriche(sceneOriginale, sceneModifiee);

    afterEach(() => {
        clearInterval(modeTriche.intervalle);
    });

    it("Vérifie que l'on peut créer ModeTriche", () => {
      expect(modeTriche).toBeTruthy();
    });

    it("Devrait avoir aucun objet à clignoter si le clignotement est déjà actif avec activerModeTriche()", () => {
        modeTriche.estActif = true;
        modeTriche.activerModeTriche();
        expect(modeTriche.objetsAClignoter.length).toEqual(0);
    });

    it("Devrait faire clignoter l'objet si le clignotement n'est pas déjà actif avec activerModeTriche()", () => {
        modeTriche.estActif = false;
        modeTriche.activerModeTriche();
        for (const objet of modeTriche.objetsAClignoter) {
          expect(objet.visible).toEqual(true);
        }
    });

    it("Devrait montrer que l'intervalle est bien initialisé", () => {
        modeTriche.estActif = true;
        spyOn(window, "setInterval").and.callThrough();

        modeTriche.activerModeTriche();

        expect(modeTriche.intervalle).toBeDefined();
        expect(window.setInterval).toHaveBeenCalled();
        expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), jasmine.any(Number));
    });

    it("Devrait rendre tous les objets invisible avec faireClignoterDifference()", () => {
      modeTriche.faireClignoterDifferences(false);
      for (const objet of modeTriche.objetsAClignoter) {
        expect(objet.visible).toEqual(false);
      }
    });

    it("Devrait trouver l'objet dans la scène originale et la scène modifiée", () => {
      sceneOriginale.add(new Cube(PROPRIETES, COULEUR).getMesh().clone());
      sceneModifiee.add(new Cube(PROPRIETES, COULEUR).getMesh().clone());
      const modeTricheObjets: ModeTriche = new ModeTriche(sceneOriginale, sceneModifiee);
      modeTricheObjets.estActif = true;
      modeTricheObjets.activerModeTriche();
      expect(modeTricheObjets.objetsAClignoter.length).toEqual(0);
    });

    it("Devrait faire clignoter l'objet dans la scène originale", () => {
      sceneOriginale.add(new Cube(PROPRIETES, COULEUR).getMesh().clone());
      const modeTricheObjets: ModeTriche = new ModeTriche(sceneOriginale, sceneModifiee);
      modeTricheObjets.estActif = true;
      modeTricheObjets.activerModeTriche();
      expect(modeTricheObjets.objetsAClignoter.length).toEqual(0);
    });
  });
