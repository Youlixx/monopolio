export interface CityTile {
  type: 'city',

  name: string,
  cost: number,
  texture: number
}

export interface ChanceTile {
  type: 'chance'
}

export interface TaxTile {
  type: 'tax'
}

export interface StartTile {
  type: 'start'
}

export interface PrisonTile {
  type: 'prison'
}

export interface WorldCupTile {
  type: 'cup'
}

export interface AirportTile {
  type: 'airport'
}

export type Tile = CityTile | ChanceTile | TaxTile | StartTile | PrisonTile | WorldCupTile | AirportTile;
