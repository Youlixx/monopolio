import { Component } from '@angular/core';
import { BoardService } from './services/board.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-monop';

  constructor(private boardService: BoardService) { }

  onClick() {
    this.boardService.angleX += 45;
    console.log(this.boardService.angleX)
    // console.log(this.boardService.cells)
  }
}
