import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Sidebars } from "./core/sidebars.class";
import { Sidebar } from "./core/sidebar.class";
import { CreateSidebarOptions, SidebarOptions } from "./core/sidebar-options";
import { SidebarRef } from "./core/sidebar-ref.type";

// --- FOR DOCUMENTATION --- //
import { SidebarContainerComponent } from "src/app/core/components/sidebar/sidebar-container/sidebar-container.component";

/**
 * Service de gestion des sidebars.
 *
 * --- ETAPES DE CONFIGURATION ---
 *
 * Encapsuler sa page dans le composant SidebarContainerComponent - Penser à renseigner un id au container.
 *  @see {@link SidebarContainerComponent}
 *
 * L'id va être consommé par le service dans les fonctions de créations et d'affichage de la sidebar.
 * @see {@link createSidebar} et {@link createAndShowSidebar}
 *
 * Une fois la sidebar créée, une références est créée @see {@link SidebarRef}
 *
 * Elle peut être utilisée directement pour appeler différentes fonctions du service sans avoir à l'appeler à chaque fois.
 *
 * Lorsqu'un Composant est rendu dans la sidebar, la ref de celle-ci lui est injectée. Pour consommer la ref il suffit d'appeller ```@Inject(SIDEBAR_REF)``` dans le composant rendu par la sidebar.
 * @see  {@link Sidebar.renderContent }
 *
 * @example
 * ```ts
 * constructor(@Inject(SIDEBAR_REF) private _sidebarRef: SidebarRef) {}
 * ```
 *
 * --- Un seul container ne peut avoir que 4 sidebars en simultané (top-left-bottom-right)
 */
@Injectable({
  providedIn: "root",
})
export class SidebarService {
  readonly $factory: BehaviorSubject<FactorySidebars> =
    new BehaviorSubject<FactorySidebars>({});

  /**
   *
   * Enregistre le container de sidebars dans l'usine à sidebars
   *
   * @param containerId nom du container de sidebars
   */
  containerRegister(containerId: string) {
    const factory = this.$factory.value;
    if (!factory[containerId]) {
      factory[containerId] = new Sidebars();
      this.$factory.next(factory);
    }
    console.info(
      "[SIDEBAR-SERVICE] - Container " + containerId + " already exists"
    );
  }

  /**
   * Crée une sidebar et l'ajoute à l'usine à sidebars dans le container renseigné
   *
   * @param containerId Container où enregistrer la sidebar
   * @param title Titre de la sidebar
   * @param options Options supplémentaires de la sidebar
   *
   * @returns La ref de la sidebar @see {@link SidebarRef}
   */
  createSidebar(
    containerId: string,
    title?: string,
    options?: CreateSidebarOptions
  ): SidebarRef | null {
    const sidebars = this.getSidebars(containerId);

    if (sidebars) {
      const position = options?.position || "right"; // Par défaut la position droite est renseignée si aucune position n'est renseignée
      const sidebar = sidebars[position];

      const newSidebar: Sidebar = {
        ref: this._createSidebarRef(containerId, position, options?.data),
        title,
        position,
        content: options?.content,
        renderContent: options?.renderContent,
        footerActions: options?.footerActions || [],
        show: false,
        height: options.height || 550,
        width: options.width || 550,
      };
      sidebars[position] = newSidebar;

      this._setSidebars(containerId, sidebars);

      return sidebars[position].ref;
    }
    return null;
  }

  /**
   * Crée une sidebar et l'affiche directement
   *
   * @see {@link createSidebar}
   */
  createAndShowSidebar(
    containerId: string,
    title?: string,
    options?: CreateSidebarOptions
  ): SidebarRef | null {
    
    const ref = this.createSidebar(containerId, title, options);
    this.updateSidebar(ref.id, { show: true });

    return ref;
  }

  /**
   * Ouvre / Ferme automatiquement la sidebar
   * @param sidebarId Identifiant de la sidebar
   * @returns Etat d'ouverture de la sidebar (true ou false)
   */
  toggleSidebar(sidebarId: string): boolean {
    const sidebar = this.getSidebar(sidebarId);

    if (sidebar) {
      const isOpen = !sidebar.show;
      this.updateSidebar(sidebarId, { show: isOpen });
      return isOpen;
    }
    return false;
  }

  /**
   * Met à jour une ou plusieurs valeurs de la sidebar
   *
   * @param sidebarId Identifiant de la sidebar
   * @param values  Valeurs à changer
   */
  updateSidebar(sidebarId: string, values: SidebarOptions) {
    const containerRef = sidebarId.split("_")[1];
    const sidebars = this.getSidebars(containerRef);
    if (sidebars) {
      const sidebar = Object.values(sidebars).find(
        (s) => s.ref.id === sidebarId
      );
      if (sidebar) {
        const show = values.show != undefined ? values.show : sidebar.show;
        const newSidebar: Sidebar = {
          ref: sidebar.ref,
          title: values.title || sidebar.title,
          position: values.position || sidebar.position,
          content: values.content || sidebar.content,
          renderContent: values.renderContent || sidebar.renderContent,
          footerActions: values.footerActions || sidebar.footerActions,
          height: values.height || sidebar.height,
          width: values.width || sidebar.width,
          show: show,
        };
        if (values.position && values.position != sidebar.position) {
          this.createAndShowSidebar(containerRef, newSidebar.title, newSidebar);
          sidebars[sidebar.position] = new Sidebar(sidebar.position);
        } else {
          sidebars[newSidebar.position] = newSidebar;
        }
      }
      this._setSidebars(containerRef, sidebars);
    }
  }

  /**
   * Affiche la sidebar
   * @param sidebarId Idenfidant de la sidebar
   */
  showSidebar(sidebarId: string) {
    this.updateSidebar(sidebarId, { show: true });
  }

  hideSidebar(sidebarId: string, reset: boolean = false) {
    if (reset) {
      this.removeSidebar(sidebarId);
    } else {
      this.updateSidebar(sidebarId, { show: false });
    }
  }

  /**
   * Supprime la sidebar de l'usine à sidebars
   * @param sidebarId Idenfidant de la sidebar
   */
  removeSidebar(sidebarId: string) {
    const containerRef = sidebarId.split("_")[1];
    const sidebars = this.getSidebars(containerRef);
    if (sidebars) {
      const sidebar = Object.values(sidebars).find(
        (s) => s.ref.id === sidebarId
      );
      if (sidebar) {
        sidebars[sidebar.position] = new Sidebar(sidebar.position);
        this._setSidebars(containerRef, sidebars);
      }
    }
  }

  /**
   * Renvoie l'état d'ouverture de la sidebar
   * @param sidebarId Idenfidant de la sidebar
   *
   * @returns true ou false
   */
  isOpen(sidebarId: string) {
    const sidebar = this.getSidebar(sidebarId);
    return sidebar?.show || false;
  }

  /**
   * Renvoie toutes les sidebars d'un container si le container existe
   * @param containerId Identifiant du container
   *
   * @returns Les 4 sidebars du container
   *
   * @see {@link Sidebars}
   */
  getSidebars(containerId: string): Sidebars | undefined {
    const sidebars = this.$factory.value[containerId];

    if (!sidebars) {
      console.info(
        "[SIDEBAR-SERVICE] - Container " + containerId + " not found"
      );
    }
    return this.$factory.value[containerId];
  }

  /**
   * Renvoie une sidebar si elle existe
   * @param sidebarId Identifiant de la sidebar
   *
   * @returns Une sidebar
   *
   * @see {@link Sidebar}
   */

  getSidebar(sidebarId: string): Sidebar | undefined {
    const containerRef = sidebarId.split("_")[1];
    const sidebars = this.getSidebars(containerRef);
    if (sidebars) {
      const sidebar = Object.values(sidebars).find(
        (s: Sidebar) => s.ref.id === sidebarId
      );
      if (!sidebar) {
        console.info(
          "[SIDEBAR-SERVICE] - Sidebar " +
            sidebarId +
            " not found in Container " +
            containerRef
        );
      }
      return sidebar;
    }
    return null;
  }

  /**
   * Définit les sidebars dans l'usine à sidebar
   *
   * @param containerId Identifiant du container où enregistrer les sidebars
   * @param sidebars Sidebars à enregistrer
   *
   * @see {@link Sidebars}
   */
  private _setSidebars(containerId: string, sidebars: Sidebars) {
    const factory = this.$factory.value;
    factory[containerId] = sidebars;
    this.$factory.next(factory);
  }

  /**
   * Création de la ref pour une nouvelle sidebar
   *
   * @param containerId Identifiant du container de la sidebar
   * @param position Position de la sidebar
   *
   * @returns Une nouvelle référence pour la sidebar
   *
   * @see {@link SidebarRef}
   */
  private _createSidebarRef(
    containerId: string,
    position: Sidebar["position"],
    data?: any
  ): SidebarRef {
    const ref_id = "sidebar_" + containerId + "_" + position;

    // --- Initialisation de la ref avec les fonctions de service ---
    return {
      id: ref_id,
      show: () => this.showSidebar(ref_id),
      hide: () => this.hideSidebar(ref_id),
      update: (values) => this.updateSidebar(ref_id, values),
      toggle: () => this.toggleSidebar(ref_id),
      remove: () => this.removeSidebar(ref_id),
      isOpen: () => this.isOpen(ref_id),
      data,
    };
  }
}

interface FactorySidebars {
  [ref: string]: Sidebars;
}
