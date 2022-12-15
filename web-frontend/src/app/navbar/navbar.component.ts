import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  switchTheme() {
    document.body.classList.toggle('light');
    document.body.classList.toggle('dark');
  }
}
