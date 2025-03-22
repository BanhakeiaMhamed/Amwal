import { InjectionToken } from "@angular/core";
import { SidebarOptions } from "./sidebar-options";

/**
 * Référence d'une sidebar
 *
 * On y trouve son identifiant et les actions possibles
 */
export type SidebarRef = {
  /**
   * Identifiant de la sidebar
   */
  id: string;
  /**
   * Cache la sidebar
   */
  hide: () => void;
  /**
   * Affiche la sidebar
   */
  show: () => void;
  /**
   * Met à jour la sidebar
   */
  update: (values: SidebarOptions) => void;
  /**
   * Affiche ou Cache la sidebar en fonction de son état courant
   */
  toggle: () => boolean;
  /**
   * Retire la sidebar de l'usine à sidebars
   */
  remove: () => void;
  /**
   * Renvoie l'état d'affichage de la sidebar
   */
  isOpen: () => boolean;

  data? : any
};

export const SIDEBAR_REF = new InjectionToken<SidebarRef>("sidebar_");
