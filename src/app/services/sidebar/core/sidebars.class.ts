import { Sidebar } from "./sidebar.class";

export class Sidebars {
  top: Sidebar;
  left: Sidebar;
  bottom: Sidebar;
  right: Sidebar;

  constructor() {
    this.top = new Sidebar("top");
    this.left = new Sidebar("left");
    this.bottom = new Sidebar("bottom");
    this.right = new Sidebar("right");
  }
}
