import { HttpClientModule } from "@angular/common/http";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";

import { SocketService } from "../services/socket.service";
import { VueAttenteComponent } from "./vue-attente.component";

describe("VueAttenteComponent", () => {
  let component: VueAttenteComponent;
  let fixture: ComponentFixture<VueAttenteComponent>;
  let socketServiceSpy: jasmine.SpyObj<SocketService>;
  let routerSpy: jasmine.SpyObj<Router>;
  const MOCK_PROMESSE_CATCH: {} = {catch: () => "catch"};
  const MOCK_PROMESSE: {} = {then: () => MOCK_PROMESSE_CATCH};

  beforeEach(() => {
    socketServiceSpy = jasmine.createSpyObj("SocketService", ["initSocket", "joindreSalle", "onSupprimerPartie",
                                                              "partieSupprimeeActualiser", "quitterSalle",
                                                              "onCommencerPartie", "onDemandeConnexion", "reponseConnexion"]);
    routerSpy = jasmine.createSpyObj("Router", ["navigate"]);
    routerSpy.navigate.and.returnValue(MOCK_PROMESSE);
    socketServiceSpy.onDemandeConnexion.and.returnValue(of(void 0));
    socketServiceSpy.onSupprimerPartie.and.returnValue(of(void 0));
    socketServiceSpy.onCommencerPartie.and.returnValue(of(void 0));
});

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VueAttenteComponent ],
      imports: [HttpClientModule, RouterTestingModule],
      providers:
      [
        {
          provide: SocketService,
          useValue: socketServiceSpy,
        },
        {
          provide: Router,
          useValue: routerSpy,
        },
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VueAttenteComponent);
    component = fixture.componentInstance;
  });

  it("Vérifie que l'on peut créer VueAttenteComponent", () => {
    expect(component).toBeTruthy();
  });

  it("Devrait déplacer le joueur de la liste de parties vers une page d'attente avec initIoConnection()", () => {
    component.idPartie = 0;
    component.typePartie = "0";
    socketServiceSpy.initSocket();
    socketServiceSpy.joindreSalle(component.idPartie + component.typePartie);
    socketServiceSpy.onSupprimerPartie.and.returnValue(of(true));
    component.ngOnInit();
    socketServiceSpy.partieSupprimeeActualiser(0, "0");
    expect(component.quitter).toEqual(true);
  });

  it("Devrait appeler le websocket pour déplacer le joueur d'une page d'attente à la liste de parties avec de retourListeParties()", () => {
    component.idPartie = 0;
    component.typePartie = "0";
    socketServiceSpy.quitterSalle(component.idPartie + component.typePartie);
    component.retourListeParties();
    expect(socketServiceSpy.quitterSalle).toHaveBeenCalled();
  });

  it("Devrait appeler le router pour déplacer le joueur d'une page d'attente à la liste de parties avec retourListeParties()", () => {
    component.idPartie = 0;
    component.typePartie = "0";
    component.retourListeParties();
    expect(routerSpy.navigate).toHaveBeenCalledWith(["selection"]);
  });
});
