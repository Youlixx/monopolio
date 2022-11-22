import { Component, Input, HostListener } from '@angular/core';

@Component({
    selector: 'board-cell',
    templateUrl: './board-cell.component.html',
    styleUrls: ['./board-cell.component.scss']
})
export class BoardCellComponent {
    // @Input() tileIndex: Cell;

    constructor() { }

    @HostListener("click", ["$event"])
    public onClick(event: any): void {
        console.log("click!")
    }
}
