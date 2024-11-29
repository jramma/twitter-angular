import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-material-input',
  templateUrl: './material-input.component.html',
  styleUrls: ['./material-input.component.scss'],
})
export class MaterialInputComponent {
  @Input() control!: FormControl;
  @Input() label!: string;
  @Input() type: string = 'text'; 
}
