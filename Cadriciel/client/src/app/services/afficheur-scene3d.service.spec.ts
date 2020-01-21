import { TestBed } from "@angular/core/testing";

import { AfficheurScene3dService } from "./afficheur-scene3d.service";

describe("AfficheurScene3dService", () => {
    beforeEach(() => TestBed.configureTestingModule({}));

    it("Vérifie que l'on peut créer AfficheurScene3dService", () => {
        const service: AfficheurScene3dService = TestBed.get(AfficheurScene3dService);
        expect(service).toBeTruthy();
    });
});
