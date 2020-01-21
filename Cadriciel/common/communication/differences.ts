export interface ReponseDifferences {
    ajoute: boolean;
    erreur: string;
    idImageOriginale: string;
    idImageModifiee: string;
    idImageDifferences: string;
}

export interface CliqueDifference {
    posX: number;
    posY: number;
}
