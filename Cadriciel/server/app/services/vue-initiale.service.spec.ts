import { assert } from "chai";
import "reflect-metadata";
import { VueInitialeService } from "./vue-initiale.service";

it("Devrait ajouter un utilisateur", (done: Function) => {
    // tslint:disable-next-line:no-console --> afin d'afficher dans le terminal à quel fichier du serveur nous sommes rendus pour les tests
    console.log("-----Test vue-initiale service-----");
    const vue: VueInitialeService = new VueInitialeService;
    vue.ajouterUtilisateur("Alex");
    assert.ok(vue.utilisateurs[0] === "Alex" );
    done();
});

it("Devrait ne pas ajouter un nom deja existant", (done: Function) => {
    const vue: VueInitialeService = new VueInitialeService;
    vue.ajouterUtilisateur("David");
    assert.ok(!vue.verifierConnexion("David"));
    done();
});

it("Devrait ajouter un nom non existant", (done: Function) => {
    const vue: VueInitialeService = new VueInitialeService;
    assert.ok(vue.verifierConnexion("Alex"));
    done();
});

it("Devrait deconnecter un utilisateur existant", (done: Function) => {
    const vue: VueInitialeService = new VueInitialeService;
    vue.ajouterUtilisateur("David");
    assert.ok(vue.deconnecterUtilisateur("David"));
    done();
});

it("Devrait retourner faux pour la deconnection d'un utilisateur non existant", (done: Function) => {
    const vue: VueInitialeService = new VueInitialeService;
    assert.ok(!vue.deconnecterUtilisateur("Alex"));
    done();
});
