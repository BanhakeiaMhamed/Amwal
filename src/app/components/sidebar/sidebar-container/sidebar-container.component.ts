import {
  AfterViewInit,
  Component,
  ContentChild,
  Input,
  TemplateRef,
} from "@angular/core";
import { SidebarService } from "src/app/services/sidebar/sidebar.service";
import { SidebarComponent } from "../sidebar.component";
import { CommonModule } from "@angular/common";
import { Sidebars } from "src/app/services/sidebar/core/sidebars.class";

@Component({
  selector: "app-sidebar-container",
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: "./sidebar-container.component.html",
  styleUrl: "./sidebar-container.component.scss",
})
export class SidebarContainerComponent implements AfterViewInit {
  @Input({ required: true }) id: string;
  sidebars: Sidebars;

  constructor(private sidebarService: SidebarService) {
    this.sidebarService.$factory.subscribe((factory) => {
      this.sidebars = factory[this.id] || new Sidebars();

      // console.log(this.id, this.sidebars);
    });
  }

  ngAfterViewInit(): void {
    this.sidebarService.containerRegister(this.id);
  }
}
