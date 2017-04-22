import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule}    from '@angular/forms';
import { ChartsModule } from 'ng2-charts';

import { AppComponent }         from './components/app.component';
import {OptionsComponent} from "./components/options.component";
import {LoginComponent} from "./components/login.component";
import {OverviewComponent} from "./components/overview.component";
import {DetailsComponent} from "./components/details.component";
import {AppRoutingModule} from "./app-routing.module";
import {DeviceService} from "./services/device.service";
import {LineChartComponent} from "./components/charts/linechart.component";
import {BoolChartComponent} from "./components/charts/boolchart.component";
import {EnuChartComponent} from "./components/charts/enuchart.component";
@NgModule({
  imports: [
      BrowserModule,
      FormsModule,
      ChartsModule,
      AppRoutingModule,
      ReactiveFormsModule
  ],
  declarations: [
      AppComponent,
      OptionsComponent,
      LoginComponent,
      OverviewComponent,
      DetailsComponent,
      LineChartComponent,
      EnuChartComponent,
      BoolChartComponent
  ],
  providers: [ DeviceService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
