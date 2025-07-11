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


const {width} = Dimensions.get('window');

interface StarterPokemon {
  id: number;
  name: string;
  sprite: string;
  types: string[];
}

const CreateCharacterScreen = () => {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [selectedClass, setSelectedClass] = useState('Treinador');
  const [origin, setOrigin] = useState('');
  const [selectedGender, setSelectedGender] = useState('Masculino');
  const [starterPokemon, setStarterPokemon] = useState<StarterPokemon[]>([]);
  const [selectedStarter, setSelectedStarter] = useState<StarterPokemon | null>(null);
  const [isShiny, setIsShiny] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStarters, setLoadingStarters] = useState(true);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);


  const classes = [
    'Treinador',
    'Pesquisador',
    'Vilão'
  ];
  const selectAvatar = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('Usuário cancelou a seleção de imagem');
        } else if (response.errorCode) {
          console.log('Erro ao selecionar imagem:', response.errorMessage);
          Alert.alert('Erro', 'Não foi possível selecionar a imagem');
        } else if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          if (uri) setAvatarUri(uri);
        }
      }
    );
  };

  const genders = ['Masculino', 'Feminino', 'Outro'];

  const regions = [
    'Kanto', 'Johto', 'Hoenn', 'Sinnoh', 'Unova',
    'Kalos', 'Alola', 'Galar', 'Paldea'
  ];

  // Pokémon iniciais clássicos
  const starterIds = [1, 4, 7, 152, 155, 158, 252, 255, 258, 387, 390, 393, 495, 498, 501];

  useEffect(() => {
    loadStarterPokemon();
  }, []);

  const loadStarterPokemon = async () => {
    try {
      setLoadingStarters(true);
      const starters: StarterPokemon[] = [];

      for (const id of starterIds) {
        try {
          const pokemon = await pokemonDataService.getPokemon(id);
          starters.push({
            id: pokemon.id,
            name: pokemon.name,
            sprite: pokemon.sprites.front_default,
            types: pokemon.types.map((type: any) => type.type.name)
          });
        } catch (error) {
          console.error(`Erro ao carregar Pokémon ${id}:`, error);
        }
      }

      setStarterPokemon(starters);
      if (starters.length > 0) {
        setSelectedStarter(starters[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar Pokémon iniciais:', error);
      Alert.alert('Erro', 'Não foi possível carregar os Pokémon iniciais');
    } finally {
      setLoadingStarters(false);
    }
  };

    <View style={{ alignItems: 'center', marginBottom: 20 }}>
    <TouchableOpacity onPress={selectAvatar}>
      {avatarUri ? (
        <Image 
          source={{ uri: avatarUri }} 
          style={{ width: 100, height: 100, borderRadius: 50 }} 
        />
      ) : (
        <View 
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: '#e1e8ed',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Text style={{ color: '#666' }}>Selecionar Avatar</Text>
        </View>
      )}
    </TouchableOpacity>
  </View>

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert('Erro', 'Por favor, informe o nome do personagem');
      return false;
    }

    if (name.trim().length < 2 || name.trim().length > 30) {
      Alert.alert('Erro', 'O nome deve ter entre 2 e 30 caracteres');
      return false;
    }

    if (!age.trim()) {
      Alert.alert('Erro', 'Por favor, informe a idade');
      return false;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 10 || ageNum > 99) {
      Alert.alert('Erro', 'A idade deve ser entre 10 e 99 anos');
      return false;
    }

    if (!origin.trim()) {
      Alert.alert('Erro', 'Por favor, informe a região de origem');
      return false;
    }

    if (!selectedStarter) {
      Alert.alert('Erro', 'Por favor, selecione um Pokémon inicial');
      return false;
    }

    return true;
  };

  const handleCreateCharacter = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      const characterData = {
        name: name.trim(),
        age: parseInt(age),
        class: selectedClass,
        origin: origin.trim(),
        gender: selectedGender,
        starterPokemonId: selectedStarter!.id,
        starterPokemonName: selectedStarter!.name,
        starterIsShiny: isShiny,
        avatar: avatarUri
      };

      const response = await characterService.create(characterData);

      if (response.character) {
        Alert.alert(
          'Sucesso!',
          `Personagem ${name} criado com sucesso!`,
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } else {
        Alert.alert('Erro', 'Não foi possível criar o personagem');
      }

    } catch (error: any) {
      console.error('Erro ao criar personagem:', error);
      
      let errorMessage = 'Erro ao criar personagem. Tente novamente.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStarterSelection = () => {
    if (loadingStarters) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>Carregando Pokémon...</Text>
        </View>
      );
    }

    return (
      <View style={styles.starterContainer}>
        <Text style={styles.label}>Pokémon Inicial*</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.starterScroll}>
          {starterPokemon.map((pokemon) => (
            <TouchableOpacity
              key={pokemon.id}
              style={[
                styles.starterCard,
                selectedStarter?.id === pokemon.id && styles.selectedStarter
              ]}
              onPress={() => setSelectedStarter(pokemon)}
            >
              <Image source={{ uri: pokemon.sprite }} style={styles.starterImage} />
              <Text style={styles.starterName}>{pokemon.name}</Text>
              <View style={styles.typesContainer}>
                {pokemon.types.map((type, index) => (
                  <Text key={index} style={styles.typeText}>{type}</Text>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        
        <View style={styles.shinyContainer}>
          <TouchableOpacity
            style={[styles.shinyButton, isShiny && styles.shinyButtonActive]}
            onPress={() => setIsShiny(!isShiny)}
          >
            <Text style={[styles.shinyText, isShiny && styles.shinyTextActive]}>
              ✨ Shiny {isShiny ? '(Ativo)' : '(Inativo)'}
            </Text>
          </TouchableOpacity>
        </View>
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
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome do Personagem*</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite o nome"
              value={name}
              onChangeText={setName}
              maxLength={30}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Idade*</Text>
            <TextInput
              style={styles.input}
              placeholder="10-99 anos"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              maxLength={2}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Classe*</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedClass}
                onValueChange={setSelectedClass}
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
            <TextInput
              style={styles.input}
              placeholder="Ex: Kanto, Johto, Hoenn..."
              value={origin}
              onChangeText={setOrigin}
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Gênero*</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedGender}
                onValueChange={setSelectedGender}
                enabled={!loading}
              >
                {genders.map((gender) => (
                  <Picker.Item key={gender} label={gender} value={gender} />
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
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
    paddingTop: 50,
  },
  backButton: {
    fontSize: 16,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 60,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    overflow: 'hidden',
  },
  starterContainer: {
    marginBottom: 20,
  },
  starterScroll: {
    marginVertical: 10,
  },
  starterCard: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#e1e8ed',
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    alignItems: 'center',
    width: 120,
  },
  selectedStarter: {
    borderColor: '#FF6B6B',
    backgroundColor: '#FFF5F5',
  },
  starterImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  starterName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 4,
    textTransform: 'capitalize',
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  typeText: {
    fontSize: 10,
    color: '#666',
    backgroundColor: '#f1f2f6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginHorizontal: 2,
    textTransform: 'capitalize',
  },
  shinyContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  shinyButton: {
    backgroundColor: '#f1f2f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#e1e8ed',
  },
  shinyButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFA500',
  },
  shinyText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  shinyTextActive: {
    color: '#333',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  createButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#FF6B6B',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  createButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
    elevation: 0,
  },
  createButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CreateCharacterScreen;

