import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestComponent } from './pages/quest/quest.component';
import { MapComponent } from './shared/map/map.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ExamsPageComponent } from './pages/exams-page/exams-page.component';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    QuestComponent,
    MapComponent,
    HomeComponent,
    LoginPageComponent,
    ExamsPageComponent,
  ],
  imports: [BrowserModule, HttpClientModule, FormsModule, AppRoutingModule],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
