import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { GamesComponent } from './games/games.component';
import { ProfileComponent } from './profile/profile.component';
import { GameComponent } from './game/game.component';
import { InventoryComponent } from './inventory/inventory.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ShareComponent } from './share/share.component';
import { CurrencyComponent } from './currency/currency.component';
import { CommodityComponent } from './commodity/commodity.component';

const routes: Routes = [
  { path: '', component: IntroComponent },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'game/:id', component: GameComponent },
  { path: 'games', component: GamesComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'game/:id/inventory', component: InventoryComponent },
  { path: 'game/:id/transactions', component: TransactionsComponent },
  { path: 'game/:id/share/:code', component: ShareComponent },
  { path: 'game/:id/currency/:code', component: CurrencyComponent },
  { path: 'game/:id/commodity/:code', component: CommodityComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
