import { Injectable } from "@angular/core";
import { AbstractControl } from "@angular/forms";
import { IMAGE_MODIFIEE, IMAGE_ORIGINALE, NOM_JEU } from "../Constantes";

@Injectable({
    providedIn: "root",
})

export class ExceptionChampInvalide extends Error {
    public constructor(champ: string) {
        super();
        this.name = "ExceptionChampInvalide";
        this.message = "Champ " + champ + " non trouvé!";
    }
}

export class GestionFormulaireService {
    public genererFormData(nomJeu: string, imageOriginale: File | null, imageModifiee: File | null): FormData {
        const formData: FormData = new FormData();
        if (nomJeu === "") {
            throw new ExceptionChampInvalide(NOM_JEU);
        } else if (imageOriginale === null) {
            throw new ExceptionChampInvalide(IMAGE_ORIGINALE);
        } else if (imageModifiee === null) {
            throw new ExceptionChampInvalide(IMAGE_MODIFIEE);
        } else {
            formData.append(NOM_JEU, nomJeu);
            formData.append(IMAGE_ORIGINALE, imageOriginale);
            formData.append(IMAGE_MODIFIEE, imageModifiee);
        }

        return formData;
    }

    public validerFormatBitmap(control: AbstractControl): { mauvaisFormat: boolean } | null {
        if (control.value == null || !control.value.endsWith(".bmp")) {
            return { mauvaisFormat: true };
        }

        return null;
    }

    public validerNomFichier(control: AbstractControl): {mauvaisNom: boolean } | null {
        const path: string = control.value;
        let nomFichier: string | undefined;
        if (path !== null) {
            nomFichier = path.split("\\").pop();
            if (nomFichier === undefined || nomFichier.includes("]")
                || nomFichier.includes("/") || nomFichier.includes(":")
                || nomFichier.includes("*") || nomFichier.includes("?")
                || nomFichier.includes("\"") || nomFichier.includes("<")
                || nomFichier.includes(">") || nomFichier.includes("|")) {
                    return { mauvaisNom: true };
            }
        }

        return null;
    }
}
