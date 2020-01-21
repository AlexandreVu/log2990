import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Observer } from "rxjs/Observer";

import * as socketIo from "socket.io-client";
import { CliqueDifference } from "../../../../common/communication/differences";
import { TypeDePartie } from "../Partie";

const ADRESSE_SERVEUR: string = "http://localhost:3000";

@Injectable({
    providedIn: "root",
})
export class SocketService {
    public socket: SocketIOClient.Socket;

    public constructor() {
        this.initSocket();
     }

    public initSocket(): void {
        this.socket = socketIo(ADRESSE_SERVEUR);
    }

    public partieSupprimeeActualiser(id: number, type: string): void {
        this.socket.emit("supprimerPartie", id, type);
    }

    public joindreSalle(id: number, type: string, ajout: boolean, idVS: string): void {
        this.socket.emit("joindre", id, type, ajout, idVS);
    }

    public quitterSalle(id: number, type: string, idVS: string): void {
        this.socket.emit("quitter", id, type, idVS);
    }

    public onSupprimerPartie(): Observable<boolean> {
        return new Observable<boolean>((observer: Observer<boolean>) => {
            this.socket.on("supprimerPartie", (info: boolean) => {
                observer.next(info);
            });
        });
    }

    public connexion(nomUtilisateur: string): void {
        this.socket.emit("connexion", nomUtilisateur);
    }

    public onConnexion(): Observable<string> {
        return new Observable<string>((observer: Observer<string>) => {
            this.socket.on("connexion", (nom: string) => {
                observer.next(nom);
            });
        });
    }

    public deconnexion(nom: string): void {
        this.socket.emit("deconnexion", nom);
    }

    public onDeconnexion(): Observable<string> {
        return new Observable<string>((observer: Observer<string>) => {
            this.socket.on("deconnexion", (nom: string) => {
                observer.next(nom);
            });
        });
    }

    public envoyerScore(nom: string, nomJeu: String, position: number, nbJoueurs: number): void {
        this.socket.emit("ajoutScore", nom, nomJeu, position, nbJoueurs);
    }

    public onScore(): Observable<string> {
        return new Observable<string>(
            (observer: Observer<string>) => {
                this.socket.on("ajoutScore", (message: string) => {
                    observer.next(message);
                });
            });
    }

    public envoyerDifferenceSimple(cle: string, posX: number, posY: number): void {
        const clique: CliqueDifference = {posX: posX, posY: posY};
        this.socket.emit("differenceSimpleTrouvee", cle, clique);
    }

    public envoyerDifferenceLibre(cle: string, pos: THREE.Vector3): void {
        this.socket.emit("differenceLibreTrouvee", cle, pos);
    }

    public onDifferenceSimple(): Observable<CliqueDifference> {
        return new Observable<CliqueDifference>(
            (observer: Observer<CliqueDifference>) => {
                this.socket.on("differenceSimpleTrouvee", (clique: CliqueDifference) => {
                    observer.next(clique);
                });
            });
    }

    public onDifferenceLibre(): Observable<THREE.Vector3> {
        return new Observable<THREE.Vector3>(
            (observer: Observer<THREE.Vector3>) => {
                this.socket.on("differenceLibreTrouvee", (pos: THREE.Vector3) => {
                    observer.next(pos);
                });
            });
    }

    public envoyerFinPartie(cle: string): void {
        this.socket.emit("finPartie", cle);
    }

    public onFinPartie(): Observable<void> {
        return new Observable<void>(
            (observer: Observer<void>) => {
                this.socket.on("finPartie", () => {
                    observer.next(void 0);
                });
            });
    }

    public onActualiserBouton(): Observable<{id: number, type: string, ajout: boolean , idVS: string}> {
        return new Observable<{id: number, type: string, ajout: boolean , idVS: string}>(
            (observer: Observer<{id: number, type: string, ajout: boolean, idVS: string}>) => {
            this.socket.on("actualiser", (info: {id: number, type: string, ajout: boolean, idVS: string}) => {
                observer.next(info);
            });
        });
    }

    public onDemandeConnexion(): Observable<boolean> {
        return new Observable<boolean>((observer: Observer<boolean>) => {
            this.socket.on("demandeConnexion", (info: boolean) => {
                observer.next(info);
            });
        });
    }

    public demandeConnexion(): void {
        this.socket.emit("demandeConnexion");
    }

    public reponseConnexion(id: number, type: string, ajout: boolean, idVs: string): void {
        this.socket.emit("reponseConnexion", id, type, ajout, idVs);
    }

    public onReponseConnexion(): Observable<{id: number, type: string, idVs: string}> {
        return new Observable<{id: number, type: string, idVs: string}>((observer: Observer<{id: number, type: string, idVs: string}>) => {
            this.socket.on("reponseConnexion", (data: {id: number, type: string, idVs: string}) => {
                observer.next(data);
            });
        });
    }

    public differenceTrouvee(nomJoueur: string, idPartie: number, typePartie: string): void {
        this.socket.emit("differenceTrouvee", nomJoueur, idPartie, typePartie);
    }

    public onDifferenceTrouvee(): Observable<string> {
        return new Observable<string>(
            (observer: Observer<string>) => {
                this.socket.on("differenceTrouvee", (message: string) => {
                    observer.next(message);
                });
            });
    }

    public erreurIdentification(nomJoueur: string, idPartie: number, typePartie: string): void {
        this.socket.emit("erreurIdentification", nomJoueur, idPartie, typePartie);
    }

    public onErreurIdentification(): Observable<string> {
        return new Observable<string>(
            (observer: Observer<string>) => {
                this.socket.on("erreurIdentification", (message: string) => {
                    observer.next(message);
                });
            });
    }

    public commencerPartie(cle: {cle: string}): void {
        this.socket.emit("commencerPartie", cle);
    }

    public onCommencerPartie(): Observable<{cle: string}> {
        return new Observable<{cle: string}>((observer: Observer<{cle: string}>) => {
            this.socket.on("commencerPartie", (info: {cle: string}) => {
                observer.next(info);
            });
        });
    }

    public annulerCreation(id: number, type: TypeDePartie): void {
        this.socket.emit("annulerCreation", id, type);
    }

    public onAnullerCreation(): Observable<{id: number, type: TypeDePartie}> {
        return new Observable<{id: number, type: TypeDePartie}>((observer: Observer<{id: number, type: TypeDePartie}>) => {
            this.socket.on("annulerCreation", (partie: {id: number, type: TypeDePartie}) => {
                observer.next(partie);
            });
        });
    }

    public changement(): void {
        this.socket.emit("changement");
    }

    public onChangement(): Observable<boolean> {
        return new Observable<boolean>((observer: Observer<boolean>) => {
            this.socket.on("changement", (info: boolean) => {
                observer.next(info);
            });
        });
    }
}
