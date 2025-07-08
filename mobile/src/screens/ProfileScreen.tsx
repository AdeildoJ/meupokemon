import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Image,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { launchImageLibrary, ImagePickerResponse, MediaType, PhotoQuality } from 'react-native-image-picker';

type Props = NativeStackScreenProps<MainStackParamList, 'Profile'>;

interface Character {
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
  team: any[];
  items: { [key: string]: number };
  tms: { [key: string]: number };
  pokeballs: { [key: string]: number };
  createdAt: string;
  isVip?: boolean;
  pcoins?: number;
  ecoins?: number;
  ranking?: number;
  totalBattles?: number;
  wins?: number;
  diary?: string;
  history?: string;
  firstCapture?: {
    name: string;
    image: string;
  };
  favoritePokemon?: {
    name: string;
    image: string;
  };
}

const ProfileScreen: React.FC<Props> = ({ navigation, route }) => {
  const { characterId } = route.params;
  const [character, setCharacter] = useState<Character | null>(null);
  const [diary, setDiary] = useState<string>('');
  const [history, setHistory] = useState<string>('');
  const [editableName, setEditableName] = useState<string>('');
  const [avatarSource, setAvatarSource] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadCharacter();
  }, []);

  const loadCharacter = async () => {
    try {
      const charactersData = await AsyncStorage.getItem('characters');
      if (charactersData) {
        const characters: Character[] = JSON.parse(charactersData);
        const foundCharacter = characters.find(c => c.id === characterId);
        if (foundCharacter) {
          setCharacter(foundCharacter);
          setDiary(foundCharacter.diary || '');
          setHistory(foundCharacter.history || '');
          setEditableName(foundCharacter.name);
          setAvatarSource(foundCharacter.avatarUri);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar personagem:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          {
            title: 'Permissão de Acesso à Galeria',
            message: 'Este aplicativo precisa de acesso à sua galeria para selecionar fotos.',
            buttonNeutral: 'Perguntar Depois',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULT_GRANTED) {
          return true;
        } else {
          Alert.alert('Permissão Negada', 'Não foi possível acessar a galeria sem permissão.');
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true; // iOS não precisa de permissão explícita para galeria
    }
  };

  const handleChoosePhoto = async () => {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      return;
    }

    const options = {
      mediaType: 'photo' as MediaType,
      includeBase64: false,
      maxHeight: 200,
      maxWidth: 200,
      quality: 0.7 as PhotoQuality, // Ajustado para PhotoQuality
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('Seleção de imagem cancelada');
      } else if (response.errorCode) {
        console.log('Erro na seleção de imagem: ', response.errorMessage);
        Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
      } else if (response.assets && response.assets.length > 0) {
        const source = response.assets[0].uri;
        if (source) {
          setAvatarSource(source);
        }
      }
    });
  };

  const saveProfile = async () => {
    if (!character) return;

    if (editableName.trim() === '') {
      Alert.alert('Erro', 'O nome do personagem não pode ser vazio.');
      return;
    }

    try {
      const charactersData = await AsyncStorage.getItem('characters');
      if (charactersData) {
        const characters: Character[] = JSON.parse(charactersData);
        const characterIndex = characters.findIndex(c => c.id === characterId);
        
        if (characterIndex !== -1) {
          characters[characterIndex] = {
            ...characters[characterIndex],
            name: editableName,
            avatarUri: avatarSource,
            diary: diary,
            history: history,
          };
          
          await AsyncStorage.setItem('characters', JSON.stringify(characters));
          Alert.alert('Sucesso', 'Perfil salvo com sucesso!');
        }
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Não foi possível salvar o perfil.');
    }
  };

  const renderStat = (label: string, value: number | string) => (
    <View style={styles.statItem}>
      <Text style={styles.statLabel}>{label}:</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (!character) {
    return (
      <View style={styles.errorContainer}>
        <Text>Personagem não encontrado</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>PERFIL</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Seção de Informações Principais */}
      <View style={styles.mainInfoSection}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: avatarSource || 'https://via.placeholder.com/100' }} 
            style={styles.avatar} 
          />
          <TouchableOpacity style={styles.changeAvatarButton} onPress={handleChoosePhoto}>
            <Text style={styles.changeAvatarButtonText}>Alterar Foto</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.nameContainer}>
            <TextInput
              style={styles.nameInput}
              value={editableName}
              onChangeText={setEditableName}
              placeholder="Nome do Personagem"
            />
            {character.isVip && <Text style={styles.vipTag}>VIP</Text>}
          </View>

          <View style={styles.statsGrid}>
            {renderStat('Nv', character.level)}
            {renderStat('Idade', character.age)}
            {renderStat('FOR', character.stats.FOR)}
            {renderStat('INT', character.stats.INT)}
            {renderStat('SAB', character.stats.SAB)}
            {renderStat('CAR', character.stats.CAR)}
            {renderStat('VEL', character.stats.VEL)}
            {renderStat('ALT', character.stats.ALT)}
            {renderStat('FAM', character.stats.FAM)}
          </View>
          <View style={styles.rankingContainer}>
            <Text style={styles.rankingText}>Ranking: {character.ranking || 'N/A'}</Text>
            <Text style={styles.rankingText}>Vitórias: {character.wins !== undefined ? `${((character.wins / (character.totalBattles || 1)) * 100).toFixed(0)}%` : 'N/A'}</Text>
          </View>
        </View>
      </View>

      {/* Diário */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Diário</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Descreva o dia a dia do seu personagem..."
          multiline
          numberOfLines={6}
          value={diary}
          onChangeText={setDiary}
          textAlignVertical="top"
        />
      </View>

      {/* História */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>História</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Conte a história do seu personagem..."
          multiline
          numberOfLines={6}
          value={history}
          onChangeText={setHistory}
          textAlignVertical="top"
        />
      </View>

      {/* Pokémons Especiais */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pokémons Especiais</Text>
        <View style={styles.pokemonRow}>
          {/* Pokémon Inicial */}
          <View style={styles.pokemonCard}>
            <Text style={styles.pokemonCardTitle}>Pokémon Inicial</Text>
            <Image 
              source={{ uri: character.starterPokemon?.image || 'https://via.placeholder.com/80' }} 
              style={styles.pokemonImage} 
            />
            <Text style={styles.pokemonName}>{character.starterPokemon?.name || 'Não definido'}</Text>
          </View>

          {/* Primeira Captura */}
          <View style={styles.pokemonCard}>
            <Text style={styles.pokemonCardTitle}>Primeira Captura</Text>
            <Image 
              source={{ uri: character.firstCapture?.image || 'https://via.placeholder.com/80' }} 
              style={styles.pokemonImage} 
            />
            <Text style={styles.pokemonName}>{character.firstCapture?.name || 'Não definido'}</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>

          {/* Pokémon Favorito */}
          <View style={styles.pokemonCard}>
            <Text style={styles.pokemonCardTitle}>Pokémon Favorito</Text>
            <Image 
              source={{ uri: character.favoritePokemon?.image || 'https://via.placeholder.com/80' }} 
              style={styles.pokemonImage} 
            />
            <Text style={styles.pokemonName}>{character.favoritePokemon?.name || 'Não definido'}</Text>
            <TouchableOpacity style={styles.editButton}>
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Botão Salvar */}
      <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
        <Text style={styles.saveButtonText}>💾 Salvar Perfil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    fontSize: 16,
    color: '#007bff',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  placeholder: {
    width: 60,
  },
  mainInfoSection: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'flex-start',
  },
  avatarContainer: {
    alignItems: 'center',
    marginRight: 15,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ddd',
    marginBottom: 10,
  },
  changeAvatarButton: {
    backgroundColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  changeAvatarButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  detailsContainer: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  nameInput: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  vipTag: {
    backgroundColor: '#FFD700',
    color: '#333',
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginLeft: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statItem: {
    width: '32%', // Aproximadamente 3 colunas
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 5,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 14,
    color: '#333',
  },
  rankingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  rankingText: {
    fontSize: 14,
    color: '#555',
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
    minHeight: 120,
  },
  pokemonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pokemonCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  pokemonCardTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  pokemonImage: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  pokemonName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  editButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#28a745',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;


