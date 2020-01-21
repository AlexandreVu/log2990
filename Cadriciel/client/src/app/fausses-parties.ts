import { Partie, TypeDePartie } from "./Partie";
import { PartieLibre } from "./PartieLibre";

export const PARTIESSIMPLES: Partie[] = [
    new Partie(0, "Partie A", TypeDePartie.SIMPLE),
    new Partie(1, "Partie C", TypeDePartie.SIMPLE),
];

export const PARTIESLIBRES: PartieLibre[] = [
    new PartieLibre(0, "Partie B"),
    new PartieLibre(1, "Partie D"),
];

const img1: string = "abc123";
const img2: string = "456xyz";

PARTIESSIMPLES[0].setIdImageOriginale(img1);
PARTIESSIMPLES[1].setIdImageOriginale(img2);
PARTIESLIBRES[0].setIdImageOriginale(img1);
PARTIESLIBRES[1].setIdImageOriginale(img2);
