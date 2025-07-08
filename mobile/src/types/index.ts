export interface Pokemon {
  id: string;
  name: string;
  image: string;
  level: number;
  type1: string;
  type2?: string;
  nature: string;
  ability: string;
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
  ev: {
    hp: number;
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
  };
  iv: {
    hp: number;
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
  };
  moves: Array<{
    name: string;
    type: string;
    pp: number;
    accuracy: number;
    power: number;
  }>;
  wins: number;
  losses: number;
  weight?: number;
  height?: number;
}

export interface Character {
  id: string;
  name: string;
  avatarUri: string;
  age: number;
  class: string;
  level: number;
  generation: number;
  starterPokemon: any;
  pokemonGender: 'male' | 'female';
  stats: {
    FOR: number;
    INT: number;
    SAB: number;
    CAR: number;
    VEL: number;
    ALT: number;
    FAM: number;
  };
  team: (Pokemon | null)[];
  items: { [key: string]: number };
  tms: { [key: string]: number };
  pokeballs: { [key: string]: number };
  createdAt: string;
  isVip?: boolean;
  pcoins?: number;
  ecoins?: number;
  ranking?: number;
  totalBattles: number;
  wins: number;
}

export interface BagTab {
  id: string;
  name: string;
  icon: string;
}

export interface MenuItem {
  id: string;
  name: string;
  icon: string;
  action: () => void;
}

export interface TypeEffectiveness {
  [key: string]: {
    strong: Array<{type: string, multiplier: string}>, 
    weak: Array<{type: string, multiplier: string}>, 
    resistant: Array<{type: string, multiplier: string}>, 
    vulnerable: Array<{type: string, multiplier: string}>
  };
}
