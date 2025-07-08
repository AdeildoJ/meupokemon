import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import api from '../services/api';

type Props = NativeStackScreenProps<MainStackParamList, 'PokemonDetail'>;

interface PokemonDetailType {
  name: string;
  sprites: { other: { 'official-artwork': { front_default: string } } };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  height: number;
  weight: number;
}

const PokemonDetailScreen: React.FC<Props> = ({ route }) => {
  const { pokemonId } = route.params;
  const [pokemon, setPokemon] = useState<PokemonDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPokemonDetail = async () => {
      try {
        setError('');
        setLoading(true);
        const response = await api.get(`pokemon/${pokemonId}`);
        setPokemon(response.data);
      } catch (err) {
        console.error('Erro ao buscar detalhes do Pokémon:', err);
        setError('Não foi possível carregar os detalhes do Pokémon. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonDetail();
  }, [pokemonId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Carregando detalhes do Pokémon...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!pokemon) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Pokémon não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.pokemonName}>{pokemon.name}</Text>
        <Image
          source={{ uri: pokemon.sprites.other['official-artwork'].front_default }}
          style={styles.pokemonImage}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tipos</Text>
        <View style={styles.typesContainer}>
          {pokemon.types.map((typeInfo, index) => (
            <View key={index} style={[styles.typeBadge, { backgroundColor: getTypeColor(typeInfo.type.name) }]}>
              <Text style={styles.typeText}>{typeInfo.type.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Habilidades</Text>
        <FlatList
          data={pokemon.abilities}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Text style={styles.abilityText}>- {item.ability.name}</Text>
          )}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estatísticas Base</Text>
        {pokemon.stats.map((statInfo, index) => (
          <View key={index} style={styles.statBarContainer}>
            <Text style={styles.statName}>{statInfo.stat.name}:</Text>
            <View style={styles.statBarBackground}>
              <View style={[styles.statBarFill, { width: `${statInfo.base_stat > 100 ? 100 : statInfo.base_stat}%` }]} />
              <Text style={styles.statValue}>{statInfo.base_stat}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detalhes</Text>
        <Text style={styles.detailText}>Altura: {pokemon.height / 10} m</Text>
        <Text style={styles.detailText}>Peso: {pokemon.weight / 10} kg</Text>
      </View>
    </ScrollView>
  );
};

// Função auxiliar para obter cor do tipo (exemplo simplificado)
const getTypeColor = (type: string) => {
  switch (type) {
    case 'grass': return '#7AC74C';
    case 'fire': return '#EE8130';
    case 'water': return '#6390F0';
    case 'bug': return '#A6B91A';
    case 'normal': return '#A8A77A';
    case 'poison': return '#A33EA1';
    case 'electric': return '#F7D02C';
    case 'ground': return '#E2BF65';
    case 'fairy': return '#D685AD';
    case 'fighting': return '#C22E28';
    case 'psychic': return '#F95587';
    case 'rock': return '#B6A136';
    case 'ghost': return '#735797';
    case 'ice': return '#96D9D6';
    case 'dragon': return '#6F35FC';
    case 'steel': return '#B7B7CE';
    case 'dark': return '#705746';
    case 'flying': return '#A98FF3';
    default: return '#68A090';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pokemonName: {
    fontSize: 32,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    marginBottom: 10,
    color: '#333',
  },
  pokemonImage: {
    width: 200,
    height: 200,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeBadge: {
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  typeText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  abilityText: {
    fontSize: 16,
    marginBottom: 5,
    textTransform: 'capitalize',
    color: '#555',
  },
  statBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statName: {
    width: 80,
    fontSize: 15,
    fontWeight: 'bold',
    textTransform: 'capitalize',
    color: '#555',
  },
  statBarBackground: {
    flex: 1,
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginHorizontal: 10,
    overflow: 'hidden',
    justifyContent: 'center',
  },
  statBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
});

export default PokemonDetailScreen;
