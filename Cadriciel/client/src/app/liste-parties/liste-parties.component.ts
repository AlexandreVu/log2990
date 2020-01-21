import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { SERVEUR_UPLOADS } from "../Constantes";
import { GestionnaireDeParties } from "../GestionnaireDeParties";
import { Partie as Partie, TypeDePartie } from "../Partie";
import { PartieLibre } from "../PartieLibre";
import { CommunicationService } from "../services/communication.service";
import { FormulaireService } from "../services/formulaire.service";
import { SocketService } from "../services/socket.service";

@Component({
    selector: "app-liste-parties",
    templateUrl: "./liste-parties.component.html",
    styleUrls: ["./liste-parties.component.css"],
})
export class ListePartiesComponent implements OnInit, OnDestroy {
    public gestionnaireDeParties: GestionnaireDeParties;
    public idVsSimple: {id: number, idVs: string}[];
    public idVsLibre: {id: number, idVs: string}[];
    private subscribe: Subscription;

    protected readonly ADRESSE_SERVEUR: string = SERVEUR_UPLOADS;

    public constructor(private service: FormulaireService, public router: Router,
                       private socketService: SocketService, private communication: CommunicationService) {
        this.gestionnaireDeParties = GestionnaireDeParties.getGestionnaire();
        this.idVsSimple = [];
        this.idVsLibre = [];
    }

    public ngOnInit(): void {
        this.initIoConnection();
        this.chargerParties();
    }

    public ngOnDestroy(): void {
        this.subscribe.unsubscribe();
    }

    private initIoConnection(): void {
        this.socketService.initSocket();
        this.subscribe = this.socketService.onActualiserBouton().subscribe(
           (info: {id: number, type: string, ajout: boolean, idVS: string}) => {
               if (info.type === "0") {
               info.ajout ? this.gestionnaireDeParties.creerPartieUnContreUnSimple(info.id) :
                            this.gestionnaireDeParties.annulerPartieUnContreUnSimple(info.id) ;
               this.idVsSimple.push({id: info.id, idVs: info.idVS});
            } else {
                info.ajout ? this.gestionnaireDeParties.creerPartieUnContreUnLibre(info.id) :
                            this.gestionnaireDeParties.annulerPartieUnContreUnLibre(info.id) ;
            }
               this.ajouterId(info.id, info.type, info.idVS);
        });
        this.socketService.demandeConnexion();
        this.socketService.onReponseConnexion().subscribe((info: {id: number, type: string, idVs: string}) => {
            info.type === "0" ? this.gestionnaireDeParties.creerPartieUnContreUnSimple(info.id) :
            this.gestionnaireDeParties.creerPartieUnContreUnLibre(info.id);
            info.type === "0" ? this.idVsSimple.push({id: info.id, idVs: info.idVs}) : this.idVsLibre.push({id: info.id, idVs: info.idVs});
        });
        this.socketService.onAnullerCreation().subscribe((partie: {id: number, type: TypeDePartie}) => {
            partie.type === TypeDePartie.SIMPLE ? this.gestionnaireDeParties.annulerPartieUnContreUnSimple(partie.id) :
                                                 this.gestionnaireDeParties.annulerPartieUnContreUnLibre(partie.id);
            this.chargerParties();
            this.socketService.demandeConnexion();
        });
        this.socketService.onChangement().subscribe((rep: boolean) => {
            this.chargerParties();
        });
    }

    public creerPartieUnContreUnSimple(partieId: number): void {
        this.gestionnaireDeParties.creerPartieUnContreUnSimple(partieId);
        this.communication.getIdVS({type: TypeDePartie.SIMPLE}).subscribe(
            (idVs: string) => {
                this.gestionnaireDeParties.idVS = idVs;
                this.router.navigate(["attente", "simple", this.gestionnaireDeParties.getPartieSelectionnee().id]).then().catch();
            });
    }

    public creerPartieUnContreUnLibre(id: number): void {
        this.gestionnaireDeParties.creerPartieUnContreUnLibre(id);
        this.communication.getIdVS({type: TypeDePartie.LIBRE}).subscribe(
            (idVS: string) => {
                this.gestionnaireDeParties.idVS = idVS;
                this.router.navigate(["attente", "libre", this.gestionnaireDeParties.getPartieSelectionnee().id]).then().catch();
            });
    }

    public joindrePartieSimple(id: number): void {
        let trouve: boolean = false;
        const partieSelectionnee: Partie = this.gestionnaireDeParties.getPartieSelectionnee();
        for (let i: number = 0; i < this.idVsSimple.length; i++) {
            if (this.idVsSimple[i].id === partieSelectionnee.id) {
                trouve = true;
                this.gestionnaireDeParties.idVS = this.idVsSimple[i].idVs;
                this.idVsSimple.splice(i, 1);
                const cle: string = partieSelectionnee.id +
                TypeDePartie.SIMPLE.toString() + this.gestionnaireDeParties.idVS;
                this.socketService.commencerPartie({cle: cle});
                this.socketService.annulerCreation(partieSelectionnee.id, TypeDePartie.SIMPLE);
                this.socketService.joindreSalle(partieSelectionnee.id, TypeDePartie.SIMPLE.toString(),
                                                true, this.gestionnaireDeParties.idVS);
                this.router.navigate(["jeu", "simple", partieSelectionnee.id, "1v1", this.gestionnaireDeParties.idVS]).then().catch();
            }
        }
        if (!trouve) {
            this.gestionnaireDeParties.annulerPartieUnContreUnSimple(id);
            this.router.navigate(["attente", "simple", partieSelectionnee.id]).then().catch();
        }
    }

    public joindrePartieLibre(id: number): void {
        let trouve: boolean = false;
        const partieSelectionnee: PartieLibre = this.gestionnaireDeParties.getPartieSelectionnee() as PartieLibre;
        for ( let i: number = 0; i < this.idVsLibre.length; i++) {
            if (this.idVsLibre[i].id === partieSelectionnee.id) {
                trouve = true;
                this.gestionnaireDeParties.idVS = this.idVsLibre[i].idVs;
                const cle: string = partieSelectionnee.id +
                TypeDePartie.LIBRE.toString() + this.idVsLibre[i].idVs;
                this.socketService.commencerPartie({cle: cle});
                this.idVsLibre.splice(i, 1);
                this.socketService.annulerCreation(partieSelectionnee.id, TypeDePartie.LIBRE);
                this.socketService.joindreSalle(partieSelectionnee.id, TypeDePartie.LIBRE.toString(),
                                                true, this.gestionnaireDeParties.idVS);
                this.router.navigate(["jeu", "libre", partieSelectionnee.id, "1v1", this.gestionnaireDeParties.idVS]).then().catch();
            }
        }
        if (!trouve) {
            this.gestionnaireDeParties.annulerPartieUnContreUnLibre(id);
            this.router.navigate(["attente", "libre", partieSelectionnee.id]).then().catch();
        }
    }

    public chargerParties(): void {
        this.service.getPartiesSimples().subscribe((parties: Partie[]) => {
            this.gestionnaireDeParties.setPartiesSimple(parties);
        });

        this.service.getPartiesLibres().subscribe((parties: PartieLibre[]) => {
            this.gestionnaireDeParties.setPartiesLibre(parties);
        });
    }

    public getPartieSelectionnee(): Partie {
        return this.gestionnaireDeParties.getPartieSelectionnee();
    }

    public jouer(): void {
        const partieSelectionnee: Partie | PartieLibre = this.gestionnaireDeParties.getPartieSelectionnee();
        const type: string = partieSelectionnee.type === TypeDePartie.SIMPLE ? "simple" : "libre";
        this.router.navigate(["jeu", type, partieSelectionnee.id, "solo"]).then().catch();
    }

    public ajouterId(id: number, type: string, idVs: string): void {
        const tab: {id: number, idVs: string}[] = type === "0" ? this.idVsSimple : this.idVsLibre;
        let trouve: boolean = false;

        for (const partie of tab) {
            if (partie.id === id && idVs !== undefined) {
                partie.idVs = idVs;
                trouve = true;
            }
        }

        if (!trouve && idVs !== undefined) {
            tab.push({id: id, idVs: idVs});
        }
        type === "0" ? this.idVsSimple = tab : this.idVsLibre = tab;
    }

}
