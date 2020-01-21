import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as express from "express";
import { inject, injectable } from "inversify";
import * as logger from "morgan";
import * as multer from "multer";
import * as GridFSStorage from "multer-gridfs-storage";
import * as path from "path";
import { Routes } from "./routes";
import { Parties } from "./routes/parties";
import Types from "./types";

@injectable()
export class Application {

    private readonly internalError: number = 500;
    public app: express.Application;

    public constructor(@inject(Types.Routes) private api: Routes, @inject(Types.Donnees) private donnees: Parties.Donnees) {
        this.app = express();

        const storage: GridFSStorage = this.configDBImages();

        api.upload = multer({ storage: storage});

        this.config();

        this.routes();

        this.donnees.initialiserDonnees().then().catch();
    }

    private configDBImages(): GridFSStorage {
        return new GridFSStorage({
            url: "mongodb://utilisateur1:equipe209@ds139775.mlab.com:39775/projet",
            file: (req: Express.Request, file: Express.Multer.File) => {
                if (file.mimetype === "image/bmp") {
                    return {
                        bucketName: Parties.Jeu.COLLECTION_IMG_UPLOADS, // Collection
                        filename: file.originalname,
                    };
                }

                return null;
            },
         });
    }

    private config(): void {
        // Middlewares configuration
        this.app.use(logger("dev"));
        this.app.use(bodyParser.json({limit: "1mb"}));
        this.app.use(bodyParser.urlencoded({limit: "1mb", extended: true }));
        this.app.use(cookieParser());
        this.app.use(express.static(path.join(__dirname, "../client")));
        this.app.use(cors());
    }

    public routes(): void {
        const router: express.Router = express.Router();

        router.use(this.api.routes);

        this.app.use(router);

        this.errorHandeling();
    }

    private errorHandeling(): void {
        // Gestion des erreurs
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: Error = new Error("Not Found");
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (this.app.get("env") === "development") {
            // tslint:disable-next-line:no-any
            this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err.status || this.internalError);
                res.send({
                    message: err.message,
                    error: err,
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user (in production env only)
        // tslint:disable-next-line:no-any
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: {},
            });
        });
    }
}
