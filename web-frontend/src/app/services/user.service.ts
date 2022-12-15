import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from "ngx-cookie-service";
import { LoginUser } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  USER_URL_API = 'http://localhost:3000';

  constructor(private http: HttpClient, private cookies: CookieService) { }

  setToken(token: string) {
    this.cookies.set("token", token);
  }

  getToken() {
    return this.cookies.get("token");
  }

  verifyToken() {
    return this.http.get(this.USER_URL_API + '/verifyToken');
  }

  login(user: LoginUser) {
    return this.http.post(this.USER_URL_API + '/login', user);
  }

  logout() {
    this.cookies.delete("token");
  }
}
