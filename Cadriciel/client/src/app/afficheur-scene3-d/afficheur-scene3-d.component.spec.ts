import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import * as THREE from "three";

import { HttpClientModule } from "@angular/common/http";
import { CameraPremierePersonne, TOUCHE_CLICK_DROIT, TOUCHE_CLICK_GAUCHE } from "../services/CameraPremierePersonne";
import { AfficheurScene3DComponent } from "./afficheur-scene3-d.component";
import { ModeTriche } from "./mode-triche";

describe("AfficheurScene3DComponent", () => {
  let component: AfficheurScene3DComponent;
  let fixture: ComponentFixture<AfficheurScene3DComponent>;
  let touche: KeyboardEvent;
  let clique: MouseEvent;
  let afficheurSpy: jasmine.SpyObj<AfficheurScene3DComponent>;
  let cameraSpy: jasmine.SpyObj<CameraPremierePersonne>;

  beforeEach(() => {
    afficheurSpy = jasmine.createSpyObj("AfficheurScene3DComponent", ["envoyerErreurClick"]);
    cameraSpy = jasmine.createSpyObj("CameraPremierePersonne", ["effectuerRotation"]);
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfficheurScene3DComponent ],
      imports: [HttpClientModule],
      providers: [
        {
          provide: AfficheurScene3DComponent,
          useValue: afficheurSpy,
        },
        {
          provide: CameraPremierePersonne,
          useValue: cameraSpy,
        },
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfficheurScene3DComponent);
    component = fixture.componentInstance;
    component.serviceRendu.cameraAmovible = new CameraPremierePersonne(0);
  });

  it("Vérifie que l'on peut créer AfficheurScene3DComponent", () => {
    expect(component).toBeTruthy();
  });

  it("Devrait désactiver la touche A", () => {
    touche = new KeyboardEvent("keyup", {key: "a"});
    component.serviceRendu.cameraAmovible.alternerActivationTranslation(touche, true);
    component.gestionClavierDesactiverTouche(touche);
    expect(component.serviceRendu.cameraAmovible.translationGaucheActive).toEqual(false);
  });

  it("Devrait activer la tourche A", () => {
    touche = new KeyboardEvent("keydown", {key: "a"});
    component.serviceRendu.cameraAmovible.alternerActivationTranslation(touche, false);
    component.gestionClavierActiverTouche(touche);
    expect(component.serviceRendu.cameraAmovible.translationGaucheActive).toEqual(true);
  });

  it("Devrait activer le mode de triche en appuyant sur T", () => {
    touche = new KeyboardEvent("keydown", {key: "t"});
    component.gestionnaireModeTriche = new ModeTriche(new THREE.Scene, new THREE.Scene);
    const MODE_TRICHE_ACTIF: boolean = component.gestionnaireModeTriche.estActif;
    component.gestionClavierActiverTouche(touche);
    expect(component.gestionnaireModeTriche.estActif).toEqual(!MODE_TRICHE_ACTIF);
  });

  it("Devrait désactiver la rotation si on relâche le clique de la souris", () => {
    clique = new MouseEvent("mouseup");
    component.gestionSourisDesactiverClick(clique);
    expect(component.serviceRendu.cameraAmovible.rotationCameraActive).toEqual(false);
  });

  it("Devrait désactiver la rotation si la souris se déplace en-dehors du canvas", () => {
    clique = new MouseEvent("mousemove");
    Object.defineProperty(clique, "target", {writable: false, value: document.createElement("body")});
    component.serviceRendu.cameraAmovible.alternerActivationRotation(true);
    component.gestionSourisMouvement(clique);
    expect(component.serviceRendu.cameraAmovible.rotationCameraActive).toEqual(false);
  });

  it("Devrait faire une rotation si la souris se déplace dans le canvas", () => {
    clique = new MouseEvent("mousemove");
    Object.defineProperty(clique, "target", {writable: false, value: document.createElement("canvas")});
    component.serviceRendu.cameraAmovible.alternerActivationRotation(true);
    cameraSpy.effectuerRotation(0, 0);
    component.gestionSourisMouvement(clique);
    expect(cameraSpy.effectuerRotation).toHaveBeenCalledWith(0, 0);
  });

  it("Devrait activer la rotation si on fait un clique droit", () => {
    clique = new MouseEvent("mousedown", {button: TOUCHE_CLICK_DROIT});
    Object.defineProperty(clique, "target", {writable: false, value: document.createElement("canvas")});
    component.gestionSourisActiverClick(clique);
    expect(component.serviceRendu.cameraAmovible.rotationCameraActive).toEqual(true);
  });

  it("Devrait envoyer une erreur si on fait un clique gauche à position indéfinie", () => {
    clique = new MouseEvent("mousedown", {button: TOUCHE_CLICK_GAUCHE});
    Object.defineProperty(clique, "target", {writable: false, value: document.createElement("canvas")});
    component.serviceRendu.sceneOriginale = new THREE.Scene();
    component.serviceRendu.sceneModifiee = new THREE.Scene();
    afficheurSpy.envoyerErreurClick(clique);
    component.gestionSourisActiverClick(clique);
    expect(afficheurSpy.envoyerErreurClick).toHaveBeenCalledWith(clique);
  });
});
