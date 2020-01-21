import { injectable } from "inversify";

@injectable()
export class VueInitialeService {
  public utilisateurs: string[] = [];

  public verifierConnexion(nom: string): boolean {
    for (const utilisateur of this.utilisateurs) {
        if (utilisateur === nom) {
            return false;
        }
    }
    this.ajouterUtilisateur(nom);

    return true;
  }

  public deconnecterUtilisateur(nom: string): boolean {
    let i: number = 0;
    for (i ; i < this.utilisateurs.length; i++) {
        if (this.utilisateurs[i] === nom) {
            this.utilisateurs.splice(i, 1);

            return true;
          }
      }

    return false;
  }

  public ajouterUtilisateur(nom: string): void {
      this.utilisateurs.push(nom);
  }

}
