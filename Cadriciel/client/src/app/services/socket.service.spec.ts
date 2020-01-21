import { TestBed } from "@angular/core/testing";
import { Socket } from "ngx-socket-io";
import { of } from "rxjs";

import { Vector3 } from "three";
import { TypeDePartie } from "../Partie";
import { SocketService } from "./socket.service";

describe("SocketService", async() => {
  let service: SocketService;
  let socketSpy: jasmine.SpyObj<Socket>;

  const NOM: string = "Utilisateur";
  const NOM_JEU: string = "Test";
  const POSITION: number = 1;
  const NB_JOUEURS: number = 0;
  const ID: number = 0;
  const TYPE_PARTIE: string = "simple";

  beforeAll(() => {
    service = new SocketService();
  });

  beforeEach(async() => {
    socketSpy = jasmine.createSpyObj("Socket", ["emit", "on"]);
    service.initSocket();
  });

  beforeEach(async() => TestBed.configureTestingModule({
    providers: [
      {
        provide: Socket,
        useValue: socketSpy,
      },
    ],
  }));

  it("Vérifie que l'on peut créer SocketService", async() => {
    expect(service).toBeTruthy();
  });

  it("Devrait émettre vers le serveur la partie qui a été supprimée", async() => {
    socketSpy.emit("supprimerPartie", 0, "0");
    service.partieSupprimeeActualiser(0, "0");
    expect(socketSpy.emit).toHaveBeenCalledWith("supprimerPartie", 0, "0");
  });

  it("Devrait émettre vers le serveur le numéro de la salle à rejoindre", async() => {
    socketSpy.emit("joindre", 0, "0", true, "0");
    service.joindreSalle(0, "0", true, "0");
    expect(socketSpy.emit).toHaveBeenCalledWith("joindre", 0, "0", true, "0");
  });

  it("Devrait émettre vers le serveur le numéro de la salle à quitter", async() => {
    socketSpy.emit("quitter", 0, "", "0");
    service.quitterSalle(0, "", "0");
    expect(socketSpy.emit).toHaveBeenCalledWith("quitter", 0, "", "0");
  });

  it("Devrait recevoir du serveur la partie qui a été supprimée", async() => {
    socketSpy.on("supprimerPartie");
    service.onSupprimerPartie();
    expect(socketSpy.on).toHaveBeenCalledWith("supprimerPartie");
    socketSpy.on.and.returnValue(of(true));
    service.onSupprimerPartie().subscribe(
      (reponse: boolean) => {
        expect(reponse).toEqual(true);
      });
  });

  it("Devrait emettre vers le serveur le nom de l'utilisateur qui s'est connecte", async() => {
    socketSpy.emit("connexion", "Utilisateur");
    service.connexion("Utilisateur");
    expect(socketSpy.emit).toHaveBeenCalledWith("connexion", "Utilisateur");
  });

  it("Devrait recevoir le nom de l'utilisateur qui s'est connecte", async() => {
    socketSpy.on("connexion");
    service.onConnexion();
    expect(socketSpy.on).toHaveBeenCalledWith("connexion");
    socketSpy.on.and.returnValue("Utilisateur");
    service.onConnexion().subscribe(
      (reponse: string) => {
        expect(reponse).toEqual("Utilisateur");
      });
  });

  it("Devrait emettre vers le serveur le nom de l'utilisateur qui s'est deconnecte", async() => {
    socketSpy.emit("deconnexion", "Utilisateur");
    service.deconnexion("Utilisateur");
    expect(socketSpy.emit).toHaveBeenCalledWith("deconnexion", "Utilisateur");
    socketSpy.on.and.returnValue("Utilisateur");
    service.onDeconnexion().subscribe(
      (reponse: string) => {
        expect(reponse).toEqual("Utilisateur");
      });
  });

  it("Devrait recevoir le nom de l'utilisateur qui s'est deconnecte", async() => {
    socketSpy.on("deconnexion");
    service.onDeconnexion();
    expect(socketSpy.on).toHaveBeenCalledWith("deconnexion");
  });

  it("Devrait emettre les informations pour envoyer un score vers le serveur", async() => {
    socketSpy.emit("ajoutScore", NOM, NOM_JEU, POSITION, NB_JOUEURS);
    service.envoyerScore(NOM, NOM_JEU, POSITION, NB_JOUEURS);
    expect(socketSpy.emit).toHaveBeenCalledWith("ajoutScore", NOM, NOM_JEU, POSITION, NB_JOUEURS);
  });

  it("Devrait recevoir la phrase d'ajout de score dans le tableau", async() => {
    socketSpy.on("ajoutScore");
    service.onScore();
    expect(socketSpy.on).toHaveBeenCalledWith("ajoutScore");
    socketSpy.on.and.returnValue("PHRASE DECONNEXION");
    service.onScore().subscribe(
      (reponse: string) => {
        expect(reponse).toEqual("PHRASE DECONNEXION");
      });
  });

  it("Devrait émettre qu'un joueur en partie 1v1 a trouvé une différence vers le serveur", async() => {
    socketSpy.emit("differenceTrouvee", NOM, ID, TYPE_PARTIE);
    service.differenceTrouvee(NOM, ID, TYPE_PARTIE);
    expect(socketSpy.emit).toHaveBeenCalledWith("differenceTrouvee", NOM, ID, TYPE_PARTIE);
  });

  it("Devrait recevoir le nom du joueur ayant trouvé une différence et dans quelle partie il a trouvé l'erreur", async() => {
    socketSpy.on("differenceTrouvee");
    service.onDifferenceTrouvee();
    expect(socketSpy.on).toHaveBeenCalledWith("differenceTrouvee");
    socketSpy.on.and.returnValue("PHRASE DIFFÉRENCE TROUVÉE");
    service.onDifferenceTrouvee().subscribe(
      (reponse: string) => {
        expect(reponse).toEqual("PHRASE DIFFÉRENCE TROUVÉE");
      });
  });

  it("Devrait émettre qu'un joueur en partie 1v1 a fait une erreur vers le serveur", async() => {
    socketSpy.emit("erreurIdentification", NOM, ID, TYPE_PARTIE);
    service.erreurIdentification(NOM, ID, TYPE_PARTIE);
    expect(socketSpy.emit).toHaveBeenCalledWith("erreurIdentification", NOM, ID, TYPE_PARTIE);
  });

  it("Devrait recevoir le nom du joueur ayant fait une erreur et dans quelle partie il a fait une erreur", async() => {
    socketSpy.on("erreurIdentification");
    service.onErreurIdentification();
    expect(socketSpy.on).toHaveBeenCalledWith("erreurIdentification");
    socketSpy.on.and.returnValue("PHRASE ERREUR");
    service.onErreurIdentification().subscribe(
      (reponse: string) => {
        expect(reponse).toEqual("PHRASE ERREUR");
      });
  });
  it("Dervait effectuer une demande de connexion", () => {
    socketSpy.emit("demandeConnexion");
    service.demandeConnexion();
    expect(socketSpy.emit).toHaveBeenCalledWith("demandeConnexion");
  });

  it("Devrait transmettre les informations de la partie", () => {
    socketSpy.emit("reponseConnexion", 0, "PartieSimple", true, "0");
    service.reponseConnexion(0, "PartieSimple", true, "0");
    expect(socketSpy.emit).toHaveBeenCalledWith("reponseConnexion", 0, "PartieSimple", true, "0");
  });

  it("Devrait recevoir la reponse contenant id de partie et type", async() => {
    socketSpy.on("reponseConnexion");
    service.onReponseConnexion();
    expect(socketSpy.on).toHaveBeenCalledWith("reponseConnexion");
    socketSpy.on.and.returnValue({id: 0, type: "PartieSimple"});
    service.onReponseConnexion().subscribe(
      (reponse: {id: number, type: string}) => {
        expect(reponse).toEqual({id: 0, type: "PartieSimple"});
      });
  });

  it("Devrait envoyer la position d'une différence trouvée en mode simple", () => {
    socketSpy.emit("differenceSimpleTrouvee", "0", 0, 0);
    service.envoyerDifferenceSimple("0", 0, 0);
    expect(socketSpy.emit).toHaveBeenCalledWith("differenceSimpleTrouvee", "0", 0, 0);
  });

  it("Devrait envoyer la position d'une différence trouvée en mode libre", () => {
    socketSpy.emit("differenceLibreTrouvee", "0", new Vector3(0, 0, 0));
    service.envoyerDifferenceLibre("0", new Vector3(0, 0, 0));
    expect(socketSpy.emit).toHaveBeenCalledWith("differenceLibreTrouvee", "0", new Vector3(0, 0, 0));
  });

  it("Devrait recevoir la position d'une différence en mode simple", () => {
    socketSpy.on("differenceSimpleTrouvee");
    service.onDifferenceSimple();
    expect(socketSpy.on).toHaveBeenCalledWith("differenceSimpleTrouvee");
    socketSpy.on.and.returnValue({posX: 0, posY: 0});
    service.onDifferenceSimple().subscribe(
      (reponse: {posX: number, posY: number}) => {
        expect(reponse).toEqual({posX: 0, posY: 0});
      });
  });

  it("Devrait recevoir la position d'une différence en mode libre", () => {
    socketSpy.on("differenceLibreTrouvee");
    service.onDifferenceLibre();
    expect(socketSpy.on).toHaveBeenCalledWith("differenceLibreTrouvee");
    socketSpy.on.and.returnValue(new Vector3(0, 0, 0));
    service.onDifferenceLibre().subscribe(
      (reponse: Vector3) => {
        expect(reponse).toEqual(new Vector3(0, 0, 0));
      });
  });

  it("Devrait envoyer la fin d'une partie", () => {
    socketSpy.emit("finPartie");
    service.envoyerFinPartie("0");
    expect(socketSpy.emit).toHaveBeenCalledWith("finPartie");
  });

  it("Devrait recevoir la fin de la partie", () => {
    socketSpy.on("finPartie");
    service.onFinPartie();
    expect(socketSpy.on).toHaveBeenCalledWith("finPartie");
  });

  it("Devrait faire changer la valeur du bouton pour les parties 1v1", async() => {
    socketSpy.on("actualiser");
    service.onActualiserBouton();
    expect(socketSpy.on).toHaveBeenCalledWith("actualiser");
    socketSpy.on.and.returnValue(of({id: 0, type: "0"}));
    service.onActualiserBouton().subscribe(
      (reponse: {id: number, type: string}) => {
        expect(reponse).toEqual({id: 0, type: "0"});
      });
  });

  it("Devrait emettre le signal de changement", () => {
    socketSpy.emit("changement");
    service.changement();
    expect(socketSpy.emit).toHaveBeenCalledWith("changement");
  });

  it("Devrait recevoir le signal de changement", () => {
    socketSpy.on("changement");
    service.onChangement().subscribe((info: boolean) => {
      expect(info).toEqual(true);
    });
  });

  it("Devrait demander la connexion", () => {
    socketSpy.on("demandeConnexion");
    service.onDemandeConnexion();
    expect(socketSpy.on).toHaveBeenCalledWith("demandeConnexion");
    socketSpy.on.and.returnValue(of(false));
    service.onDemandeConnexion().subscribe(
      (reponse: boolean) => {
        expect(reponse).toEqual(false);
      });
  });

  it("Devrait envoyer vers le serveur la requête de commencer la partie", () => {
    socketSpy.emit("commencerPartie");
    service.commencerPartie({cle : "0"});
    expect(socketSpy.emit).toHaveBeenCalledWith("commencerPartie");
  });

  it("Devrait commencer la partie", () => {
    socketSpy.on("commencerPartie");
    service.onCommencerPartie();
    expect(socketSpy.on).toHaveBeenCalledWith("commencerPartie");
    socketSpy.on.and.returnValue(of({cle: "0"}));
    service.onCommencerPartie().subscribe(
      (reponse: {cle: string}) => {
        expect(reponse).toEqual({cle: "0"});
      });
  });

  it("Devrait envoyer vers le serveur la requête d'annuler la création d'une partie", () => {
    socketSpy.emit("annulerCreation");
    service.annulerCreation(0, TypeDePartie.SIMPLE);
    expect(socketSpy.emit).toHaveBeenCalledWith("annulerCreation");
  });

  it("Devrait annuler la création d'une partie", () => {
    socketSpy.on("annulerCreation");
    service.onAnullerCreation();
    expect(socketSpy.on).toHaveBeenCalledWith("annulerCreation");
    socketSpy.on.and.returnValue(of({id: 0, type: TypeDePartie.SIMPLE}));
    service.onAnullerCreation().subscribe(
      (reponse: {id: number, type: TypeDePartie}) => {
        expect(reponse).toEqual({id: 0, type: TypeDePartie.SIMPLE});
      });
  });
});
