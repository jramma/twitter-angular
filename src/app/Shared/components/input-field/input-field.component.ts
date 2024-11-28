import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
})
export class InputFieldComponent {
  @Input() id!: string;
  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() control!: FormControl;

  // Métodos de ayuda para la plantilla
  get minlengthError(): number | null {
    return this.control.errors?.minlength?.requiredLength || null;
  }

  get maxlengthError(): number | null {
    return this.control.errors?.maxlength?.requiredLength || null;
  }
}
