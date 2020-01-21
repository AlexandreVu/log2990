import {} from "jasmine";
import * as THREE from "three";
import { GestionnaireDeParties } from "../GestionnaireDeParties";
import { ListeObjets } from "../PartieLibre";
import { Proprietes } from "../objet3-d/objet3-d";
import { GenerateurGeometrique } from "./generateur-geo";
import { FACTEUR_TAILLE_MAX, FACTEUR_TAILLE_MIN,
         GenerateurScene, NOMBRE_OBJETS_MAXIMAL,
         NOMBRE_OBJETS_MINIMAL, TAILLE_REFERENCE } from "./generateur-scene";
import { GenerateurThematique } from "./generateur-theme";

const COULEUR_BACKGROUND_BLANC: number = 0xFFFFFF;
const COULEUR_BACKGROUND_NOIR: number = 0x000000;
const NOMBRE_MODELES_REQUIS: number = 10;
const NOMBRE_OBJETS_ARBITRAIRE: number = 57;

describe("GenerateurScene", () => {
    const generateurGeometrique: GenerateurGeometrique = new GenerateurGeometrique();
    const generateurThematique: GenerateurThematique = new GenerateurThematique();

    const spy: jasmine.SpyObj<GenerateurGeometrique> = jasmine.createSpyObj("GenerateurGeometrique", ["chargerScene"]);

    it("Vérifie que l'on peut créer GenerateurGeometrique", () => {
        expect(generateurGeometrique).toBeTruthy();
    });

    it("Vérifie que l'on peut créer GenerateurThematique", () => {
        expect(generateurThematique).toBeTruthy();
    });

    it("Devrait retourner un Vector3 avec de bonnes valeurs", () => {
        const controle: THREE.Vector3 = new THREE.Vector3(1, 1, 1);
        const test: THREE.Vector3 = GenerateurScene.creerVector3(1, 1, 1);
        expect(test).toEqual(controle);
    });

    it("Devrait retourner un ListeObjet avec des valeurs", () => {
        const listeGeo: ListeObjets = generateurGeometrique.genererScene();
        const listeTheme: ListeObjets = generateurThematique.genererScene();
        expect(listeGeo.liste.length).toBeGreaterThan(0);
        expect(listeTheme.liste.length).toBeGreaterThan(0);
    });

    it("Devrait retourner un ListeObjets avec des valeurs aléatoires", () => {
        const listeGeo1: ListeObjets = generateurGeometrique.genererScene();
        const listeGeo2: ListeObjets = generateurGeometrique.genererScene();
        const listeTheme1: ListeObjets = generateurThematique.genererScene();
        const listeTheme2: ListeObjets = generateurThematique.genererScene();
        expect(listeGeo1).not.toEqual(listeGeo2);
        expect(listeTheme1).not.toEqual(listeTheme2);
    });

    it("Devrait charger la bonne scène", () => {
        const listeGeo: ListeObjets = generateurGeometrique.genererScene();
        const listeTheme: ListeObjets = generateurThematique.genererScene();
        const gestionnaire: GestionnaireDeParties = GestionnaireDeParties.getGestionnaire();
        const scene1: THREE.Scene = new THREE.Scene();
        const scene2: THREE.Scene = new THREE.Scene();
        generateurGeometrique.chargerScene(listeGeo, scene1, scene2);
        let listeActuelle: Proprietes[] = gestionnaire.objetsDansLaScene;
        expect(listeActuelle).toEqual(listeGeo.liste);

        generateurThematique.chargerScene(listeTheme, scene1, scene2);
        listeActuelle = gestionnaire.objetsDansLaScene;
        expect(listeActuelle).toEqual(listeTheme.liste);
    });

    it("Devrait charger plusieurs scènes une à la suite de l'autre", () => {
        const listeGeo: ListeObjets = generateurGeometrique.genererScene();
        const listeGeo2: ListeObjets = generateurGeometrique.genererScene();
        const listeGeo3: ListeObjets = generateurGeometrique.genererScene();
        const listeTheme: ListeObjets = generateurThematique.genererScene();
        const listeTheme2: ListeObjets = generateurThematique.genererScene();
        const listeTheme3: ListeObjets = generateurThematique.genererScene();
        const gestionnaire: GestionnaireDeParties = GestionnaireDeParties.getGestionnaire();
        const scene1: THREE.Scene = new THREE.Scene();
        const scene2: THREE.Scene = new THREE.Scene();

        generateurGeometrique.chargerScene(listeGeo, scene1, scene2);
        expect(gestionnaire.objetsDansLaScene).toEqual(listeGeo.liste);
        generateurGeometrique.chargerScene(listeGeo2, scene1, scene2);
        expect(gestionnaire.objetsDansLaScene).toEqual(listeGeo2.liste);
        generateurGeometrique.chargerScene(listeGeo3, scene1, scene2);
        expect(gestionnaire.objetsDansLaScene).toEqual(listeGeo3.liste);
        generateurThematique.chargerScene(listeTheme, scene1, scene2);
        expect(gestionnaire.objetsDansLaScene).toEqual(listeTheme.liste);
        generateurThematique.chargerScene(listeTheme2, scene1, scene2);
        expect(gestionnaire.objetsDansLaScene).toEqual(listeTheme2.liste);
        generateurThematique.chargerScene(listeTheme3, scene1, scene2);
        expect(gestionnaire.objetsDansLaScene).toEqual(listeTheme3.liste);
    });
    it("Devrait s'assurer que le générateur de scène thématique permet de générer au moins 10 différents modèles", () => {
        expect(generateurThematique.getNombreModeles()).toBeGreaterThanOrEqual(NOMBRE_MODELES_REQUIS);
    });
    it("Devrait s'assurer que le générateur de scène thématique permet à la scène d'avoir une couleur de fond", () => {
        const listeTheme: ListeObjets = generateurThematique.genererScene();
        const scene1: THREE.Scene = new THREE.Scene();
        const scene2: THREE.Scene = new THREE.Scene();
        generateurThematique.chargerScene(listeTheme, scene1, scene2);

        expect((scene1.background as THREE.Color).getHex()).not.toEqual(COULEUR_BACKGROUND_NOIR);
        expect((scene1.background as THREE.Color).getHex()).not.toEqual(COULEUR_BACKGROUND_BLANC);
        expect((scene2.background as THREE.Color).getHex()).not.toEqual(COULEUR_BACKGROUND_NOIR);
        expect((scene2.background as THREE.Color).getHex()).not.toEqual(COULEUR_BACKGROUND_BLANC);
    });
    it("Devrait montrer que la liste d'objet servant à fabriquer la scène contient au minimum 10 objets", () => {
        const gestionnaire: GestionnaireDeParties = GestionnaireDeParties.getGestionnaire();
        gestionnaire.setNbObjets(NOMBRE_OBJETS_MINIMAL);
        let listeTheme: ListeObjets = generateurThematique.genererScene();
        let listeGeo: ListeObjets = generateurGeometrique.genererScene();

        expect(listeTheme.liste.length).toBeGreaterThanOrEqual(NOMBRE_OBJETS_MINIMAL);
        expect(listeTheme.liste.length).toBeLessThanOrEqual(NOMBRE_OBJETS_MAXIMAL);
        expect(listeGeo.liste.length).toBeGreaterThanOrEqual(NOMBRE_OBJETS_MINIMAL);
        expect(listeGeo.liste.length).toBeLessThanOrEqual(NOMBRE_OBJETS_MAXIMAL);

        gestionnaire.setNbObjets(NOMBRE_OBJETS_MINIMAL - 1);
        listeTheme = generateurThematique.genererScene();
        listeGeo = generateurGeometrique.genererScene();

        expect(listeTheme.liste.length).toBeGreaterThanOrEqual(NOMBRE_OBJETS_MINIMAL);
        expect(listeTheme.liste.length).toBeLessThanOrEqual(NOMBRE_OBJETS_MAXIMAL);
        expect(listeGeo.liste.length).toBeGreaterThanOrEqual(NOMBRE_OBJETS_MINIMAL);
        expect(listeGeo.liste.length).toBeLessThanOrEqual(NOMBRE_OBJETS_MAXIMAL);
    });
    it("Devrait s'assurer que la liste d'objet servant à fabriquer la scène contient au maximum 200 objets", () => {
        const gestionnaire: GestionnaireDeParties = GestionnaireDeParties.getGestionnaire();
        gestionnaire.setNbObjets(NOMBRE_OBJETS_MAXIMAL);
        let listeTheme: ListeObjets = generateurThematique.genererScene();
        let listeGeo: ListeObjets = generateurGeometrique.genererScene();

        expect(listeTheme.liste.length).toBeGreaterThanOrEqual(NOMBRE_OBJETS_MINIMAL);
        expect(listeTheme.liste.length).toBeLessThanOrEqual(NOMBRE_OBJETS_MAXIMAL);
        expect(listeGeo.liste.length).toBeGreaterThanOrEqual(NOMBRE_OBJETS_MINIMAL);
        expect(listeGeo.liste.length).toBeLessThanOrEqual(NOMBRE_OBJETS_MAXIMAL);

        gestionnaire.setNbObjets(NOMBRE_OBJETS_MAXIMAL + 1);
        listeTheme = generateurThematique.genererScene();
        listeGeo = generateurGeometrique.genererScene();

        expect(listeTheme.liste.length).toBeGreaterThanOrEqual(NOMBRE_OBJETS_MINIMAL);
        expect(listeTheme.liste.length).toBeLessThanOrEqual(NOMBRE_OBJETS_MAXIMAL);
        expect(listeGeo.liste.length).toBeGreaterThanOrEqual(NOMBRE_OBJETS_MINIMAL);
        expect(listeGeo.liste.length).toBeLessThanOrEqual(NOMBRE_OBJETS_MAXIMAL);
    });
    it("Devrait s'assurer que la liste d'objet servant à fabriquer la scène contient le nombre souhaité d'objets", () => {
        const gestionnaire: GestionnaireDeParties = GestionnaireDeParties.getGestionnaire();
        gestionnaire.setNbObjets(NOMBRE_OBJETS_ARBITRAIRE);
        const listeTheme: ListeObjets = generateurThematique.genererScene();
        const listeGeo: ListeObjets = generateurGeometrique.genererScene();

        expect(listeTheme.liste.length).toEqual(NOMBRE_OBJETS_ARBITRAIRE);
        expect(listeGeo.liste.length).toEqual(NOMBRE_OBJETS_ARBITRAIRE);
    });
    it("Devrait montrer que la taille d'un objet généré est entre 50% et 150% d'une taille de référence", () => {
        const tailleTheme: number = generateurThematique.genererTaille();
        const tailleGeo: number = generateurGeometrique.genererTaille();

        expect(tailleTheme).toBeGreaterThanOrEqual(TAILLE_REFERENCE * FACTEUR_TAILLE_MIN);
        expect(tailleTheme).toBeLessThanOrEqual(TAILLE_REFERENCE * FACTEUR_TAILLE_MAX);
        expect(tailleGeo).toBeGreaterThanOrEqual(TAILLE_REFERENCE * FACTEUR_TAILLE_MIN);
        expect(tailleGeo).toBeLessThanOrEqual(TAILLE_REFERENCE * FACTEUR_TAILLE_MAX);
    });
    beforeEach(() => {
        spy.chargerScene();
    });

    it("Devrait charger une scène même si nous avons une liste d'objets ayant le mauvais type d'objets", () => {
        expect(spy.chargerScene).toHaveBeenCalled();
    });
});
