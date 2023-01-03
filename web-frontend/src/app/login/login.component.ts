import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/user.service';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public loaded: boolean = false;
  public err: string = "";

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.verifyToken();
  }

  verifyToken() {
    if (this.userService.getToken()) {
      this.userService.verifyToken().subscribe({
        next: res => {
          this.userService.sessionEvent.emit(true);
          this.router.navigate(['games']);
        },
        error: err => {
          console.log(err.error);
          this.userService.logout();
          this.loaded = true;
        }
      })
    }
    else this.loaded = true;
  }

  login(f: NgForm) {
    this.userService.login(f.value).subscribe({
      next: (res: any) => {
        this.userService.setToken(res['token']);
        this.userService.sessionEvent.emit(true);
        this.router.navigate(['games']);
      },
      error: err => {
        if (err.status == 403) this.err = 'Usuario o contraseña incorrectos';
      }
    })
  }
}
