import { Component, HostListener } from '@angular/core';

const ANGLE_SENSIBILITY: number = 0.2;
const SCALE_SENSIBILITY: number = 0.003;

const MIN_SCALE: number = 0.1;
const MAX_SCALE: number = 1.5;

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.scss']
})
export class BoardComponent {
    private startX: number;
    private startY: number;

    private originX: number;
    private originZ: number;

    private mouseDown: boolean;

    public scale: number;

    public angleX: number;
    public angleZ: number;
  
    constructor() {
        this.startX = 0;
        this.startY = 0;

        this.originX = 0;
        this.originZ = 0;

        this.mouseDown = false;

        this.scale = 1;

        this.angleX = 55;
        this.angleZ = 225;
    }

    @HostListener("mousedown", ["$event"])
    public onMouseDown(event: MouseEvent): void {
        if(event.buttons == 1) {
            this.startX = event.clientX;
            this.startY = event.clientY;

            this.originX = this.angleX;
            this.originZ = this.angleZ;

            this.mouseDown = true;
        }
    }

    @HostListener("mouseup", ["$event"])
    public onMouseUp(event: MouseEvent): void {
        this.mouseDown = false;
    }

    @HostListener("mousemove", ["$event"])
    public onMouseOver(event: MouseEvent): void {
        if(this.mouseDown) {
            const deltaX = event.clientX - this.startX;
            const deltaY = event.clientY - this.startY;

            this.angleZ = this.originZ - ANGLE_SENSIBILITY * deltaX;
            this.angleX = this.originX - ANGLE_SENSIBILITY * deltaY;

            if(this.angleX > 90) {
                this.angleX = 90;
            } else if(this.angleX < 0) {
                this.angleX = 0;
            }

            if(this.angleZ > 360) {
                this.angleZ -= 360;
            } else if(this.angleZ < 0) {
                this.angleZ += 360;
            }
        }
    }

    @HostListener("mouseenter", ["$event"])
    public onMouseEnter(event: MouseEvent): void {
        if(event.buttons != 1) {
            this.mouseDown = false;
        }
    }

    @HostListener("wheel", ["$event"]) 
    public onScroll(event: WheelEvent): void {
        this.scale *= (1 - SCALE_SENSIBILITY * event.deltaY);

        if(this.scale < MIN_SCALE) {
            this.scale = MIN_SCALE;
        } else if(this.scale > MAX_SCALE) {
            this.scale = MAX_SCALE;
        }
    }
}
