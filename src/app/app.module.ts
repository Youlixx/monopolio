import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { BoardGridComponent } from './board-grid/board-grid.component';
import { BoardService } from './services/board.service';
import { BoardComponent } from './board/board.component';
import { AvatarComponent } from './avatar/avatar.component';
import { BoardCellComponent } from './board-cell/board-cell.component';
import { BoardCornerComponent } from './board-corner/board-corner.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardGridComponent,
    BoardComponent,
    AvatarComponent,
    BoardCellComponent,
    BoardCornerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [BoardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
