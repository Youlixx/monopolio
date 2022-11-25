import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {GameComponent} from "./pages/game/game.component";
import {BoardComponent} from "./pages/game/board/board.component";
import {BoardService} from "./services/board.service";

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    BoardComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [BoardService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
