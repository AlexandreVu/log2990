import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChronometreComponent } from "./chronometre.component";

describe("ChronometreComponent", () => {
  let component: ChronometreComponent;
  let fixture: ComponentFixture<ChronometreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChronometreComponent ],
    })
    .compileComponents().then().catch();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChronometreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("Vérifie que l'on peut créer ChronometreComponent", () => {
    expect(component).toBeTruthy();
  });

  it("Devrait lancer le chronometre a sa creation.", () => {
    spyOn(window, "setInterval").and.callThrough();
    const msParSeconde: number = 1000;

    fixture = TestBed.createComponent(ChronometreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.intervalle).toBeDefined();
    expect(window.setInterval).toHaveBeenCalledWith(jasmine.any(Function), msParSeconde);
  });

  it("Devrait arreter le chronometre", () => {
    spyOn(window, "clearInterval").and.callThrough();
    component.stop();

    expect(window.clearInterval).toHaveBeenCalledWith(component.intervalle);
  });

  it("Devrait retourner le temps passé avec un format de deux chiffres", () => {
    const temps0: string = component.getTempsAffichage(0);
    const temps1: string = component.getTempsAffichage(1);
    const tempsRandom: number = 10;
    const temps10: string = component.getTempsAffichage(tempsRandom);

    expect(temps0).toEqual("00");
    expect(temps1).toEqual("01");
    expect(temps10).toEqual("" + tempsRandom);
  });

});
