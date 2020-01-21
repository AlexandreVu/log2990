import { Component } from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ALPHA_NUMERIQUE, NOM_JEU } from "../Constantes";
import { Partie, TypeDePartie } from "../Partie";
import { CommunicationService } from "../services/communication.service";
import { FormulaireService } from "../services/formulaire.service";
import { ExceptionChampInvalide, GestionFormulaireService } from "../services/gestion-formulaire.service";
import { SocketService } from "../services/socket.service";

@Component({
    selector: "app-formulaire-jeu-simple",
    templateUrl: "./formulaire-jeu-simple.component.html",
    styleUrls: ["./formulaire-jeu-simple.component.css"],
})

export class FormulaireJeuSimpleComponent {

    public readonly MIN_LONGUEUR_NOM: number = 3;
    public readonly MAX_LONGUEUR_NOM: number = 20;

    public essaiEnvoi: boolean;
    public envoye: boolean;
    public creationConfirme: boolean;
    public messageErreur: string;
    private imageOriginale: File;
    private imageModifiee: File;

    public constructor(private fb: FormBuilder, private gestionnaire: GestionFormulaireService,
                       private communications: CommunicationService,
                       private ficheService: FormulaireService,
                       private socket: SocketService) {
                           this.essaiEnvoi = false;
                           this.envoye = false;
                           this.creationConfirme = false;
                       }
    public jeuSimpleForm: FormGroup = this.fb.group({
        nomJeu: ["", [Validators.required, Validators.minLength(this.MIN_LONGUEUR_NOM), Validators.maxLength(this.MAX_LONGUEUR_NOM),
                      Validators.pattern(ALPHA_NUMERIQUE)]],
        imageOriginale: ["", [Validators.required, this.gestionnaire.validerFormatBitmap, this.gestionnaire.validerNomFichier]],
        imageModifiee: ["", [Validators.required, this.gestionnaire.validerFormatBitmap, this.gestionnaire.validerNomFichier]],
    });

    // Retourne les éléments du formulaire pour un controle plus simple dans le HTML
    public getControles(): { [key: string]: AbstractControl } {
        return this.jeuSimpleForm.controls;
    }

    // Vérifie que les champs du formulaire sont valides
    public valider(): void {
        this.essaiEnvoi = true;
        if (!this.jeuSimpleForm.invalid) {
            try {
                const nomJeu: AbstractControl | null = this.jeuSimpleForm.get(NOM_JEU);
                if (nomJeu == null) {
                    throw new ExceptionChampInvalide("nom du jeu");
                }
                this.envoyerFormulaire(nomJeu);
            } catch (e) {
                alert(e.message);
            }
        }
    }

    private envoyerFormulaire(nomJeu: AbstractControl): void {
        const formData: FormData = this.gestionnaire.genererFormData(nomJeu.value, this.imageOriginale, this.imageModifiee);
        this.communications.envoyerFormulaire(formData).subscribe((res) => {
            if (res !== undefined) {
                this.creationConfirme = res.ajoute;
                if (!res.ajoute) {
                    this.messageErreur = res.erreur;
                } else {
                    const partie: Partie = new Partie(0, nomJeu.value, TypeDePartie.SIMPLE);
                    partie.setIdImageOriginale(res.idImageOriginale);
                    partie.setIdImageModifiee(res.idImageModifiee);
                    partie.setIdImageDifferences(res.idImageDifferences);
                    this.ficheService.getIdDisponible(partie).subscribe((idR: {id: number}) => {
                        partie.setId(idR.id);
                        // tslint:disable-next-line:no-empty --> la fonction subscribe ne fait rien dans ce component.
                        this.ficheService.envoyerPartieSimple(partie).subscribe((bool: boolean) => {
                            this.socket.changement();
                        });
                    });
                }
            }
            this.envoye = true;
        });
    }
    public ajoutImageOriginale(event: Event): void {
        const target: HTMLInputElement | null = event.target as HTMLInputElement;
        if (target !== null && target.files !== null) {
            this.imageOriginale = target.files[0];
        }
    }

    public ajoutImageModifiee(event: Event): void {
        const target: HTMLInputElement | null = event.target as HTMLInputElement;
        if (target !== null && target.files !== null) {
            this.imageModifiee = target.files[0];
        }
    }

    public reinitialiser(): void {
        this.jeuSimpleForm.reset();
        this.essaiEnvoi = false;
        this.envoye = false;
        this.creationConfirme = false;
    }
}
