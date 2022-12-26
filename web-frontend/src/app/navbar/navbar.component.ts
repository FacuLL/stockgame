import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedUser } from '../models/User';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor (private userService: UserService, private router: Router) {}

  public user?: LoggedUser;
  public defaultProfileImage: string = "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
  public userOptions: boolean = false;

  ngOnInit() {
    this.checkSession();
    this.userService.sessionEvent.subscribe({
      next: (session: boolean) => {
        if (!session) this.user = undefined;
        this.checkSession();
      }
    });
  }

  switchTheme() {
    document.body.classList.toggle('light');
    document.body.classList.toggle('dark');
  }

  public checkSession() {
    if (this.userService.getToken()) {
      this.userService.getProfile().subscribe({
        next: res => {
          this.user = res;
        },
        error: err => {
          this.user = undefined;
        }
      })
    }
    else this.user = undefined;
  }

  toggleUserOptions() {
    if (this.user) {
      this.userOptions = !this.userOptions;
    }
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.userService.logout();
    this.userOptions = false;
    this.router.navigate(['/login']);
  }
}
