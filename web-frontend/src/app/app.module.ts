import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { TablerIconsModule } from 'angular-tabler-icons';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { TokenInterceptorService } from './services/token-interceptor.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { IntroComponent } from './intro/intro.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { GamesComponent } from './games/games.component';

import { IconUser,  IconLock, IconCoin, IconWallet, IconChartBar, IconChevronDown, IconEdit, IconSunMoon, IconLogout, IconMenu2, IconX, IconHome, IconArrowsExchange2, IconArchive, IconArrowBack, IconArrowBigUpLine, IconArrowBigDownLine, IconCaretRight} from 'angular-tabler-icons/icons';
import { ClickOutsideDirective } from 'src/app/directives/clickOutside.directive';
import { ProfileComponent } from './profile/profile.component';
import { GameComponent } from './game/game.component';
import { InventoryComponent } from './inventory/inventory.component';
import { GamemenuComponent } from './gamemenu/gamemenu.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { ShareComponent } from './share/share.component';
import { CurrencyComponent } from './currency/currency.component';
import { CommodityComponent } from './commodity/commodity.component';
const icons = {
  IconUser,
  IconLock,
  IconCoin,
  IconWallet,
  IconChartBar,
  IconChevronDown,
  IconEdit,
  IconSunMoon,
  IconLogout,
  IconMenu2,
  IconX,
  IconHome,
  IconArrowsExchange2,
  IconArchive,
  IconArrowBack,
  IconArrowBigUpLine,
  IconArrowBigDownLine,
  IconCaretRight

};

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    IntroComponent,
    LoginComponent,
    HomeComponent,
    GamesComponent,
    ClickOutsideDirective,
    ProfileComponent,
    GameComponent,
    InventoryComponent,
    GamemenuComponent,
    TransactionsComponent,
    ShareComponent,
    CurrencyComponent,
    CommodityComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    TablerIconsModule.pick(icons)
  ],
  providers: [
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
