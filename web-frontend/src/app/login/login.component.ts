import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private err: string = "";

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.verifyToken();
  }

  verifyToken() {
    if (this.userService.getToken()) {
      this.userService.verifyToken().subscribe({
        next: res => {
          this.router.navigate(['games']);
        },
        error: err => {
          console.log(err.error);
          this.userService.logout();
        }
      })
    }
  }

  login(f: NgForm) {
    this.userService.login(f.value).subscribe({
      next: (res: any) => {
        console.log(res['token']);
        this.userService.setToken(res['token']);
        this.router.navigate(['games']);
      },
      error: err => {
        this.err = err.error;
        console.log(err.error);
      }
    })
  }
}
