import * as THREE from "three";
import { GenerateurScene } from "./generateur-scene";

import { Cone } from "../objet3-d/cone";
import { Cube } from "../objet3-d/cube";
import { Cylindre } from "../objet3-d/cylindre";
import { Objet3D, Proprietes } from "../objet3-d/objet3-d";
import { Pyramide } from "../objet3-d/pyramide";
import { Sphere } from "../objet3-d/sphere";

const NOMS_FORMES: string[] = ["Sphere",
                               "Cube",
                               "Cone",
                               "Cylindre",
                               "Pyramide"];
const COULEUR_FOND: number = 0xCAFEFA;

export class GenerateurGeometrique extends GenerateurScene {

    public constructor() {
        super();
    }
    protected genererProprietes(): Proprietes {
        return this.genererProprieteBase(NOMS_FORMES[this.genererNombreEntier(0, NOMS_FORMES.length - 1)]);
    }

    protected ajouterOriginal(propriete: Proprietes, scene: THREE.Scene): void {
        scene.background = new THREE.Color(COULEUR_FOND);
        if (!propriete.Ajout) {
            const forme: Objet3D = this.chargerObjet(propriete);
            this.ajouter(forme, scene);
        }
    }

    protected ajouterModifie(propriete: Proprietes, scene: THREE.Scene): void {
        scene.background = new THREE.Color(COULEUR_FOND);
        if (!propriete.Retrait) {
            const forme: Objet3D = (propriete.ModCouleur ? this.chargerObjetModifie(propriete) :
                                                           this.chargerObjet(propriete));
            this.ajouter(forme, scene);
        }
    }

    protected ajouter(forme: Objet3D, scene: THREE.Scene): void {
        forme.ajouterDansUneScene(scene);
    }
    private chargerFormeGeometrique(couleur: number, propriete: Proprietes): Objet3D {
        switch (propriete.Forme) {
            case "Sphere":
                return new Sphere(propriete, couleur);
            case "Cube":
                return new Cube(propriete, couleur);
            case "Cone":
                return new Cone(propriete, couleur);
            case "Cylindre":
                return new Cylindre(propriete, couleur);
            case "Pyramide":
                return new Pyramide(propriete, couleur);
            default:
                return new Cube(propriete, couleur);
        }
    }
    protected chargerObjet(propriete: Proprietes): Objet3D {
        return this.chargerFormeGeometrique(propriete.Couleur, propriete);
    }
    protected chargerObjetModifie(propriete: Proprietes): Objet3D {
        return this.chargerFormeGeometrique(propriete.CouleurAlt, propriete);
    }
}
