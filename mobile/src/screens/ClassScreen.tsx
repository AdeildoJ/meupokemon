import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<MainStackParamList, 'Class'>;

interface Pokemon {
  id: string;
  name: string;
  image: string;
  level: number;
  type1: string;
  type2?: string;
  nature: string;
  ability: string;
  hp: number;
  attack: number;
  defense: number;
  spAttack: number;
  spDefense: number;
  speed: number;
  ev: {
    hp: number;
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
  };
  iv: {
    hp: number;
    attack: number;
    defense: number;
    spAttack: number;
    spDefense: number;
    speed: number;
  };
  moves: string[];
  wins: number;
  losses: number;
}

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
  team: (Pokemon | null)[];
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
  // Dados específicos da classe
  badges?: string[]; // Insígnias de ginásio
  ribbons?: string[]; // Fitas de coordenadores
  pokedexCompletion?: number; // % de Pokédex concluída
  // Dados específicos do pesquisador
  missionsCreated?: number;
  missionsCompleted?: number;
  researchFocus?: string;
  researchProgress?: { [key: string]: number };
  // Dados específicos do vilão
  pokemonStolen?: number;
  successfulMissions?: number;
  interruptedMissions?: number;
  // Dados específicos do líder de ginásio
  gymType?: string;
  gymBadge?: string;
  gymTMs?: string[];
  gymWins?: number;
  gymLosses?: number;
  gymRanking?: number;
}

interface Badge {
  id: string;
  name: string;
  image: string;
  bonus: string;
}

interface Ribbon {
  id: string;
  name: string;
  image: string;
  bonus: string;
}

// Lista de insígnias disponíveis
const availableBadges: Badge[] = [
  { id: 'boulder', name: 'Insígnia Pedra', image: '🪨', bonus: '+5 ATK' },
  { id: 'cascade', name: 'Insígnia Cascata', image: '💧', bonus: '+5 DEF' },
  { id: 'thunder', name: 'Insígnia Trovão', image: '⚡', bonus: '+5 SPD' },
  { id: 'rainbow', name: 'Insígnia Arco-íris', image: '🌈', bonus: '+5 SP.ATK' },
  { id: 'soul', name: 'Insígnia Alma', image: '👻', bonus: '+5 SP.DEF' },
  { id: 'marsh', name: 'Insígnia Pântano', image: '🧠', bonus: '+5 HP' },
  { id: 'volcano', name: 'Insígnia Vulcão', image: '🌋', bonus: '+10 ATK' },
  { id: 'earth', name: 'Insígnia Terra', image: '🌍', bonus: '+10 DEF' },
];

// Lista de fitas disponíveis
const availableRibbons: Ribbon[] = [
  { id: 'cool', name: 'Fita Legal', image: '😎', bonus: '+3 CAR' },
  { id: 'beauty', name: 'Fita Beleza', image: '💄', bonus: '+3 INT' },
  { id: 'cute', name: 'Fita Fofa', image: '🥰', bonus: '+3 SAB' },
  { id: 'smart', name: 'Fita Inteligente', image: '🤓', bonus: '+3 FOR' },
  { id: 'tough', name: 'Fita Resistente', image: '💪', bonus: '+3 VEL' },
];

const ClassScreen: React.FC<Props> = ({ navigation, route }) => {
  const { characterId } = route.params;
  const [character, setCharacter] = useState<Character | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showBadgeModal, setShowBadgeModal] = useState<boolean>(false);
  const [showRibbonModal, setShowRibbonModal] = useState<boolean>(false);
  const [selectedSlotIndex, setSelectedSlotIndex] = useState<number>(0);

  const loadCharacter = useCallback(async () => {
    try {
      const charactersData = await AsyncStorage.getItem('characters');
      if (charactersData) {
        const characters: Character[] = JSON.parse(charactersData);
        const foundCharacter = characters.find(c => c.id === characterId);
        if (foundCharacter) {
          // Inicializar dados específicos da classe se não existirem
          if (!foundCharacter.badges) foundCharacter.badges = new Array(8).fill(null);
          if (!foundCharacter.ribbons) foundCharacter.ribbons = new Array(5).fill(null);
          if (!foundCharacter.pokedexCompletion) foundCharacter.pokedexCompletion = 0;
          
          setCharacter(foundCharacter);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar personagem:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do personagem.');
    } finally {
      setIsLoading(false);
    }
  }, [characterId]);

  useEffect(() => {
    loadCharacter();
  }, [loadCharacter]);

  const saveCharacterData = async (updatedCharacter: Character) => {
    try {
      const charactersData = await AsyncStorage.getItem('characters');
      if (charactersData) {
        const characters: Character[] = JSON.parse(charactersData);
        const characterIndex = characters.findIndex(c => c.id === characterId);
        
        if (characterIndex !== -1) {
          characters[characterIndex] = updatedCharacter;
          await AsyncStorage.setItem('characters', JSON.stringify(characters));
          setCharacter(updatedCharacter);
        }
      }
    } catch (error) {
      console.error('Erro ao salvar dados do personagem:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados.');
    }
  };

  const handleBadgeSelection = (badgeId: string) => {
    if (!character) return;
    
    const updatedBadges = [...(character.badges || [])];
    updatedBadges[selectedSlotIndex] = badgeId;
    
    const updatedCharacter = { ...character, badges: updatedBadges };
    saveCharacterData(updatedCharacter);
    setShowBadgeModal(false);
  };

  const handleRibbonSelection = (ribbonId: string) => {
    if (!character) return;
    
    const updatedRibbons = [...(character.ribbons || [])];
    updatedRibbons[selectedSlotIndex] = ribbonId;
    
    const updatedCharacter = { ...character, ribbons: updatedRibbons };
    saveCharacterData(updatedCharacter);
    setShowRibbonModal(false);
  };

  const openBadgeSelection = (index: number) => {
    setSelectedSlotIndex(index);
    setShowBadgeModal(true);
  };

  const openRibbonSelection = (index: number) => {
    setSelectedSlotIndex(index);
    setShowRibbonModal(true);
  };

  const renderTrainerContent = () => {
    if (!character) return null;

    const getBadgeById = (badgeId: string) => availableBadges.find(b => b.id === badgeId);
    const getRibbonById = (ribbonId: string) => availableRibbons.find(r => r.id === ribbonId);

    return (
      <ScrollView style={styles.contentContainer}>
        {/* Estatísticas do Treinador */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas do Treinador</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Ranking:</Text>
              <Text style={styles.statValue}>{character.ranking || 'N/A'}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Vitórias:</Text>
              <Text style={styles.statValue}>{character.wins || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Derrotas:</Text>
              <Text style={styles.statValue}>{(character.totalBattles || 0) - (character.wins || 0)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>% Pokédex:</Text>
              <Text style={styles.statValue}>{character.pokedexCompletion || 0}%</Text>
            </View>
          </View>
        </View>

        {/* Insígnias de Ginásio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Insígnias de Ginásio</Text>
          <View style={styles.badgesContainer}>
            {character.badges?.map((badgeId, index) => (
              <TouchableOpacity
                key={index}
                style={styles.badgeSlot}
                onPress={() => openBadgeSelection(index)}
              >
                {badgeId ? (
                  <View style={styles.badgeContent}>
                    <Text style={styles.badgeIcon}>{getBadgeById(badgeId)?.image}</Text>
                    <Text style={styles.badgeName}>{getBadgeById(badgeId)?.name}</Text>
                  </View>
                ) : (
                  <View style={styles.emptySlot}>
                    <Text style={styles.emptySlotText}>+</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.swapButton}>
            <Text style={styles.swapButtonText}>🔄 Trocar Insígnias</Text>
          </TouchableOpacity>
        </View>

        {/* Fitas de Coordenadores */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fitas de Coordenadores</Text>
          <View style={styles.ribbonsContainer}>
            {character.ribbons?.map((ribbonId, index) => (
              <TouchableOpacity
                key={index}
                style={styles.ribbonSlot}
                onPress={() => openRibbonSelection(index)}
              >
                {ribbonId ? (
                  <View style={styles.ribbonContent}>
                    <Text style={styles.ribbonIcon}>{getRibbonById(ribbonId)?.image}</Text>
                    <Text style={styles.ribbonName}>{getRibbonById(ribbonId)?.name}</Text>
                  </View>
                ) : (
                  <View style={styles.emptySlot}>
                    <Text style={styles.emptySlotText}>+</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.swapButton}>
            <Text style={styles.swapButtonText}>🔄 Trocar Fitas</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderPesquisadorContent = () => {
    if (!character) return null;

    // Focos de pesquisa disponíveis
    const researchFoci = [
      { id: 'baby', name: 'Baby Pokémon', description: 'Ter chocado todos os pokebabys', progress: character.researchProgress?.baby || 0 },
      { id: 'type', name: 'Tipo Pokémon', description: 'Ter um pokémon de cada tipo e combinação de tipo', progress: character.researchProgress?.type || 0 },
      { id: 'fossil', name: 'Fossil Pokémon', description: 'Ter todos os fósseis pokémon', progress: character.researchProgress?.fossil || 0 },
      { id: 'mega', name: 'Mega Evolução', description: 'Conseguir todas as mega stones', progress: character.researchProgress?.mega || 0 },
      { id: 'gigantamax', name: 'Gigantamax', description: 'Conseguir todas gigantamax', progress: character.researchProgress?.gigantamax || 0 },
      { id: 'zmove', name: 'Mov Z', description: 'Ter todos os cristais Z', progress: character.researchProgress?.zmove || 0 },
      { id: 'tm', name: 'Movie Pokémon', description: 'Ter todos os TM', progress: character.researchProgress?.tm || 0 },
      { id: 'pokemon', name: 'Pokémon', description: 'Capturar todos os pokémon', progress: character.researchProgress?.pokemon || 0 },
      { id: 'evolution', name: 'Evolução', description: 'Ter evoluído todos os pokémon possíveis', progress: character.researchProgress?.evolution || 0 },
    ];

    return (
      <ScrollView style={styles.contentContainer}>
        {/* Estatísticas do Pesquisador */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas do Pesquisador</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Missões Criadas:</Text>
              <Text style={styles.statValue}>{character.missionsCreated || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Missões Concluídas:</Text>
              <Text style={styles.statValue}>{character.missionsCompleted || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>% Pokédex:</Text>
              <Text style={styles.statValue}>{character.pokedexCompletion || 0}%</Text>
            </View>
          </View>
        </View>

        {/* Foco da Pesquisa */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Foco da Pesquisa</Text>
          <Text style={styles.sectionSubtitle}>
            Os focos serão completos após concluir suas missões matrix
          </Text>
          {researchFoci.map((focus) => (
            <View key={focus.id} style={styles.researchFocusItem}>
              <View style={styles.researchFocusHeader}>
                <Text style={styles.researchFocusName}>{focus.name}</Text>
                <Text style={styles.researchFocusProgress}>{focus.progress}%</Text>
              </View>
              <Text style={styles.researchFocusDescription}>{focus.description}</Text>
              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarBackground}>
                  <View 
                    style={[
                      styles.progressBarFill, 
                      { width: `${focus.progress}%` }
                    ]} 
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Botão para Criar Missão (se for Professor) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações do Pesquisador</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>📋 Criar Nova Missão</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>🔬 Laboratório de Pesquisa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>📊 Relatório de Progresso</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const renderVilaoContent = () => {
    if (!character) return null;

    return (
      <ScrollView style={styles.contentContainer}>
        {/* Estatísticas do Vilão */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas do Vilão</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Vitórias:</Text>
              <Text style={styles.statValue}>{character.wins || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Derrotas:</Text>
              <Text style={styles.statValue}>{(character.totalBattles || 0) - (character.wins || 0)}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Ranking:</Text>
              <Text style={styles.statValue}>{character.ranking || 'N/A'}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Pokémon Roubados:</Text>
              <Text style={styles.statValue}>{character.pokemonStolen || 0}</Text>
            </View>
          </View>
        </View>

        {/* Atividades Criminosas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Atividades Criminosas</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Missões Bem Sucedidas:</Text>
              <Text style={styles.statValue}>{character.successfulMissions || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Missões Interrompidas:</Text>
              <Text style={styles.statValue}>{character.interruptedMissions || 0}</Text>
            </View>
          </View>
        </View>

        {/* Especializações */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Especializações</Text>
          <View style={styles.specializationContainer}>
            <TouchableOpacity style={styles.specializationButton}>
              <Text style={styles.specializationIcon}>🔓</Text>
              <Text style={styles.specializationName}>Ladrão</Text>
              <Text style={styles.specializationDescription}>Criar missões falsas e roubar itens</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.specializationButton, styles.vipOnly]}>
              <Text style={styles.specializationIcon}>🎯</Text>
              <Text style={styles.specializationName}>Caçador (VIP)</Text>
              <Text style={styles.specializationDescription}>Roubar Pokémon de outros jogadores</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Ações do Vilão */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ações do Vilão</Text>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>🎭 Criar Missão Falsa</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>💣 Sabotar Missão</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>⚔️ Desafiar Treinador</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.vipOnly]}>
            <Text style={styles.actionButtonText}>🎯 Caçar Pokémon (VIP)</Text>
          </TouchableOpacity>
        </View>

        {/* Aviso Legal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚠️ Aviso Legal</Text>
          <Text style={styles.warningText}>
            O roubo de Pokémon é uma atividade de alto risco. Pokémon roubados ficam indisponíveis por 7 dias. 
            Após esse período, a polícia resgata o Pokémon e o devolve ao dono original. 
            Caçadores só podem roubar um Pokémon por vez.
          </Text>
        </View>
      </ScrollView>
    );
  };

  const renderGymLeaderContent = () => {
    if (!character) return null;

    // Verificar se o personagem atende aos requisitos
    const isVip = character.isVip || false;
    const hasRequiredLevel = (character.level || 1) >= 20;
    const canBeGymLeader = isVip && hasRequiredLevel;

    if (!canBeGymLeader) {
      return (
        <ScrollView style={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Requisitos para Líder de Ginásio</Text>
            <View style={styles.requirementContainer}>
              <Text style={styles.requirementText}>
                Para se tornar um Líder de Ginásio, você precisa:
              </Text>
              <Text style={[styles.requirementItem, isVip ? styles.requirementMet : styles.requirementNotMet]}>
                {isVip ? '✅' : '❌'} Conta VIP
              </Text>
              <Text style={[styles.requirementItem, hasRequiredLevel ? styles.requirementMet : styles.requirementNotMet]}>
                {hasRequiredLevel ? '✅' : '❌'} Nível 20 ou superior (Atual: {character.level || 1})
              </Text>
            </View>
          </View>
        </ScrollView>
      );
    }

    return (
      <ScrollView style={styles.contentContainer}>
        {/* Configuração do Ginásio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuração do Ginásio</Text>
          <View style={styles.gymConfigContainer}>
            <View style={styles.gymConfigItem}>
              <Text style={styles.gymConfigLabel}>Tipo do Ginásio:</Text>
              <TouchableOpacity style={styles.gymConfigButton}>
                <Text style={styles.gymConfigButtonText}>
                  {character.gymType || 'Selecionar Tipo'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.gymConfigItem}>
              <Text style={styles.gymConfigLabel}>Insígnia:</Text>
              <TouchableOpacity style={styles.gymConfigButton}>
                <Text style={styles.gymConfigButtonText}>
                  {character.gymBadge || 'Selecionar Insígnia'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.gymConfigItem}>
              <Text style={styles.gymConfigLabel}>3 TMs para Recompensa:</Text>
              <TouchableOpacity style={styles.gymConfigButton}>
                <Text style={styles.gymConfigButtonText}>
                  {character.gymTMs?.length || 0}/3 TMs Selecionados
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Ranking de Líderes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ranking de Líderes</Text>
          <View style={styles.rankingContainer}>
            <Text style={styles.rankingText}>1º Campeão</Text>
            <Text style={styles.rankingText}>2º-5º Elite 4</Text>
            <Text style={styles.rankingText}>6º+ Líderes de Ginásio</Text>
          </View>
        </View>

        {/* Estatísticas do Ginásio */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estatísticas do Ginásio</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Vitórias como Líder:</Text>
              <Text style={styles.statValue}>{character.gymWins || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Derrotas como Líder:</Text>
              <Text style={styles.statValue}>{character.gymLosses || 0}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Ranking Atual:</Text>
              <Text style={styles.statValue}>{character.gymRanking || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Botão Salvar */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>💾 Salvar Configurações</Text>
          </TouchableOpacity>
          <Text style={styles.saveWarning}>
            ⚠️ Após salvar, as configurações não poderão ser alteradas!
          </Text>
        </View>
      </ScrollView>
    );
  };

  const renderContent = () => {
    if (!character) return null;

    switch (character.class) {
      case 'Treinador':
        return renderTrainerContent();
      case 'Pesquisador':
        return renderPesquisadorContent();
      case 'Vilão':
        return renderVilaoContent();
      case 'Líder de Ginásio':
        return renderGymLeaderContent();
      default:
        return (
          <View style={styles.contentContainer}>
            <Text style={styles.errorText}>Classe não reconhecida: {character.class}</Text>
          </View>
        );
    }
  };

  const renderBadgeModal = () => (
    <Modal visible={showBadgeModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Selecionar Insígnia</Text>
          <FlatList
            data={availableBadges}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleBadgeSelection(item.id)}
              >
                <Text style={styles.modalItemIcon}>{item.image}</Text>
                <View style={styles.modalItemInfo}>
                  <Text style={styles.modalItemName}>{item.name}</Text>
                  <Text style={styles.modalItemBonus}>{item.bonus}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowBadgeModal(false)}
          >
            <Text style={styles.modalCloseButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderRibbonModal = () => (
    <Modal visible={showRibbonModal} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Selecionar Fita</Text>
          <FlatList
            data={availableRibbons}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleRibbonSelection(item.id)}
              >
                <Text style={styles.modalItemIcon}>{item.image}</Text>
                <View style={styles.modalItemInfo}>
                  <Text style={styles.modalItemName}>{item.name}</Text>
                  <Text style={styles.modalItemBonus}>{item.bonus}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={styles.modalCloseButton}
            onPress={() => setShowRibbonModal(false)}
          >
            <Text style={styles.modalCloseButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Carregando dados da classe...</Text>
      </View>
    );
  }

  if (!character) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Personagem não encontrado.</Text>
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
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Classe: {character.class}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Conteúdo */}
      {renderContent()}

      {/* Modais */}
      {renderBadgeModal()}
      {renderRibbonModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSpacer: {
    width: 60,
  },
  backButton: {
    padding: 5,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  backButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  loadingText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  contentContainer: {
    flex: 1,
    padding: 15,
  },
  section: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    fontStyle: 'italic',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statItem: {
    width: '48%',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeSlot: {
    width: '22%',
    aspectRatio: 1,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  badgeContent: {
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  badgeName: {
    fontSize: 10,
    textAlign: 'center',
    color: '#333',
  },
  ribbonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  ribbonSlot: {
    width: '18%',
    aspectRatio: 1,
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  ribbonContent: {
    alignItems: 'center',
  },
  ribbonIcon: {
    fontSize: 20,
    marginBottom: 5,
  },
  ribbonName: {
    fontSize: 8,
    textAlign: 'center',
    color: '#333',
  },
  emptySlot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptySlotText: {
    fontSize: 24,
    color: '#999',
  },
  swapButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  swapButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  researchFocusItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  researchFocusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  researchFocusName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  researchFocusProgress: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  researchFocusDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E9ECEF',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#28A745',
    borderRadius: 4,
  },
  actionButton: {
    backgroundColor: '#28A745',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  specializationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  specializationButton: {
    width: '48%',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#28A745',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
  },
  vipOnly: {
    borderColor: '#FFC107',
    backgroundColor: '#FFF8E1',
  },
  specializationIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  specializationName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  specializationDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  warningText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  requirementContainer: {
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  requirementText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  requirementItem: {
    fontSize: 14,
    marginBottom: 8,
  },
  requirementMet: {
    color: '#28A745',
  },
  requirementNotMet: {
    color: '#DC3545',
  },
  gymConfigContainer: {
    marginBottom: 15,
  },
  gymConfigItem: {
    marginBottom: 15,
  },
  gymConfigLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  gymConfigButton: {
    padding: 12,
    backgroundColor: '#E9ECEF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CED4DA',
  },
  gymConfigButtonText: {
    fontSize: 16,
    color: '#333',
  },
  rankingContainer: {
    padding: 15,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  rankingText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  saveButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  saveWarning: {
    fontSize: 12,
    color: '#DC3545',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 16,
    color: '#DC3545',
    textAlign: 'center',
    marginTop: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalItemIcon: {
    fontSize: 32,
    marginRight: 15,
  },
  modalItemInfo: {
    flex: 1,
  },
  modalItemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  modalItemBonus: {
    fontSize: 14,
    color: '#666',
  },
  modalCloseButton: {
    backgroundColor: '#6C757D',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  modalCloseButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ClassScreen;

