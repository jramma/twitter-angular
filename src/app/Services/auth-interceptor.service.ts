import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectAccessToken } from '../store/selectors/auth.selectors';
import { switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Obtener el access_token desde el store de Redux
    return this.store.select(selectAccessToken).pipe(
      take(1), // Tomar solo el último valor del token
      switchMap((access_token) => {
        if (access_token) {
          req = req.clone({
            setHeaders: {
              'Content-Type': 'application/json; charset=utf-8',
              Accept: 'application/json',
              Authorization: `Bearer ${access_token}`,
            },
          });
        }
        return next.handle(req);
      })
    );
  }
}
