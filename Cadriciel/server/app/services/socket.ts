import * as http from "http";
import { injectable } from "inversify";
import * as socketIo from "socket.io";
import { DEUX, TROIS } from "../../../client/src/app/Constantes";
import { TypeDePartie } from "../../../client/src/app/Partie";
import { CliqueDifference } from "../../../common/communication/differences";

@injectable()
export class SocketService {
    private io: SocketIO.Server;

    public constructor(server: http.Server) {
        this.initIoConnection(server);
    }

    // La methode ne peut etre divisee.
    // tslint:disable-next-line:max-func-body-length
    private initIoConnection(server: http.Server): void {
        this.io = socketIo(server);
        // La methode ne peut etre divisee.
        // tslint:disable-next-line:max-func-body-length
        this.io.on("connect", (socket: SocketIO.Socket) => {
            socket.on("supprimerPartie", (id: number, type: string) => {
                socket.broadcast.to(id + type).emit("supprimerPartie");
            });

            socket.on("joindre", (id: number, type: string, ajout: boolean, idVS: string) => {
                socket.join(id + type);
                socket.join(id + type + idVS);
                socket.broadcast.emit("actualiser", {id: id, type: type, ajout: ajout, idVS: idVS});
            });

            socket.on("quitter", (id: number, type: string, idVS: string) => {
                socket.emit("quitter"); // Sert pour les tests
                socket.broadcast.emit("actualiser", {id: id, type: type, ajout: false});
                socket.leave(id + type);
                socket.join(id + type + idVS);
            });

            socket.on("connexion", (nom: string) => {
                socket.broadcast.emit("connexion", nom);
            });
            socket.on("commencerPartie", (cle: {cle: string}) => {
                socket.broadcast.to(cle.cle).emit("commencerPartie", {cle: cle});
            });

            socket.on("deconnexion", (nom: string) => {
                socket.broadcast.emit("deconnexion", nom);
            });

            socket.on("ajoutScore", (nom: string, nomJeu: String, position: number, nbJoueurs: number) => {
                const nombreJoueurs: string = nbJoueurs ? "1V1." : "solo.";
                let positionString: string = "position indéterminée";

                switch (position) {
                    case 1:
                        positionString = "première";
                        break;
                    case DEUX:
                        positionString = "deuxième";
                        break;
                    case TROIS:
                        positionString = "troisième";
                        break;
                    default:
                }

                socket.broadcast.emit("ajoutScore", nom + " obtient la " + positionString + " place dans les meilleurs temps du jeu "
                                    + nomJeu + " en " + nombreJoueurs);
            });

            socket.on("finPartie", (cle: string) => {
                socket.broadcast.to(cle).emit("finPartie");
            });

            socket.on("differenceSimpleTrouvee", (cle: string, clique: CliqueDifference) => {
                socket.broadcast.to(cle).emit("differenceSimpleTrouvee", clique);
            });

            socket.on("differenceLibreTrouvee", (cle: string, pos: THREE.Vector3) => {
                socket.broadcast.to(cle).emit("differenceLibreTrouvee", pos);
            });

            socket.on("demandeConnexion", () => {
                socket.broadcast.emit("demandeConnexion");
            });

            socket.on("reponseConnexion", (id: number, type: string, ajout: boolean, idVs: string) => {
                socket.broadcast.emit("reponseConnexion", {id: id, type: type, idVs: idVs});
            });

            socket.on("differenceTrouvee", (nomJoueur: string, idPartie: number, typePartie: string) => {
                this.io.to(idPartie + typePartie).emit("differenceTrouvee", "Différence trouvée par " + nomJoueur);
            });

            socket.on("erreurIdentification", (nomJoueur: string, idPartie: number, typePartie: string) => {
                this.io.to(idPartie + typePartie).emit("erreurIdentification", "Erreur par " + nomJoueur);
            });

            socket.on("annulerCreation", (id: number, type: TypeDePartie) => {
                socket.broadcast.emit("annulerCreation", {id: id, type: type});
            });

            socket.on("changement", () => {
                socket.broadcast.emit("changement");
                socket.emit("changement", true);
            });
        });
    }

}
