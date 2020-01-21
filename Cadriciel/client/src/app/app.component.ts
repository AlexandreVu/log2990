import { HttpClient } from "@angular/common/http";
import { Component, HostListener, OnInit } from "@angular/core";
import { Confirmation } from "../../../common/communication/confirmation";
import { CommunicationService } from "./services/communication.service";

import { Observable } from "rxjs";
import { SocketService } from "./services/socket.service";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
    public readonly title: string = "LOG2990";
    private readonly URL_CONNEXION_BDD: string = "http://localhost:3000/connecterBDD";
    public formulaireOuvert: boolean;

    @HostListener("window:beforeunload", ["$event"])
    public beforeUnload($event: BeforeUnloadEvent): void {
        $event.returnValue = "Vous allez perdre vos données!";
        // La fonction subscribe ne fait rien dans ce fichier
        // tslint:disable-next-line:no-empty
        this.communication.deconnecter(this.communication.nom).subscribe((confirmation: Confirmation) => {
        });
        this.socket.deconnexion(this.communication.nom);
      }
    public constructor(private communication: CommunicationService,
                       private http: HttpClient,
                       private socket: SocketService) { this.formulaireOuvert = false; }

    public ngOnInit(): void {
        // pas besoin de traiter la reponse.
        // tslint:disable-next-line:no-empty
        this.connecterBDD().subscribe((connecter: boolean) => {});
    }

    private connecterBDD(): Observable<boolean> {
        return this.http.get<boolean>(this.URL_CONNEXION_BDD);
    }
}
