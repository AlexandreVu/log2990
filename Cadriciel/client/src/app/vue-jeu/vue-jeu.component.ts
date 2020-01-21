import { Component, Injectable, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Confirmation } from "../../../../common/communication/confirmation";
import { CliqueDifference } from "../../../../common/communication/differences";
import { CLICK, DATA_BITMAP, DIFFERENCES_ATTENDUES_1V1, DIFFERENCES_ATTENDUES_SOLO, IMAGE_MODIFIEE,
          IMAGE_ORIGINALE, SERVEUR_UPLOADS } from "../Constantes";
import { GestionnaireDeParties } from "../GestionnaireDeParties";
import { Partie, TypeDePartie } from "../Partie";
import { PartieLibre } from "../PartieLibre";
import { AfficheurScene3DComponent } from "../afficheur-scene3-d/afficheur-scene3-d.component";
import { ChronometreComponent } from "../chronometre/chronometre.component";
import { AfficheurScene3dService } from "../services/afficheur-scene3d.service";
import { CommunicationService } from "../services/communication.service";
import { SocketService } from "../services/socket.service";
@Component({
  selector: "app-vue-jeu",
  templateUrl: "./vue-jeu.component.html",
  styleUrls: ["./vue-jeu.component.css"],
})
@Injectable()
export class VueJeuComponent implements OnInit {
    public partie: Partie | PartieLibre;
    public type: TypeDePartie;
    public differencesTrouvees: number;
    public evenements: string[];
    public idPartie: number;
    public id1v1: number;
    public imageModifiee: string;
    public mauvaisClique: boolean;
    public partieTerminee: boolean;
    public modeSolo: boolean;
    public partiePerdue: boolean;
    public differencesAttendues: number;
    public readonly ADRESSE_SERVEUR: string = SERVEUR_UPLOADS;
    private readonly TIMEOUT: number = 1000;
    private gestionnaire: GestionnaireDeParties;
    private audioTrouvee: HTMLAudioElement;
    private audioNonTrouvee: HTMLAudioElement;
    @ViewChild("scene3D")
    private scene3D: AfficheurScene3DComponent;

    @ViewChild("chrono") private chrono: ChronometreComponent;
    public constructor(private route: ActivatedRoute, private service: CommunicationService,
                       private router: Router , private socket: SocketService) {
        this.scene3D = new AfficheurScene3DComponent(new AfficheurScene3dService, this.service);
        this.differencesTrouvees = 0;
        this.evenements = [];
        this.evenements = ["Debut de partie."];
        this.chrono = new ChronometreComponent();
        this.mauvaisClique = false;
        this.modeSolo = true;
        this.audioTrouvee = new Audio("../../assets/bell_sound.mp3");
        this.audioNonTrouvee = new Audio("../../assets/son_erreur.mp3");
        this.idPartie = this.route.snapshot.params["id"];
        this.type = this.route.snapshot.params["type"] === "simple" ? TypeDePartie.SIMPLE : TypeDePartie.LIBRE;
        this.modeSolo = this.route.snapshot.params["mode"] === "solo";
        this.id1v1 = this.route.snapshot.params["idVS"];
        this.differencesAttendues = this.modeSolo ? DIFFERENCES_ATTENDUES_SOLO : DIFFERENCES_ATTENDUES_1V1;
        this.partiePerdue = false;
    }
    public ngOnInit(): void {
        this.gestionnaire = GestionnaireDeParties.getGestionnaire();
        if (this.type === TypeDePartie.SIMPLE) {
            this.service.getPartieSimple(this.idPartie).subscribe((partie: Partie) => {
                this.initialisationPartie(partie);
            });
        } else {
            this.service.getPartieLibre(this.idPartie).subscribe((partie: PartieLibre) => {
                this.initialisationPartie(partie);
            });
        }
        this.initialiserSocket();
        if (!this.modeSolo) {
            this.initialiserSocketMulti();
        }
    }
    private initialiserSocket(): void {
        this.socket.onConnexion().subscribe((nom: string) => {
            this.connexionUtilisateur(nom);
        });
        this.socket.onDeconnexion().subscribe((nom: string) => {
            this.deconnexionUtilisateur(nom);
        });
        this.socket.onScore().subscribe((message: string) => {
            this.ajoutScore(message);
        });
    }
    private initialiserSocketMulti(): void {
        if (this.type === TypeDePartie.SIMPLE) {
            this.socket.onDifferenceSimple().subscribe((clique: CliqueDifference) => {
                this.cliqueDifferenceRecue(clique.posX, clique.posY);
            });
        } else {
            this.socket.onDifferenceLibre().subscribe((pos: THREE.Vector3) => {
                this.scene3D.serviceRendu.enleverDifference(pos);
            });
        }
        this.socket.onFinPartie().subscribe(() => { this.finPartieRecue(); });
        this.socket.onDifferenceTrouvee().subscribe((message: string) => { this.messageRecu(message); });
        this.socket.onErreurIdentification().subscribe((message: string) => { this.messageRecu(message); });
    }
    private initialisationPartie(partie: Partie | PartieLibre): void {
        this.partie = partie;
        addEventListener("load", (event) => this.verificationRefresh());
        const titre: HTMLHeadingElement = document.getElementById("titre") as HTMLHeadingElement;
        titre.innerText = "Jeu " + partie.nom;
        if (this.type === TypeDePartie.SIMPLE) {
            this.initialiserSimple(partie);
        } else {
            this.initialiserLibre(partie as PartieLibre);
        }
    }
    private initialiserSimple(partie: Partie): void {
        const imageOriginale: HTMLElement | null = document.getElementById(IMAGE_ORIGINALE);
        const imageModifiee: HTMLElement | null = document.getElementById(IMAGE_MODIFIEE);
        if (imageOriginale !== null && imageModifiee !== null) {
            (imageOriginale as HTMLImageElement).src = this.ADRESSE_SERVEUR + partie.idImageOriginale;
            (imageModifiee as HTMLImageElement).src = this.ADRESSE_SERVEUR + partie.idImageModifiee;
            imageOriginale.addEventListener(CLICK, (event) => this.cliqueSimple(event as MouseEvent));
            imageModifiee.addEventListener(CLICK, (event) => this.cliqueSimple(event as MouseEvent));
        }
        this.service.commencerJeu("" + this.idPartie, this.partie.idImageOriginale, this.partie.idImageModifiee,
                                  this.partie.idImageDifferences).subscribe();
    }
    private initialiserLibre(partieLibre: PartieLibre): void {
        this.gestionnaire.setNbObjets(partieLibre.quantiteObjets);
        this.gestionnaire.objetsDansLaScene = partieLibre.listeObjets.liste;
        for (const item of partieLibre.typeModifications) {
            if (item === "ajout") {
                this.gestionnaire.setAjout(true);
            }
            if (item === "suppression") {
                this.gestionnaire.setRetrait(true);
            }
            if (item === "changementCouleur") {
                this.gestionnaire.setModCouleur(true);
            }
        }
        this.scene3D.chargerScene(partieLibre.listeObjets);
        document.addEventListener("nouvelleDifference", (event: CustomEvent) => {
            this.nouvelleDifferenceTrouvee();
            if (!this.modeSolo) {
                this.socket.envoyerDifferenceLibre(this.getCleComplete1v1(), event.detail);
            }
        });
        document.addEventListener("aucuneDifference", (event: CustomEvent) => {
            this.aucuneDifferenceTrouvee(event.detail[0], event.detail[1]);
        });
    }
    private cliqueSimple(event: MouseEvent): void {
        if (this.mauvaisClique) {
            return;
        }
        // suppose que les deux images ont la même taille
        const imageOriginale: HTMLImageElement = document.getElementById(IMAGE_ORIGINALE) as HTMLImageElement;
        let posX: number = Math.round(event.offsetX / imageOriginale.width * imageOriginale.naturalWidth);
        let posY: number = Math.round(event.offsetY / imageOriginale.height * imageOriginale.naturalHeight);
        if (posX > imageOriginale.naturalWidth) {
            posX = imageOriginale.naturalWidth;
        }
        if (posY > imageOriginale.naturalHeight) {
            posY = imageOriginale.naturalHeight;
        }
        this.service.envoyerClickSimple(this.idPartie, posX, posY, this.partie.idImageOriginale).subscribe((base64: string) => {
            if (base64 !== null) {
                this.nouvelleDifferenceTrouvee();
                if (!this.modeSolo) {
                    this.socket.envoyerDifferenceSimple(this.getCleComplete1v1(), posX, posY);
                }
                const img: HTMLImageElement = document.getElementById(IMAGE_MODIFIEE) as HTMLImageElement;
                img.src = DATA_BITMAP + base64;
            } else {
                this.aucuneDifferenceTrouvee(event.clientX, event.clientY);
            }
        });
    }
    private cliqueDifferenceRecue(posX: number, posY: number): void {
        this.service.envoyerClickSimple(this.idPartie, posX, posY, this.partie.idImageOriginale).subscribe((base64: string) => {
            if (base64 !== null) {
                this.verifierScrollBar();
                const img: HTMLElement | null = document.getElementById(IMAGE_MODIFIEE);
                if (img !== null) {
                    (img as HTMLImageElement).src = DATA_BITMAP + base64;
                }
            }
        });
    }
    private aucuneDifferenceTrouvee(posX: number, posY: number): void {
        if (!this.modeSolo) {
            this.socket.erreurIdentification(this.service.nom, this.partie.id, this.partie.type.toString());
        } else {
            this.messageRecu("Erreur!");
        }
        this.verifierScrollBar();
        this.mauvaisClique = true;
        if (this.type === TypeDePartie.LIBRE) {
            this.scene3D.ignorerClicks = true;
        }
        const motErreur: HTMLDivElement = document.getElementById("erreurIdentification") as HTMLDivElement;
        motErreur.style.left = posX + "px";
        motErreur.style.top = posY + "px";
        this.audioNonTrouvee.pause();
        this.audioNonTrouvee.currentTime = 0;
        this.audioNonTrouvee.play().then().catch((error) => {/*Erreur ignorée: erreur lancée que durant les tests*/});
        document.body.style.cursor = "not-allowed";
        setTimeout(() => {
            this.mauvaisClique = false;
            if (this.type === TypeDePartie.LIBRE) {
                this.scene3D.ignorerClicks = false;
            }
            document.body.style.cursor = "default";
        },         this.TIMEOUT);
    }
    private nouvelleDifferenceTrouvee(): void {
        if (!this.modeSolo) {
            this.socket.differenceTrouvee(this.service.nom, this.partie.id, this.partie.type.toString());
        } else {
            this.messageRecu("Différence Trouvée.");
        }
        this.verifierScrollBar();
        // Refresh l'image de différence
        this.differencesTrouvees++;
        this.audioTrouvee.pause();
        this.audioTrouvee.currentTime = 0;
        this.audioTrouvee.play().then().catch((error) => {/*Erreur ignorée: erreur lancée que durant les tests*/});
        if (this.differencesTrouvees === this.differencesAttendues) {
            this.terminerPartie();
            if (!this.modeSolo) {
                this.socket.envoyerFinPartie(this.getCleComplete1v1());
            }
        }
    }
    private getCleComplete1v1(): string {
        return this.idPartie + this.type.toString() + this.id1v1;
    }
    private terminerPartie(): void {
        this.chrono.stop();
        this.partieTerminee = true;
        const secParMinute: number = 60;
        const temps: number = this.chrono.minutes * secParMinute + this.chrono.secondes;
        this.service.updateScore(temps, this.idPartie, this.type, this.modeSolo).subscribe((posString: string) => {
            const pos: number = +posString; // position = 1,2 ou 3. 0 si pas meilleur score. -1 si erreur
            if (pos > 0) {
                this.socket.envoyerScore(this.service.nom, this.partie.nom, pos, 0);
            }
        });
        if (this.type === TypeDePartie.SIMPLE) {
            this.service.terminerJeu(this.idPartie).subscribe((confirmation: Confirmation) => {
                if (!confirmation.ajoute) {
                    const message: HTMLElement = document.getElementById("messagePartieTerminee") as HTMLElement;
                    message.innerHTML = "Erreur lors de la communication au serveur." +
                                        "Vérifiez votre connexion. Votre score n'a pas été sauvegardé.";
                }
            });
        }
    }
    private finPartieRecue(): void {
        this.chrono.stop();
        this.partiePerdue = true;
        this.partieTerminee = true;
    }
    private retour(): void {
        this.router.navigate(["selection"]).then().catch();
    }
    private verificationRefresh(): void {
        if (!this.gestionnaire.getPartieSelectionnee()) {
            this.retour();
        }
    }
    private getHeure(): string {
        const date: Date = new Date();

        return date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds() + " - ";
    }
    public connexionUtilisateur(nom: string): void {
        this.evenements.push(this.getHeure() + nom + " vient de se connecter.");
        this.verifierScrollBar();
    }
    public deconnexionUtilisateur(nom: string): void {
        this.evenements.push(this.getHeure() + nom + " vient de se déconnecter.");
        this.verifierScrollBar();
    }
    public ajoutScore(messageScore: string): void {
        this.evenements.push(this.getHeure() + messageScore);
        this.verifierScrollBar();
    }
    private verifierScrollBar(): void {
        const evenements: HTMLElement | null = document.getElementById("evenements");
        if (evenements != null) {
            evenements.scrollTop = evenements.scrollHeight;
        }
    }
    public messageRecu(message: string): void {
        this.evenements.push(this.getHeure() + message);
        this.verifierScrollBar();
    }
}
