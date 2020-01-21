import { assert } from "chai";
import "reflect-metadata";
import { PartiesMultijoueur } from "./partieMultijoueur";

let parties: PartiesMultijoueur;
const ID1: number = 1;

beforeEach( () => {
    parties = new PartiesMultijoueur;
});

it("Devrait ajouter l'id d'une partieSimple non creee", () => {
    // tslint:disable-next-line:no-console --> afin d'afficher dans le terminal à quel fichier du serveur nous sommes rendu pour les tests
    console.log("-----Test PartiesMultijoueur-----");
    assert.isTrue(parties.ajouterIdSimple(ID1));
});

it("Devrait pas ajouter l'id d'une partieSimple deja creee", () => {
    parties.ajouterIdSimple(ID1);
    assert.isTrue(!parties.ajouterIdSimple(ID1));
});

it("Devrait ajouter l'id d'une partieLibre non creee", () => {
    assert.isTrue(parties.ajouterIdLibre(ID1));
});

it("Devrait pas ajouter l'id d'une partieLibre deja creee", () => {
    parties.ajouterIdLibre(ID1);
    assert.isTrue(!parties.ajouterIdLibre(ID1));
});
