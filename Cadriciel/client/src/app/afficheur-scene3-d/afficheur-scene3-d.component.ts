import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from "@angular/core";
import * as THREE from "three";
import { GestionnaireDeParties } from "../GestionnaireDeParties";
import { GestionnaireCollisions } from "../ObjetDeJeu/GestionnaireCollisions";
import { ListeObjets, PartieLibre } from "../PartieLibre";
import { GenerateurGeometrique } from "../generateur-scene/generateur-geo";
import { GenerateurScene } from "../generateur-scene/generateur-scene";
import { GenerateurThematique } from "../generateur-scene/generateur-theme";
import { CameraPremierePersonne, TOUCHE_CLICK_DROIT, TOUCHE_CLICK_GAUCHE } from "../services/CameraPremierePersonne";
import { AfficheurScene3dService } from "../services/afficheur-scene3d.service";
import { CommunicationService } from "../services/communication.service";
import { ModeTriche } from "./mode-triche";

@Component({
    selector: "app-afficheur-scene3-d",
    templateUrl: "./afficheur-scene3-d.component.html",
    styleUrls: ["./afficheur-scene3-d.component.css"],
})
export class AfficheurScene3DComponent implements AfterViewInit {
    public testNgAfterViewInit: boolean;
    public ignorerClicks: boolean;
    public gestionnaireModeTriche: ModeTriche;
    private generateurScene: GenerateurScene;
    private gestionnaireCollisions: GestionnaireCollisions;
    private gestionnaireDeParties: GestionnaireDeParties;
    private posDiffTrouvees: THREE.Vector3[];

    @ViewChild("conteneurSceneOriginale")
    private conteneurOriginalRef: ElementRef;

    @ViewChild("conteneurSceneModifiee")
    private conteneurModifieRef: ElementRef;

    public constructor(public serviceRendu: AfficheurScene3dService,
                       private communication: CommunicationService) {
        this.testNgAfterViewInit = false;
        this.gestionnaireDeParties = GestionnaireDeParties.getGestionnaire();
        this.gestionnaireCollisions = GestionnaireCollisions.obtenirGestionnaire();
        this.posDiffTrouvees = [];
        this.ignorerClicks = false;
    }
    @HostListener("document:keyup", ["$event"])
    public gestionClavierDesactiverTouche(event: KeyboardEvent): void {
        this.serviceRendu.cameraAmovible.alternerActivationTranslation(event, false);
    }
    @HostListener("document:keydown", ["$event"])
    public gestionClavierActiverTouche(event: KeyboardEvent): void {
        if (event.key === "c") { this.gestionnaireCollisions.rendreCollisionneursVisible(); }
        if (event.key === "t") {
            this.gestionnaireModeTriche.estActif = !this.gestionnaireModeTriche.estActif;
            this.gestionnaireModeTriche.activerModeTriche();
        } else {
            this.serviceRendu.cameraAmovible.alternerActivationTranslation(event, true);
        }
    }
    @HostListener("document:mousemove", ["$event"])
    public gestionSourisMouvement(event: MouseEvent): void {
        if ((event.target as Element).localName === "canvas") {
            this.serviceRendu.cameraAmovible.effectuerRotation(event.movementX, event.movementY);
        } else {
            if (this.serviceRendu.cameraAmovible === undefined) {
                this.serviceRendu.cameraAmovible = new CameraPremierePersonne(0);
            }
            this.serviceRendu.cameraAmovible.alternerActivationRotation(false);
        }
    }
    @HostListener("document:mouseup", ["$event"])
    public gestionSourisDesactiverClick(event: MouseEvent): void {
        this.serviceRendu.cameraAmovible.alternerActivationRotation(false);
    }
    @HostListener("document:mousedown", ["$event"])
    public gestionSourisActiverClick(event: MouseEvent): void {
        if ((event.target as Element).localName === "canvas") {
            if (event.button === TOUCHE_CLICK_DROIT) {
                this.serviceRendu.cameraAmovible.alternerActivationRotation(true);
            }
            if (event.button === TOUCHE_CLICK_GAUCHE && !this.ignorerClicks) {
                this.gererClickGauche(event);
            }
        }
    }

    private gererClickGauche(event: MouseEvent): void {
        const pos: THREE.Vector3 | undefined = this.serviceRendu.identifierObjet(event);
        if (pos !== undefined) {
            const objDejaTrouve: THREE.Vector3 | undefined = this.posDiffTrouvees.find((element: THREE.Vector3) => {
                return this.serviceRendu.memePosition(element, pos);
            });
            if (objDejaTrouve === undefined) {
                this.posDiffTrouvees.push(pos);
                this.communication.envoyerClickLibre(this.gestionnaireDeParties.getPartieSelectionnee().id, pos.x, pos.y, pos.z)
                .subscribe((trouve: boolean) => {
                    if (trouve) {
                        this.serviceRendu.enleverDifference(pos);
                        document.dispatchEvent(new CustomEvent("nouvelleDifference", {"detail": pos}));
                    } else {
                        this.envoyerErreurClick(event);
                    }
                });
            } else {
                this.envoyerErreurClick(event);
            }
        } else {
            this.envoyerErreurClick(event);
        }
    }

    public envoyerErreurClick(event: MouseEvent): void {
        const posClique: number[] = [event.pageX, event.pageY];
        document.dispatchEvent(new CustomEvent("aucuneDifference", {"detail": posClique}));
    }

    public get conteneurOriginal(): HTMLDivElement {
        return this.conteneurOriginalRef.nativeElement;
    }

    public get conteneurModifie(): HTMLDivElement {
        return this.conteneurModifieRef.nativeElement;
    }

    public ngAfterViewInit(): void {
        this.gestionnaireDeParties = GestionnaireDeParties.getGestionnaire();
        this.serviceRendu.initialiserAffichage(this.conteneurOriginal, this.conteneurModifie);
        this.testNgAfterViewInit = true;
    }

    public chargerScene(listeObjets: ListeObjets): void {
        this.gestionnaireModeTriche = new ModeTriche(this.serviceRendu.sceneOriginale, this.serviceRendu.sceneModifiee);

        const partieLibre: PartieLibre = this.gestionnaireDeParties.getPartieSelectionnee() as PartieLibre;
        if (partieLibre) {
            this.generateurScene = ((partieLibre.typeObjets as string) === "Formes thématiques") ? new GenerateurThematique() :
            new GenerateurGeometrique();
            this.serviceRendu.sceneGeneree = false;
            this.generateurScene.chargerScene(listeObjets, this.serviceRendu.sceneOriginale, this.serviceRendu.sceneModifiee);
            this.serviceRendu.sceneGeneree = true;
        }
    }
}
