import * as THREE from "three";
import { Modele3D } from "../objet3-d/modele3d";
import { Proprietes } from "../objet3-d/objet3-d";
import { GenerateurScene } from "./generateur-scene";

const COULEUR_ALIEN: number = 0x41CC4A;
const COULEUR_ALIEN_ALT: number = 0x79B7B4;
const COULEUR_AMIRAL: number = 0x772915;
const COULEUR_AMIRAL_ALT: number = 0x961885;
const COULEUR_COMET: number = 0x00FFF6;
const COULEUR_COMET_ALT: number = 0x008CFF;
const COULEUR_ROCHE: number = 0xA57548;
const COULEUR_ROCHE_ALT: number = 0xD86D08;
const COULEUR_SATELLITE: number = 0xB7B7B7;
const COULEUR_SATELLITE_ALT: number = 0xFFFFFF;
const COULEUR_FOND: number = 0x343F4F;
const DECALAGE_JUPITER_X: number = 2400;
const DECALAGE_JUPITER_Y: number = 400;
const POSITION_DECALAGE: number = 650;
const NOMBRE_COMET_MAX: number = 4;
const NOMBRE_JUPITER_MAX: number = 1;
const NOMBRE_SATELLITE_MAX: number = 5;
const NOMBRE_VAISSEAU_AMIRAL_MAX: number = 2;
const NOMBRE_VAISSEAU_MAITRE_ALIEN_MAX: number = 3;
const TAILLE_COMET: number = 0.5;
const TAILLE_VAISSEAU_COMBAT: number = 0.5;

const NOMS_MODELES: string[] = ["VaisseauCombat",
                                "Asteroide",
                                "AsteroideB",
                                "Alien",
                                "VaisseauAlien",
                                "VaisseauAmiral",
                                "VaisseauMaitreAlien",
                                "Satellite",
                                "Comet",
                                "Jupiter"];

export class GenerateurThematique extends GenerateurScene {
    private nombreCometConstruits: number;
    private nombreJupiterConstruits: number;
    private nombreSatellitesConstruits: number;
    private nombreVaisseauAmiralConstruits: number;
    private nombreVaisseauMaitreAlienConstruits: number;
    public constructor() {
        super();
        this.nombreCometConstruits = 0;
        this.nombreJupiterConstruits = 0;
        this.nombreSatellitesConstruits = 0;
        this.nombreVaisseauAmiralConstruits = 0;
        this.nombreVaisseauMaitreAlienConstruits = 0;
    }
    public getNombreModeles(): number {
        return NOMS_MODELES.length;
    }
    private estMembreFlotteHumaine(nomModele: string): boolean {
        return nomModele === "VaisseauCombat" || nomModele === "VaisseauAmiral";
    }
    private estMembreFlotteAlien(nomModele: string): boolean {
        return nomModele === "Alien" || nomModele === "VaisseauAlien" || nomModele === "VaisseauMaitreAlien";
    }
    private estUnDecor(nomModele: string): boolean {
        return nomModele === "Asteroide" || nomModele === "AsteroideB" ||
               nomModele === "Satellite" || nomModele === "Comet" || nomModele === "Jupiter";
    }
    private donnerCouleur(propriete: Proprietes, couleur: number, couleurAlt: number): void {
        propriete.Couleur = couleur;
        propriete.CouleurAlt = couleurAlt;
    }
    private genererProprieteHumains(propriete: Proprietes): void {
        propriete.Rotation = new THREE.Vector3(0, 0, 0);
        propriete.Position = new THREE.Vector3(propriete.Position.x, propriete.Position.y, propriete.Position.z - POSITION_DECALAGE);
        if (this.nombreVaisseauAmiralConstruits < NOMBRE_VAISSEAU_AMIRAL_MAX) {
            propriete.Forme = "VaisseauAmiral";
            propriete.Hauteur = this.genererTaille();
            propriete.Rotation = new THREE.Vector3(0, Math.PI, 0);
            this.donnerCouleur(propriete, COULEUR_AMIRAL, COULEUR_AMIRAL_ALT);
            this.nombreVaisseauAmiralConstruits++;
        } else {
            if (propriete.Forme.valueOf() === "VaisseauAmiral") {
                propriete.Forme = "VaisseauCombat";
            }
            if (propriete.Forme.valueOf() === "VaisseauCombat") {
                propriete.Hauteur = this.genererTaille() * TAILLE_VAISSEAU_COMBAT;
            }
        }
    }
    private genererProprieteAlien(propriete: Proprietes): void {
        propriete.Rotation = new THREE.Vector3(0, 0, 0);
        propriete.Position = new THREE.Vector3(propriete.Position.x, propriete.Position.y, propriete.Position.z + POSITION_DECALAGE);
        this.donnerCouleur(propriete, COULEUR_ALIEN, COULEUR_ALIEN_ALT);
        if (this.nombreVaisseauMaitreAlienConstruits < NOMBRE_VAISSEAU_MAITRE_ALIEN_MAX) {
            propriete.Forme = "VaisseauMaitreAlien";
            this.nombreVaisseauMaitreAlienConstruits++;
        } else {
            if (propriete.Forme.valueOf() === "VaisseauMaitreAlien") {
                propriete.Forme = "VaisseauAlien";
            }
        }
    }
    private genererProprieteDecor(propriete: Proprietes): void {
        this.donnerCouleur(propriete, COULEUR_ROCHE, COULEUR_ROCHE_ALT);
        if (propriete.Forme.valueOf() === "Satellite" && this.nombreSatellitesConstruits < NOMBRE_SATELLITE_MAX) {
            propriete.Rotation = new THREE.Vector3(0, propriete.Rotation.y, 0);
            this.donnerCouleur(propriete, COULEUR_SATELLITE, COULEUR_SATELLITE_ALT);
            this.nombreSatellitesConstruits++;
        } else {
            if (propriete.Forme.valueOf() === "Comet" && this.nombreCometConstruits < NOMBRE_COMET_MAX) {
                propriete.Rotation = new THREE.Vector3(propriete.Rotation.x, 0, 0);
                this.donnerCouleur(propriete, COULEUR_COMET, COULEUR_COMET_ALT);
                this.nombreCometConstruits++;
            } else {
                if (propriete.Forme.valueOf() === "Jupiter" && this.nombreJupiterConstruits < NOMBRE_JUPITER_MAX) {
                    propriete.Rotation = new THREE.Vector3(0, Math.PI * TAILLE_COMET, 0);
                    propriete.Position = new THREE.Vector3(- DECALAGE_JUPITER_X, - DECALAGE_JUPITER_Y, 0);
                    this.donnerCouleur(propriete, COULEUR_COMET, COULEUR_COMET_ALT);
                    this.nombreJupiterConstruits++;
                } else {
                    if (propriete.Forme.valueOf() === "Comet" || propriete.Forme.valueOf() === "Satellite" ||
                        propriete.Forme.valueOf() === "Jupiter") {
                        propriete.Forme = "Asteroide";
                    }
                }
            }
        }
    }
    private appliquerThematique(propriete: Proprietes): void {
        if (this.estMembreFlotteHumaine(propriete.Forme.valueOf())) {
            this.genererProprieteHumains(propriete);
        }
        if (this.estMembreFlotteAlien(propriete.Forme.valueOf())) {
            this.genererProprieteAlien(propriete);
        }
        if (this.estUnDecor(propriete.Forme.valueOf())) {
            this.genererProprieteDecor(propriete);
        }

    }
    protected genererProprietes(): Proprietes {
        const propriete: Proprietes = this.genererProprieteBase(NOMS_MODELES[this.genererNombreEntier(0, NOMS_MODELES.length - 1)]);
        this.appliquerThematique(propriete);

        return propriete;
    }
    protected ajouterOriginal(propriete: Proprietes, scene: THREE.Scene): void {
        scene.background = new THREE.Color(COULEUR_FOND);
        if (!propriete.Ajout) {
            this.chargerObjet(propriete, scene);
        }
    }
    protected ajouterModifie(propriete: Proprietes, scene: THREE.Scene): void {
        scene.background = new THREE.Color(COULEUR_FOND);
        if (!propriete.Retrait) {
            (propriete.ModCouleur ? this.chargerObjetModifie(propriete, scene) :
                                    this.chargerObjet(propriete, scene));
        }
    }
    private chargerModele(couleur: number, propriete: Proprietes, scene: THREE.Scene): Modele3D {
        return new Modele3D(propriete, couleur, scene);
    }
    protected chargerObjet(propriete: Proprietes, scene: THREE.Scene): Modele3D {
        return this.chargerModele(propriete.Couleur, propriete, scene);
    }
    protected chargerObjetModifie(propriete: Proprietes, scene: THREE.Scene): Modele3D {
        return this.chargerModele(propriete.CouleurAlt, propriete, scene);
    }
}
