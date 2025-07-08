import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Player, Pokemon } from '../types';

const PlayerInfoScreen: React.FC = () => {
  const [player] = useState<Player>({
    id: '1',
    name: 'Pikachu',
    avatar: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
    level: 1,
    age: 19,
    stats: {
      for: 100,
      int: 75,
      vel: 85,
      car: 90,
      fama: 65,
    },
    coins: {
      pcoin: 1500,
      ecoin: 50,
    },
    ranking: 1500,
    winPercentage: 65,
    isVip: false,
    team: [],
  });

  const [selectedPokemon] = useState<Pokemon>({
    id: 152,
    name: 'Chikorita',
    types: ['Grass'],
    height: 0.9,
    weight: 6.4,
    abilities: ['Overgrow'],
    nature: 'Modest',
    happiness: 70,
    level: 5,
    moves: [
      { name: 'Tackle', type: 'Normal', pp: 35, accuracy: 100, damage: 40 },
      { name: 'Growl', type: 'Normal', pp: 40, accuracy: 100, damage: 0 },
    ],
    stats: {
      hp: 45,
      attack: 49,
      defense: 65,
      specialAttack: 49,
      specialDefense: 65,
      speed: 45,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>FICHA DE JOGADOR</Text>
          <TouchableOpacity style={styles.menuButton}>
            <Text style={styles.menuText}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* Player Info Section */}
        <View style={styles.playerSection}>
          <View style={styles.playerInfo}>
            <Image source={{ uri: player.avatar }} style={styles.avatar} />
            <View style={styles.playerDetails}>
              <Text style={styles.playerName}>{player.name}</Text>
              <Text style={styles.statusLabel}>Status do Jogador</Text>
            </View>
          </View>

          {/* Stats Grid - 3 columns as requested */}
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Nv.</Text>
                <Text style={styles.statValue}>{player.level}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Idade</Text>
                <Text style={styles.statValue}>{player.age}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Vel</Text>
                <Text style={styles.statValue}>{player.stats.vel}</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>For</Text>
                <Text style={styles.statValue}>{player.stats.for}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Int</Text>
                <Text style={styles.statValue}>{player.stats.int}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>PCoin</Text>
                <Text style={styles.statValue}>{player.coins.pcoin}</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Sab</Text>
                <Text style={styles.statValue}>50</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Car</Text>
                <Text style={styles.statValue}>{player.stats.car}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>ECoin</Text>
                <Text style={styles.statValue}>{player.coins.ecoin}</Text>
              </View>
            </View>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Alt</Text>
                <Text style={styles.statValue}>50</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Fama</Text>
                <Text style={styles.statValue}>{player.stats.fama}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Hab</Text>
                <Text style={styles.statValue}>25</Text>
              </View>
            </View>
          </View>

          {/* Ranking and Win Percentage */}
          <View style={styles.rankingContainer}>
            <View style={styles.rankingItem}>
              <Text style={styles.rankingLabel}>Ranking #{player.ranking}</Text>
            </View>
            <View style={styles.rankingItem}>
              <Text style={styles.rankingLabel}>Vitórias {player.winPercentage}%</Text>
            </View>
          </View>
        </View>

        {/* Pokemon Team Section */}
        <View style={styles.teamSection}>
          <Text style={styles.sectionTitle}>Equipe Pokémon</Text>
          <View style={styles.teamSlots}>
            {[...Array(6)].map((_, index) => (
              <View key={index} style={styles.teamSlot}>
                {index === 0 ? (
                  <Image
                    source={{ uri: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/152.png' }}
                    style={styles.pokemonSlot}
                  />
                ) : (
                  <View style={styles.emptySlot} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>🔄 Trocar Pokémon</Text>
        </TouchableOpacity>

        {/* Pokemon Info Section */}
        <View style={styles.pokemonInfoSection}>
          <Text style={styles.sectionTitle}>Informação Pokémon</Text>
          <View style={styles.tabContainer}>
            <TouchableOpacity style={[styles.tab, styles.activeTab]}>
              <Text style={[styles.tabText, styles.activeTabText]}>Status</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>EV/IV</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.tab}>
              <Text style={styles.tabText}>Moves</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, styles.typesTab]}>
              <Text style={[styles.tabText, styles.typesTabText]}>Tipos</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.pokemonName}>{selectedPokemon.name}</Text>
        </View>

        {/* Backpack Section */}
        <View style={styles.backpackSection}>
          <Text style={styles.sectionTitle}>Mochila</Text>
          <View style={styles.backpackInfo}>
            <View style={styles.backpackItem}>
              <View style={styles.backpackIcon} />
              <Text style={styles.backpackText}>TMs</Text>
              <Text style={styles.backpackText}>Pokéballs</Text>
            </View>
          </View>
          <Text style={styles.backpackEmpty}>Nenhum item na mochila</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  menuButton: {
    padding: 8,
  },
  menuText: {
    fontSize: 20,
    color: '#333',
  },
  playerSection: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ff6b6b',
  },
  playerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  playerDetails: {
    flex: 1,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsContainer: {
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  rankingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rankingItem: {
    flex: 1,
    alignItems: 'center',
  },
  rankingLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  teamSection: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  teamSlots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  teamSlot: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pokemonSlot: {
    width: 40,
    height: 40,
  },
  emptySlot: {
    width: 40,
    height: 40,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pokemonInfoSection: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    padding: 8,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginRight: 4,
    borderRadius: 4,
  },
  activeTab: {
    backgroundColor: '#2196F3',
  },
  typesTab: {
    backgroundColor: '#2196F3',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
  },
  activeTabText: {
    color: '#fff',
  },
  typesTabText: {
    color: '#fff',
  },
  pokemonName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  backpackSection: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
  },
  backpackInfo: {
    marginBottom: 12,
  },
  backpackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backpackIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#2196F3',
    borderRadius: 4,
  },
  backpackText: {
    fontSize: 14,
    color: '#333',
  },
  backpackEmpty: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default PlayerInfoScreen;

