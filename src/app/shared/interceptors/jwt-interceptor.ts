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
    const userToken = `eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluQG9wdGlvLmFpIiwic3ViIjoiYWRtaW4iLCJpYXQiOjE3MDA1NzYwMzAsImV4cCI6MTcwMjMwNDAzMH0.7g5HoEVEeefc_imsBCTJRsQM6NXfsvF7CtsJ-YPeG6-sq8OQ_hcHx76H3ltDhQ50Cfy1YJ2ySk14iL5Q0amrNQ`;

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
