import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../shared/button/button.component';
import { HeaderComponent } from '../shared/header/header.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EnumToArrayPipe } from '../pipes/enum-to-array.pipe';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { QuillModule } from 'ngx-quill';
import { QuillEditorComponent } from '../shared/quill-editor/quill-editor.component';

@NgModule({
  declarations: [
    ButtonComponent,
    HeaderComponent,
    QuillEditorComponent,
    EnumToArrayPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    FormsModule,

    //Quill
    QuillModule,

    // Angular Material
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatIconModule,
    MatOptionModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatStepperModule,
  ],
  exports: [
    // Modules
    ReactiveFormsModule,
    RouterModule,
    FontAwesomeModule,
    FormsModule,
    // Components
    ButtonComponent,
    HeaderComponent,
    QuillEditorComponent,
    EnumToArrayPipe,

    //Quill
    QuillModule,

    // Angular Material
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatIconModule,
    MatOptionModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatSliderModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatProgressBarModule,
    MatStepperModule,
  ],
})
export class SharedModule {}
