
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import { characterService, pokemonDataService } from '../services/api';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const [token, setToken] = useState<string | null>(null);
const [userId, setUserId] = useState<string | null>(null);

useEffect(() => {
  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('@user');
      if (userData) {
        const userParsed = JSON.parse(userData);
        setUserId(userParsed.id); // 👈 Isso assume que o objeto tem .id
        setToken(parsedUser.token); // 👈 aqui buscamos o token
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  };

  loadUser();
}, []);


const {width} = Dimensions.get('window');

// --- ESTRUTURA DE DADOS PARA OS INICIAIS ---
// Mapeia os Pokémon iniciais por região e classe.
const starterData = {
    Kanto: {
      Treinador: [1, 4, 7], // Bulbasaur, Charmander, Squirtle
      Pesquisador: [1, 4, 7],
      Vilão: [29, 32, 56], // Nidoran♀, Nidoran♂, Mankey
    },
    Johto: {
      Treinador: [152, 155, 158], // Chikorita, Cyndaquil, Totodile
      Pesquisador: [152, 155, 158],
      Vilão: [167, 177, 215], // Spinarak, Natu, Sneasel
    },
    Hoenn: {
      Treinador: [252, 255, 258], // Treecko, Torchic, Mudkip
      Pesquisador: [252, 255, 258],
      Vilão: [302, 335, 347], // Sableye, Zangoose, Anorith
    },
    Sinnoh: {
      Treinador: [387, 390, 393], // Turtwig, Chimchar, Piplup
      Pesquisador: [387, 390, 393],
      Vilão: [434, 442, 451], // Stunky, Spiritomb, Skorupi
    },
    Unova: { 
      Treinador: [495, 498, 501], // Snivy, Tepig, Oshawott
      Pesquisador: [495, 498, 501],
      Vilão: [509, 517, 527], // Purrloin, Munna, Woobat
    },
    Kalos: { 
      Treinador: [650, 653, 656], // Chespin, Fennekin, Froakie
      Pesquisador: [650, 653, 656],
      Vilão: [661, 667, 674], // Fletchling, Litleo, Pancham
    },
    Alola: { 
      Treinador: [722, 725, 728], // Rowlet, Litten, Popplio
      Pesquisador: [722, 725, 728],
      Vilão: [734, 744, 757], // Yungoos, Rockruff, Salandit
    },
    Galar: { 
      Treinador: [810, 813, 816], // Grookey, Scorbunny, Sobble
      Pesquisador: [810, 813, 816],
      Vilão: [819, 821, 831], // Skwovet, Rookidee, Wooloo
    },
    Paldea: { 
      Treinador: [906, 909, 912], // Sprigatito, Fuecoco, Quaxly
      Pesquisador: [906, 909, 912],
      Vilão: [915, 921, 924], // Lechonk, Pawmi, Tandemaus
    },
};

interface StarterPokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  ability: string;
}

const CreateCharacterScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [selectedClass, setSelectedClass] = useState('Treinador');
  const [origin, setOrigin] = useState('Kanto');
  const [selectedGender, setSelectedGender] = useState('Masculino');
  const [starterPokemon, setStarterPokemon] = useState<StarterPokemon[]>([]);
  const [selectedStarter, setSelectedStarter] = useState<StarterPokemon | null>(null);
  const [pokemonGender, setPokemonGender] = useState<string | null>(null);
  const [isShiny, setIsShiny] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStarters, setLoadingStarters] = useState(true);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const classes = ['Treinador', 'Pesquisador', 'Vilão'];
  const regions = ['Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova', 'Kalos', 'Alola', 'Galar', 'Paldea'];

  useEffect(() => {
    if (origin) {
      loadStarterPokemon(origin, selectedClass);
    } else {
      setStarterPokemon([]);
      setSelectedStarter(null);
    }
  }, [origin, selectedClass]);

  const handleSelectAvatar = () => {
    launchImageLibrary({ mediaType: 'photo', includeBase64: false }, response => {
      if (response.didCancel || response.errorCode) return;
      const uri = response.assets?.[0]?.uri;
      if (uri) setAvatarUri(uri);
    });
  };

  const loadStarterPokemon = async (region: string, charClass: string) => {
    setLoadingStarters(true);
    setSelectedStarter(null);
    setPokemonGender(null);

    const regionStarters = starterData[region as keyof typeof starterData];
    const starterIds = regionStarters?.[charClass as keyof typeof regionStarters] || regionStarters?.['Treinador'] || [];

    if (starterIds.length === 0) {
        setStarterPokemon([]);
        setLoadingStarters(false);
        return;
    }

    try {
      const starters: StarterPokemon[] = [];
      for (const id of starterIds) {
        try {
          const pokemon = await pokemonDataService.getPokemon(id);
          const ability = pokemon.abilities.find((a: any) => !a.is_hidden)?.ability.name || '???';
          starters.push({
            id: pokemon.id,
            name: pokemon.name,
            sprite: pokemon.sprites.front_default,
            types: pokemon.types.map((type: any) => type.type.name),
            ability: ability,
          });
        } catch (error) {
          console.error(`Erro ao carregar Pokémon ${id}:`, error);
        }
      }
      setStarterPokemon(starters);
    } catch (error) {
      console.error('Erro ao carregar Pokémon iniciais:', error);
      Alert.alert('Erro', 'Não foi possível carregar os Pokémon iniciais');
    } finally {
      setLoadingStarters(false);
    }
  };

  const handleSelectStarter = (pokemon: StarterPokemon) => {
    setSelectedStarter(pokemon);
    setPokemonGender(null);
  };

  const validateForm = () => {
    console.log('=== VALIDAÇÃO DEBUG ===');
    console.log('Nome:', name, '| Trim:', name.trim(), '| Length:', name.trim().length);
    console.log('Classe:', selectedClass);
    console.log('Origem:', origin);
    console.log('Gênero do personagem:', selectedGender);
    console.log('Pokémon selecionado:', selectedStarter?.name);
    console.log('Gênero do Pokémon:', pokemonGender);
    console.log('========================');

    // Validação do nome
    if (!name || !name.trim() || name.trim().length < 2 || name.trim().length > 30) {
      Alert.alert('Erro', 'O nome deve ter entre 2 e 30 caracteres');
      return false;
    }

    // Validação da classe
    if (!selectedClass || selectedClass.trim() === '') {
      Alert.alert('Erro', 'Por favor, selecione uma classe');
      return false;
    }

    // Validação da origem
    if (!origin || origin.trim() === '') {
      Alert.alert('Erro', 'Por favor, selecione uma região de origem');
      return false;
    }

    // Validação do gênero do personagem
    if (!selectedGender || selectedGender.trim() === '') {
      Alert.alert('Erro', 'Por favor, selecione o gênero do personagem');
      return false;
    }

    // Validação do Pokémon inicial
    if (!selectedStarter) {
      Alert.alert('Erro', 'Por favor, selecione um Pokémon inicial');
      return false;
    }

    // Validação do gênero do Pokémon
    if (!pokemonGender || pokemonGender.trim() === '') {
      Alert.alert('Erro', 'Por favor, defina o gênero do seu Pokémon inicial');
      return false;
    }

    return true;
  };

  const handleCreateCharacter = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const characterData = {
        Id: userId,
        name: name.trim(),
        class: selectedClass,
        origin: origin,
        gender: selectedGender,
        starterPokemonId: selectedStarter!.id,
        starterPokemonName: selectedStarter!.name,
        starterPokemonGender: pokemonGender,
        starterIsShiny: isShiny,
        avatar: avatarUri,
      };

      console.log('Dados enviados:', characterData);

      const response = await characterService.create(characterData);
      if (response.character) {
        Alert.alert('Sucesso!', `Personagem ${name} criado com sucesso!`, [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert('Erro', 'Não foi possível criar o personagem');
      }
    } catch (error: any) {
      console.error('Erro ao criar personagem:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao criar personagem. Tente novamente.';
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStarterSelection = () => {
    return (
      <View style={styles.starterContainer}>
        <Text style={styles.label}>Pokémon Inicial*</Text>
        
        {loadingStarters ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B6B" />
            <Text style={styles.loadingText}>Carregando Pokémon...</Text>
          </View>
        ) : (
          <>
            {/* As 3 Pokeballs com imagens reais */}
            <View style={styles.pokeballContainer}>
              {starterPokemon.map((pokemon, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.pokeballButton,
                    { 
                      borderColor: selectedStarter?.id === pokemon.id ? '#FF6B6B' : 'transparent',
                      borderWidth: selectedStarter?.id === pokemon.id ? 3 : 0,
                    }
                  ]}
                  onPress={() => handleSelectStarter(pokemon)}
                >
                  <Image 
                    source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png' }}
                    style={styles.pokeballImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Detalhes do Pokémon Selecionado - Layout Horizontal */}
            {selectedStarter && (
              <View style={styles.pokemonDetailContainer}>
                {/* Lado Esquerdo - Imagem do Pokémon */}
                <View style={styles.pokemonImageContainer}>
                  <Image 
                    source={{ 
                      uri: selectedStarter.sprite.replace('front_default', 'other/official-artwork/front_default') || selectedStarter.sprite 
                    }} 
                    style={styles.pokemonImageLarge} 
                    resizeMode="contain"
                  />
                </View>

                {/* Lado Direito - Informações do Pokémon */}
                <View style={styles.pokemonInfoContainer}>
                  <Text style={styles.pokemonName}>{selectedStarter.name}</Text>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Tipo:</Text>
                    <Text style={styles.infoValue}>{selectedStarter.types.join(', ')}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Natureza:</Text>
                    <Text style={styles.infoValue}>Dócil</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Habilidade:</Text>
                    <Text style={styles.infoValue}>{selectedStarter.ability}</Text>
                  </View>
                  
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nível:</Text>
                    <Text style={styles.infoValue}>5</Text>
                  </View>

                  {/* Seleção de Gênero do Pokémon */}
                  <View style={styles.genderSelectorContainer}>
                    <View style={styles.genderSelector}>
                      <TouchableOpacity 
                        style={[
                          styles.genderButton, 
                          { backgroundColor: pokemonGender === 'Masculino' ? '#a7d8e4' : '#e0e0e0' }
                        ]}
                        onPress={() => setPokemonGender('Masculino')}
                      >
                        <Text style={[
                          styles.genderIcon,
                          { color: pokemonGender === 'Masculino' ? '#0077b6' : '#666' }
                        ]}>♂</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={[
                          styles.genderButton, 
                          { backgroundColor: pokemonGender === 'Feminino' ? '#ffb6c1' : '#e0e0e0' }
                        ]}
                        onPress={() => setPokemonGender('Feminino')}
                      >
                        <Text style={[
                          styles.genderIcon,
                          { color: pokemonGender === 'Feminino' ? '#d90429' : '#666' }
                        ]}>♀</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            )}
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Criar Personagem</Text>
        <View style={{width: 60}} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <TouchableOpacity onPress={handleSelectAvatar}>
              {avatarUri ? (
                <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarPlaceholderText}>+</Text>
                </View>
              )}
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>NOME DO PERSONAGEM*</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Digite o nome" 
                value={name} 
                onChangeText={setName} 
                maxLength={40} 
                editable={!loading} 
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
            <TouchableOpacity 
              style={[
                styles.charGenderButton, 
                { backgroundColor: selectedGender === 'Masculino' ? '#62ec80ff' : '#e1e8ed' }
              ]} 
              onPress={() => setSelectedGender('Masculino')}
            >
              <Text style={styles.genderIcon}>♂</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.charGenderButton, 
                { backgroundColor: selectedGender === 'Feminino' ? '#f5f84bff' : '#e1e8ed' }
              ]} 
              onPress={() => setSelectedGender('Feminino')}
            >
              <Text style={styles.genderIcon}>♀</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Classe*</Text>
            <View style={styles.pickerContainer}>
              <Picker 
                selectedValue={selectedClass} 
                onValueChange={(itemValue) => setSelectedClass(itemValue)} 
                enabled={!loading}
              >
                {classes.map((cls) => (
                  <Picker.Item key={cls} label={cls} value={cls} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Região de Origem*</Text>
            <View style={styles.pickerContainer}>
              <Picker 
                selectedValue={origin} 
                onValueChange={(itemValue) => setOrigin(itemValue)} 
                enabled={!loading}
              >
                {regions.map((region) => (
                  <Picker.Item key={region} label={region} value={region} />
                ))}
              </Picker>
            </View>
          </View>

          {renderStarterSelection()}

          <TouchableOpacity 
            style={[styles.createButton, loading && styles.createButtonDisabled]} 
            onPress={handleCreateCharacter} 
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.createButtonText}>Criar Personagem</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fcfcfce3' 
  },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 15, 
    backgroundColor: 'white', 
    borderBottomWidth: 1, 
    borderBottomColor: '#4caff7ff', 
    paddingTop: 50 
  },
  backButton: { 
    fontSize: 16, 
    color: '#FF6B6B', 
    fontWeight: 'bold' 
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  content: { 
    flex: 1 
  },
  form: { 
    padding: 20 
  },
  avatarImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 30, 
    marginRight: 10 
  },
  avatarPlaceholder: { 
    width: 100, 
    height: 100, 
    borderRadius: 30, 
    backgroundColor: '#f7c7c7ff', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 10 
  },
  avatarPlaceholderText: { 
    color: '#666', 
    fontSize: 50 
  },
  charGenderButton: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginHorizontal: 10 
  },
  inputContainer: { 
    marginBottom: 20 
  },
  label: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#333', 
    marginBottom: 8, 
    textTransform: 'capitalize' 
  },
  input: { 
    backgroundColor: 'white', 
    borderWidth: 1, 
    borderColor: '#e1e8ed', 
    borderRadius: 12, 
    padding: 16, 
    fontSize: 16, 
    color: '#333' 
  },
  pickerContainer: { 
    backgroundColor: 'white', 
    borderWidth: 1, 
    borderColor: '#e1e8ed', 
    borderRadius: 12, 
    overflow: 'hidden' 
  },
  starterContainer: { 
    marginBottom: 20 
  },
  loadingContainer: { 
    alignItems: 'center', 
    paddingVertical: 40 
  },
  loadingText: { 
    fontSize: 16, 
    color: '#666', 
    marginTop: 10 
  },
  pokeballContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
    paddingHorizontal: 20,
  },
  pokeballButton: { 
    width: 70, 
    height: 70, 
    borderRadius: 35, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginHorizontal: 15,
    backgroundColor: '#f8f9fa',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pokeballImage: {
    width: 50,
    height: 50,
  },
  pokemonDetailContainer: { 
    flexDirection: 'row',
    marginTop: 20, 
    padding: 20, 
    backgroundColor: '#ffffff', 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: '#e1e8ed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  pokemonImageContainer: {
    flex: 0.4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 15,
  },
  pokemonImageLarge: { 
    width: 250, 
    height: 250,
  },
  pokemonInfoContainer: {
    flex: 0.6,
    justifyContent: 'center',
  },
  pokemonName: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 15, 
    textTransform: 'capitalize', 
    color: '#333',
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    textTransform: 'capitalize',
    flex: 1,
  },
  genderSelectorContainer: {
    marginTop: 15,
  },
  genderLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  genderSelector: { 
    flexDirection: 'row',
    justifyContent: 'center',
  },
  genderButton: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginHorizontal: 8, 
    borderWidth: 2, 
    borderColor: 'transparent' 
  },
  genderIcon: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  createButton: { 
    backgroundColor: '#FF6B6B', 
    borderRadius: 12, 
    padding: 16, 
    alignItems: 'center', 
    marginTop: 30, 
    shadowColor: '#FF6B6B', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.3, 
    shadowRadius: 8, 
    elevation: 8 
  },
  createButtonDisabled: { 
    backgroundColor: '#ccc', 
    shadowOpacity: 0, 
    elevation: 0 
  },
  createButtonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});

export default CreateCharacterScreen;

