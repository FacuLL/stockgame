import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { UserService } from "./user.service";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(private userService: UserService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
    if(!this.userService.getToken()) return next.handle(req);
    const headers = req.clone({
      setHeaders: {
        authorization: `Bearer ${ this.userService.getToken() }`
      }
    });
    return next.handle(headers);
  }
}
