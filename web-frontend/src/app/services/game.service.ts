import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlayingGames } from '../models/Game';


@Injectable({
  providedIn: 'root'
})
export class GameService {

  GAME_URL_API = 'http://localhost:3000';

  constructor(private http: HttpClient) { }

  getPlayingGames() {
    return this.http.get<PlayingGames[]>(this.GAME_URL_API + '/games');
  }

  getGame(gameid: number) {
    return this.http.get<PlayingGames>(this.GAME_URL_API + '/game/' + gameid);
  }
}
