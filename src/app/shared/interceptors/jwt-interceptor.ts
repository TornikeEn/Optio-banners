import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class JwtInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const userToken = `eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluQG9wdGlvLmFpIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE2OTk0NTE2NDIsImV4cCI6MTcwMTE3OTY0Mn0.jWssoPCAZWI6sg6w3Hy93Htnj6e_Up1T52jVOl1KttRaCijUFgH7Zov47vUjyy1dTIHbxrH3J_G91_PCV_tRnA`;

    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(error);
      })
    );
  }
}
