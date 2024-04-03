import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../shared/button/button.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [ButtonComponent, HeaderComponent],
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FontAwesomeModule],
  exports: [
    // Modules
    ReactiveFormsModule,
    RouterModule,
    FontAwesomeModule,
    // Components
    ButtonComponent,
    HeaderComponent,
  ],
})
export class SharedModule {}
