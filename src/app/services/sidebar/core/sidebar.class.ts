import { Type } from "@angular/core";
import { SidebarFooterAction } from "./sidebar-footer-action";
import { SidebarRef } from "./sidebar-ref.type";

export class Sidebar {
  ref: SidebarRef;
  title: string;
  position: "top" | "left" | "bottom" | "right";
  content?: string;
  renderContent?: Type<any>;
  footerActions: SidebarFooterAction[] = [];
  show: boolean = false;
  width?: number;
  height?: number;

  constructor(position: Sidebar["position"]) {
    this.ref = {
      id: "_" + position,
      show: () => {},
      hide: () => {},
      update: (values) => {},
      toggle: () => false,
      remove: () => {},
      isOpen: () => false,
    };
    this.position = position;
  }
}
