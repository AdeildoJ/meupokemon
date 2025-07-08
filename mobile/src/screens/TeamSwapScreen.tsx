import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  SafeAreaView,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

interface Character {
  id: string;
  name: string;
  age: number;
  class: string;
  origin: string;
  avatar?: string;
  starterPokemonId: number;
  starterPokemonName: string;
  starterIsShiny: boolean;
  level: number;
  coins: number;
  team: any[];
  characterId?: string;
  ranking?: number;
  fame?: number;
  victories?: number;
  defeats?: number;
  pcoin?: number;
  ecoin?: number;
  isGymLeader?: boolean;
}

interface PokemonData {
  id: number;
  name: string;
  nickname?: string;
  level: number;
  happiness: number;
  nature: string;
  ability: string;
  types: string[];
  height: number;
  weight: number;
  sprite: string;
  cry?: string;
  description: string;
  eggGroups: string[];
  hatchTime: number;
  isShiny: boolean;
  moves: any[];
  stats: any;
  ivs: any;
  evs: any;
  heldItem?: any;
  hasBeenTraded?: boolean;
  experience: number;
  experienceToNext: number;
}

const TeamSwapScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {character} = route.params as {character: Character};
  
  // ESTADOS PARA CONTROLE DA TELA
  const [currentTeam, setCurrentTeam] = useState<(PokemonData | null)[]>([]);
  const [pokemonBox, setPokemonBox] = useState<PokemonData[]>([]);
  const [selectedTeamSlot, setSelectedTeamSlot] = useState<number | null>(null);
  const [selectedBoxPokemon, setSelectedBoxPokemon] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [boxLimit] = useState(50); // Limite de 50 Pokémon na box

  // FUNÇÃO PARA OBTER URL DA IMAGEM COM FALLBACKS
  const getPokemonImageUrl = (pokemonId: number, isShiny: boolean = false): string => {
    const shinyPath = isShiny ? '/shiny' : '';
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork${shinyPath}/${pokemonId}.png`;
  };

  // DADOS MOCK PARA DEMONSTRAÇÃO
  const generateMockPokemon = (id: number, name: string, level: number, types: string[], isShiny: boolean = false): PokemonData => {
    return {
      id,
      name,
      nickname: '',
      level,
      happiness: Math.floor(Math.random() * 255),
      nature: 'Hardy',
      ability: 'Torrente',
      types,
      height: 0.4,
      weight: 5.2,
      sprite: getPokemonImageUrl(id, isShiny),
      description: `Descrição do ${name}`,
      eggGroups: ['Aquático 1', 'Campo'],
      hatchTime: 5120,
      isShiny,
      moves: [],
      stats: { hp: 53, attack: 51, defense: 53, spAttack: 61, spDefense: 56, speed: 40, total: 314 },
      ivs: { hp: 31, attack: 31, defense: 31, spAttack: 31, spDefense: 31, speed: 31 },
      evs: { hp: 0, attack: 0, defense: 0, spAttack: 0, spDefense: 0, speed: 0 },
      experience: 0,
      experienceToNext: 1000,
    };
  };

  // INICIALIZAR DADOS
  useEffect(() => {
    initializeTeamAndBox();
  }, [character]);

  const initializeTeamAndBox = () => {
    // EQUIPE ATUAL (6 SLOTS)
    const team: (PokemonData | null)[] = [
      generateMockPokemon(character.starterPokemonId, character.starterPokemonName, character.level, ['agua'], character.starterIsShiny),
      null,
      null,
      null,
      null,
      null
    ];

    // BOX COM POKÉMON VARIADOS PARA DEMONSTRAÇÃO
    const box: PokemonData[] = [
      generateMockPokemon(25, 'Pikachu', 15, ['eletrico']),
      generateMockPokemon(1, 'Bulbasaur', 12, ['grama', 'veneno']),
      generateMockPokemon(4, 'Charmander', 10, ['fogo']),
      generateMockPokemon(7, 'Squirtle', 11, ['agua']),
      generateMockPokemon(133, 'Eevee', 20, ['normal']),
      generateMockPokemon(150, 'Mewtwo', 70, ['psiquico']),
      generateMockPokemon(144, 'Articuno', 50, ['gelo', 'voador']),
      generateMockPokemon(145, 'Zapdos', 50, ['eletrico', 'voador']),
      generateMockPokemon(146, 'Moltres', 50, ['fogo', 'voador']),
      generateMockPokemon(448, 'Lucario', 35, ['lutador', 'aco']),
      generateMockPokemon(6, 'Charizard', 45, ['fogo', 'voador']),
      generateMockPokemon(9, 'Blastoise', 42, ['agua']),
      generateMockPokemon(3, 'Venusaur', 40, ['grama', 'veneno']),
      generateMockPokemon(94, 'Gengar', 38, ['fantasma', 'veneno']),
      generateMockPokemon(130, 'Gyarados', 35, ['agua', 'voador']),
      generateMockPokemon(149, 'Dragonite', 55, ['dragao', 'voador']),
      generateMockPokemon(248, 'Tyranitar', 55, ['pedra', 'sombrio']),
      generateMockPokemon(445, 'Garchomp', 48, ['dragao', 'terra']),
      generateMockPokemon(282, 'Gardevoir', 30, ['psiquico', 'fada']),
      generateMockPokemon(376, 'Metagross', 45, ['aco', 'psiquico']),
      generateMockPokemon(384, 'Rayquaza', 70, ['dragao', 'voador']),
      generateMockPokemon(493, 'Arceus', 80, ['normal']),
      generateMockPokemon(25, 'Pikachu', 25, ['eletrico'], true), // Shiny
    ];

    setCurrentTeam(team);
    setPokemonBox(box);
  };

  // CORES DOS TIPOS
  const typeColors: {[key: string]: string} = {
    normal: '#A8A878',
    fogo: '#F08030',
    agua: '#6890F0',
    eletrico: '#F8D030',
    grama: '#78C850',
    gelo: '#98D8D8',
    lutador: '#C03028',
    veneno: '#A040A0',
    terra: '#E0C068',
    voador: '#A890F0',
    psiquico: '#F85888',
    inseto: '#A8B820',
    pedra: '#B8A038',
    fantasma: '#705898',
    dragao: '#7038F8',
    sombrio: '#705848',
    aco: '#B8B8D0',
    fada: '#EE99AC',
  };

  // FUNÇÃO PARA SELECIONAR SLOT DA EQUIPE
  const selectTeamSlot = (index: number) => {
    if (selectedTeamSlot === index) {
      setSelectedTeamSlot(null);
    } else {
      setSelectedTeamSlot(index);
      setSelectedBoxPokemon(null);
    }
  };

  // FUNÇÃO PARA SELECIONAR POKÉMON DA BOX
  const selectBoxPokemon = (index: number) => {
    if (selectedBoxPokemon === index) {
      setSelectedBoxPokemon(null);
    } else {
      setSelectedBoxPokemon(index);
      setSelectedTeamSlot(null);
    }
  };

  // FUNÇÃO PARA REALIZAR A TROCA
  const performSwap = () => {
    if (selectedTeamSlot !== null && selectedBoxPokemon !== null) {
      const newTeam = [...currentTeam];
      const newBox = [...pokemonBox];
      
      // Pokémon da equipe que será movido para a box
      const teamPokemon = newTeam[selectedTeamSlot];
      // Pokémon da box que será movido para a equipe
      const boxPokemon = newBox[selectedBoxPokemon];
      
      // Realizar a troca
      newTeam[selectedTeamSlot] = boxPokemon;
      
      if (teamPokemon) {
        // Se havia um Pokémon no slot da equipe, mover para a box
        newBox[selectedBoxPokemon] = teamPokemon;
      } else {
        // Se o slot estava vazio, remover o Pokémon da box
        newBox.splice(selectedBoxPokemon, 1);
      }
      
      setCurrentTeam(newTeam);
      setPokemonBox(newBox);
      setSelectedTeamSlot(null);
      setSelectedBoxPokemon(null);
      setHasChanges(true);
      
      Alert.alert('Troca Realizada', 'Pokémon trocado com sucesso!');
    }
  };

  // FUNÇÃO PARA MOVER POKÉMON DA EQUIPE PARA A BOX
  const moveToBox = (teamIndex: number) => {
    const pokemon = currentTeam[teamIndex];
    if (!pokemon) return;

    // Verificar se ainda haverá pelo menos 1 Pokémon na equipe
    const remainingPokemon = currentTeam.filter((p, index) => p !== null && index !== teamIndex);
    if (remainingPokemon.length === 0) {
      Alert.alert('Erro', 'Você deve manter pelo menos 1 Pokémon na sua equipe!');
      return;
    }

    // Verificar limite da box
    if (pokemonBox.length >= boxLimit) {
      Alert.alert('Erro', `A Box está cheia! Limite: ${boxLimit} Pokémon.`);
      return;
    }

    const newTeam = [...currentTeam];
    const newBox = [...pokemonBox];
    
    newTeam[teamIndex] = null;
    newBox.push(pokemon);
    
    setCurrentTeam(newTeam);
    setPokemonBox(newBox);
    setHasChanges(true);
    
    Alert.alert('Pokémon Movido', `${pokemon.name} foi movido para a Box!`);
  };

  // FUNÇÃO PARA MOVER POKÉMON DA BOX PARA A EQUIPE
  const moveToTeam = (boxIndex: number, teamIndex: number) => {
    const pokemon = pokemonBox[boxIndex];
    if (!pokemon) return;

    const newTeam = [...currentTeam];
    const newBox = [...pokemonBox];
    
    // Se já há um Pokémon no slot da equipe, mover para a box
    if (newTeam[teamIndex]) {
      if (newBox.length >= boxLimit) {
        Alert.alert('Erro', `A Box está cheia! Não é possível trocar.`);
        return;
      }
      newBox.push(newTeam[teamIndex]!);
    }
    
    newTeam[teamIndex] = pokemon;
    newBox.splice(boxIndex, 1);
    
    setCurrentTeam(newTeam);
    setPokemonBox(newBox);
    setHasChanges(true);
    
    Alert.alert('Pokémon Adicionado', `${pokemon.name} foi adicionado à equipe!`);
  };

  // FUNÇÃO PARA VALIDAR E SALVAR MUDANÇAS
  const saveChanges = () => {
    // Verificar se há pelo menos 1 Pokémon na equipe
    const activePokemon = currentTeam.filter(pokemon => pokemon !== null);
    
    if (activePokemon.length === 0) {
      Alert.alert('Erro', 'Você deve ter pelo menos 1 Pokémon na sua equipe!');
      return;
    }
    
    // Verificar se há mudanças para salvar
    if (!hasChanges) {
      Alert.alert('Aviso', 'Nenhuma mudança foi feita na equipe.');
      return;
    }
    
    // Mostrar resumo das mudanças
    Alert.alert(
      'Confirmar Mudanças', 
      `Sua nova equipe terá ${activePokemon.length} Pokémon.\nBox: ${pokemonBox.length}/${boxLimit} Pokémon.\n\nDeseja salvar as mudanças?`,
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Salvar',
          onPress: () => {
            // Aqui você salvaria as mudanças no estado global ou backend
            // Por exemplo: updateCharacterTeam(character.id, currentTeam);
            
            Alert.alert(
              'Equipe Salva!', 
              'Sua nova equipe foi salva com sucesso!',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    // Navegar de volta para a tela anterior
                    navigation.goBack();
                  }
                }
              ]
            );
          }
        }
      ]
    );
  };

  // FUNÇÃO PARA RESETAR MUDANÇAS
  const resetChanges = () => {
    if (!hasChanges) return;
    
    Alert.alert(
      'Resetar Mudanças',
      'Tem certeza que deseja desfazer todas as mudanças?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: 'Resetar',
          style: 'destructive',
          onPress: () => {
            initializeTeamAndBox();
            setSelectedTeamSlot(null);
            setSelectedBoxPokemon(null);
            setHasChanges(false);
            Alert.alert('Mudanças Resetadas', 'A equipe foi restaurada ao estado original.');
          }
        }
      ]
    );
  };

  // RENDERIZAR SLOT DA EQUIPE
  const renderTeamSlot = (pokemon: PokemonData | null, index: number) => {
    const isSelected = selectedTeamSlot === index;
    
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.teamSlot,
          isSelected && styles.selectedSlot
        ]}
        onPress={() => selectTeamSlot(index)}
      >
        {pokemon ? (
          <View style={styles.pokemonContainer}>
            <Image
              source={{ uri: pokemon.sprite }}
              style={styles.pokemonImage}
              resizeMode="contain"
            />
            <Text style={styles.pokemonLevel}>Nv.{pokemon.level}</Text>
            <View style={styles.typesContainer}>
              {pokemon.types.map((type, typeIndex) => (
                <View
                  key={typeIndex}
                  style={[
                    styles.typeChip,
                    { backgroundColor: typeColors[type] || '#68A090' }
                  ]}
                >
                  <Text style={styles.typeText}>{type.toUpperCase()}</Text>
                </View>
              ))}
            </View>
            {pokemon.isShiny && (
              <Text style={styles.shinyIndicator}>✨</Text>
            )}
          </View>
        ) : (
          <View style={styles.emptySlot}>
            <Text style={styles.emptySlotText}>⚪</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  // RENDERIZAR POKÉMON DA BOX
  const renderBoxPokemon = (pokemon: PokemonData, index: number) => {
    const isSelected = selectedBoxPokemon === index;
    
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.boxSlot,
          isSelected && styles.selectedSlot
        ]}
        onPress={() => selectBoxPokemon(index)}
      >
        <View style={styles.pokemonContainer}>
          <Image
            source={{ uri: pokemon.sprite }}
            style={styles.boxPokemonImage}
            resizeMode="contain"
          />
          <Text style={styles.pokemonName}>{pokemon.name}</Text>
          <Text style={styles.pokemonLevel}>Nv.{pokemon.level}</Text>
          <View style={styles.typesContainer}>
            {pokemon.types.slice(0, 2).map((type, typeIndex) => (
              <View
                key={typeIndex}
                style={[
                  styles.typeChipSmall,
                  { backgroundColor: typeColors[type] || '#68A090' }
                ]}
              >
                <Text style={styles.typeTextSmall}>{type.substring(0, 3).toUpperCase()}</Text>
              </View>
            ))}
          </View>
          {pokemon.isShiny && (
            <Text style={styles.shinyIndicatorSmall}>✨</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trocar Pokémon</Text>
        <TouchableOpacity
          style={[styles.resetButton, !hasChanges && styles.resetButtonDisabled]}
          onPress={resetChanges}
          disabled={!hasChanges}
        >
          <Text style={[styles.resetButtonText, !hasChanges && styles.resetButtonTextDisabled]}>
            🔄
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollContainer}>
        {/* EQUIPE ATUAL */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Equipe Atual</Text>
          <View style={styles.teamGrid}>
            {/* PRIMEIRA LINHA */}
            <View style={styles.teamRow}>
              {currentTeam.slice(0, 3).map((pokemon, index) => 
                renderTeamSlot(pokemon, index)
              )}
            </View>
            {/* SEGUNDA LINHA */}
            <View style={styles.teamRow}>
              {currentTeam.slice(3, 6).map((pokemon, index) => 
                renderTeamSlot(pokemon, index + 3)
              )}
            </View>
          </View>
        </View>

        {/* INSTRUÇÕES DE TROCA */}
        {(selectedTeamSlot !== null || selectedBoxPokemon !== null) && (
          <View style={styles.instructionContainer}>
            <Text style={styles.instructionText}>
              {selectedTeamSlot !== null 
                ? `Slot ${selectedTeamSlot + 1} da equipe selecionado. Agora escolha um Pokémon da Box para trocar.`
                : `Pokémon da Box selecionado. Agora escolha um slot da equipe para trocar.`
              }
            </Text>
            {selectedTeamSlot !== null && selectedBoxPokemon !== null && (
              <TouchableOpacity
                style={styles.swapButton}
                onPress={performSwap}
              >
                <Text style={styles.swapButtonText}>🔄 Realizar Troca</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* BOX DE ARMAZENAMENTO */}
        <View style={styles.section}>
          <View style={styles.boxHeader}>
            <Text style={styles.sectionTitle}>Armazenamento (Box)</Text>
            <Text style={styles.boxCounter}>
              {pokemonBox.length} / {boxLimit} Pokémon
            </Text>
          </View>
          
          <View style={styles.boxGrid}>
            {pokemonBox.map((pokemon, index) => 
              renderBoxPokemon(pokemon, index)
            )}
          </View>
        </View>
      </ScrollView>

      {/* BOTÃO SALVAR FIXO */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.saveButton,
            !hasChanges && styles.saveButtonDisabled
          ]}
          onPress={saveChanges}
          disabled={!hasChanges}
        >
          <Text style={[
            styles.saveButtonText,
            !hasChanges && styles.saveButtonTextDisabled
          ]}>
            💾 Salvar Trocas
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  placeholder: {
    width: 60,
  },
  resetButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#e74c3c',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resetButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  resetButtonText: {
    fontSize: 16,
    color: 'white',
  },
  resetButtonTextDisabled: {
    color: '#7f8c8d',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  teamGrid: {
    alignItems: 'center',
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 10,
  },
  teamSlot: {
    width: 100,
    height: 120,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  selectedSlot: {
    borderColor: '#3498db',
    backgroundColor: '#e3f2fd',
  },
  pokemonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  pokemonImage: {
    width: 60,
    height: 60,
  },
  pokemonLevel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 2,
  },
  typesContainer: {
    flexDirection: 'row',
    marginTop: 2,
  },
  typeChip: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 8,
    marginHorizontal: 1,
  },
  typeText: {
    color: 'white',
    fontSize: 6,
    fontWeight: 'bold',
  },
  shinyIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    fontSize: 12,
  },
  emptySlot: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptySlotText: {
    fontSize: 30,
    color: '#bdc3c7',
  },
  instructionContainer: {
    backgroundColor: '#e8f5e8',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#27ae60',
  },
  instructionText: {
    fontSize: 14,
    color: '#2c3e50',
    textAlign: 'center',
    marginBottom: 10,
  },
  swapButton: {
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  swapButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  boxHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  boxCounter: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '600',
  },
  boxGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  boxSlot: {
    width: '30%',
    height: 100,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  boxPokemonImage: {
    width: 40,
    height: 40,
  },
  pokemonName: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 2,
  },
  typeChipSmall: {
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 6,
    marginHorizontal: 1,
  },
  typeTextSmall: {
    color: 'white',
    fontSize: 5,
    fontWeight: 'bold',
  },
  shinyIndicatorSmall: {
    position: 'absolute',
    top: 1,
    right: 1,
    fontSize: 8,
  },
  bottomContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  saveButton: {
    backgroundColor: '#27ae60',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonTextDisabled: {
    color: '#7f8c8d',
  },
});

export default TeamSwapScreen;

