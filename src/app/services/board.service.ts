import {Injectable} from "@angular/core";

import {Tile} from "../models/board/tile";
import {
  AirportTileMesh,
  ChanceTileMesh,
  CityTileMesh,
  PrisonTileMesh,
  StartTileMesh,
  TaxTileMesh,
  ThinTileMesh,
  TILE_DEPTH,
  TILE_HEIGHT,
  TILE_WIDTH,
  TileMesh,
  WorldCupTileMesh,
} from "../models/board/tile-mesh";
import {BehaviorSubject} from "rxjs";
import {BoxGeometry, Mesh, MeshBasicMaterial, Scene, TextureLoader} from "three";

const TEXTURES_TO_LOAD = [
  "assets/board/0.png",
  "assets/board/1.png",
  "assets/board/2.png",
  "assets/board/3.png",
  "assets/board/4.png",
  "assets/board/5.png",
  "assets/board/6.png",
  "assets/board/7.png",
  "assets/board/8.png",
  "assets/board/9.png",
  "assets/board/10.png"
];

@Injectable({
  providedIn: "root"
})
export class BoardService {
  public tileTextures: Array<HTMLImageElement> = [];

  private tileMeshes: Array<TileMesh> = [];

  public anisotropy = 0;
  public scene!: Scene;

  public ready$ = new BehaviorSubject<boolean>(false);

  constructor() {
  }

  public loadScene(anisotropy: number) {
    this.anisotropy = anisotropy;

    this.scene = new Scene();
    this.scene.background = new TextureLoader().load("assets/background.png");

    this.loadTextures().then(_ => {
      this.queryTiles().then(_ => {
        this.updateAndReady();
      });
    });
  }

  private loadTextures(): Promise<void> {
    let promises: Array<Promise<HTMLImageElement>> = [];

    for (let url of TEXTURES_TO_LOAD) {
      promises.push(new Promise((resolve, reject) => {
        let image = new Image();
        image.src = url;

        image.onload = () => {
          resolve(image);
        };

        image.onerror = () => {
          reject(image);
        };
      }));
    }

    return Promise.all(promises).then(images => images.forEach(image => {
      this.tileTextures.push(image);
    }));
  }

  private queryTiles(): Promise<void> {
    return new Promise<Array<Tile>>((resolve) => {
      resolve([
        {type: "start"},
        {type: "city", name: "GRENADE", cost: 0, texture: 0},
        {type: "city", name: "SEVILLE", cost: 0, texture: 0},
        {type: "city", name: "MADRID", cost: 0, texture: 0},
        {type: "city", name: "BALI", cost: 0, texture: 8},
        {type: "city", name: "HONG KONG", cost: 0, texture: 1},
        {type: "city", name: "PEKIN", cost: 0, texture: 1},
        {type: "city", name: "SHANGAI", cost: 0, texture: 1},
        {type: "prison"},
        {type: "city", name: "VENISE", cost: 0, texture: 2},
        {type: "city", name: "MILAN", cost: 0, texture: 2},
        {type: "city", name: "ROME", cost: 0, texture: 2},
        {type: "chance"},
        {type: "city", name: "HAMBOURG", cost: 0, texture: 3},
        {type: "city", name: "CHYPRE", cost: 0, texture: 8},
        {type: "city", name: "BERLIN", cost: 0, texture: 3},
        {type: "cup"},
        {type: "city", name: "LONDRES", cost: 0, texture: 4},
        {type: "city", name: "DUBAI", cost: 0, texture: 8},
        {type: "city", name: "SYDNEY", cost: 0, texture: 4},
        {type: "chance"},
        {type: "city", name: "CHICAGO", cost: 0, texture: 5},
        {type: "city", name: "LAS VEGAS", cost: 0, texture: 5},
        {type: "city", name: "NEW YORK", cost: 0, texture: 5},
        {type: "airport"},
        {type: "city", name: "NICE", cost: 0, texture: 8},
        {type: "city", name: "LYON", cost: 0, texture: 6},
        {type: "city", name: "PARIS", cost: 0, texture: 6},
        {type: "chance"},
        {type: "city", name: "OSAKA", cost: 0, texture: 7},
        {type: "tax"},
        {type: "city", name: "TOKYO", cost: 0, texture: 7}
      ])
    }).then(tiles => {
      tiles.forEach(tile => {
        switch (tile.type) {
          case "city":
            this.tileMeshes.push(new CityTileMesh(tile, this));
            break;
          case "chance":
            this.tileMeshes.push(new ChanceTileMesh(tile));
            break;
          case "tax":
            this.tileMeshes.push(new TaxTileMesh(tile));
            break;
          case "start":
            this.tileMeshes.push(new StartTileMesh(tile));
            break;
          case "prison":
            this.tileMeshes.push(new PrisonTileMesh(tile));
            break;
          case "cup":
            this.tileMeshes.push(new WorldCupTileMesh(tile));
            break;
          case "airport":
            this.tileMeshes.push(new AirportTileMesh(tile));
            break;
        }
      });

      const gridSize = this.tileMeshes.length / 4 - 1;

      let tileIndex = 0;
      let currentX = TILE_WIDTH * gridSize / 2 + TILE_HEIGHT / 2;
      let currentY = TILE_WIDTH * gridSize / 2 + TILE_HEIGHT / 2;

      for (let side = 0; side < 4; side++) {
        const multiplierX = side == 0 ? -1 : side == 2 ? 1 : 0;
        const multiplierY = side == 1 ? -1 : side == 3 ? 1 : 0;

        this.tileMeshes[tileIndex].position.x = currentX;
        this.tileMeshes[tileIndex].position.z = currentY;

        currentX += multiplierX * (TILE_WIDTH / 2 + TILE_HEIGHT / 2);
        currentY += multiplierY * (TILE_WIDTH / 2 + TILE_HEIGHT / 2);

        this.scene.add(this.tileMeshes[tileIndex++]);

        while (this.tileMeshes[tileIndex] instanceof ThinTileMesh) {
          this.tileMeshes[tileIndex].position.x = currentX;
          this.tileMeshes[tileIndex].position.z = currentY;

          currentX += multiplierX * TILE_WIDTH;
          currentY += multiplierY * TILE_WIDTH;

          if (side % 2 == 1) {
            this.tileMeshes[tileIndex].rotation.y = Math.PI / 2;
          }

          this.scene.add(this.tileMeshes[tileIndex++]);
        }

        currentX += multiplierX * (TILE_HEIGHT / 2 - TILE_WIDTH / 2);
        currentY += multiplierY * (TILE_HEIGHT / 2 - TILE_WIDTH / 2);
      }

      let ground = new Mesh(
        new BoxGeometry(gridSize * TILE_WIDTH, 0, gridSize * TILE_WIDTH),
        new MeshBasicMaterial({color: 0xBED36A})
      );

      ground.position.y = -TILE_DEPTH / 2;
      this.scene.add(ground);
    });
  }

  private updateAndReady() {
    // this.tileMeshes.forEach(mesh => {
    //   if (mesh instanceof UpdatableTileMesh) {
    //     mesh.updateTexture();
    //   }
    // });

    this.ready$.next(true);
  }
}
