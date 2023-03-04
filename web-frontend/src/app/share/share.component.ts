import { Component, EventEmitter, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Route, Router } from '@angular/router';
import { HistoricalData } from '../models/Data';
import { PlayingGames } from '../models/Game';
import { GameShare } from '../models/Share';
import { GameService } from '../services/game.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.scss']
})
export class ShareComponent implements OnInit {

  public loaded: boolean = false;
  public game?: PlayingGames = this.gameService.loadedGame;
  public share?: GameShare = this.gameService.loadedShare;
  public data?: HistoricalData[] = this.gameService.loadedShare?.historical;

  public stockevent: EventEmitter<number> = this.gameService.shareLoadEvent;

  public backendAssetsUrl = "http://localhost:3000/";
  public defaultshareimage = "";;

  constructor(private gameService: GameService, private userService: UserService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.gameService.gameLoadEvent.subscribe({
      next: (res: number) => {
        if (res == 200) {
          this.game = this.gameService.loadedGame;
          this.loaded = true;
          this.checkShare();
        }
        else if (res == 403) {
          this.userService.logout();
          this.router.navigate(['/login']);
        }
        else if (res == 404 || res == 500) {
          this.router.navigate(['/games']);
        }
      }
    });
    this.checkGame();

    this.gameService.shareLoadEvent.subscribe({
      next: (res: number) => {
        if (res == 200) {
          this.share = this.gameService.loadedShare;
          this.data = this.gameService.loadedShare?.historical;
          this.loaded = true;
        }
        else if (res == 403) {
          this.userService.logout();
          this.router.navigate(['/login']);
        }
        else if (res == 404 || res == 500) {
          this.router.navigate(['/game/' + this.game?.gameid]);
        }
      }
    });
  }

  checkShare() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.get('code') != this.gameService.loadedShare?.code)
        this.gameService.loadShare(params.get('code'), this.game?.gameid);
      else this.loaded = true;
    });
  }

  checkGame() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (Number(params.get('id')) != this.gameService.loadedGame?.gameid)
        this.gameService.loadGame(Number(params.get('id')));
      else {
        this.loaded = true;
        this.checkShare();
      }
    });
  }
}
