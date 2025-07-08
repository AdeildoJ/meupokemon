import React, { useState, useEffect } from 'react';
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
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { characterService, Character, pokemonDataService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const { width } = Dimensions.get('window');

const CharacterSheetScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const { characterId } = route.params as { characterId: string };
  
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [starterSprite, setStarterSprite] = useState<string>('');

  useEffect(() => {
    loadCharacter();
  }, [characterId]);

  const loadCharacter = async () => {
    try {
      setLoading(true);
      const response = await characterService.getById(characterId);
      setCharacter(response.character);
      
      // Carregar sprite do Pokémon inicial
      if (response.character.starterPokemonId) {
        try {
          const pokemon = await pokemonDataService.getPokemon(response.character.starterPokemonId);
          setStarterSprite(
            response.character.starterIsShiny 
              ? pokemon.sprites.front_shiny || pokemon.sprites.front_default
              : pokemon.sprites.front_default
          );
        } catch (error) {
          console.error('Erro ao carregar sprite do Pokémon:', error);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar personagem:', error);
      Alert.alert('Erro', 'Não foi possível carregar o personagem');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  const handleMenuOption = (option: string) => {
    setMenuVisible(false);
    
    switch (option) {
      case 'capture':
        Alert.alert('Capturar Pokémon', 'Funcionalidade em desenvolvimento');
        break;
      case 'battle':
        Alert.alert('Batalha', 'Funcionalidade em desenvolvimento');
        break;
      case 'pokecenter':
        handlePokecenter();
        break;
      case 'pokemart':
        Alert.alert('PokéMart', 'Funcionalidade em desenvolvimento');
        break;
      case 'friends':
        Alert.alert('Amigos', 'Funcionalidade em desenvolvimento');
        break;
    }
  };

  const handlePokecenter = () => {
    const healTime = user?.isVip ? 'instantâneo' : '30 segundos';
    Alert.alert(
      'Centro Pokémon',
      `Seus Pokémon serão curados em ${healTime}${user?.isVip ? ' (VIP)' : ''}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Curar', 
          onPress: () => {
            if (user?.isVip) {
              Alert.alert('Sucesso', 'Seus Pokémon foram curados instantaneamente!');
            } else {
              Alert.alert('Curando...', 'Seus Pokémon serão curados em 30 segundos');
            }
          }
        }
      ]
    );
  };

  const getClassColor = (className: string) => {
    switch (className) {
      case 'Treinador': return '#3498db';
      case 'Criador': return '#e67e22';
      case 'Coordenador': return '#9b59b6';
      case 'Pesquisador': return '#2ecc71';
      case 'Ranger': return '#27ae60';
      default: return '#95a5a6';
    }
  };

  const renderMenu = () => (
    <Modal
      visible={menuVisible}
      transparent
      animationType="fade"
      onRequestClose={() => setMenuVisible(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => setMenuVisible(false)}
      >
        <View style={styles.menuContainer}>
          <Text style={styles.menuTitle}>Menu de Ações</Text>
          
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleMenuOption('capture')}
          >
            <Text style={styles.menuIcon}>🎯</Text>
            <Text style={styles.menuText}>Capturar Pokémon</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleMenuOption('battle')}
          >
            <Text style={styles.menuIcon}>⚔️</Text>
            <Text style={styles.menuText}>Batalha</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleMenuOption('pokecenter')}
          >
            <Text style={styles.menuIcon}>🏥</Text>
            <Text style={styles.menuText}>Centro Pokémon</Text>
            {user?.isVip && <Text style={styles.vipLabel}>VIP</Text>}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleMenuOption('pokemart')}
          >
            <Text style={styles.menuIcon}>🛒</Text>
            <Text style={styles.menuText}>PokéMart</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => handleMenuOption('friends')}
          >
            <Text style={styles.menuIcon}>👥</Text>
            <Text style={styles.menuText}>Amigos</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.menuItem, styles.cancelItem]}
            onPress={() => setMenuVisible(false)}
          >
            <Text style={styles.menuIcon}>❌</Text>
            <Text style={styles.menuText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Carregando personagem...</Text>
      </View>
    );
  }

  if (!character) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Personagem não encontrado</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{character.name}</Text>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Text style={styles.menuButton}>☰</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Card Principal do Personagem */}
        <View style={styles.characterCard}>
          {/* Avatar e Info Básica */}
          <View style={styles.characterHeader}>
            <View style={styles.avatarContainer}>
              {character.avatar ? (
                <Image source={{ uri: character.avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatarPlaceholder, { backgroundColor: getClassColor(character.class) }]}>
                  <Text style={styles.avatarText}>
                    {character.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
            
            <View style={styles.characterInfo}>
              <Text style={styles.characterName}>{character.name}</Text>
              <View style={styles.infoRow}>
                <View style={[styles.classBadge, { backgroundColor: getClassColor(character.class) }]}>
                  <Text style={styles.classText}>{character.class}</Text>
                </View>
                <Text style={styles.infoText}>{character.age} anos</Text>
                <Text style={styles.infoText}>{character.gender}</Text>
              </View>
              <Text style={styles.originText}>📍 {character.origin}</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Nível</Text>
              <Text style={styles.statValue}>{character.level}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Experiência</Text>
              <Text style={styles.statValue}>{character.experience}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Moedas</Text>
              <Text style={styles.statValue}>{character.coins}</Text>
            </View>
          </View>
        </View>

        {/* Pokémon Inicial */}
        <View style={styles.starterCard}>
          <Text style={styles.sectionTitle}>Pokémon Inicial</Text>
          <View style={styles.starterInfo}>
            {starterSprite && (
              <Image source={{ uri: starterSprite }} style={styles.starterSprite} />
            )}
            <View style={styles.starterDetails}>
              <Text style={styles.starterName}>
                {character.starterPokemonName}
                {character.starterIsShiny && ' ✨'}
              </Text>
              <Text style={styles.starterType}>
                {character.starterIsShiny ? 'Shiny' : 'Normal'}
              </Text>
            </View>
          </View>
        </View>

        {/* Time de Pokémon */}
        <View style={styles.teamCard}>
          <Text style={styles.sectionTitle}>Time de Pokémon</Text>
          <View style={styles.teamGrid}>
            {[...Array(6)].map((_, index) => (
              <View key={index} style={styles.teamSlot}>
                <View style={styles.pokeballContainer}>
                  <Image
                    source={{
                      uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'
                    }}
                    style={[
                      styles.pokeballIcon,
                      index > 0 && styles.emptyPokeball // Apenas o primeiro slot tem Pokémon (inicial)
                    ]}
                  />
                </View>
                <Text style={styles.slotNumber}>{index + 1}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {renderMenu()}
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  menuButton: {
    fontSize: 24,
    color: '#FF6B6B',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  characterCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  characterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  characterInfo: {
    flex: 1,
  },
  characterName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  classBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 10,
  },
  classText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  originText: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#f1f2f6',
    paddingTop: 15,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  starterCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  starterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starterSprite: {
    width: 80,
    height: 80,
    marginRight: 15,
  },
  starterDetails: {
    flex: 1,
  },
  starterName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  starterType: {
    fontSize: 14,
    color: '#666',
  },
  teamCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  teamSlot: {
    width: '30%',
    alignItems: 'center',
    marginBottom: 15,
  },
  pokeballContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  pokeballIcon: {
    width: 40,
    height: 40,
  },
  emptyPokeball: {
    opacity: 0.3,
  },
  slotNumber: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    width: width * 0.8,
    maxWidth: 300,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f2f6',
  },
  cancelItem: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: 15,
    width: 30,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  vipLabel: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: 'bold',
    backgroundColor: '#FFF8DC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    marginBottom: 20,
    textAlign: 'center',
  },
  backButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CharacterSheetScreen;

