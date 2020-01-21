import { assert } from "chai";
import "reflect-metadata";
import { PartieLibre } from "../../../client/src/app/PartieLibre";
import { GenerateurScene } from "../../../client/src/app/generateur-scene/generateur-scene";
import { Proprietes } from "../../../client/src/app/objet3-d/objet3-d";
import { IdentificationDifferencesLibre } from "./identification-differences-libre";

const partie: PartieLibre = new PartieLibre(0, "nomPartie");
let objDiff: Proprietes;
let objNonDiff: Proprietes;
let service: IdentificationDifferencesLibre;

before(async () => {
    service = new IdentificationDifferencesLibre();
    objDiff = {
        Forme: "Cube",
        Rayon: 0,
        Hauteur: 2,
        Position: GenerateurScene.creerVector3(-1, 0, 1),
        Rotation: GenerateurScene.creerVector3(0, 0, 0),
        Couleur: 0,
        Ajout: true,
        Retrait: false,
        ModCouleur: false,
        CouleurAlt: 0,
    };
    objNonDiff = {
        Forme: "Cylindre",
        Rayon: 1,
        Hauteur: 2,
        Position: GenerateurScene.creerVector3(1, 0, -1),
        Rotation: GenerateurScene.creerVector3(0, 0, 0),
        Couleur: 0,
        Ajout: false,
        Retrait: false,
        ModCouleur: false,
        CouleurAlt: 0,
    };
    partie.listeObjets.liste.push(objDiff);
    partie.listeObjets.liste.push(objNonDiff);
});

it("Devrait trouver une différence lorsqu'on clique sur un objet différent", () => {
    // tslint:disable-next-line:no-console --> afin d'afficher dans le terminal à quel fichier du serveur nous sommes rendus pour les tests
    console.log("-----Test identification differences libres-----");
    const trouve: boolean = service.differenceExiste(partie, objDiff.Position.x, objDiff.Position.y, objDiff.Position.z);

    assert.isTrue(trouve, "Devrait avoir trouvé la différence");
});

it("Ne devrait pas trouver de différence lorsqu'on ne clique pas sur un objet", () => {
    const trouve: boolean = service.differenceExiste(partie, 0, 0, 0);

    assert.isFalse(trouve, "Ne devrait pas avoir trouvé la différence");
});

it("Ne devrait pas trouver de différence lorsque l'objet clické n'a pas de différence", () => {
    const trouve: boolean = service.differenceExiste(partie, objNonDiff.Position.x, objNonDiff.Position.y, objNonDiff.Position.z);

    assert.isFalse(trouve, "Ne devrait pas avoir trouvé de différence");
});
