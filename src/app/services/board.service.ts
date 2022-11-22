const CELL_WIDTH = 110;
const CELL_HEIGHT = 150;



class Cell {

}

class CellCity extends Cell {
    tile: number;

    constructor(tile: number) {
        super();

        this.tile = tile;
    }
}

class Player {
    color: string;

    position: number = 0;

    constructor(color: string) {
        this.color = color;
    }
}

export class BoardService {
    /// REWORK DES TYPES
    public cells: any[];

    public boardData: any[];

    public outerBoardSize: number;
    public innerBoardSize: number;

    public gridWidth: number;
    public gridOffset: number;


    /// PLAYER API
    public players: Player[];

    // public playerData: any[];

    angleX: number = 225;

    constructor() {
        // retrieve sur le server
        this.cells = [
            {tile: 0, place: "GRENADE"},
            {tile: 0, place: "SEVILLE"},
            {tile: 0, place: "MADRID"},
            {tile: 8, place: "BALI"},
            {tile: 1, place: "HONG KONG"},
            {tile: 1, place: "PEKIN"},
            {tile: 1, place: "SHANGAI"},
            {tile: 2, place: "VENISE"},
            {tile: 2, place: "MILAN"},
            {tile: 2, place: "ROME"},
            {tile: 9, place: "CHANCE"},
            {tile: 3, place: "HAMBOURG"},
            {tile: 8, place: "CHYPRE"},
            {tile: 3, place: "BERLIN"},
            {tile: 4, place: "LONDES"},
            {tile: 8, place: "DUBAI"},
            {tile: 4, place: "SYDNEY"},
            {tile: 9, place: "CHANCE"},
            {tile: 5, place: "CHICAGO"},
            {tile: 5, place: "LAS VEGAS"},
            {tile: 5, place: "NEW YORK"},
            {tile: 8, place: "NICE"},
            {tile: 6, place: "LYON"},
            {tile: 6, place: "PARIS"},
            {tile: 9, place: "CHANCE"},
            {tile: 7, place: "OSAKA"},
            {tile: 10, place: "IMPOTS"},
            {tile: 7, place: "TOKYO"},
        ]

        this.players = [new Player("#47FF00")];

        this.outerBoardSize = 2 * CELL_HEIGHT;
        this.innerBoardSize = 0;

        this.gridWidth = 0;
        this.gridOffset = 0;

        this.boardData = [];

        this.updateBoardData();
    }

    public updateBoardData(): void {
        this.gridWidth = Math.floor(this.cells.length / 4);

        this.innerBoardSize = this.gridWidth * CELL_WIDTH;
        this.outerBoardSize = 2 * CELL_HEIGHT + this.innerBoardSize;

        this.gridOffset = CELL_HEIGHT + this.gridWidth * CELL_WIDTH;

        this.boardData = [];

        const gridWidthLarge = this.gridWidth + 1;

        let cellIndex = 1;
        let listIndex = 0;

        for(let cell = 0; cell < this.gridWidth; cell++) {
            const position = cellIndex % gridWidthLarge;

            this.boardData.push({
                id: cellIndex,
                position: {left: "0px", top: CELL_HEIGHT + (this.gridWidth - position) * CELL_WIDTH + "px"},
                orientation: "column",
                data: this.cells[listIndex++]
            });

            cellIndex++;
        }

        cellIndex++;

        for(let cell = 0; cell < this.gridWidth; cell++) {
            const position = cellIndex % gridWidthLarge;

            this.boardData.push({
                id: cellIndex,
                position: {left: CELL_HEIGHT + (position - 1) * CELL_WIDTH + "px", top: "0px"},
                orientation: "row",
                data: this.cells[listIndex++]
            });

            cellIndex++;
        }

        cellIndex++;

        for(let cell = 0; cell < this.gridWidth; cell++) {
            const position = cellIndex % gridWidthLarge;

            this.boardData.push({
                id: cellIndex,
                position: {left: this.gridOffset + "px", top: CELL_HEIGHT + (position - 1) * CELL_WIDTH + "px"},
                orientation: "column",
                data: this.cells[listIndex++]
            });

            cellIndex++;
        }

        cellIndex++;

        for(let cell = 0; cell < this.gridWidth; cell++) {
            const position = cellIndex % gridWidthLarge;

            this.boardData.push({
                id: cellIndex,
                position: {left: CELL_HEIGHT + (this.gridWidth - position) * CELL_WIDTH + "px", top: this.gridOffset + "px"},
                orientation: "row",
                data: this.cells[listIndex++]
            });

            cellIndex++;
        }
    }

    public setCells(cells: any[]): void {
        this.cells = cells;

        this.updateBoardData();
    }
}