import {Routes} from "@angular/router";
import {HomeComponent} from "./components/home/home.component";
import {ChiSonoComponent} from "./components/chi-sono/chi-sono.component";
import {ProgettiComponent} from "./components/progetti/progetti.component";
import {ServiziComponent} from "./components/servizi/servizi.component";
import { ContattiComponent } from "./components/contatti/contatti.component";

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'chi-sono', component: ChiSonoComponent },
  { path: 'progetti', component: ProgettiComponent },
  { path: 'servizi', component: ServiziComponent },
  { path: 'contatti', component: ContattiComponent },
]
