import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-feedback-message',
  templateUrl: './feedback-message.component.html',
  styleUrls: ['./feedback-message.component.scss'],
})
export class FeedbackMessageComponent  {
  @Input() message: string = '';
  @Input() type: 'error' | 'success' = 'error';


}
