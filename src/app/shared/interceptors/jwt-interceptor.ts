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
    const userToken = `eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImludGVybnNoaXBAb3B0aW8uYWkiLCJzdWIiOiJpbnRlcm5zaGlwIiwiaW50ZXJuc2hpcElkIjoidG9ybmlrZS5lbnVxaWR6ZUBnbWFpbC5jb20iLCJpYXQiOjE2OTY2NTA4MjIsImV4cCI6MTY5NzUxNDgyMn0.fyqASGfDGqP4JPj5FFrQQOaUECA6joxcsbFTcjdShDvLZrnsYwU9T3Mrfov-YnJzKtvVtkwAaUGtQv7C6o1G_w`;

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
