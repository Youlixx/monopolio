import {BoxGeometry, CanvasTexture, Material, Mesh, MeshBasicMaterial, TextureLoader} from "three";
import {AirportTile, ChanceTile, CityTile, PrisonTile, StartTile, TaxTile, WorldCupTile} from "./tile";
import {BoardService} from "../../services/board.service";

const LOADER = new TextureLoader();

export const TILE_DEPTH = 7;
export const TILE_WIDTH = 11;
export const TILE_HEIGHT = 15;

export abstract class TileMesh extends Mesh {
  private static TILE_SIDE_WIDTH_TEXTURE = LOADER.load("assets/board/side_width.png");
  private static TILE_SIDE_HEIGHT_TEXTURE = LOADER.load("assets/board/side_height.png");

  protected static TILE_BOTTOM_MATERIAL = new MeshBasicMaterial({color: 0x000000});
  protected static TILE_SIDE_WIDTH_MATERIAL = new MeshBasicMaterial({map: TileMesh.TILE_SIDE_WIDTH_TEXTURE});
  protected static TILE_SIDE_HEIGHT_MATERIAL = new MeshBasicMaterial({map: TileMesh.TILE_SIDE_HEIGHT_TEXTURE});

  protected constructor(geometry: BoxGeometry) {
    super(geometry, []);
  }

  abstract setTopMaterial(material: Material): void;
}

export class ThinTileMesh extends TileMesh {
  private static TILE_GEOMETRY = new BoxGeometry(TILE_WIDTH, TILE_DEPTH, TILE_HEIGHT);

  protected constructor() {
    super(ThinTileMesh.TILE_GEOMETRY);
  }

  override setTopMaterial(material: Material) {
    this.material = [
      TileMesh.TILE_SIDE_HEIGHT_MATERIAL,
      TileMesh.TILE_SIDE_HEIGHT_MATERIAL,
      material,
      TileMesh.TILE_BOTTOM_MATERIAL,
      TileMesh.TILE_SIDE_WIDTH_MATERIAL,
      TileMesh.TILE_SIDE_WIDTH_MATERIAL
    ];
  }
}

class CornerTileMesh extends TileMesh {
  private static TILE_GEOMETRY = new BoxGeometry(TILE_HEIGHT, TILE_DEPTH, TILE_HEIGHT);

  protected constructor() {
    super(CornerTileMesh.TILE_GEOMETRY);
  }

  override setTopMaterial(material: Material) {
    this.material = [
      TileMesh.TILE_SIDE_HEIGHT_MATERIAL,
      TileMesh.TILE_SIDE_HEIGHT_MATERIAL,
      material,
      TileMesh.TILE_BOTTOM_MATERIAL,
      TileMesh.TILE_SIDE_HEIGHT_MATERIAL,
      TileMesh.TILE_SIDE_HEIGHT_MATERIAL
    ];
  }
}

// export abstract class UpdatableTileMesh extends ThinTileMesh {
//   private static TEXTURE_SCALE = 50;
//
//   protected context: CanvasRenderingContext2D;
//   protected readonly texture: CanvasTexture;
//
//   protected constructor(boardService: BoardService) {
//     super(boardService);
//
//     let canvas = document.createElement("canvas");
//     canvas.width = TILE_WIDTH * UpdatableTileMesh.TEXTURE_SCALE;
//     canvas.height = TILE_HEIGHT * UpdatableTileMesh.TEXTURE_SCALE;
//
//     this.context = canvas.getContext("2d")!;
//     this.texture = new CanvasTexture(canvas);
//     this.texture.anisotropy = this.boardService.anisotropy;
//
//     this.setTopMaterial(new MeshBasicMaterial({map: this.texture}))
//   }
//
//   public abstract updateTexture(): void;
// }

export class CityTileMesh extends ThinTileMesh {
  private static TEXTURE_SCALE = 50;

  protected context: CanvasRenderingContext2D;
  protected readonly texture: CanvasTexture;

  constructor(public tile: CityTile, private boardService: BoardService) {
    super();

    let canvas = document.createElement("canvas");
    canvas.width = TILE_WIDTH * CityTileMesh.TEXTURE_SCALE;
    canvas.height = TILE_HEIGHT * CityTileMesh.TEXTURE_SCALE;

    this.context = canvas.getContext("2d")!;
    this.texture = new CanvasTexture(canvas);
    this.texture.anisotropy = this.boardService.anisotropy;

    this.setTopMaterial(new MeshBasicMaterial({map: this.texture}));
    this.updateTexture();
  }

  updateTexture(): void {
    this.context.drawImage(this.boardService.tileTextures[this.tile.texture], 0, 0);
    this.context.fillStyle = '#000000';
    this.context.textAlign = "center";
    this.context.textBaseline = "alphabetic";
    this.context.font = "80px Arial";
    this.context.fillText(this.tile.name, 275, 520 - 10);
    this.context.font = "125px Arial";
    this.context.fillText(this.tile.cost + "€", 275, 730 - 190 / 2 + 50);

    this.texture.needsUpdate = true;
  }
}

export class ChanceTileMesh extends ThinTileMesh {
  private static TEXTURE = LOADER.load("assets/board/9.png");
  private static MATERIAL = new MeshBasicMaterial({map: ChanceTileMesh.TEXTURE});

  constructor(public tile: ChanceTile) {
    super();

    this.setTopMaterial(ChanceTileMesh.MATERIAL);
  }
}

export class TaxTileMesh extends ThinTileMesh {
  private static TEXTURE = LOADER.load("assets/board/9.png");
  private static MATERIAL = new MeshBasicMaterial({map: TaxTileMesh.TEXTURE});

  constructor(public tile: TaxTile) {
    super();

    this.setTopMaterial(TaxTileMesh.MATERIAL);
  }
}

export class StartTileMesh extends CornerTileMesh {
  private static TEXTURE = LOADER.load("assets/board/corner_0.png");
  private static MATERIAL = new MeshBasicMaterial({map: StartTileMesh.TEXTURE});

  constructor(public tile: StartTile) {
    super();

    this.setTopMaterial(StartTileMesh.MATERIAL);
  }
}

export class PrisonTileMesh extends CornerTileMesh {
  private static TEXTURE = LOADER.load("assets/board/corner_0.png");
  private static MATERIAL = new MeshBasicMaterial({map: PrisonTileMesh.TEXTURE});

  constructor(public tile: PrisonTile) {
    super();

    this.setTopMaterial(PrisonTileMesh.MATERIAL);
  }
}

export class WorldCupTileMesh extends CornerTileMesh {
  private static TEXTURE = LOADER.load("assets/board/corner_0.png");
  private static MATERIAL = new MeshBasicMaterial({map: WorldCupTileMesh.TEXTURE});

  constructor(public tile: WorldCupTile) {
    super();

    this.setTopMaterial(WorldCupTileMesh.MATERIAL);
  }
}

export class AirportTileMesh extends CornerTileMesh {
  private static TEXTURE = LOADER.load("assets/board/corner_0.png");
  private static MATERIAL = new MeshBasicMaterial({map: AirportTileMesh.TEXTURE});

  constructor(public tile: AirportTile) {
    super();

    this.setTopMaterial(AirportTileMesh.MATERIAL);
  }
}
