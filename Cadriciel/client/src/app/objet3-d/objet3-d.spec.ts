import * as THREE from "three";
import { Cone } from "./cone";
import { Cube } from "./cube";
import { Cylindre } from "./cylindre";
import { Objet3D, Proprietes } from "./objet3-d";
import { Pyramide } from "./pyramide";
import { Sphere } from "./sphere";

describe("Objet3D", () => {
    const ROTATION_DE_REFERENCE: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const POSITION_DE_REFERENCE: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
    const COULEUR: number = 0xFFFFFF;
    const TAILLE: number = 30;
    const proprietes: Proprietes = {
        Forme: "",
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
    const UN_CUBE: Objet3D = new Cube(proprietes, COULEUR);

    const UNE_SPHERE: Objet3D = new Sphere(proprietes, COULEUR);

    const UN_CONE: Objet3D = new Cone(proprietes, COULEUR);

    const UN_CYLINDRE: Objet3D = new Cylindre(proprietes, COULEUR);

    const UNE_PYRAMIDE: Objet3D = new Pyramide(proprietes, COULEUR);

    it("Vérifie que l'on peut créer Cube", () => {
        expect(UN_CUBE).toBeTruthy();
    });

    it("Vérifie qu'un cube a une géométrie", () => {
        expect(UN_CUBE.getMesh()).toBeDefined();
    });

    it("Vérifie qu'un cube a des face outlines", () => {
        expect(UN_CUBE.getDemarcationFace()).toBeDefined();
    });

    it("Vérifie qu'un cuve a un shape outline", () => {
        expect(UN_CUBE.getDemarcationForme()).toBeDefined();
    });

    it("Vérifie qu'un cube soit à la bonne position", () => {
        expect(UN_CUBE.getMesh().position).toEqual(POSITION_DE_REFERENCE);
        expect(UN_CUBE.getDemarcationFace().position).toEqual(POSITION_DE_REFERENCE);
        expect(UN_CUBE.getDemarcationForme().position).toEqual(POSITION_DE_REFERENCE);
    });

    it("Vérifie qu'un cube a le bon angle de rotation", () => {
        expect(UN_CUBE.getMesh().rotation.toVector3()).toEqual(ROTATION_DE_REFERENCE);
        expect(UN_CUBE.getDemarcationFace().rotation.toVector3()).toEqual(ROTATION_DE_REFERENCE);
        expect(UN_CUBE.getDemarcationForme().rotation.toVector3()).toEqual(ROTATION_DE_REFERENCE);
    });

    it("Vérifie qu'un cube a la bonne taille", () => {
        const geo: THREE.BoxGeometry = UN_CUBE.getMesh().geometry as THREE.BoxGeometry;
        expect(geo.parameters.width).toEqual(TAILLE);
        expect(geo.parameters.height).toEqual(TAILLE);
        expect(geo.parameters.depth).toEqual(TAILLE);
    });

    it("Vérifie que l'on peut créer Sphere", () => {
        expect(UNE_SPHERE).toBeTruthy();
    });

    it("Vérifie qu'une sphère a une géométrie", () => {
        expect(UNE_SPHERE.getMesh()).toBeDefined();
    });

    it("Vérifie qu'une sphère a des face outlines", () => {
        expect(UNE_SPHERE.getDemarcationFace()).toBeDefined();
    });

    it("Vérifie qu'une sphère a une shape outline", () => {
        expect(UNE_SPHERE.getDemarcationForme()).toBeDefined();
    });

    it("Vérifie qu'une sphère soit à la bonne position", () => {
        expect(UNE_SPHERE.getMesh().position).toEqual(POSITION_DE_REFERENCE);
        expect(UNE_SPHERE.getDemarcationFace().position).toEqual(POSITION_DE_REFERENCE);
        expect(UNE_SPHERE.getDemarcationForme().position).toEqual(POSITION_DE_REFERENCE);
    });

    it("Vérifie qu'une sphère a le bon angle de rotation", () => {
        expect(UNE_SPHERE.getMesh().rotation.toVector3()).toEqual(ROTATION_DE_REFERENCE);
        expect(UNE_SPHERE.getDemarcationFace().rotation.toVector3()).toEqual(ROTATION_DE_REFERENCE);
        expect(UNE_SPHERE.getDemarcationForme().rotation.toVector3()).toEqual(ROTATION_DE_REFERENCE);
    });

    it("Vérifie qu'une sphère a la bonne taille", () => {
        const geo: THREE.SphereGeometry = UNE_SPHERE.getMesh().geometry as THREE.SphereGeometry;
        expect(geo.parameters.radius).toEqual(TAILLE);
    });

    it("Vérifie que l'on peut créer Cone", () => {
        expect(UN_CONE).toBeTruthy();
    });

    it("Vérifie qu'un cône a une géométrie", () => {
        expect(UN_CONE.getMesh()).toBeDefined();
    });

    it("Vérifie qu'un cône a des face outlines", () => {
        expect(UN_CONE.getDemarcationFace()).toBeDefined();
    });

    it("Vérifie qu'un cône a un shape outline", () => {
        expect(UN_CONE.getDemarcationForme()).toBeDefined();
    });

    it("Vérifie qu'cône soit à la bonne position", () => {
        expect(UN_CONE.getMesh().position).toEqual(POSITION_DE_REFERENCE);
        expect(UN_CONE.getDemarcationFace().position).toEqual(POSITION_DE_REFERENCE);
        expect(UN_CONE.getDemarcationForme().position).toEqual(POSITION_DE_REFERENCE);
    });

    it("Vérifie qu'un cône a le bon angle de rotation", () => {
        expect(UN_CONE.getMesh().rotation.toVector3()).toEqual(ROTATION_DE_REFERENCE);
        expect(UN_CONE.getDemarcationFace().rotation.toVector3()).toEqual(ROTATION_DE_REFERENCE);
        expect(UN_CONE.getDemarcationForme().rotation.toVector3()).toEqual(ROTATION_DE_REFERENCE);
    });

    it("Vérifie qu'un cône a la bonne taille", () => {
        const geo: THREE.ConeGeometry = UN_CONE.getMesh().geometry as THREE.ConeGeometry;
        expect(geo.parameters.height).toEqual(TAILLE);
    });

    it("Vérifie que l'on peut créer Cylindre", () => {
        expect(UN_CYLINDRE).toBeTruthy();
    });

    it("Vérifie qu'une cylindre a une géométrie", () => {
        expect(UN_CYLINDRE.getMesh()).toBeDefined();
    });

    it("Vérifie qu'un cylindre a des face outlines", () => {
        expect(UN_CYLINDRE.getDemarcationFace()).toBeDefined();
    });

    it("Vérifie qu'un cylindre a un shape outline", () => {
        expect(UN_CYLINDRE.getDemarcationForme()).toBeDefined();
    });

    it("Vérifie qu'un cylindre soit à la bonne position", () => {
        expect(UN_CYLINDRE.getMesh().position).toEqual(POSITION_DE_REFERENCE);
        expect(UN_CYLINDRE.getDemarcationFace().position).toEqual(POSITION_DE_REFERENCE);
        expect(UN_CYLINDRE.getDemarcationForme().position).toEqual(POSITION_DE_REFERENCE);
    });

    it("Vérifie qu'un cylindre a le bon angle de rotation", () => {
        expect(UN_CYLINDRE.getMesh().rotation.toVector3()).toEqual(ROTATION_DE_REFERENCE);
        expect(UN_CYLINDRE.getDemarcationFace().rotation.toVector3()).toEqual(ROTATION_DE_REFERENCE);
        expect(UN_CYLINDRE.getDemarcationForme().rotation.toVector3()).toEqual(ROTATION_DE_REFERENCE);
    });

    it("Vérifie qu'un cylindre a la bonne taille", () => {
        const geo: THREE.CylinderGeometry = UN_CYLINDRE.getMesh().geometry as THREE.CylinderGeometry;
        expect(geo.parameters.height).toEqual(TAILLE);
        expect(geo.parameters.radiusBottom).toEqual(TAILLE);
    });

    it("Vérifie que l'on peut créer Pyramide", () => {
        expect(UNE_PYRAMIDE).toBeTruthy();
    });

    it("Vérifie qu'une pyramide a une géométrie", () => {
        expect(UNE_PYRAMIDE.getMesh()).toBeDefined();
    });

    it("Vérifie qu'une pyramide a des face outlines", () => {
        expect(UNE_PYRAMIDE.getDemarcationFace()).toBeDefined();
    });

    it("Vérifie qu'une pyramide a un shape outline", () => {
        expect(UNE_PYRAMIDE.getDemarcationForme()).toBeDefined();
    });

    it("Vérifie qu'une pyramide soit à la bonne position", () => {
        expect(UNE_PYRAMIDE.getMesh().position).toEqual(POSITION_DE_REFERENCE);
        expect(UNE_PYRAMIDE.getDemarcationFace().position).toEqual(POSITION_DE_REFERENCE);
        expect(UNE_PYRAMIDE.getDemarcationForme().position).toEqual(POSITION_DE_REFERENCE);
    });

    it("Vérifie qu'une pyramide a le bon angle de rotation", () => {
        expect(UNE_PYRAMIDE.getMesh().rotation.toVector3()).toEqual(ROTATION_DE_REFERENCE);
        expect(UNE_PYRAMIDE.getDemarcationFace().rotation.toVector3()).toEqual(ROTATION_DE_REFERENCE);
        expect(UNE_PYRAMIDE.getDemarcationForme().rotation.toVector3()).toEqual(ROTATION_DE_REFERENCE);
    });

    it("Vérifie qu'une pyramide a la bonne taille", () => {
        const geo: THREE.ConeGeometry = UNE_PYRAMIDE.getMesh().geometry as THREE.ConeGeometry;
        expect(geo.parameters.height).toEqual(TAILLE);
    });
});
