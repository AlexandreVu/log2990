import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-chronometre",
  templateUrl: "./chronometre.component.html",
  styleUrls: ["./chronometre.component.css"],
})
export class ChronometreComponent implements OnInit {
  public secondes: number;
  public minutes: number;
  private readonly INTERVALLE: number = 1000;
  private readonly MINUTE: number = 60;
  private readonly TEMPS_AFFICHAGE: number = 10;

  public constructor() {
    this.secondes = 0;
    this.minutes = 0;
  }

  public intervalle: number;

  public ngOnInit(): void {
    this.intervalle = window.setInterval(() => {
      if (this.secondes === this.MINUTE) {
        this.minutes += 1;
        this.secondes = 0;
      } else {
        this.secondes += 1;
      }
    },                                   this.INTERVALLE);
  }

  public stop(): void {
    window.clearInterval(this.intervalle);
  }

  public getTempsAffichage(temps: number): string {
      if (temps < this.TEMPS_AFFICHAGE) {
          return "0" + temps;
      } else {
          return "" + temps;
      }
  }

}
