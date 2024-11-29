import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectAuthLoading } from './store/selectors/auth.selectors'; // Asegúrate de que este selector exista

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'blog-uoc-project-front';
  loading$!: Observable<boolean>;

  constructor(private store: Store) {}

  ngOnInit(): void {
    // Suscríbete al estado de loading
    this.loading$ = this.store.select(selectAuthLoading);
  }
}
