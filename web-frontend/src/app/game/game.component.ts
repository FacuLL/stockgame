import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { PlayingGames } from '../models/Game';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  public game?: PlayingGames;

  constructor(private gameService: GameService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.getGame();
  }

  getGame() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.get('id')) 
        this.gameService.getGame(Number(params.get('id'))).subscribe({
          next: res => {
            this.game = res;
          },
          error: err => {
            console.log(err);
            
          }
        });
    });
  }
}