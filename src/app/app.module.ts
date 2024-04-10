import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QuestComponent } from './pages/quest/quest.component';
import { MapComponent } from './shared/map/map.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ExamsPageComponent } from './pages/exams-page/exams-page.component';
import { CookieService } from 'ngx-cookie-service';
import { NavigationBarComponent } from './shared/navigation-bar/navigation-bar.component';
import { SharedModule } from './modules/shared.module';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { SubjectsPageComponent } from './pages/subjects-page/subjects-page.component';
import { FilterBarComponent } from './shared/filter-bar/filter-bar.component';
import { SubjectCardComponent } from './pages/subjects-page/subject-card/subject-card.component';
import { ExamCreatePageComponent } from './pages/exams-page/exam-create-page/exam-create-page.component';
import { CreateTaskCardComponent } from './pages/exams-page/exam-create-page/create-task-card/create-task-card.component';
import { PlainMapComponent } from './shared/plain-map/plain-map.component';
import { TestMapComponent } from './shared/test-map/test-map.component';
import { SelectPolygonMapComponent } from './shared/maps/select-polygon-map/select-polygon-map.component';

@NgModule({
  declarations: [
    AppComponent,
    QuestComponent,
    MapComponent,
    HomeComponent,
    LoginPageComponent,
    ExamsPageComponent,
    NavigationBarComponent,
    LandingPageComponent,
    SubjectsPageComponent,
    FilterBarComponent,
    SubjectCardComponent,
    ExamCreatePageComponent,
    CreateTaskCardComponent,
    PlainMapComponent,
    TestMapComponent,
    SelectPolygonMapComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent],
})
export class AppModule {}
