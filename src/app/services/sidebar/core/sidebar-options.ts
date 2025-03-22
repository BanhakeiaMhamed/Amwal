import { Type } from "@angular/core";
import { Sidebar } from "./sidebar.class";
import { SidebarFooterAction } from "./sidebar-footer-action";

export interface SidebarOptions {
  title?: string;
  data?: any;
  position?: Sidebar["position"];
  content?: string;
  renderContent?: Type<any>;
  footerActions?: SidebarFooterAction[];
  width?: number;
  height?: number;
  show?: boolean;
}

export type CreateSidebarOptions = Omit<SidebarOptions, "show" | "title">;
