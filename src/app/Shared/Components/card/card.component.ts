import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent {
  @Input() title!: string;
  @Input() publicationDate!: Date;
  @Input() description!: string;
  @Input() categories!: { title: string; css_color: string }[];
  @Input() numLikes!: number;
  @Input() numDislikes!: number;
  @Input() postId!: string;

  like(postId: string): void {
    // Emit an event or handle the like action here
    console.log(`Liked post: ${postId}`);
  }

  dislike(postId: string): void {
    // Emit an event or handle the dislike action here
    console.log(`Disliked post: ${postId}`);
  }
}
