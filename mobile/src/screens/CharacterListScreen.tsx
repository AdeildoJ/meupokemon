import React, { useState, useCallback } from 'react'; // Removido useEffect
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<MainStackParamList, 'CharacterList'>;

interface Pokemon {
  id: string;
  name: string;
  image: string;
  generation: number;
}

interface CharacterStats {
  FOR: number;
  INT: number;
  SAB: number;
  CAR: number;
  VEL: number;
  ALT: number;
  FAM: number;
}

interface Character {
  id: string;
  name: string;
  avatarUri: string;
  age: number;
  class: string;
  generation: number;
  starterPokemon: Pokemon;
  pokemonGender: 'male' | 'female';
  stats: CharacterStats;
  createdAt: string;
}

const CharacterListScreen: React.FC<Props> = ({ navigation }) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isVip = false; // Por enquanto, assumimos que não é VIP

  const fetchCharacters = async () => {
    setIsLoading(true);
    try {
      const storedCharacters = await AsyncStorage.getItem('characters');
      if (storedCharacters) {
        setCharacters(JSON.parse(storedCharacters));
      } else {
        setCharacters([]);
      }
    } catch (error) {
      console.error('Erro ao buscar personagens:', error);
      Alert.alert('Erro', 'Não foi possível carregar seus personagens.');
    } finally {
      setIsLoading(false);
    }
  };

  // Usa useFocusEffect para recarregar os personagens sempre que a tela for focada
  useFocusEffect(
    useCallback(() => {
      fetchCharacters();
    }, [])
  );

  const handleCreateCharacter = () => {
    if (!isVip && characters.length >= 1) {
      Alert.alert(
        'Limite Atingido',
        'Usuários gratuitos podem criar apenas um personagem. Faça upgrade para VIP para criar mais personagens!'
      );
    } else {
      navigation.navigate('CreateCharacter');
    }
  };

  const renderPokeballs = () => {
    const pokeballs = [];
    for (let i = 0; i < 6; i++) {
      pokeballs.push(
        <Image
          key={i}
          source={require('../../assets/pokeball_bw.png')} // Imagem de pokeball preta e branca
          style={styles.pokeballIcon}
        />
      );
    }
    return <View style={styles.pokeballContainer}>{pokeballs}</View>;
  };

  const renderCharacterCard = ({ item }: { item: Character }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('CharacterDetail', { characterId: item.id })}
    >
      <Image source={{ uri: item.avatarUri }} style={styles.avatar} />
      <View style={styles.infoContainer}>
        <Text style={styles.characterName}>{item.name}</Text>
        <Text style={styles.characterDetail}>ID: {item.id.substring(item.id.length - 6)}</Text>
        <Text style={styles.characterDetail}>Classe: {item.class}</Text>
        <Text style={styles.characterDetail}>Título: Iniciante</Text> {/* Placeholder para o título */}
        {renderPokeballs()}
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando personagens...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Personagens</Text>
        <TouchableOpacity
          style={[styles.createButton, !isVip && characters.length >= 1 && styles.createButtonDisabled]}
          onPress={handleCreateCharacter}
          disabled={!isVip && characters.length >= 1}
        >
          <Text style={styles.createButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {characters.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Você ainda não tem personagens.</Text>
          <TouchableOpacity style={styles.createButtonLarge} onPress={handleCreateCharacter}>
            <Text style={styles.createButtonLargeText}>Criar Primeiro Personagem</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={characters}
          renderItem={renderCharacterCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  createButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  createButtonDisabled: {
    backgroundColor: '#ccc',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  infoContainer: {
    flex: 1,
  },
  characterName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  characterDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  pokeballContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  pokeballIcon: {
    width: 24,
    height: 24,
    marginRight: 5,
    tintColor: '#555', // Cor para pokeballs em preto e branco
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  createButtonLarge: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    elevation: 3,
  },
  createButtonLargeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CharacterListScreen;
