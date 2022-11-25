import {AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {OrthographicCamera, Raycaster, Vector3, WebGLRenderer} from "three";

import {BoardService} from "../../../services/board.service";
import {CityTileMesh, TileMesh} from "../../../models/board/tile-mesh";
import {filter} from "rxjs";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('canvas') private canvasReference!: ElementRef;
  @ViewChild('container') private containerReference!: ElementRef;

  private camera!: OrthographicCamera;
  private caster!: Raycaster;
  private renderer!: WebGLRenderer;
  private observer!: ResizeObserver;

  constructor(private zone: NgZone, private boardService: BoardService) {
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasReference.nativeElement;
  }

  private get container(): HTMLDivElement {
    return this.containerReference.nativeElement;
  }

  ngOnInit(): void {
    this.observer = new ResizeObserver(entries => {
      this.zone.run(() => {
        this.resize(entries[0].contentRect.width, entries[0].contentRect.height);
        this.render();
      });
    });
  }

  ngAfterViewInit(): void {
    this.observer.observe(this.container);

    this.caster = new Raycaster()
    this.renderer = new WebGLRenderer({canvas: this.canvas});
    // this.camera = new PerspectiveCamera(50, 0, 0.1, 1000);
    this.camera = new OrthographicCamera(-90, 90, 75, -75);
    this.camera.position.y = 90;
    this.camera.position.z = 30;
    this.camera.position.x = 30;
    this.camera.lookAt(new Vector3(0, 0, 0));

    this.boardService.loadScene(this.renderer.capabilities.getMaxAnisotropy());

    this.resize(this.container.clientWidth, this.container.clientHeight);

    this.boardService.ready$.pipe(filter(ready => ready)).subscribe(_ => {
      this.startAnimationLoop();
    });
  }

  ngOnDestroy(): void {
    this.observer.unobserve(this.container);
  }

  onClick(event: MouseEvent) {
    let coords = {
      x: 2 * (event.x / this.container.clientWidth) - 1,
      y: 1 - 2 * (event.y / this.container.clientHeight)
    };

    this.caster.setFromCamera(coords, this.camera);

    let intersects = this.caster.intersectObject(this.boardService.scene, true);

    for (let intersect of intersects) {
      if (intersect.object instanceof TileMesh) {
        if (intersect.object instanceof CityTileMesh) {
          intersect.object.tile.texture += 1;
          intersect.object.tile.texture %= 10;
          intersect.object.updateTexture();
        }

        console.log(intersect.object);

        break;
      }
    }

    this.render();
  }

  private resize(width: number, height: number): void {
    const aspectRatio = width / height;

    // // this.camera.aspect = aspectRatio;
    // this.camera.left = -width / 20;
    // this.camera.right = width / 20;
    // this.camera.top = 75;
    // this.camera.bottom = -75;

    this.camera.updateProjectionMatrix();

    this.renderer.setPixelRatio(aspectRatio);
    this.renderer.setSize(width, height);
  }

  private render(): void {
    if (this.boardService.ready$.getValue()) {
      this.renderer.render(this.boardService.scene, this.camera);
    }
  }

  private startAnimationLoop(): void {
    let component = this;

    (function animate() {
      requestAnimationFrame(animate);

      component.render();
    })();
  }
}
