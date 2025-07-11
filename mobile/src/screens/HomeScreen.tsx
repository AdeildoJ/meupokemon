import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { characterService, Character } from '../services/api';

const {width} = Dimensions.get('window');

const HomeScreen = () => {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Recarregar personagens quando a tela ganhar foco
  useFocusEffect(
    React.useCallback(() => {
      loadCharacters();
    }, [])
  );

  const loadCharacters = async () => {
    try {
      setLoading(true);
      const response = await characterService.list();
      const loadedCharacters = response.characters || [];

      setCharacters(loadedCharacters);

      // Se não tiver personagem, vai para CreateCharacterScreen
      if (loadedCharacters.length === 0) {
        navigation.navigate('CreateCharacter');
      }
    } catch (error) {
      console.error('Erro ao carregar personagens:', error);
      Alert.alert('Erro', 'Não foi possível carregar os personagens');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCharacters();
    setRefreshing(false);
  };

  const selectCharacter = (character: Character) => {
    Alert.alert(
      character.name,
      `Classe: ${character.class}\nNível: ${character.level}\nRegião: ${character.origin}\nMoedas: ${character.coins}`,
      [
        {
          text: 'CANCELAR',
          style: 'cancel'
        },
        {
          text: '🎮 JOGAR',
          style: 'default',
          onPress: () => {
            console.log('Iniciando jogo com:', character.name);
            navigation.navigate('CharacterSheetScreen' as never, {characterId: character.id} as never);
          },
        },
      ]
    );
  };

  const createNewCharacter = () => {
    // Verificar se o usuário pode criar mais personagens
    if (characters.length > 0 && !user?.isVip) {
      Alert.alert(
        'Recurso VIP',
        'Apenas usuários VIP podem ter múltiplos personagens. Deseja se tornar VIP?',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Saiba Mais', onPress: () => {
            // TODO: Implementar tela de upgrade VIP
            Alert.alert('VIP', 'Funcionalidade de upgrade VIP em desenvolvimento');
          }}
        ]
      );
      return;
    }
    
    navigation.navigate('CreateCharacter' as never);
  };

  const getClassColor = (className: string) => {
    switch (className) {
      case 'Treinador':
        return '#3498db';
      case 'Pesquisador':
        return '#2ecc71';
      case 'Vilão':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  // Renderizar as 6 pokéballs do time
  const renderTeamPokeballs = (character: Character) => {
    const team = character.team || [];
    const pokeballs = [];

    for (let i = 0; i < 6; i++) {
      const hasPokemon = i < team.length;
      pokeballs.push(
        <View key={i} style={styles.pokeballSlot}>
          <Image
            source={{
              uri: hasPokemon 
                ? 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
                : 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
            }}
            style={[
              styles.pokeballIcon,
              !hasPokemon && styles.emptyPokeball
            ]}
          />
        </View>
       );
    }

    return pokeballs;
  };

  return (
    <View style={styles.container}>
      {/* Header com info do usuário */}
      <View style={styles.userHeader}>
        <View style={styles.userInfo}>
          <Text style={styles.welcomeText}>Olá, {user?.name}!</Text>
          {user?.isVip && (
            <View style={styles.vipBadge}>
              <Text style={styles.vipText}>VIP ⭐</Text>
            </View>
          )}
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Meus Personagens</Text>
        <Text style={styles.subtitle}>Selecione um personagem para jogar</Text>
      </View>

      {/* Lista de Personagens */}
      <ScrollView 
        style={styles.charactersContainer} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && characters.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF6B6B" />
            <Text style={styles.loadingText}>Carregando personagens...</Text>
          </View>
        ) : characters.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Nenhum personagem criado</Text>
            <Text style={styles.emptySubtitle}>Crie seu primeiro personagem para começar a aventura!</Text>
          </View>
        ) : (
          characters.map((character, index) => (
            <TouchableOpacity
              key={character.id || index}
              style={styles.characterCard}
              onPress={() => selectCharacter(character)}>
              
              {/* Linha Superior - Avatar, Nome, Classe, Nível */}
              <View style={styles.topRow}>
                {/* Avatar */}
                <View style={styles.avatarContainer}>
                  {character.avatar ? (
                    <Image source={{uri: character.avatar}} style={styles.avatarImage} />
                  ) : (
                    <View style={[styles.avatarPlaceholder, {backgroundColor: getClassColor(character.class)}]}>
                      <Text style={styles.avatarText}>
                        {character.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Info Principal */}
                <View style={styles.mainInfo}>
                  <Text style={styles.characterName}>{character.name}</Text>
                  
                  <View style={styles.detailsRow}>
                    <View style={[styles.classBadge, {backgroundColor: getClassColor(character.class)}]}>
                      <Text style={styles.classText}>{character.class}</Text>
                    </View>
                    <Text style={styles.infoText}>{character.age} anos</Text>
                    <Text style={styles.infoText}>📍 {character.origin}</Text>
                  </View>
                </View>

                {/* Nível */}
                <View style={styles.levelContainer}>
                  <Text style={styles.levelLabel}>NV</Text>
                  <Text style={styles.levelValue}>{character.level || 5}</Text>
                </View>
              </View>

              {/* Linha Inferior - Time de Pokémon (OCUPANDO TODA A LARGURA) */}
              <View style={styles.teamRow}>
                <View style={styles.teamPokeballs}>
                  {renderTeamPokeballs(character)}
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Botão Criar Novo Personagem */}
      <TouchableOpacity style={styles.createButton} onPress={createNewCharacter}>
        <Text style={styles.createButtonText}>+ Criar Novo Personagem</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FF6B6B',
    paddingTop: 50, // Para status bar
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 10,
  },
  vipBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  vipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  header: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 5,
  },
  charactersContainer: {
    flex: 1,
    padding: 15,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  characterCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarContainer: {
    marginRight: 15,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  mainInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  classBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 2,
  },
  classText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white',
  },
  infoText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginRight: 10,
    marginBottom: 2,
  },
  levelContainer: {
    alignItems: 'center',
    backgroundColor: '#f39c12',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    minWidth: 40,
  },
  levelLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  levelValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  teamRow: {
    borderTopWidth: 1,
    borderTopColor: '#f1f2f6',
    paddingTop: 12,
  },
  teamPokeballs: {
    flexDirection: 'row',
    justifyContent: 'space-between', // DISTRIBUI IGUALMENTE
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  pokeballSlot: {
    alignItems: 'center',
    flex: 1, // CADA POKEBALL OCUPA ESPAÇO IGUAL
  },
  pokeballIcon: {
    width: 24, // POKEBALLS MAIORES
    height: 24,
  },
  emptyPokeball: {
    opacity: 0.3,
    tintColor: '#95a5a6',
  },
  createButton: {
    backgroundColor: '#27ae60',
    padding: 18,
    borderRadius: 12,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
