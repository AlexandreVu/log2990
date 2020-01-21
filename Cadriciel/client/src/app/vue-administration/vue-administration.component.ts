import { AfterViewInit, ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { Confirmation } from "../../../../common/communication/confirmation";
import { CLICK, SERVEUR_UPLOADS } from "../Constantes";
import { GestionnaireDeParties } from "../GestionnaireDeParties";
import { Partie as Partie } from "../Partie";
import { PartieLibre } from "../PartieLibre";
import { AfficheurScene3DComponent } from "../afficheur-scene3-d/afficheur-scene3-d.component";
import { FormulaireJeuLibreComponent } from "../formulaire-jeu-libre/formulaire-jeu-libre.component";
import { FormulaireJeuSimpleComponent } from "../formulaire-jeu-simple/formulaire-jeu-simple.component";
import { CommunicationService } from "../services/communication.service";
import { FormulaireService } from "../services/formulaire.service";
import { SocketService } from "../services/socket.service";

@Component({
    selector: "app-vue-administration",
    templateUrl: "./vue-administration.component.html",
    styleUrls: ["../liste-parties/liste-parties.component.css"],
})
export class VueAdministrationComponent implements OnInit, AfterViewInit {
    @ViewChild(FormulaireJeuSimpleComponent) private formulaire: FormulaireJeuSimpleComponent;
    @ViewChild(FormulaireJeuLibreComponent) private formulaireLibre: FormulaireJeuLibreComponent;

    @ViewChild("scene3D")
    private scene3D: AfficheurScene3DComponent;

    public gestionnaireDeParties: GestionnaireDeParties;
    public formulaireOuvert: boolean;
    public formulaireOuvertLibre: boolean;
    protected readonly ADRESSE_SERVEUR: string = SERVEUR_UPLOADS;

    public constructor(private communication: CommunicationService,
                       private service: FormulaireService,
                       private socketService: SocketService,
                       private cd: ChangeDetectorRef) {
                        this.gestionnaireDeParties = GestionnaireDeParties.getGestionnaire();
                        this.formulaireOuvert = false;
                        this.formulaireOuvertLibre = false;
                       }

    public ngOnInit(): void {
        const btnOuvrirFormulaire: HTMLElement | null = document.getElementById("btnOuvrirFormulaire");
        if (btnOuvrirFormulaire != null) {
            btnOuvrirFormulaire.addEventListener(CLICK, (e: Event) => this.ouvrirFormulaire());
        }
        const btnOuvrirFormulaireLibre: HTMLElement | null = document.getElementById("btnOuvrirFormulaireLibre");
        if (btnOuvrirFormulaireLibre != null) {
            btnOuvrirFormulaireLibre.addEventListener(CLICK, (e: Event) => this.ouvrirFormulaireLibre());
        }

        this.formulaireLibre.scene3D = this.scene3D;

        this.socketService.initSocket();

        this.socketService.onChangement().subscribe((info: boolean) => {
            this.chargerParties();
        });
        this.gestionnaireDeParties = GestionnaireDeParties.getGestionnaire();
        this.chargerParties();
    }

    public ngAfterViewInit(): void {
        this.cd.detectChanges();
    }

    @HostListener("window:beforeunload", ["$event"]) public beforeUnload($event: BeforeUnloadEvent): void {
        const EST_CONFIRME: boolean = confirm("Voulez-vous vraiment vous deconnecter?");
        if (EST_CONFIRME) {
            // Rien ne se passe lors de la déconnexion dans ce component
            // tslint:disable-next-line:no-empty
            this.communication.deconnecter(this.communication.nom).subscribe((confirmation: Confirmation) => {
            });
        }
    }

    public reinitialiserScores(): void {
        const EST_CONFIRME: boolean = confirm("Voulez-vous vraiment réinitialiser les scores ?");

        if (EST_CONFIRME) {
            this.service.calculer({id: this.gestionnaireDeParties.getPartieSelectionnee().id,
                                   type: this.gestionnaireDeParties.getPartieSelectionnee().type})
                                  .subscribe((partie: Partie) => {this.gestionnaireDeParties.updatePartie(partie); });
        }
        this.socketService.changement();
    }

    public supprimerPartie(): void {
        const EST_CONFIRME: boolean = confirm("Voulez-vous vraiment supprimer la partie ?");

        if (EST_CONFIRME) {
            const partieSelectionnee: Partie = this.gestionnaireDeParties.getPartieSelectionnee();
            this.service.supprimerPartie(partieSelectionnee.id,
                                         partieSelectionnee.type,
                                         partieSelectionnee.idImageOriginale,
                                         partieSelectionnee.idImageModifiee,
                                         partieSelectionnee.idImageDifferences,
                                        ).subscribe((bool: boolean) => {this.chargerParties(); });
            this.socketService.partieSupprimeeActualiser(partieSelectionnee.id, partieSelectionnee.type.toString().toLowerCase());
            this.socketService.changement();
        }
    }

    public ouvrirFormulaire(): void {
        this.formulaireOuvert = true;
        const btnsFermerFormulaire: HTMLCollectionOf<Element> = document.getElementsByClassName("btnFermerFormulaire");
        Array.from(btnsFermerFormulaire, (btn) => btn.addEventListener(CLICK, (e: Event) => this.fermerFormulaire()));
    }

    public fermerFormulaire(): void {
        this.formulaire.reinitialiser();
        this.formulaireOuvert = false;
    }

    public ouvrirFormulaireLibre(): void {
        this.formulaireOuvertLibre = true;
        const btnFermerFormulaireLibre: HTMLCollectionOf<Element> = document.getElementsByClassName("btnFermerFormulaireLibre");
        Array.from(btnFermerFormulaireLibre, (btn) => btn.addEventListener(CLICK,
                                                                           (e: Event) => this.fermerFormulaireLibre()));
    }

    public fermerFormulaireLibre(): void {
        this.formulaireLibre.reinitialiser();
        this.formulaireOuvertLibre = false;
    }

    public chargerParties(): void {
        this.service.getPartiesSimples().subscribe((parties: Partie[]) => {
            this.gestionnaireDeParties.setPartiesSimple(parties);
        });

        this.service.getPartiesLibres().subscribe((parties: PartieLibre[]) => {
            this.gestionnaireDeParties.setPartiesLibre(parties);
        });
    }
}
