import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  Validator,
  Validators,
} from '@angular/forms';
import Quill from 'quill';
import BlotFormatter, {
  AlignAction,
  DeleteAction,
  ImageSpec,
  ResizeAction,
} from 'quill-blot-formatter';
import { Subscription } from 'rxjs';

Quill.register('modules/blotFormatter', BlotFormatter);

class CustomImageSpec extends ImageSpec {
  override getActions() {
    return [DeleteAction, ResizeAction];
  }
}

@Component({
  selector: 'app-quill-editor',
  templateUrl: './quill-editor.component.html',
  styleUrls: ['./quill-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: QuillEditorComponent,
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: QuillEditorComponent,
    },
  ],
})
export class QuillEditorComponent
  implements OnDestroy, ControlValueAccessor, Validator
{
  style = {
    height: '300px',
    width: '100%',
    backgroundColor: 'white',
  };

  configuration = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ header: 1 }, { header: 2 }],
      ['link', 'blockquote', 'code-block', 'image'],
      [{ list: 'ordered' }, { list: 'bullet' }],
    ],
    blotFormatter: {
      specs: [CustomImageSpec],
      overlay: {
        style: {
          border: '2px solid red',
        },
      },
    },
  };

  @Input()
  errorMessage: string = 'Content';

  form: FormGroup = this.fb.group({
    editor: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder) {}

  onChangeSubs: Subscription[] = [];

  onTouched: Function = () => {}; //our function that is equal to callbak function, purpose is
  //to notify parent when component is touched

  //ControlValueAccessor interface methods (4) --> framework callbacks, called only by the Forms module at runtime

  //the parent form can set a value in the child control using writeValue -> to write initial value
  writeValue(value: any) {
    if (value) {
      this.form.setValue({ editor: value });
    }
  }

  //when a form value changes due to user input, this method will report the new value back to the parent form
  //(opposite direction of writeValue)
  registerOnChange(onChange: any) {
    const sub = this.form.valueChanges.subscribe(onChange); //We are using the valueChanges Observable to know when
    //a new value is emitted by the the address form,
    //and calling the onChange callback to notify the parent form.
    this.onChangeSubs.push(sub);
  }

  //when the user first interacts with the form control, the control is considered to have the status touched,
  //this method will report that to the parent form
  registerOnTouched(onTouched: Function) {
    //recieving a callback function onTouched and saving it into our onTouched function
    this.onTouched = onTouched;
  }

  //form controls can be enabled and disabled
  setDisabledState(disabled: boolean) {
    if (disabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  //ControlValueAccessor interface methods (only 1 here, registerOnValidatorChange is OPTIONAL)
  validate(control: AbstractControl) {
    if (this.form.valid) {
      return null;
    }

    let errors: any = {};

    errors = this.addControlErrors(errors, 'editor');

    return errors;
  }

  //helper for validate function
  addControlErrors(allErrors: any, controlName: string) {
    const errors = { ...allErrors };

    const controlErrors = this.form.controls[controlName].errors;

    if (controlErrors) {
      errors[controlName] = controlErrors;
    }

    return errors;
  }

  ngOnDestroy() {
    for (let sub of this.onChangeSubs) {
      sub.unsubscribe();
    }
  }

  maxLength(event: any) {
    if (event.editor.getLength() > 1000) {
      event.editor.deleteText(1000, event.editor.getLength());
    }
  }
}
