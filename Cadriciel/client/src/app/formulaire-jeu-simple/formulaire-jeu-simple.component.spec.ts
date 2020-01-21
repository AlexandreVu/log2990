import { TestBed } from "@angular/core/testing";

import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GestionFormulaireService } from "../services/gestion-formulaire.service";
import { FormulaireJeuSimpleComponent } from "./formulaire-jeu-simple.component";

describe("FormulaireJeuSimpleComponent", () => {
    beforeEach(() => TestBed.configureTestingModule({
        declarations: [],
        imports: [FormsModule, HttpClientModule, ReactiveFormsModule],
        providers: [FormulaireJeuSimpleComponent, GestionFormulaireService],
    }));
    it("Vérifie que l'on peut créer FormulaireJeuSimpleComponent", () => {
        const SERVICE: FormulaireJeuSimpleComponent = TestBed.get(FormulaireJeuSimpleComponent);
        expect(SERVICE).toBeTruthy();
    });
});
