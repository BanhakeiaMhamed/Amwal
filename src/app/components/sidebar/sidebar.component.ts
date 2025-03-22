import { CommonModule } from "@angular/common";
import {
  AfterViewInit,
  Component,
  Injector,
  Input,
  OnChanges,
  SimpleChanges,
  Type,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { CardModule } from "primeng/card";
import { ButtonModule } from "primeng/button";
import { Sidebar } from "src/app/services/sidebar/core/sidebar.class";
import { SidebarFooterAction } from "src/app/services/sidebar/core/sidebar-footer-action";
import {
  SidebarRef,
  SIDEBAR_REF,
} from "src/app/services/sidebar/core/sidebar-ref.type";

@Component({
  selector: "app-sidebar",
  standalone: true,
  imports: [CommonModule, SharedModule, CardModule, ButtonModule],
  templateUrl: "./sidebar.component.html",
  styleUrl: "./sidebar.component.scss",
})
export class SidebarComponent implements AfterViewInit, OnChanges {
  @Input({ required: true }) ref: SidebarRef;
  @Input() title: string;
  @Input() content: string;
  @Input() renderContent: Sidebar["renderContent"];
  @Input() footerActions: SidebarFooterAction[] = [];
  @Input() show: boolean = false;
  @Input() position: Sidebar["position"] = "right";
  @Input() height: number = 550;
  @Input() width: number = 550;

  @ViewChild("sidebarContent", { read: ViewContainerRef })
  sidebarContent: ViewContainerRef;

  constructor(private readonly injector: Injector) {}

  ngAfterViewInit(): void {
    this._renderComponent(this.renderContent, this.ref);
  }

  ngOnChanges(changes: SimpleChanges): void {
    const renderChanges = changes.renderContent;
    const refChanges = changes.ref;

    if(refChanges || refChanges){
      let newRender, newRef;

      if (renderChanges && !renderChanges.firstChange) {
        newRender = renderChanges.currentValue;
        newRef = this.ref;
      }
  
      if(refChanges && !refChanges.firstChange){
        newRef = refChanges.currentValue;
        newRender = this.renderContent;
      }
      
      this._renderComponent(newRender, newRef);
    }
  }

  private _renderComponent(component: Type<any>, ref : SidebarRef) {
    if (this.sidebarContent && component) {
      this.sidebarContent.clear();
      this.sidebarContent.createComponent(component, {
        injector: Injector.create({
          parent: this.injector,
          providers: [
            {
              provide: SIDEBAR_REF,
              useValue: this.ref,
            },
          ],
        }),
      });
    }
  }
}
