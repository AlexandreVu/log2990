import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Partie, TypeDePartie } from "../Partie";
import { PartieLibre } from "../PartieLibre";

import { of, Observable } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
    providedIn: "root",
})
export class FormulaireService {

    private readonly URL_AJOUT_SIMPLE: string = "http://localhost:3000/ajoutFicheSimple";
    private readonly URL_AJOUT_LIBRE: string = "http://localhost:3000/ajoutFicheLibre";
    private readonly URL_SUPP: string = "http://localhost:3000/supprimerPartie";
    private readonly URL_GET_LIBRE: string = "http://localhost:3000/getPartiesLibre";
    private readonly URL_GET_SIMPLE: string = "http://localhost:3000/getPartiesSimple";
    private readonly URL_CALCULER: string = "http://localhost:3000/calculer";
    private readonly URL_GET_ID: string = "http://localhost:3000/id";

    public constructor(private http: HttpClient) { /* Vide */ }

    public getIdDisponible(type: {type: TypeDePartie}): Observable<{id: number}> {
        return this.http.put<{id: number}>(this.URL_GET_ID, type).pipe(
            catchError(this.handleError<{id: number}>("getId")),
        );
    }

    public envoyerPartieSimple(fiche: Partie): Observable<boolean> {
        return this.http.post<boolean>(this.URL_AJOUT_SIMPLE, fiche).pipe(
            catchError(this.handleError<boolean>("envoyerPartie")),
        );
    }

    public envoyerPartieLibre(fiche: PartieLibre): Observable<boolean> {
        return this.http.post<boolean>(this.URL_AJOUT_LIBRE, fiche).pipe(
            catchError(this.handleError<boolean>("envoyerPartie")),
        );
    }

    public supprimerPartie(id: number, type: TypeDePartie,
                           idImageOriginale: string, idImageModifiee: string, idImageDifferences: string): Observable<boolean> {
        const data: Object = {id: id, type: type, idImageOriginale: idImageOriginale,
                              idImageModifiee: idImageModifiee, idImageDifferences: idImageDifferences};

        return this.http.put<boolean>(this.URL_SUPP, data).pipe(
            catchError(this.handleError<boolean>("supprimerPartie")),
        );
    }

    public getPartiesLibres(): Observable<Partie[]> {
        return this.http.get<Partie[]>(this.URL_GET_LIBRE).pipe(
            catchError(this.handleError<Partie[]>("getPartieLibre")),
        );
    }

    public getPartiesSimples(): Observable<Partie[]> {
        return this.http.get<Partie[]>(this.URL_GET_SIMPLE).pipe(
            catchError(this.handleError<Partie[]>("getPartiesSimple")),
        );
    }

    public calculer(partie: {id: number, type: TypeDePartie}): Observable<Partie> {
        return this.http.put<Partie>(this.URL_CALCULER, partie).pipe(
            catchError(this.handleError<Partie>("calculer")),
        );
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {

        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
