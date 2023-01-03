import { EventEmitter, Injectable, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlayingGames } from '../models/Game';
import { GameShare } from '../models/Share';
import { GameCommodity } from '../models/Commodity';
import { GameCurrency } from '../models/Currency';
import { UserService } from './user.service';


@Injectable({
  providedIn: 'root'
})
export class GameService implements OnInit {

  GAME_URL_API = 'http://localhost:3000';

  constructor(private http: HttpClient, private userService: UserService) { }

  ngOnInit(): void {
    this.userService.sessionEvent.subscribe({
      next: (session: boolean) => {
        if (!session) {
          this.loadedGame, this.loadedShare, this.loadedCurrency, this.loadedCommodity = undefined;
        }
      }
    })
  }

  public loadedGame?: PlayingGames;
  public loadedShare?: GameShare;
  public loadedCurrency?: GameCurrency;
  public loadedCommodity?: GameCommodity;

  @Output() gameLoadEvent: EventEmitter<number> = new EventEmitter();
  @Output() shareLoadEvent: EventEmitter<number> = new EventEmitter();
  @Output() currencyLoadEvent: EventEmitter<number> = new EventEmitter();
  @Output() commodityLoadEvent: EventEmitter<number> = new EventEmitter();

  getPlayingGames() {
    return this.http.get<PlayingGames[]>(this.GAME_URL_API + '/games');
  }

  getGame(gameid: number) {
    return this.http.get<PlayingGames>(this.GAME_URL_API + '/game/' + gameid);
  }

  getFullGame(gameid: number) {
    return this.http.get<PlayingGames>(this.GAME_URL_API + '/game/' + gameid+ '/full');
  }

  getFullShare(gameid: number, code: string) {
    return this.http.get<GameShare>(this.GAME_URL_API + '/game/' + gameid + '/share/' + code + '/full');
  }

  getGameShares(gameid: number) {
    return this.http.get<GameShare[]>(this.GAME_URL_API + '/game/' + gameid + '/shares');
  }

  getGameCommodities(gameid: number) {
    return this.http.get<GameCommodity[]>(this.GAME_URL_API + '/game/' + gameid + "/commodities");
  }

  getGameCurrencies(gameid: number) {
    return this.http.get<GameCurrency[]>(this.GAME_URL_API + '/game/' + gameid + "/currencies");
  }

  loadGame(gameid: number) {
    if (isNaN(gameid)) return this.gameLoadEvent.emit(404);
    this.getFullGame(gameid).subscribe({
      next: (res:PlayingGames) => {
        res.currencies = res.currencies?.filter(currency => currency.code != 'ARS');
        this.loadedGame = res;
        this.gameLoadEvent.emit(200);
      },
      error: (err) => {
        this.gameLoadEvent.emit(err.status);
      }
    })
  }

  loadShare(code: string | null, gameid?: number) {
    if (!gameid) return;
    if (code == null) return this.shareLoadEvent.emit(404);
    this.getFullShare(gameid, code).subscribe({
      next: (res: GameShare) => {
        this.loadedShare = res;
        this.shareLoadEvent.emit(200);
      },
      error: (err) => {
        this.shareLoadEvent.emit(err.status);
      }
    })
  }
}
