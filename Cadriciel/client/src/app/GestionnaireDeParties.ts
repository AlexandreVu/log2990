import { Partie, TypeDePartie } from "./Partie";
import { ListeObjets, PartieLibre } from "./PartieLibre";
import { Proprietes } from "./objet3-d/objet3-d";

const NB_OBJETS_DEFAUT: number = 50;

export class GestionnaireDeParties {
    private static instanceUnique: GestionnaireDeParties;
    private static estInstancie: boolean = false;
    private partieSelectionnee: Partie | PartieLibre;
    private partiesSimple: Partie[];
    private partiesLibre: PartieLibre[];
    private nbObjetsDansLaScene: number;
    private ajout: boolean;
    private retrait: boolean;
    private modCouleur: boolean;
    public idVS: string;
    public objetsDansLaScene: Proprietes[];
    public objetsModifies: Proprietes[];

    public static getGestionnaire(): GestionnaireDeParties {
        if (!this.estInstancie) {
            this.instanceUnique = new GestionnaireDeParties();
            this.estInstancie = true;
        }

        return this.instanceUnique;
    }
    private constructor() {
        GestionnaireDeParties.instanceUnique = this;
        this.objetsDansLaScene = new Array();
        this.objetsModifies = new Array();
        this.nbObjetsDansLaScene = NB_OBJETS_DEFAUT;
        this.ajout = false;
        this.retrait = false;
        this.modCouleur = false;
        this.partiesLibre = [];
        this.partiesSimple = [];
    }

    public creerPartieUnContreUnSimple(partieId: number): void {
        for (const item of this.getPartiesSimple()) {
            if (item.id === partieId) {
                item.partieEnLigne = true;
            }
        }
    }

    public creerPartieUnContreUnLibre(partieId: number): void {
        for (const item of this.getPartiesLibre()) {
            if (item.id === partieId) {
                item.partieEnLigne = true;
            }
        }
    }

    public annulerPartieUnContreUnSimple(partieId: number): void {
        for (const item of this.getPartiesSimple()) {
            if (item.id === partieId) {
                item.partieEnLigne = false;
            }
        }
    }

    public annulerPartieUnContreUnLibre(partieId: number): void {
        for (const item of this.getPartiesLibre()) {
            if (item.id === partieId) {
                item.partieEnLigne = false;
            }
        }
    }

    public setPartieSelectionnee(partie: Partie | PartieLibre): void {
        this.partieSelectionnee = partie;
    }
    public getPartieSelectionnee(): Partie | PartieLibre {
        return this.partieSelectionnee;
    }
    public setPartiesSimple(desPartiesSimple: Partie[]): void {
        this.partiesSimple = desPartiesSimple;
    }
    public getPartiesSimple(): Partie[] {
        return this.partiesSimple;
    }
    public updatePartie(partie: Partie): void {
        if (partie.type === TypeDePartie.SIMPLE) {
            const index: number = this.partiesSimple.findIndex((element: Partie) => {
                return element.id === partie.id;
            });
            this.partiesSimple[index] = partie;
        } else {
            const index: number = this.partiesLibre.findIndex((element: PartieLibre) => {
                return element.id === partie.id;
            });
            this.partiesLibre[index] = partie as PartieLibre;
        }
    }
    public setPartiesLibre(desPartiesLibre: PartieLibre[]): void {
        this.partiesLibre = desPartiesLibre;
    }
    public getPartiesLibre(): PartieLibre[] {
        return this.partiesLibre;
    }
    public ajouterObjet(proprietes: Proprietes): void {
        this.objetsDansLaScene.push(proprietes);
    }
    public estPartieVide(): boolean {
        return (this.objetsDansLaScene.length < 1 || this.objetsDansLaScene === undefined);
    }
    public getListeProprietes(): Proprietes[] {
        return this.objetsDansLaScene;
    }
    public getListeObjets(): ListeObjets {
        return {liste: this.objetsDansLaScene};
    }
    public getListeModifiee(): Proprietes[] {
        return this.objetsModifies;
    }
    public setListeModifiee(listeModifiee: Proprietes[]): void {
        this.objetsModifies = listeModifiee;
    }
    public setRestrictions(nbObjets: number, ajout: boolean, retrait: boolean, modCouleur: boolean): void {
        this.nbObjetsDansLaScene = nbObjets;
        this.ajout = ajout;
        this.retrait = retrait;
        this.modCouleur = modCouleur;
    }
    public getAjout(): boolean {
        return this.ajout;
    }
    public setAjout(unAjout: boolean): void {
        this.ajout = unAjout;
    }
    public getRetrait(): boolean {
        return this.retrait;
    }
    public setRetrait(unRetrait: boolean): void {
        this.retrait = unRetrait;
    }
    public getModCouleur(): boolean {
        return this.modCouleur;
    }
    public setModCouleur(uneModCouleur: boolean): void {
        this.modCouleur = uneModCouleur;
    }
    public getNbObjets(): number {
        return this.nbObjetsDansLaScene;
    }
    public setNbObjets(unNbObjets: number): void {
        this.nbObjetsDansLaScene = unNbObjets;
    }
}
