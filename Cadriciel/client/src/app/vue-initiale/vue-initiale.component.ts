import { Component, HostListener, Injectable, Input } from "@angular/core";
import { Router } from "@angular/router";
import { Confirmation } from "../../../../common/communication/confirmation";
import { CommunicationService } from "../services/communication.service";
import { SocketService } from "../services/socket.service";

@Component({
    selector: "app-vue-initiale",
    templateUrl: "./vue-initiale.component.html",
    styleUrls: ["./vue-initiale.component.css"],
})

@Injectable()
export class VueInitialeComponent {
    @Input() public nomInput: string;
    public nom: string;
    public message: string;
    public ajoute: boolean;

    public constructor(private communication: CommunicationService, private router: Router, private socket: SocketService) {
        this.nom = "";
        this.message = "";
        this.ajoute = false;
    }

    @HostListener("window:beforeunload", ["$event"]) public beforeUnload($event: BeforeUnloadEvent): void {
        $event.returnValue = "Your data will be lost!";
        // rien ne se passe lorsqu'on a une déconnexion dans ce component.
        // tslint:disable-next-line:no-empty
        this.communication.deconnecter(this.nom).subscribe((confirmation: Confirmation) => {
        });

    }

    public entrer(): void {
        if (this.communication.verifierNom(this.nomInput)) {
            this.communication.envoyerNom(this.nomInput).subscribe((confirmation: Confirmation) => {
                this.ajoute = confirmation.ajoute;
                if (!confirmation.ajoute) {
                    this.message = "Le nom existe déjà";
                }
                if (this.communication.verifierNom(this.nomInput) && this.ajoute) {
                    this.nom = this.nomInput;
                    this.message = "";
                    this.communication.nom = this.nom;
                    this.router.navigate(["selection"]).then().catch();

                    this.socket.connexion(this.nom);
                }
            });
        } else {
            this.nom = "";
            this.message = "Le format du nom n'est pas respecté. (Longueur : 4-12 caractères alphanumériques)";
        }
    }
}
