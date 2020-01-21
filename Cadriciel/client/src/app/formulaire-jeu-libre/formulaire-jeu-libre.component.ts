import { AfterViewInit, Component} from "@angular/core";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ALPHA_NUMERIQUE, NOM_JEU, NUMERIQUE } from "../Constantes";
import { GestionnaireDeParties } from "../GestionnaireDeParties";
import { PartieLibre } from "../PartieLibre";
import { AfficheurScene3DComponent } from "../afficheur-scene3-d/afficheur-scene3-d.component";
import { GenerateurGeometrique } from "../generateur-scene/generateur-geo";
import { GenerateurThematique } from "../generateur-scene/generateur-theme";
import { AfficheurScene3dService } from "../services/afficheur-scene3d.service";
import { FormulaireService } from "../services/formulaire.service";
import { SocketService } from "../services/socket.service";

export class ExceptionRecuperationJeuLibreComponent extends Error {
    public constructor(champ: string) {
        super();
        this.name = "ExceptionRecuperationJeu";
        this.message = champ;
    }
}

@Component({
    selector: "app-formulaire-jeu-libre",
    templateUrl: "./formulaire-jeu-libre.component.html",
    styleUrls: ["./formulaire-jeu-libre.component.css"],
})
export class FormulaireJeuLibreComponent implements AfterViewInit {

    public readonly MIN_LONGUEUR_NOM: number = 3;
    public readonly MAX_LONGUEUR_NOM: number = 20;
    public readonly MIN_QUANTITE: number = 10;
    public readonly MAX_QUANTITE: number = 200;

    public essaiEnvoi: boolean;
    public envoye: boolean;
    public creationConfirme: boolean;
    public messageErreur: string;
    public typeObjetSelectionne: string;
    public modificationsSelectionnees: string[];
    public nomModifs: string;
    public captureDEcran: string;
    public cacherScene: boolean;
    public scene3D: AfficheurScene3DComponent;
    public gestionnaireDeParties: GestionnaireDeParties;
    public partieLibre: PartieLibre;

    public constructor(private fb: FormBuilder, private ficheService: FormulaireService,
                       public serviceRendu: AfficheurScene3dService,
                       private socket: SocketService) {
        this.essaiEnvoi = false;
        this.envoye = false;
        this.creationConfirme = false;
        this.modificationsSelectionnees = [];
        this.gestionnaireDeParties = GestionnaireDeParties.getGestionnaire();
        this.captureDEcran = "";
        this.cacherScene = false;
        this.partieLibre = new PartieLibre(0, "");
    }

    public jeuLibreForm: FormGroup = this.fb.group({
        nomJeu: ["", [Validators.required, Validators.minLength(this.MIN_LONGUEUR_NOM), Validators.maxLength(this.MAX_LONGUEUR_NOM),
                      Validators.pattern(ALPHA_NUMERIQUE)]],
        typeObjetSelectionne: ["", [Validators.required]],
        quantiteObjets: ["", [Validators.required, Validators.min(this.MIN_QUANTITE), Validators.max(this.MAX_QUANTITE),
                              Validators.pattern(NUMERIQUE)]],
        modifications: ["", Validators.requiredTrue, this.modificationsSelectionnees],
    });

    public typeObjets: Array<Object> = [
        {typeObjet: "Formes géométriques"},
        {typeObjet: "Formes thématiques"},
    ];

    public ngAfterViewInit(): void {
        this.cacherScene = true;
    }

    public captureScene(): void {
        let donneesImage: string;
        const strDownloadMime: string = "image/octet-stream";

        const strMime: string = "image/bitmap";

        this.cacherScene = false;
        donneesImage = this.serviceRendu.getGestionnaireDeRendu().domElement.toDataURL(strMime);

        this.captureDEcran = donneesImage.replace(strMime, strDownloadMime);
        this.cacherScene = true;

        this.partieLibre.setIdImageOriginale(this.captureDEcran);
        this.captureDEcran = "";

        this.envoyer();
    }

    // type de modifications -- on peut faire 3 modif.
    public ajouterModifications(event: string): void {
        const NB_MODIFS: number = this.modificationsSelectionnees.length;
        if (!this.getControles()[event].invalid) {
            this.modificationsSelectionnees[NB_MODIFS] = this.nomModifs;
        } else {
            this.modificationsSelectionnees.splice(this.modificationsSelectionnees.indexOf(this.nomModifs), 1);
        }
    }

    public nomModifications(event: string): void {
        this.nomModifs = event;
    }

    // Retourne les éléments du formulaire pour un controle plus simple dans le HTML
    public getControles(): { [key: string]: AbstractControl } {
        return this.jeuLibreForm.controls;
    }

    // Vérifie que les champs du formulaire sont valides
    public valider(): void {
        this.essaiEnvoi = true;
        if (!this.jeuLibreForm.invalid) {
            try {
                const nomJeu: AbstractControl | null = this.jeuLibreForm.get(NOM_JEU);
                const quantiteObjets: AbstractControl | null = this.jeuLibreForm.get("quantiteObjets");
                if (nomJeu == null || nomJeu.value == null) {
                    throw new ExceptionRecuperationJeuLibreComponent("Erreur dans la récupération du nom du jeu");
                }
                if (quantiteObjets == null || quantiteObjets.value == null) {
                    throw new ExceptionRecuperationJeuLibreComponent("Erreur dans la récupération de la quantité d'objets");
                }
                this.creationConfirme = true;

                this.partieLibre.nom = nomJeu.value;

                this.partieLibre.quantiteObjets = quantiteObjets.value;
                this.gestionnaireDeParties.setNbObjets(quantiteObjets.value);

                this.donnerTypeModifications();
                this.partieLibre.typeObjets = this.getControles()["typeObjetSelectionne"].value;

                this.envoye = true;

                this.generationScene();
            } catch (e) {
                alert(e.message);
            }
        }
    }

    // Reinitialise les champs du formulaire
    public reinitialiser(): void {
        this.jeuLibreForm.reset();
        this.essaiEnvoi = false;
        this.envoye = false;
        this.creationConfirme = false;
    }

    private envoyer(): void {
        this.ficheService.getIdDisponible(this.partieLibre).subscribe((idR: {id: number}) => {
            this.partieLibre.setId(idR.id);
            this.ficheService.envoyerPartieLibre(this.partieLibre).subscribe((bool: boolean) => {
                /* Vide */
                this.socket.changement();
            });
        });
        this.modificationsSelectionnees = [];
        this.gestionnaireDeParties.setAjout(false);
        this.gestionnaireDeParties.setRetrait(false);
        this.gestionnaireDeParties.setModCouleur(false);
        this.serviceRendu.reinitialiser();
    }

    private generationScene(): void {
        if (this.partieLibre.typeObjets.valueOf() === "Formes thématiques") {
            const generateur: GenerateurThematique = new GenerateurThematique();
            this.partieLibre.listeObjets = generateur.genererScene();
        } else {
            const generateur: GenerateurGeometrique = new GenerateurGeometrique();
            this.partieLibre.listeObjets = generateur.genererScene();
        }

        this.gestionnaireDeParties.objetsDansLaScene = this.partieLibre.listeObjets.liste;

        this.gestionnaireDeParties.setPartieSelectionnee(this.partieLibre);

        this.scene3D.chargerScene(this.partieLibre.listeObjets);
    }

    private donnerTypeModifications(): void {
        this.partieLibre.typeModifications = this.modificationsSelectionnees;

        let item: string;
        for (item of this.modificationsSelectionnees) {
            if (item === "ajout") {
                this.gestionnaireDeParties.setAjout(true);
            }
            if (item === "suppression") {
                this.gestionnaireDeParties.setRetrait(true);
            }
            if (item === "changementCouleur") {
                this.gestionnaireDeParties.setModCouleur(true);
            }
        }
    }
}
