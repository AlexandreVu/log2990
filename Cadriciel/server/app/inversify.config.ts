import { Container } from "inversify";
import { Application } from "./app";
import { BaseDeDonnees } from "./mango/mangoClient";
import { PartiesMultijoueur } from "./partieMultijoueur";
import { Routes } from "./routes";
import { Connexion } from "./routes/connexion";
import { TransmissionIds } from "./routes/idsMultiTransmission";
import { Parties } from "./routes/parties";
import { TransmissionFiche } from "./routes/transmissionFiche";
import { Server } from "./server";
import { FicheJeuService } from "./services/fiche-jeu.service";
import { GenerateurDifferencesService } from "./services/generateur-differences.service";
import { GestionTempsService } from "./services/gestion-temps";
import { IdMultijoueurService } from "./services/idMultijoueur.service";
import { IdentificationDifferencesLibre } from "./services/identification-differences-libre";
import { SocketService } from "./services/socket";
import { VueInitialeService } from "./services/vue-initiale.service";

import Types from "./types";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.Routes).to(Routes);

container.bind(Types.VueInitialeService).to(VueInitialeService).inSingletonScope();
container.bind(Types.Connexion).to(Connexion.Connect);
container.bind(Types.FicheVueService).to(FicheJeuService).inSingletonScope();
container.bind(Types.TransmissionFiche).to(TransmissionFiche.Transmission);

container.bind(Types.GenerateurDifferencesService).to(GenerateurDifferencesService);
container.bind(Types.Parties).to(Parties.Jeu);
container.bind(Types.BaseDeDonnees).to(BaseDeDonnees).inSingletonScope();
container.bind(Types.IdentificationDifferencesLibreService).to(IdentificationDifferencesLibre).inSingletonScope();
container.bind(Types.GestionTempsService).to(GestionTempsService).inSingletonScope();
container.bind(Types.Donnees).to(Parties.Donnees).inSingletonScope();

container.bind(Types.SocketService).to(SocketService).inSingletonScope();

container.bind(Types.PartiesMultijoueur).to(PartiesMultijoueur).inSingletonScope();
container.bind(Types.IdMultijoueurService).to(IdMultijoueurService);
container.bind(Types.TransmissionIds).to(TransmissionIds.Ids);
export { container };
