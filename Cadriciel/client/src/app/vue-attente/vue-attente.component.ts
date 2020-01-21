import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GestionnaireDeParties } from "../GestionnaireDeParties";
import { SocketService } from "../services/socket.service";

@Component({
    selector: "app-vue-attente",
    templateUrl: "./vue-attente.component.html",
    styleUrls: ["./vue-attente.component.css"],
})
export class VueAttenteComponent implements OnInit {

    public idPartie: number;
    public typePartie: string;
    public quitter: boolean;
    public gestionnaireDeParties: GestionnaireDeParties;
    public cleCouplage: string;
    private repondre: boolean;
    private idVS: string;

    public constructor(private router: Router, public socketService: SocketService) {
        this.repondre = true;
        this.gestionnaireDeParties = GestionnaireDeParties.getGestionnaire();
        this.idPartie = this.gestionnaireDeParties.getPartieSelectionnee().id;
        this.idVS = this.gestionnaireDeParties.idVS;
        this.typePartie = this.gestionnaireDeParties.getPartieSelectionnee().type.toString().toLowerCase();
        this.quitter = false;
    }

    public ngOnInit(): void {
        this.initIoConnection();
    }

    private initIoConnection(): void {
        this.socketService.initSocket();
        this.socketService.joindreSalle(this.idPartie, this.typePartie.toString(), true, this.idVS);
        this.cleCouplage = this.idPartie + this.typePartie + this.idVS;
        this.socketService.onSupprimerPartie().subscribe((info: boolean) => {
            this.quitter = true;
        });
        this.socketService.onDemandeConnexion().subscribe((info: boolean) => {
            if (this.repondre) {
                this.socketService.reponseConnexion(this.idPartie, this.typePartie, true, this.idVS);
            }
        });
        this.socketService.onCommencerPartie().subscribe((info: {cle: string}) => {
            const type: string = this.typePartie === "0" ? "simple" : "libre";
            this.repondre = false;
            this.router.navigate(["jeu", type, this.idPartie, "1v1", this.idVS]).then().catch();
        });
    }

    public retourListeParties(): void {
        this.repondre = false;
        this.socketService.quitterSalle(this.idPartie, this.typePartie, this.idVS);
        this.router.navigate(["selection"]).then().catch();
    }
}
