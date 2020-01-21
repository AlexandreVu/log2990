import { Response } from "express";
import { injectable } from "inversify";
import { Collection, Db, GridFSBucket, GridFSBucketReadStream, GridFSBucketWriteStream, MongoClient, MongoError, ObjectId } from "mongodb";
import "reflect-metadata";
import { Readable } from "stream";
import { ErreurConnexionBDD, ErreurConnexionClient } from "../erreurs/erreurConnexion";
import { ErreurEffacementFichier } from "../erreurs/erreurEffacementFichier";
import { ErreurLectureFichier } from "../erreurs/erreurLectureFichier";
import { ErreurUploadFichier } from "../erreurs/erreurUploadFichier";

@injectable()
export class BaseDeDonnees {

    public static db?: Db;
    private static client: MongoClient;

    public static async getCollection(nomCollection: string): Promise<Collection> {
        if (BaseDeDonnees.db === undefined) {
            await BaseDeDonnees.connecter();
        }

        return (BaseDeDonnees.db as Db).collection(nomCollection);
    }

    public static async uploadFichier(buffer: Buffer, nomFichier: string, nomCollection: string): Promise<ObjectId> {
        return new Promise((resolve: Function, reject: Function) => {
            if (BaseDeDonnees.db === undefined) {
                reject(new ErreurConnexionClient());
            } else {
                const grid: GridFSBucket = new GridFSBucket(BaseDeDonnees.db, { bucketName: nomCollection});
                const uploadStream: GridFSBucketWriteStream = grid.openUploadStream(nomFichier);
                const readable: Readable = new Readable();
                readable._read = () => {
                    readable.push(buffer);
                    readable.push(null);
                };
                readable.pipe(uploadStream);

                uploadStream.on("finish", () => {
                    resolve(uploadStream.id);
                });

                readable.on("error", () => {
                    reject(new ErreurUploadFichier(nomFichier));
                });
            }
        });
    }

    public static async lireFichier(id: ObjectId, nomCollection: string): Promise<Buffer> {
        return new Promise((resolve: Function, reject: Function) => {
            if (BaseDeDonnees.db === undefined) {
                reject(new ErreurConnexionClient());
            } else {
                const grid: GridFSBucket = new GridFSBucket(BaseDeDonnees.db, { bucketName: nomCollection});
                const stream: GridFSBucketReadStream = grid.openDownloadStream(id);
                let buffer: Buffer = Buffer.from("");
                stream.on("data", (chunk: Buffer) => {
                    buffer = Buffer.concat([buffer, chunk]);
                });

                stream.on("error", () => {
                    reject(new ErreurLectureFichier());
                });

                stream.on("end", () => {
                    resolve(buffer);
                });
            }
        });
    }

    public static async effacerFichier(id: ObjectId, nomCollection: string): Promise<void> {
        return new Promise((resolve: Function, reject: Function) => {
            if (BaseDeDonnees.db === undefined) {
                reject(new ErreurConnexionClient());
            } else {
                const grid: GridFSBucket = new GridFSBucket(BaseDeDonnees.db, { bucketName: nomCollection});
                grid.delete(id, (err: MongoError) => {
                    if (err) {
                        reject(new ErreurEffacementFichier());
                    } else {
                        resolve();
                    }
                });
            }
        });
    }
    public static async connecter(): Promise<void> {
        return new Promise((resolve: Function, reject: Function) => {
            if (BaseDeDonnees.client !== undefined && BaseDeDonnees.client.isConnected() && BaseDeDonnees.db !== undefined) {
                resolve();
            } else {
                MongoClient.connect("mongodb://utilisateur1:equipe209@ds139775.mlab.com:39775/projet",
                                    (err: MongoError, mongoClient: MongoClient) => {
                if (err) {
                    reject(new ErreurConnexionBDD);
                } else {
                    BaseDeDonnees.client = mongoClient;
                    BaseDeDonnees.db = mongoClient.db("projet");
                    resolve();
                }
                });
            }
        });
    }

    public static async deconnecter(): Promise<void> {
        BaseDeDonnees.db = undefined;

        return BaseDeDonnees.client.close();
    }

    public connexion(res: Response): void {
        BaseDeDonnees.connecter().then( () => {
            res.send(true);
        }).catch( () => {
            res.send(false);
        });
    }
}
