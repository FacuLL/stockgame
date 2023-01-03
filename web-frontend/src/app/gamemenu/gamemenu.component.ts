import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PlayingGames } from '../models/Game';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-gamemenu',
  templateUrl: './gamemenu.component.html',
  styleUrls: ['./gamemenu.component.scss']
})
export class GamemenuComponent implements OnInit {
  @Input()
  public parent?: any;
  public gamemenu: boolean = false;
  public loaded?: boolean;
  public game?: PlayingGames = this.gameService.loadedGame;
  
  constructor (private gameService: GameService) {}

  ngOnInit(): void {
    this.gameService.gameLoadEvent.subscribe({
      next: (load: boolean) => {
        if (load) {
          this.game = this.gameService.loadedGame;
          this.loaded = true;
        }
      }
    });
    if (this.game) this.loaded = true;
  }

  toggleGameMenu() {
    this.gamemenu = !this.gamemenu;
  }
}
