import * as THREE from "three";

const FACTEUR_RAYCAST: number = 2;

export class IdentificateurObjet {
    private raycasteur: THREE.Raycaster;
    private positionSouris: THREE.Vector2;
    private frontieres: ClientRect;
    private objetIdentifie: THREE.Object3D;
    public constructor() {
        this.raycasteur = new THREE.Raycaster();
        this.positionSouris = new THREE.Vector2();
    }
    public identifierObjet(event: MouseEvent,
                           gestionnaireRendu: THREE.WebGLRenderer,
                           objets: THREE.Object3D[],
                           camera: THREE.PerspectiveCamera): boolean {

        this.frontieres = gestionnaireRendu.domElement.getBoundingClientRect();
        if (this.estClickDansBornes(event)) {
            this.mettreAJourPositionSouris(event, gestionnaireRendu);
            this.raycasteur.setFromCamera(this.positionSouris, camera);
            const objetsTrouves: THREE.Intersection[] = this.raycasteur.intersectObjects(objets);

            if (objetsTrouves.length !== 0) {
                this.objetIdentifie = objetsTrouves[0].object;

                return true;
            }
        }

        return false;
    }
    public obtenirObjetIdentifie(): THREE.Object3D {
        return this.objetIdentifie;
    }
    private mettreAJourPositionSouris(event: MouseEvent, gestionnaireRendu: THREE.WebGLRenderer): void {
        this.positionSouris.x = ((event.clientX - this.frontieres.left) / gestionnaireRendu.domElement.width) * FACTEUR_RAYCAST - 1;
        this.positionSouris.y = - ((event.clientY - this.frontieres.top) / gestionnaireRendu.domElement.height) * FACTEUR_RAYCAST + 1;
    }
    private estClickDansBornes(event: MouseEvent): boolean {
        return (event.clientX <= this.frontieres.right && event.clientX >= this.frontieres.left) &&
               (event.clientY <= this.frontieres.bottom && event.clientY >= this.frontieres.top);
    }
}
