import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestComponent } from './pages/quest/quest.component';
import { MapComponent } from './shared/map/map.component';
import { HomeComponent } from './pages/home/home.component';

@NgModule({
  declarations: [AppComponent, QuestComponent, MapComponent, HomeComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
