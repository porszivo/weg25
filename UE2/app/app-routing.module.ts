import {Routes, RouterModule} from "@angular/router";
import {NgModule} from "@angular/core";

import {DetailsComponent}   from "./components/details.component";
import {LoginComponent}     from "./components/login.component";
import {OverviewComponent}  from "./components/overview.component";
import {OptionsComponent}   from "./components/options.component";

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'overview', component: OverviewComponent },
    { path: 'login', component: LoginComponent },
    { path: 'detail/:id', component: DetailsComponent },
    { path: 'options', component: OptionsComponent }
];

@NgModule({
    imports: [ RouterModule.forRoot(routes) ],
    exports: [ RouterModule ]
})
export class AppRoutingModule{}