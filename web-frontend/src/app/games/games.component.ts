import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayingGames } from '../models/Game';
import { GameService } from '../services/game.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-games',
  templateUrl: './games.component.html',
  styleUrls: ['./games.component.scss']
})
export class GamesComponent implements OnInit {

  public loaded: boolean = false;

  public games: PlayingGames[] = [];

  public date: Date = new Date()

  constructor(private gameService: GameService, private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    this.verifyToken();
    this.getPlayingGames();
  }

  verifyToken() {
    if (!this.userService.getToken()) this.router.navigate(['login']);
  }

  getPlayingGames() {
    this.gameService.getPlayingGames().subscribe({
      next: res => {
        this.games = res; 
        if (res.length == 1) this.router.navigate(['/game/', res[0].gameid]);
        this.loaded = true;
      },
      error: err => {
        if (err.status == 403) {
          this.userService.logout();
          this.router.navigate(['login']);
        }
      }
    })
  }

  stringifyDate(date: Date) {
    return new Date(date).toJSON().slice(0,10).split('-').reverse().join('/');
  }

  goToGame(game: number) {
    this.router.navigate(['/game', game]);
  }
}
