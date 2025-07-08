export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

export type MainStackParamList = {
  Home: undefined;
  PokemonList: undefined;
  PokemonDetail: { pokemonId: number | string };
  CreateCharacter: undefined;
  CharacterList: undefined;
  CharacterDetail: { characterId: string };
  CharacterSheetScreen: { characterId: string };
  Profile: { characterId: string };
  Class: { characterId: string };
};


