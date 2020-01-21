import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { of, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { Confirmation } from "../../../../common/communication/confirmation";
import { ReponseDifferences } from "../../../../common/communication/differences";
import { ALPHA_NUMERIQUE_REGEX } from "../Constantes";
import { Partie, TypeDePartie } from "../Partie";
import { PartieLibre } from "../PartieLibre";

@Injectable({
    providedIn: "root",
})
export class CommunicationService {

    private readonly BASE_URL_CONNEXION: string = "http://localhost:3000/connexion";
    private readonly BASE_URL_DECONNEXION: string = "http://localhost:3000/deconnexion";
    private readonly BASE_URL_FORMULAIRE: string = "http://localhost:3000/formulaire";
    private readonly BASE_URL_COMMENCER_JEU: string = "http://localhost:3000/commencerJeu";
    private readonly BASE_URL_VERIFIER_DIFFERENCE_SIMPLE: string = "http://localhost:3000/verifierDifferenceSimple";
    private readonly BASE_URL_VERIFIER_DIFFERENCE_LIBRE: string = "http://localhost:3000/verifierDifferenceLibre";
    private readonly BASE_URL_TERMINER_JEU: string = "http://localhost:3000/terminerJeu";
    private readonly BASE_URL_UPDATE_SCORE: string = "http://localhost:3000/updateScore";
    private readonly URL_GET_SIMPLE_ID: string = "http://localhost:3000/partiesSimples/";
    private readonly URL_GET_LIBRE_ID: string = "http://localhost:3000/partiesLibres/";
    private readonly URL_GET_ID_VS: string = "http://localhost:3000/VS";
    private _nom: string;

    private readonly MIN_LENGTH: number = 4;
    private readonly MAX_LENGTH: number = 12;

    public constructor(private http: HttpClient) { }

    public envoyerNom(nom: string): Observable<Confirmation> {
        return this.http.post<Confirmation>(this.BASE_URL_CONNEXION, { nom: nom }).pipe(
            catchError(this.handleError<Confirmation>("envoyerNom")),
        );
    }

    public get nom(): string {
        if (this._nom !== undefined) {
            return this._nom;
        } else if (window.localStorage["nom"] !== undefined) {
            return window.localStorage["nom"];
        } else {
            return "";
        }
    }

    public set nom(nouvNom: string) {
        this._nom = nouvNom;
        window.localStorage["nom"] = nouvNom;
    }

    public deconnecter(nom: string): Observable<Confirmation> {
        return this.http.put<Confirmation>(this.BASE_URL_DECONNEXION, { nom: nom }).pipe(
            catchError(this.handleError<Confirmation>("deconnecter")),
        );
    }

    public envoyerFormulaire(formulaire: FormData): Observable<ReponseDifferences> {
        return this.http.post<ReponseDifferences>(this.BASE_URL_FORMULAIRE, formulaire).pipe(
            catchError(this.handleError<ReponseDifferences>("envoyerFormulaire")),
        );
    }

    public commencerJeu(idJeu: string, idImageOriginale: string,
                        idImageModifiee: string, idImageDifferences: string): Observable<string> {
        const data: Object = {idJeu: idJeu, nom: this.nom, idImageOriginale: idImageOriginale, idImageModifiee: idImageModifiee,
                              idImageDifferences: idImageDifferences};

        return this.http.post<string>(this.BASE_URL_COMMENCER_JEU, data).pipe(
            catchError(this.handleError<string>("commencerJeu")),
        );
    }

    public envoyerClickSimple(idJeu: number, x: number, y: number, idImageOriginale: string): Observable<string> {
        const data: Object = {idJeu: idJeu, nom: this.nom, x: x, y: y, idImageOriginale: idImageOriginale};

        return this.http.post<string>(this.BASE_URL_VERIFIER_DIFFERENCE_SIMPLE, data).pipe(
            catchError(this.handleError<string>("verifierDifferenceSimple")),
        );
    }

    public envoyerClickLibre(idJeu: number, x: number, y: number, z: number): Observable<boolean> {
        const data: Object = {idJeu: idJeu, x: x, y: y, z: z};

        return this.http.post<boolean>(this.BASE_URL_VERIFIER_DIFFERENCE_LIBRE, data).pipe(
            catchError(this.handleError<boolean>("verifierDifferenceLibre")),
        );
    }

    public terminerJeu(idJeu: number): Observable<Confirmation> {
        const data: Object = {idJeu: idJeu, nom: this.nom};

        return this.http.post<Confirmation>(this.BASE_URL_TERMINER_JEU, data).pipe(
            catchError(this.handleError<Confirmation>("terminerJeu")),
        );
    }

    public updateScore(temps: number, idPartie: number, type: TypeDePartie, modeSolo: boolean): Observable<string> {
        const data: Object = {temps: temps, idPartie: idPartie, type: type, nom: this.nom, modeSolo: modeSolo};

        return this.http.post<string>(this.BASE_URL_UPDATE_SCORE, data).pipe(
            catchError(this.handleError<string>("updateScore")),
        );
    }

    public getPartieLibre(id: number): Observable<PartieLibre> {
        return this.http.get<PartieLibre>(this.URL_GET_LIBRE_ID + id).pipe(
            catchError(this.handleError<PartieLibre>("partiesLibres/" + id)),
        );
    }

    public getPartieSimple(id: number): Observable<Partie> {
        return this.http.get<Partie>(this.URL_GET_SIMPLE_ID + id).pipe(
            catchError(this.handleError<Partie>("partiesSimples/" + id)),
        );
    }

    public getIdVS(type: {type: TypeDePartie}): Observable<string> {
        return this.http.post<string>(this.URL_GET_ID_VS, type).pipe(
            catchError(this.handleError<string>("idMulti")),
        );
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }

    public verifierNom(nom: string): boolean {
        return ((nom.match(ALPHA_NUMERIQUE_REGEX) == null ||
                (nom.length < this.MIN_LENGTH || nom.length > this.MAX_LENGTH)) ?
                false : true);
    }
}
