import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import * as THREE from "three";
import { CliqueDifference } from "../../../../common/communication/differences";
import { IMAGE_ORIGINALE } from "../Constantes";
import { Partie, TypeDePartie } from "../Partie";
import { PartieLibre } from "../PartieLibre";
import { AfficheurScene3DComponent } from "../afficheur-scene3-d/afficheur-scene3-d.component";
import { ChronometreComponent } from "../chronometre/chronometre.component";
import { CommunicationService } from "../services/communication.service";
import { SocketService } from "../services/socket.service";
import { VueJeuComponent } from "./vue-jeu.component";

describe("VueJeuComponent", () => {
  let component: VueJeuComponent;
  let fixture: ComponentFixture<VueJeuComponent>;
  let communicationServiceSpy: jasmine.SpyObj<CommunicationService>;
  let socketServiceSpy: jasmine.SpyObj<SocketService>;

  const UNE_PARTIE_LIBRE: PartieLibre = new PartieLibre(0, "");
  const UNE_PARTIE_SIMPLE: Partie = new Partie(0, "", TypeDePartie.SIMPLE);
  UNE_PARTIE_SIMPLE.idImageOriginale = "";
  UNE_PARTIE_SIMPLE.idImageModifiee = "";
  UNE_PARTIE_LIBRE.typeModifications = [];
  UNE_PARTIE_LIBRE.typeModifications.push("ajout");

  const nomJoueur: string = "Alex";
  const fauxMessageScore: string = nomJoueur + " obtient la 1e place dans les meilleurs temps du jeu test en 1V1.";
  const fauxMessage: string = "";
  const clique: CliqueDifference = {posX: 0, posY: 0};
  const pos: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
  beforeEach(() => {
    socketServiceSpy = jasmine.createSpyObj("SocketService", ["onConnexion", "onDeconnexion", "onScore", "joindreSalle",
                                                              "onFinPartie", "onDifferenceSimple", "onDifferenceLibre",
                                                              "onDifferenceTrouvee", "onErreurIdentification",
                                                              "envoyerDifferenceSimple", "envoyerDifferenceLibre",
                                                              "erreurIdentification", "differenceTrouvee"]);
    communicationServiceSpy = jasmine.createSpyObj("CommunicationService", ["commencerJeu", "getPartieLibre", "getPartieSimple",
                                                                            "envoyerClickSimple", "envoyerClickLibre"]);
    communicationServiceSpy.getPartieSimple.and.returnValue(of(UNE_PARTIE_SIMPLE));
    communicationServiceSpy.getPartieLibre.and.returnValue(of(UNE_PARTIE_LIBRE));
    communicationServiceSpy.commencerJeu.and.returnValue(of("commencerJeu"));
    communicationServiceSpy.envoyerClickSimple.and.returnValue(of("srcImage"));
    communicationServiceSpy.envoyerClickLibre.and.returnValue(of("srcImage"));
    socketServiceSpy.onConnexion.and.returnValue(of(nomJoueur));
    socketServiceSpy.onDeconnexion.and.returnValue(of(nomJoueur));
    socketServiceSpy.onScore.and.returnValue(of(fauxMessageScore));
    socketServiceSpy.onFinPartie.and.returnValue(of(void 0));
    socketServiceSpy.onDifferenceSimple.and.returnValue(of(clique));
    socketServiceSpy.onDifferenceLibre.and.returnValue(of(pos));
    socketServiceSpy.onDifferenceTrouvee.and.returnValue(of(fauxMessage));
    socketServiceSpy.onErreurIdentification.and.returnValue(of(fauxMessage));
    socketServiceSpy.envoyerDifferenceSimple.and.returnValue(of(void 0));
    socketServiceSpy.envoyerDifferenceLibre.and.returnValue(of(void 0));
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VueJeuComponent, ChronometreComponent, AfficheurScene3DComponent ],
      imports: [RouterTestingModule, HttpClientModule],
      providers:
      [
        {
            provide: CommunicationService,
            useValue: communicationServiceSpy,
        },
        {
            provide: SocketService,
            useValue: socketServiceSpy,
        },
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VueJeuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("Vérifie que l'on peut créer VueJeuComponent", () => {
    expect(component).toBeTruthy();
  });

  it ("Devrait charger une partie libre dans le ngOnInit", () => {
    component.type = TypeDePartie.LIBRE;
    component.partie = UNE_PARTIE_LIBRE;
    component.ngOnInit();

    expect(component.partie.id).toEqual(UNE_PARTIE_LIBRE.id);
  });

  it("Devrait ajouter la phrase de connexion utilisateur", () => {
    const taille: number = component.evenements.length;
    component.connexionUtilisateur("David");
    expect(component.evenements.length).toEqual(taille + 1);
  });

  it("Devrait ajouter la phrase de deconnexion", () => {
    const taille: number = component.evenements.length;
    component.deconnexionUtilisateur("David");
    expect(component.evenements.length).toEqual(taille + 1);
  });

  it("Devrait ajouter la phrase d'ajout de score", () => {
    const taille: number = component.evenements.length;
    component.ajoutScore("David");
    expect(component.evenements.length).toEqual(taille + 1);
  });

  it ("Devrait charger une partie simple dans le ngOnInit", () => {
    component.type = TypeDePartie.SIMPLE;
    component.ngOnInit();

    expect(component.partie.id).toEqual(UNE_PARTIE_SIMPLE.id);
  });

  it ("Devrait ajouter un message reçu dans le tableau d'évènement", () => {
    const taille: number = component.evenements.length;
    component.messageRecu("TEST");
    expect(component.evenements.length).toEqual(taille + 1);
  });

  it("Ne devrait pas envoyer le clique si ce n'est pas une différence - Mode 1v1 Simple", () => {
    component.modeSolo = false;
    component.type = TypeDePartie.SIMPLE;
    component.id1v1 = 0;
    fixture.detectChanges();
    component.ngOnInit();
    const imageOriginale: HTMLImageElement = document.getElementById(IMAGE_ORIGINALE) as HTMLImageElement;
    communicationServiceSpy.envoyerClickSimple.and.returnValue(of(null));

    imageOriginale.click();

    expect(socketServiceSpy.envoyerDifferenceSimple).not.toHaveBeenCalled();
  });

  it("Devrait envoyer le clique si c'est une différence - Mode 1v1 Simple", () => {
    component.modeSolo = false;
    component.type = TypeDePartie.SIMPLE;
    component.id1v1 = 0;
    fixture.detectChanges();
    component.ngOnInit();
    const imageOriginale: HTMLImageElement = document.getElementById(IMAGE_ORIGINALE) as HTMLImageElement;
    communicationServiceSpy.envoyerClickSimple.and.returnValue(of("srcDiffTrouvee"));

    imageOriginale.click();

    expect(socketServiceSpy.envoyerDifferenceSimple).toHaveBeenCalled();
  });

  it("Ne devrait pas envoyer le clique si ce n'est pas une différence - Mode 1v1 Libre", () => {
    component.modeSolo = false;
    component.type = TypeDePartie.LIBRE;
    component.id1v1 = 0;
    component.ngOnInit();
    const event: CustomEvent = new CustomEvent("aucuneDifference", {detail: [0, 0]});

    document.dispatchEvent(event);

    expect(socketServiceSpy.envoyerDifferenceLibre).not.toHaveBeenCalled();
  });

  it("Devrait envoyer le clique si c'est une différence - Mode 1v1 Libre", () => {
    component.modeSolo = false;
    component.type = TypeDePartie.LIBRE;
    component.id1v1 = 0;
    component.ngOnInit();
    const event: CustomEvent = new CustomEvent("nouvelleDifference", {detail: pos});

    document.dispatchEvent(event);

    expect(socketServiceSpy.envoyerDifferenceLibre).toHaveBeenCalled();
  });
});
