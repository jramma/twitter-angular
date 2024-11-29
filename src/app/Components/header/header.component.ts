import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { logout } from 'src/app/store/actions/auth.actions';
import { selectShowAuthSection, selectShowNoAuthSection } from 'src/app/store/selectors/auth.selectors';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  showAuthSection: boolean = false;
  showNoAuthSection: boolean = true;

  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {
    // Suscribirse a la visibilidad de las secciones de autenticación desde el estado de Redux
    this.store.select(selectShowAuthSection).subscribe((showAuth) => {
      this.showAuthSection = showAuth;
    });

    this.store.select(selectShowNoAuthSection).subscribe((showNoAuth) => {
      this.showNoAuthSection = showNoAuth;
    });
  }

  navigateTo(route: string): void {
    this.router.navigateByUrl(route);
  }

  logout(): void {
    // Despachar la acción de logout para limpiar el estado de autenticación
    this.store.dispatch(logout());
    this.navigateTo('home');
  }
}
