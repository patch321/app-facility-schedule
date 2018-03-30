import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MyDatePickerModule } from 'mydatepicker';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { ScheduleTableComponent } from './schedule-table/schedule-table.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavbarComponent,
    ScheduleTableComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MyDatePickerModule,
    RouterModule.forRoot([
      {
        path: 'dashboard',
        component: DashboardComponent
      }, {
        path: '',
        pathMatch: 'full',
        redirectTo: '/dashboard'
      }
    ])
  ],
  providers: [HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }