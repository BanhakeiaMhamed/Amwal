import { Routes } from '@angular/router';
import {SearchComponent} from "./components/search/search.component";
import {DashboardComponent} from "./components/dashboard/dashboard.component";

export const routes: Routes = [
  {path: "search", component:SearchComponent},
  {path: "admin", component:DashboardComponent}
];
