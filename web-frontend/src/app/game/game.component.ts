import { Component, OnInit} from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { PlayingGames } from '../models/Game';
import { GameService } from '../services/game.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  public loaded: boolean = false;
  public game?: PlayingGames = this.gameService.loadedGame;
  public buymenu: string = "shares";

  public backendAssetsUrl = "http://localhost:3000/"
  public defaultshareimage = "";
  public defaultcurrencyimage = "";
  
  constructor(private gameService: GameService, private userService: UserService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.gameService.gameLoadEvent.subscribe({
      next: (res: number) => {
        if (res == 200) {
          this.game = this.gameService.loadedGame;
          this.loaded = true;
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
  }

  checkGame() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (Number(params.get('id')) != this.gameService.loadedGame?.gameid)
        this.gameService.loadGame(Number(params.get('id')));
      else this.loaded = true;
    });
  }

  goToCurrency(currencycode: string) {
    this.router.navigate(['game/' + this.game?.gameid + '/currency/' + currencycode])
  }

  goToShare(sharecode: string) {
    this.router.navigate(['game/' + this.game?.gameid + '/share/' + sharecode])
  }

  goToCommodity(commoditycode: string) {
    this.router.navigate(['game/' + this.game?.gameid + '/commodity/' + commoditycode])
  }
}