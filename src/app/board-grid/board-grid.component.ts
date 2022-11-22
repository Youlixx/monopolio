import { Component, Input } from '@angular/core';
import { BoardService } from '../services/board.service';

const CELL_WIDTH = 110;
const CELL_HEIGHT = 150;

const CELL_HALF_WIDTH = Math.floor(CELL_WIDTH / 2);
const CELL_OFFSET = CELL_HEIGHT - Math.floor(CELL_WIDTH / 2);

@Component({
    selector: 'board-grid',
    templateUrl: './board-grid.component.html',
    styleUrls: ['./board-grid.component.scss'],
})
export class BoardGridComponent {
    @Input() public scale: number;

    @Input() public angleX: number;
    @Input() public angleZ: number;

    constructor(public board : BoardService) {
        this.scale = 0;

        this.angleX = 0;
        this.angleZ = 0;
    }

    public getCellsPerSide(): number {
        return Math.floor(this.board.cells.length / 4);
    }

    private getInnerBoardSize(): number {
        return this.getCellsPerSide() * CELL_WIDTH;
    }

    private getBoardSize(): number {
        return 2 * CELL_HEIGHT + this.getCellsPerSide() * CELL_WIDTH;
    }

    public getBoardStyle(): any {
        const boardSize = this.getBoardSize() + "px";

        return {
            width: boardSize,
            height: boardSize,
            transform: "translateZ(" + boardSize + ") scale(" + this.scale + ") rotateX(" + this.angleX + "deg) rotateZ(" + this.angleZ + "deg)"
        }
    }

    public getInnerBoardStyle(): any {
        const boardSize = (this.getInnerBoardSize() + CELL_HEIGHT) + "px";

        return {
            width: boardSize,
            height: boardSize
        }
    }

    private getCellSide(index: number): number {
        return Math.floor(4 * index / this.board.cells.length);
    }

    public getBoardIndex(index: number): number {
        return 1 + index + this.getCellSide(index);
    }

    public getCellOrientation(index: number): string {
        if(this.getCellSide(index) % 2 == 0) {
            if(this.angleZ % 360 > 270 || this.angleZ % 360 < 90) {
                return "rotate-0";
            } else {
                return "rotate-180";
            }
        } else {
            if(this.angleZ % 360 < 180) {
                return "rotate-90";
            } else {
                return "rotate-270";
            }
        }
    }

    public getCellPosition(index: number): any {
        const cellPerSide = this.getCellsPerSide();
        const position = this.getBoardIndex(index) % (cellPerSide + 1);

        switch(this.getCellSide(index)) {
            case 0: return {left: CELL_HEIGHT + (position - 1) * CELL_WIDTH + "px", top: "0px"};
            case 1: return {left: CELL_HEIGHT + this.getInnerBoardSize() + "px", top: CELL_HEIGHT + (position - 1) * CELL_WIDTH + "px"};
            case 2: return {left: CELL_HEIGHT + (cellPerSide - position) * CELL_WIDTH + "px", top: CELL_HEIGHT + this.getInnerBoardSize() + "px"};
            default: return {left: "0px", top: CELL_HEIGHT + (cellPerSide - position) * CELL_WIDTH + "px"};
        }
    }

    public getCornerPosition(index: number): any {
        const offset = CELL_HEIGHT + this.getInnerBoardSize();

        switch(index) {
            case 0: return {left: "0px", top: "0px"};
            case 1: return {left: offset + "px", top: "0px"};
            case 2: return {left: offset + "px", top: offset + "px"};
            default: return {left: "0px", top: offset + "px"};
        }
    }

    public getPlayerStyle(): any {
        return {
            transform: "translate(-50%, -50%) rotateZ(" + -this.angleZ + "deg) rotateX(" + -this.angleX + "deg) translateY(-50%)"
        }
    }

    public getPlayerPositionStyle(): any {
        let index = 31;

        const cellPerSide = this.getCellsPerSide() + 1;
        const position = index % cellPerSide;
        const side = Math.floor(index / cellPerSide);

        switch(side) {
            case 0: return {left: CELL_OFFSET + position * CELL_WIDTH + "px", top: CELL_OFFSET + "px"};
            case 1: return {left: this.getBoardSize() - CELL_OFFSET + "px", top: CELL_OFFSET + position * CELL_WIDTH + "px"};
            case 2: return {left: this.getBoardSize() - CELL_OFFSET - position * CELL_WIDTH + "px", top: this.getBoardSize() - CELL_OFFSET + "px"};
            default: return {left: CELL_OFFSET + "px", top: this.getBoardSize() - CELL_OFFSET - position * CELL_WIDTH + "px"};
        }
    }
}
