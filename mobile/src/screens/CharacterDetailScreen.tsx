import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Animated,
  Dimensions,
  TextInput,
} from 'react-native';

const CharacterDetailScreen = ({route, navigation}) => {
  const {character} = route.params;
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [activeTab, setActiveTab] = useState('INFOR');
  const [showMenu, setShowMenu] = useState(false);
  const [showBackpack, setShowBackpack] = useState(false);
  const [activeBackpackTab, setActiveBackpackTab] = useState('ITENS');
  const [expandedItems, setExpandedItems] = useState({});
  const [typeMapMode, setTypeMapMode] = useState('ATACANDO');
  const [editingNickname, setEditingNickname] = useState(false);
  const [tempNickname, setTempNickname] = useState('');

  // DADOS COMPLETOS DA EQUIPE POKÉMON COM EVOLUÇÃO PIPLUP → PRINPLUP → EMPOLEON
  const [teamPokemon, setTeamPokemon] = useState([
    {
      id: 1,
      name: 'Piplup',
      nickname: 'Pingu',
      level: 16,
      types: ['ÁGUA'],
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/393.png',
      isShiny: false,
      isLeader: true,
      hp: { current: 45, max: 54 },
      nature: 'Modest',
      ability: 'Torrent',
      height: 0.4,
      weight: 5.2,
      eggGroups: ['Water 1', 'Field'],
      hatchTime: '5120 steps',
      cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/393.ogg',
      description: 'Piplup é um Pokémon do tipo Água. É orgulhoso e odeia aceitar comida de humanos. Sua espessa pelagem o protege do frio.',
      stats: {
        hp: 54,
        attack: 51,
        defense: 53,
        spAttack: 61,
        spDefense: 56,
        speed: 40
      },
      ivs: {
        hp: 15,
        attack: 12,
        defense: 18,
        spAttack: 25,
        spDefense: 20,
        speed: 14
      },
      evs: {
        hp: 0,
        attack: 0,
        defense: 0,
        spAttack: 36,
        spDefense: 0,
        speed: 0
      },
      moves: [
        {
          name: 'Bubble Beam',
          type: 'ÁGUA',
          power: 65,
          accuracy: 100,
          pp: { current: 20, max: 20 },
          category: 'Especial',
          contact: false,
          priority: 0,
          description: 'Um ataque de bolhas que pode diminuir a velocidade do oponente.'
        },
        {
          name: 'Peck',
          type: 'VOADOR',
          power: 35,
          accuracy: 100,
          pp: { current: 35, max: 35 },
          category: 'Físico',
          contact: true,
          priority: 0,
          description: 'Ataca o oponente com um bico afiado.'
        },
        {
          name: 'Growl',
          type: 'NORMAL',
          power: 0,
          accuracy: 100,
          pp: { current: 40, max: 40 },
          category: 'Status',
          contact: false,
          priority: 0,
          description: 'Reduz o ataque do oponente com um rugido fofo.'
        },
        {
          name: 'Water Sport',
          type: 'ÁGUA',
          power: 0,
          accuracy: 100,
          pp: { current: 15, max: 15 },
          category: 'Status',
          contact: false,
          priority: 0,
          description: 'Reduz o poder de ataques do tipo Fogo.'
        }
      ],
      learnset: [
        'Pound', 'Growl', 'Water Sport', 'Peck', 'Bubble Beam', 'Bide', 'Fury Attack', 'Brine', 'Whirlpool', 'Mist', 'Drill Peck', 'Hydro Pump'
      ],
      canEvolve: true,
      evolutionLevel: 16,
      nextEvolution: 'Prinplup',
      evolutionData: {
        currentStage: 1,
        totalStages: 3,
        evolutionChain: [
          { name: 'Piplup', level: 1, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/393.png' },
          { name: 'Prinplup', level: 16, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/394.png' },
          { name: 'Empoleon', level: 36, sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/395.png' }
        ]
      }
    },
    {
      id: 2,
      name: 'Gyarados',
      nickname: 'Serpente',
      level: 32,
      types: ['ÁGUA', 'VOADOR'],
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/130.png',
      isShiny: true,
      isLeader: false,
      hp: { current: 95, max: 95 },
      nature: 'Adamant',
      ability: 'Intimidate',
      height: 6.5,
      weight: 235.0,
      eggGroups: ['Water 2', 'Dragon'],
      hatchTime: '1280 steps',
      cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/130.ogg',
      description: 'Gyarados é conhecido por sua natureza feroz. É capaz de destruir cidades inteiras quando enfurecido.',
      stats: {
        hp: 95,
        attack: 125,
        defense: 79,
        spAttack: 60,
        spDefense: 100,
        speed: 81
      },
      ivs: {
        hp: 28,
        attack: 31,
        defense: 22,
        spAttack: 8,
        spDefense: 25,
        speed: 19
      },
      evs: {
        hp: 0,
        attack: 252,
        defense: 0,
        spAttack: 0,
        spDefense: 6,
        speed: 0
      },
      moves: [
        {
          name: 'Aqua Tail',
          type: 'ÁGUA',
          power: 90,
          accuracy: 90,
          pp: { current: 10, max: 10 },
          category: 'Físico',
          contact: true,
          priority: 0,
          description: 'Ataca balançando a cauda como uma onda violenta.'
        },
        {
          name: 'Crunch',
          type: 'SOMBRIO',
          power: 80,
          accuracy: 100,
          pp: { current: 15, max: 15 },
          category: 'Físico',
          contact: true,
          priority: 0,
          description: 'Morde com presas afiadas, podendo diminuir a defesa.'
        },
        {
          name: 'Ice Fang',
          type: 'GELO',
          power: 65,
          accuracy: 95,
          pp: { current: 15, max: 15 },
          category: 'Físico',
          contact: true,
          priority: 0,
          description: 'Morde com presas geladas, podendo congelar ou causar flinch.'
        },
        {
          name: 'Dragon Dance',
          type: 'DRAGÃO',
          power: 0,
          accuracy: 100,
          pp: { current: 20, max: 20 },
          category: 'Status',
          contact: false,
          priority: 0,
          description: 'Dança mística que aumenta ataque e velocidade.'
        }
      ],
      learnset: [
        'Splash', 'Tackle', 'Flail', 'Bite', 'Dragon Rage', 'Leer', 'Twister', 'Ice Fang', 'Aqua Tail', 'Scary Face', 'Dragon Dance', 'Crunch', 'Hydro Pump', 'Dragon Rush', 'Hyper Beam'
      ],
      canEvolve: false,
      evolutionLevel: null,
      nextEvolution: null
    },
    {
      id: 3,
      name: 'Pikachu',
      nickname: 'Raio',
      level: 25,
      types: ['ELÉTRICO'],
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      isShiny: false,
      isLeader: false,
      hp: { current: 60, max: 60 },
      nature: 'Jolly',
      ability: 'Static',
      height: 0.4,
      weight: 6.0,
      eggGroups: ['Field', 'Fairy'],
      hatchTime: '2560 steps',
      cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/25.ogg',
      description: 'Pikachu armazena eletricidade em suas bochechas. Quando libera energia acumulada, suas bochechas faíscam.',
      stats: {
        hp: 60,
        attack: 55,
        defense: 40,
        spAttack: 50,
        spDefense: 50,
        speed: 90
      },
      ivs: {
        hp: 20,
        attack: 18,
        defense: 12,
        spAttack: 22,
        spDefense: 16,
        speed: 31
      },
      evs: {
        hp: 0,
        attack: 0,
        defense: 0,
        spAttack: 6,
        spDefense: 0,
        speed: 252
      },
      moves: [
        {
          name: 'Thunderbolt',
          type: 'ELÉTRICO',
          power: 90,
          accuracy: 100,
          pp: { current: 15, max: 15 },
          category: 'Especial',
          contact: false,
          priority: 0,
          description: 'Ataque elétrico forte que pode paralisar o oponente.'
        },
        {
          name: 'Quick Attack',
          type: 'NORMAL',
          power: 40,
          accuracy: 100,
          pp: { current: 30, max: 30 },
          category: 'Físico',
          contact: true,
          priority: 1,
          description: 'Ataque rápido que sempre ataca primeiro.'
        },
        {
          name: 'Iron Tail',
          type: 'AÇO',
          power: 100,
          accuracy: 75,
          pp: { current: 15, max: 15 },
          category: 'Físico',
          contact: true,
          priority: 0,
          description: 'Ataca com cauda dura como ferro, podendo diminuir defesa.'
        },
        {
          name: 'Double Team',
          type: 'NORMAL',
          power: 0,
          accuracy: 100,
          pp: { current: 15, max: 15 },
          category: 'Status',
          contact: false,
          priority: 0,
          description: 'Cria cópias ilusórias para aumentar evasão.'
        }
      ],
      learnset: [
        'Thunder Shock', 'Growl', 'Tail Whip', 'Thunder Wave', 'Quick Attack', 'Double Team', 'Slam', 'Thunderbolt', 'Feint', 'Agility', 'Discharge', 'Light Screen', 'Thunder'
      ],
      canEvolve: true,
      evolutionLevel: null,
      nextEvolution: 'Raichu',
      evolutionMethod: 'Thunder Stone'
    },
    {
      id: 4,
      name: 'Lucario',
      nickname: 'Guerreiro',
      level: 42,
      types: ['LUTADOR', 'AÇO'],
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/448.png',
      isShiny: false,
      isLeader: false,
      hp: { current: 70, max: 70 },
      nature: 'Serious',
      ability: 'Steadfast',
      height: 1.2,
      weight: 54.0,
      eggGroups: ['Field', 'Human-Like'],
      hatchTime: '6400 steps',
      cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/448.ogg',
      description: 'Lucario pode sentir auras emitidas por todas as coisas. Entende emoções humanas e raramente se aproxima de humanos.',
      stats: {
        hp: 70,
        attack: 110,
        defense: 70,
        spAttack: 115,
        spDefense: 70,
        speed: 90
      },
      ivs: {
        hp: 24,
        attack: 29,
        defense: 18,
        spAttack: 31,
        spDefense: 21,
        speed: 26
      },
      evs: {
        hp: 0,
        attack: 4,
        defense: 0,
        spAttack: 252,
        spDefense: 0,
        speed: 252
      },
      moves: [
        {
          name: 'Aura Sphere',
          type: 'LUTADOR',
          power: 80,
          accuracy: 100,
          pp: { current: 20, max: 20 },
          category: 'Especial',
          contact: false,
          priority: 0,
          description: 'Ataque de aura que nunca erra o alvo.'
        },
        {
          name: 'Flash Cannon',
          type: 'AÇO',
          power: 80,
          accuracy: 100,
          pp: { current: 10, max: 10 },
          category: 'Especial',
          contact: false,
          priority: 0,
          description: 'Dispara luz que pode diminuir defesa especial.'
        },
        {
          name: 'Extreme Speed',
          type: 'NORMAL',
          power: 80,
          accuracy: 100,
          pp: { current: 5, max: 5 },
          category: 'Físico',
          contact: true,
          priority: 2,
          description: 'Ataque extremamente rápido com alta prioridade.'
        },
        {
          name: 'Calm Mind',
          type: 'PSÍQUICO',
          power: 0,
          accuracy: 100,
          pp: { current: 20, max: 20 },
          category: 'Status',
          contact: false,
          priority: 0,
          description: 'Acalma a mente para aumentar ataque e defesa especiais.'
        }
      ],
      learnset: [
        'Foresight', 'Quick Attack', 'Endure', 'Counter', 'Feint', 'Force Palm', 'Copycat', 'Screech', 'Reversal', 'Nasty Plot', 'Me First', 'Sword Dance', 'Aura Sphere', 'Close Combat', 'Dragon Pulse', 'Extreme Speed'
      ],
      canEvolve: false,
      evolutionLevel: null,
      nextEvolution: null
    },
    {
      id: 5,
      name: 'Charizard',
      nickname: 'Dragão',
      level: 36,
      types: ['FOGO', 'VOADOR'],
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/6.png',
      isShiny: false,
      isLeader: false,
      hp: { current: 78, max: 78 },
      nature: 'Timid',
      ability: 'Blaze',
      height: 1.7,
      weight: 90.5,
      eggGroups: ['Monster', 'Dragon'],
      hatchTime: '5120 steps',
      cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/6.ogg',
      description: 'Charizard voa pelos céus procurando oponentes poderosos. Suas chamas ficam mais quentes após batalhas difíceis.',
      stats: {
        hp: 78,
        attack: 84,
        defense: 78,
        spAttack: 109,
        spDefense: 85,
        speed: 100
      },
      ivs: {
        hp: 22,
        attack: 14,
        defense: 19,
        spAttack: 31,
        spDefense: 23,
        speed: 31
      },
      evs: {
        hp: 0,
        attack: 0,
        defense: 0,
        spAttack: 252,
        spDefense: 4,
        speed: 252
      },
      moves: [
        {
          name: 'Flamethrower',
          type: 'FOGO',
          power: 90,
          accuracy: 100,
          pp: { current: 15, max: 15 },
          category: 'Especial',
          contact: false,
          priority: 0,
          description: 'Ataque de fogo que pode queimar o oponente.'
        },
        {
          name: 'Air Slash',
          type: 'VOADOR',
          power: 75,
          accuracy: 95,
          pp: { current: 15, max: 15 },
          category: 'Especial',
          contact: false,
          priority: 0,
          description: 'Ataque com lâminas de ar que pode causar flinch.'
        },
        {
          name: 'Dragon Pulse',
          type: 'DRAGÃO',
          power: 85,
          accuracy: 100,
          pp: { current: 10, max: 10 },
          category: 'Especial',
          contact: false,
          priority: 0,
          description: 'Ataque com energia dracônica.'
        },
        {
          name: 'Solar Beam',
          type: 'GRAMA',
          power: 120,
          accuracy: 100,
          pp: { current: 10, max: 10 },
          category: 'Especial',
          contact: false,
          priority: 0,
          description: 'Absorve luz no primeiro turno e ataca no segundo.'
        }
      ],
      learnset: [
        'Scratch', 'Growl', 'Ember', 'Smokescreen', 'Dragon Rage', 'Scary Face', 'Fire Fang', 'Flame Burst', 'Wing Attack', 'Slash', 'Flamethrower', 'Fire Spin', 'Inferno', 'Heat Wave', 'Flare Blitz'
      ],
      canEvolve: false,
      evolutionLevel: null,
      nextEvolution: null
    },
    {
      id: 6,
      name: 'Gengar',
      nickname: 'Sombra',
      level: 38,
      types: ['FANTASMA', 'VENENO'],
      sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png',
      isShiny: true,
      isLeader: false,
      hp: { current: 60, max: 60 },
      nature: 'Modest',
      ability: 'Levitate',
      height: 1.5,
      weight: 40.5,
      eggGroups: ['Amorphous'],
      hatchTime: '5120 steps',
      cry: 'https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/94.ogg',
      description: 'Gengar se esconde nas sombras e diminui a temperatura ao redor em 10 graus. Sua presença faz as pessoas tremerem.',
      stats: {
        hp: 60,
        attack: 65,
        defense: 60,
        spAttack: 130,
        spDefense: 75,
        speed: 110
      },
      ivs: {
        hp: 16,
        attack: 8,
        defense: 14,
        spAttack: 31,
        spDefense: 20,
        speed: 31
      },
      evs: {
        hp: 0,
        attack: 0,
        defense: 0,
        spAttack: 252,
        spDefense: 4,
        speed: 252
      },
      moves: [
        {
          name: 'Shadow Ball',
          type: 'FANTASMA',
          power: 80,
          accuracy: 100,
          pp: { current: 15, max: 15 },
          category: 'Especial',
          contact: false,
          priority: 0,
          description: 'Ataque sombrio que pode diminuir defesa especial.'
        },
        {
          name: 'Sludge Bomb',
          type: 'VENENO',
          power: 90,
          accuracy: 100,
          pp: { current: 10, max: 10 },
          category: 'Especial',
          contact: false,
          priority: 0,
          description: 'Ataque tóxico que pode envenenar o oponente.'
        },
        {
          name: 'Thunderbolt',
          type: 'ELÉTRICO',
          power: 90,
          accuracy: 100,
          pp: { current: 15, max: 15 },
          category: 'Especial',
          contact: false,
          priority: 0,
          description: 'Ataque elétrico que pode paralisar.'
        },
        {
          name: 'Hypnosis',
          type: 'PSÍQUICO',
          power: 0,
          accuracy: 60,
          pp: { current: 20, max: 20 },
          category: 'Status',
          contact: false,
          priority: 0,
          description: 'Induz sono profundo no oponente.'
        }
      ],
      learnset: [
        'Hypnosis', 'Lick', 'Spite', 'Mean Look', 'Curse', 'Night Shade', 'Confuse Ray', 'Sucker Punch', 'Shadow Punch', 'Payback', 'Shadow Ball', 'Dream Eater', 'Dark Pulse', 'Destiny Bond', 'Hex', 'Nightmare'
      ],
      canEvolve: false,
      evolutionLevel: null,
      nextEvolution: null
    }
  ]);

  // DADOS DA MOCHILA EXPANDIDA COM SISTEMA DE ITENS EQUIPÁVEIS
  const backpackItems = {
    ITENS: [
      {
        id: 'potion',
        name: 'Poção',
        nameEn: 'Potion',
        emoji: '🧪',
        quantity: 15,
        description: 'Restaura 20 HP de um Pokémon.',
        effect: '+20 HP',
        rarity: 'Comum',
        canUse: true,
        category: 'Cura',
        isEquippable: false
      },
      {
        id: 'super_potion',
        name: 'Super Poção',
        nameEn: 'Super Potion',
        emoji: '💉',
        quantity: 8,
        description: 'Restaura 50 HP de um Pokémon.',
        effect: '+50 HP',
        rarity: 'Comum',
        canUse: true,
        category: 'Cura',
        isEquippable: false
      },
      {
        id: 'hyper_potion',
        name: 'Hiper Poção',
        nameEn: 'Hyper Potion',
        emoji: '💊',
        quantity: 3,
        description: 'Restaura 200 HP de um Pokémon.',
        effect: '+200 HP',
        rarity: 'Raro',
        canUse: true,
        category: 'Cura',
        isEquippable: false
      },
      {
        id: 'antidote',
        name: 'Antídoto',
        nameEn: 'Antidote',
        emoji: '🟢',
        quantity: 5,
        description: 'Cura envenenamento de um Pokémon.',
        effect: 'Remove Veneno',
        rarity: 'Comum',
        canUse: true,
        category: 'Status',
        isEquippable: false
      },
      {
        id: 'awakening',
        name: 'Despertar',
        nameEn: 'Awakening',
        emoji: '☕',
        quantity: 4,
        description: 'Acorda um Pokémon que está dormindo.',
        effect: 'Remove Sono',
        rarity: 'Comum',
        canUse: true,
        category: 'Status',
        isEquippable: false
      },
      {
        id: 'paralyze_heal',
        name: 'Cura Paralisia',
        nameEn: 'Paralyze Heal',
        emoji: '⚡',
        quantity: 3,
        description: 'Cura paralisia de um Pokémon.',
        effect: 'Remove Paralisia',
        rarity: 'Comum',
        canUse: true,
        category: 'Status',
        isEquippable: false
      },
      {
        id: 'burn_heal',
        name: 'Cura Queimadura',
        nameEn: 'Burn Heal',
        emoji: '🧊',
        quantity: 2,
        description: 'Cura queimadura de um Pokémon.',
        effect: 'Remove Queimadura',
        rarity: 'Comum',
        canUse: true,
        category: 'Status',
        isEquippable: false
      },
      {
        id: 'ice_heal',
        name: 'Cura Gelo',
        nameEn: 'Ice Heal',
        emoji: '🔥',
        quantity: 2,
        description: 'Descongela um Pokémon congelado.',
        effect: 'Remove Congelamento',
        rarity: 'Comum',
        canUse: true,
        category: 'Status',
        isEquippable: false
      },
      {
        id: 'full_heal',
        name: 'Cura Total',
        nameEn: 'Full Heal',
        emoji: '✨',
        quantity: 1,
        description: 'Cura todos os problemas de status de um Pokémon.',
        effect: 'Remove Todos Status',
        rarity: 'Raro',
        canUse: true,
        category: 'Status',
        isEquippable: false
      },
      {
        id: 'revive',
        name: 'Reviver',
        nameEn: 'Revive',
        emoji: '💫',
        quantity: 2,
        description: 'Revive um Pokémon desmaiado com metade do HP.',
        effect: 'Revive + 50% HP',
        rarity: 'Raro',
        canUse: true,
        category: 'Reviver',
        isEquippable: false
      },
      {
        id: 'max_revive',
        name: 'Reviver Máximo',
        nameEn: 'Max Revive',
        emoji: '🌟',
        quantity: 1,
        description: 'Revive um Pokémon desmaiado com HP completo.',
        effect: 'Revive + 100% HP',
        rarity: 'Muito Raro',
        canUse: true,
        category: 'Reviver',
        isEquippable: false
      },
      {
        id: 'rare_candy',
        name: 'Doce Raro',
        nameEn: 'Rare Candy',
        emoji: '🍬',
        quantity: 3,
        description: 'Aumenta o nível de um Pokémon em 1.',
        effect: '+1 Nível',
        rarity: 'Muito Raro',
        canUse: true,
        category: 'Evolução',
        isEquippable: false
      },
      {
        id: 'pp_up',
        name: 'Mais PP',
        nameEn: 'PP Up',
        emoji: '📈',
        quantity: 2,
        description: 'Aumenta permanentemente o PP máximo de um movimento.',
        effect: '+PP Máximo',
        rarity: 'Raro',
        canUse: true,
        category: 'Melhoria',
        isEquippable: false
      },
      {
        id: 'protein',
        name: 'Proteína',
        nameEn: 'Protein',
        emoji: '💪',
        quantity: 1,
        description: 'Aumenta permanentemente o Ataque base de um Pokémon.',
        effect: '+Ataque Base',
        rarity: 'Muito Raro',
        canUse: true,
        category: 'Vitamina',
        isEquippable: false
      },
      {
        id: 'iron',
        name: 'Ferro',
        nameEn: 'Iron',
        emoji: '🛡️',
        quantity: 1,
        description: 'Aumenta permanentemente a Defesa base de um Pokémon.',
        effect: '+Defesa Base',
        rarity: 'Muito Raro',
        canUse: true,
        category: 'Vitamina',
        isEquippable: false
      },
      // ITENS EQUIPÁVEIS
      {
        id: 'leftovers',
        name: 'Sobras',
        nameEn: 'Leftovers',
        emoji: '🍽️',
        quantity: 1,
        description: 'Restaura gradualmente HP do Pokémon durante a batalha.',
        effect: 'Recupera 1/16 HP por turno',
        rarity: 'Raro',
        canUse: false,
        category: 'Equipável',
        isEquippable: true,
        equipEffect: 'hp_recovery'
      },
      {
        id: 'choice_band',
        name: 'Banda Escolha',
        nameEn: 'Choice Band',
        emoji: '🎗️',
        quantity: 1,
        description: 'Aumenta o Ataque, mas permite usar apenas um movimento.',
        effect: '+50% Ataque, trava movimento',
        rarity: 'Muito Raro',
        canUse: false,
        category: 'Equipável',
        isEquippable: true,
        equipEffect: 'attack_boost'
      },
      {
        id: 'focus_sash',
        name: 'Faixa de Foco',
        nameEn: 'Focus Sash',
        emoji: '🥋',
        quantity: 1,
        description: 'Garante que o Pokémon sobreviva a um ataque fatal com 1 HP.',
        effect: 'Sobrevive com 1 HP se estiver com HP cheio',
        rarity: 'Muito Raro',
        canUse: false,
        category: 'Equipável',
        isEquippable: true,
        equipEffect: 'survival'
      },
      {
        id: 'everstone',
        name: 'Pedra Eterna',
        nameEn: 'Everstone',
        emoji: '🪨',
        quantity: 1,
        description: 'Impede a evolução do Pokémon que a carrega.',
        effect: 'Previne evolução',
        rarity: 'Comum',
        canUse: false,
        category: 'Equipável',
        isEquippable: true,
        equipEffect: 'prevent_evolution'
      }
    ],
    POKÉBOLAS: [
      {
        id: 'pokeball',
        name: 'Pokébola',
        nameEn: 'Poké Ball',
        emoji: '⚪',
        quantity: 20,
        description: 'Pokébola padrão para capturar Pokémon selvagens.',
        effect: 'Taxa de Captura: 1x',
        rarity: 'Comum',
        canUse: true,
        category: 'Captura',
        catchRate: 1.0
      },
      {
        id: 'greatball',
        name: 'Bola Ótima',
        nameEn: 'Great Ball',
        emoji: '🔵',
        quantity: 15,
        description: 'Pokébola com taxa de captura superior à Pokébola comum.',
        effect: 'Taxa de Captura: 1.5x',
        rarity: 'Comum',
        canUse: true,
        category: 'Captura',
        catchRate: 1.5
      },
      {
        id: 'ultraball',
        name: 'Bola Ultra',
        nameEn: 'Ultra Ball',
        emoji: '🟡',
        quantity: 10,
        description: 'Pokébola de alta performance com excelente taxa de captura.',
        effect: 'Taxa de Captura: 2x',
        rarity: 'Raro',
        canUse: true,
        category: 'Captura',
        catchRate: 2.0
      },
      {
        id: 'masterball',
        name: 'Bola Mestra',
        nameEn: 'Master Ball',
        emoji: '🟣',
        quantity: 1,
        description: 'A Pokébola definitiva que nunca falha na captura.',
        effect: 'Taxa de Captura: ∞',
        rarity: 'Lendário',
        canUse: true,
        category: 'Captura',
        catchRate: 999
      },
      {
        id: 'safariball',
        name: 'Bola Safari',
        nameEn: 'Safari Ball',
        emoji: '🟤',
        quantity: 5,
        description: 'Pokébola especial usada apenas na Zona Safari.',
        effect: 'Taxa de Captura: 1.5x (Safari)',
        rarity: 'Especial',
        canUse: false,
        category: 'Especial',
        catchRate: 1.5
      },
      {
        id: 'netball',
        name: 'Bola Rede',
        nameEn: 'Net Ball',
        emoji: '🕸️',
        quantity: 8,
        description: 'Muito eficaz contra Pokémon dos tipos Água e Inseto.',
        effect: 'Taxa: 3x (Água/Inseto)',
        rarity: 'Raro',
        canUse: true,
        category: 'Especializada',
        catchRate: 3.0
      },
      {
        id: 'diveball',
        name: 'Bola Mergulho',
        nameEn: 'Dive Ball',
        emoji: '🌊',
        quantity: 6,
        description: 'Funciona melhor em Pokémon encontrados debaixo d\'água.',
        effect: 'Taxa: 3.5x (Subaquático)',
        rarity: 'Raro',
        canUse: true,
        category: 'Especializada',
        catchRate: 3.5
      },
      {
        id: 'timerball',
        name: 'Bola Cronômetro',
        nameEn: 'Timer Ball',
        emoji: '⏰',
        quantity: 4,
        description: 'Fica mais eficaz conforme a batalha se prolonga.',
        effect: 'Taxa: 1x-4x (Tempo)',
        rarity: 'Raro',
        canUse: true,
        category: 'Especializada',
        catchRate: 4.0
      },
      {
        id: 'luxuryball',
        name: 'Bola Luxo',
        nameEn: 'Luxury Ball',
        emoji: '💎',
        quantity: 2,
        description: 'Pokémon capturados ficam mais amigáveis rapidamente.',
        effect: 'Taxa: 1x + Amizade',
        rarity: 'Muito Raro',
        canUse: true,
        category: 'Especial',
        catchRate: 1.0
      },
      {
        id: 'premierball',
        name: 'Bola Premier',
        nameEn: 'Premier Ball',
        emoji: '⚪',
        quantity: 3,
        description: 'Pokébola comemorativa com performance igual à comum.',
        effect: 'Taxa de Captura: 1x',
        rarity: 'Especial',
        canUse: true,
        category: 'Comemorativa',
        catchRate: 1.0
      }
    ],
    MTS: [
      {
        id: 'tm01',
        name: 'MT01 - Foco',
        nameEn: 'TM01 - Focus Punch',
        emoji: '💿',
        quantity: 1,
        description: 'Ensina o movimento Soco Focado. Ataque poderoso que falha se o usuário for atingido.',
        effect: 'Ensina: Focus Punch',
        rarity: 'Raro',
        canUse: true,
        category: 'Movimento',
        moveType: 'LUTADOR',
        movePower: 150
      },
      {
        id: 'tm06',
        name: 'MT06 - Tóxico',
        nameEn: 'TM06 - Toxic',
        emoji: '💿',
        quantity: 1,
        description: 'Ensina o movimento Tóxico. Envenena gravemente o oponente.',
        effect: 'Ensina: Toxic',
        rarity: 'Raro',
        canUse: true,
        category: 'Movimento',
        moveType: 'VENENO',
        movePower: 0
      },
      {
        id: 'tm10',
        name: 'MT10 - Poder Oculto',
        nameEn: 'TM10 - Hidden Power',
        emoji: '💿',
        quantity: 1,
        description: 'Ensina o movimento Poder Oculto. Tipo e poder variam conforme o Pokémon.',
        effect: 'Ensina: Hidden Power',
        rarity: 'Raro',
        canUse: true,
        category: 'Movimento',
        moveType: 'NORMAL',
        movePower: 70
      },
      {
        id: 'tm15',
        name: 'MT15 - Hiper Raio',
        nameEn: 'TM15 - Hyper Beam',
        emoji: '💿',
        quantity: 1,
        description: 'Ensina o movimento Hiper Raio. Ataque devastador que requer descanso.',
        effect: 'Ensina: Hyper Beam',
        rarity: 'Muito Raro',
        canUse: true,
        category: 'Movimento',
        moveType: 'NORMAL',
        movePower: 150
      },
      {
        id: 'tm24',
        name: 'MT24 - Raio',
        nameEn: 'TM24 - Thunderbolt',
        emoji: '💿',
        quantity: 1,
        description: 'Ensina o movimento Raio. Ataque elétrico que pode paralisar.',
        effect: 'Ensina: Thunderbolt',
        rarity: 'Raro',
        canUse: true,
        category: 'Movimento',
        moveType: 'ELÉTRICO',
        movePower: 90
      },
      {
        id: 'tm26',
        name: 'MT26 - Terremoto',
        nameEn: 'TM26 - Earthquake',
        emoji: '💿',
        quantity: 1,
        description: 'Ensina o movimento Terremoto. Ataque que atinge todos os Pokémon em campo.',
        effect: 'Ensina: Earthquake',
        rarity: 'Muito Raro',
        canUse: true,
        category: 'Movimento',
        moveType: 'TERRA',
        movePower: 100
      },
      {
        id: 'tm29',
        name: 'MT29 - Psíquico',
        nameEn: 'TM29 - Psychic',
        emoji: '💿',
        quantity: 1,
        description: 'Ensina o movimento Psíquico. Ataque mental que pode diminuir defesa especial.',
        effect: 'Ensina: Psychic',
        rarity: 'Raro',
        canUse: true,
        category: 'Movimento',
        moveType: 'PSÍQUICO',
        movePower: 90
      },
      {
        id: 'tm35',
        name: 'MT35 - Lança-chamas',
        nameEn: 'TM35 - Flamethrower',
        emoji: '💿',
        quantity: 1,
        description: 'Ensina o movimento Lança-chamas. Ataque de fogo que pode queimar.',
        effect: 'Ensina: Flamethrower',
        rarity: 'Raro',
        canUse: true,
        category: 'Movimento',
        moveType: 'FOGO',
        movePower: 90
      },
      {
        id: 'tm55',
        name: 'MT55 - Escaldadura',
        nameEn: 'TM55 - Scald',
        emoji: '💿',
        quantity: 1,
        description: 'Ensina o movimento Escaldadura. Ataque de água fervente que pode queimar.',
        effect: 'Ensina: Scald',
        rarity: 'Raro',
        canUse: true,
        category: 'Movimento',
        moveType: 'ÁGUA',
        movePower: 80
      },
      {
        id: 'tm68',
        name: 'MT68 - Gigaimpacto',
        nameEn: 'TM68 - Giga Impact',
        emoji: '💿',
        quantity: 1,
        description: 'Ensina o movimento Gigaimpacto. Ataque físico devastador que requer descanso.',
        effect: 'Ensina: Giga Impact',
        rarity: 'Muito Raro',
        canUse: true,
        category: 'Movimento',
        moveType: 'NORMAL',
        movePower: 150
      }
    ]
  };

  // CORES DOS TIPOS POKÉMON
  const typeColors = {
    NORMAL: '#A8A878',
    FOGO: '#F08030',
    ÁGUA: '#6890F0',
    ELÉTRICO: '#F8D030',
    GRAMA: '#78C850',
    GELO: '#98D8D8',
    LUTADOR: '#C03028',
    VENENO: '#A040A0',
    TERRA: '#E0C068',
    VOADOR: '#A890F0',
    PSÍQUICO: '#F85888',
    INSETO: '#A8B820',
    PEDRA: '#B8A038',
    FANTASMA: '#705898',
    DRAGÃO: '#7038F8',
    SOMBRIO: '#705848',
    AÇO: '#B8B8D0',
    FADA: '#EE99AC'
  };

  // DADOS DE EFETIVIDADE DE TIPOS COMPLETOS
  const typeEffectiveness = {
    attacking: {
      NORMAL: { superEffective: [], notVeryEffective: ['PEDRA', 'AÇO'], noEffect: ['FANTASMA'] },
      FOGO: { superEffective: ['GRAMA', 'GELO', 'INSETO', 'AÇO'], notVeryEffective: ['FOGO', 'ÁGUA', 'PEDRA', 'DRAGÃO'], noEffect: [] },
      ÁGUA: { superEffective: ['FOGO', 'TERRA', 'PEDRA'], notVeryEffective: ['ÁGUA', 'GRAMA', 'DRAGÃO'], noEffect: [] },
      ELÉTRICO: { superEffective: ['ÁGUA', 'VOADOR'], notVeryEffective: ['ELÉTRICO', 'GRAMA', 'DRAGÃO'], noEffect: ['TERRA'] },
      GRAMA: { superEffective: ['ÁGUA', 'TERRA', 'PEDRA'], notVeryEffective: ['FOGO', 'GRAMA', 'VENENO', 'VOADOR', 'INSETO', 'DRAGÃO', 'AÇO'], noEffect: [] },
      GELO: { superEffective: ['GRAMA', 'TERRA', 'VOADOR', 'DRAGÃO'], notVeryEffective: ['FOGO', 'ÁGUA', 'GELO', 'AÇO'], noEffect: [] },
      LUTADOR: { superEffective: ['NORMAL', 'GELO', 'PEDRA', 'SOMBRIO', 'AÇO'], notVeryEffective: ['VENENO', 'VOADOR', 'PSÍQUICO', 'INSETO', 'FADA'], noEffect: ['FANTASMA'] },
      VENENO: { superEffective: ['GRAMA', 'FADA'], notVeryEffective: ['VENENO', 'TERRA', 'PEDRA', 'FANTASMA'], noEffect: ['AÇO'] },
      TERRA: { superEffective: ['FOGO', 'ELÉTRICO', 'VENENO', 'PEDRA', 'AÇO'], notVeryEffective: ['GRAMA', 'INSETO'], noEffect: ['VOADOR'] },
      VOADOR: { superEffective: ['ELÉTRICO', 'GRAMA', 'LUTADOR'], notVeryEffective: ['ELÉTRICO', 'PEDRA', 'AÇO'], noEffect: [] },
      PSÍQUICO: { superEffective: ['LUTADOR', 'VENENO'], notVeryEffective: ['PSÍQUICO', 'AÇO'], noEffect: ['SOMBRIO'] },
      INSETO: { superEffective: ['GRAMA', 'PSÍQUICO', 'SOMBRIO'], notVeryEffective: ['FOGO', 'LUTADOR', 'VENENO', 'VOADOR', 'FANTASMA', 'AÇO', 'FADA'], noEffect: [] },
      PEDRA: { superEffective: ['FOGO', 'GELO', 'VOADOR', 'INSETO'], notVeryEffective: ['LUTADOR', 'TERRA', 'AÇO'], noEffect: [] },
      FANTASMA: { superEffective: ['PSÍQUICO', 'FANTASMA'], notVeryEffective: ['SOMBRIO'], noEffect: ['NORMAL'] },
      DRAGÃO: { superEffective: ['DRAGÃO'], notVeryEffective: ['AÇO'], noEffect: ['FADA'] },
      SOMBRIO: { superEffective: ['PSÍQUICO', 'FANTASMA'], notVeryEffective: ['LUTADOR', 'SOMBRIO', 'FADA'], noEffect: [] },
      AÇO: { superEffective: ['GELO', 'PEDRA', 'FADA'], notVeryEffective: ['FOGO', 'ÁGUA', 'ELÉTRICO', 'AÇO'], noEffect: [] },
      FADA: { superEffective: ['LUTADOR', 'DRAGÃO', 'SOMBRIO'], notVeryEffective: ['FOGO', 'VENENO', 'AÇO'], noEffect: [] }
    },
    defending: {
      NORMAL: { weakTo: ['LUTADOR'], resistantTo: [], immuneTo: ['FANTASMA'] },
      FOGO: { weakTo: ['ÁGUA', 'TERRA', 'PEDRA'], resistantTo: ['FOGO', 'GRAMA', 'GELO', 'INSETO', 'AÇO', 'FADA'], immuneTo: [] },
      ÁGUA: { weakTo: ['ELÉTRICO', 'GRAMA'], resistantTo: ['FOGO', 'ÁGUA', 'GELO', 'AÇO'], immuneTo: [] },
      ELÉTRICO: { weakTo: ['TERRA'], resistantTo: ['ELÉTRICO', 'VOADOR', 'AÇO'], immuneTo: [] },
      GRAMA: { weakTo: ['FOGO', 'GELO', 'VENENO', 'VOADOR', 'INSETO'], resistantTo: ['ÁGUA', 'ELÉTRICO', 'GRAMA', 'TERRA'], immuneTo: [] },
      GELO: { weakTo: ['FOGO', 'LUTADOR', 'PEDRA', 'AÇO'], resistantTo: ['GELO'], immuneTo: [] },
      LUTADOR: { weakTo: ['VOADOR', 'PSÍQUICO', 'FADA'], resistantTo: ['PEDRA', 'INSETO', 'SOMBRIO'], immuneTo: [] },
      VENENO: { weakTo: ['TERRA', 'PSÍQUICO'], resistantTo: ['GRAMA', 'LUTADOR', 'VENENO', 'INSETO', 'FADA'], immuneTo: [] },
      TERRA: { weakTo: ['ÁGUA', 'GRAMA', 'GELO'], resistantTo: ['VENENO', 'PEDRA'], immuneTo: ['ELÉTRICO'] },
      VOADOR: { weakTo: ['ELÉTRICO', 'GELO', 'PEDRA'], resistantTo: ['GRAMA', 'LUTADOR', 'INSETO'], immuneTo: ['TERRA'] },
      PSÍQUICO: { weakTo: ['INSETO', 'FANTASMA', 'SOMBRIO'], resistantTo: ['LUTADOR', 'PSÍQUICO'], immuneTo: [] },
      INSETO: { weakTo: ['FOGO', 'VOADOR', 'PEDRA'], resistantTo: ['GRAMA', 'LUTADOR', 'TERRA'], immuneTo: [] },
      PEDRA: { weakTo: ['ÁGUA', 'GRAMA', 'LUTADOR', 'TERRA', 'AÇO'], resistantTo: ['NORMAL', 'FOGO', 'VENENO', 'VOADOR'], immuneTo: [] },
      FANTASMA: { weakTo: ['FANTASMA', 'SOMBRIO'], resistantTo: ['VENENO', 'INSETO'], immuneTo: ['NORMAL', 'LUTADOR'] },
      DRAGÃO: { weakTo: ['GELO', 'DRAGÃO', 'FADA'], resistantTo: ['FOGO', 'ÁGUA', 'ELÉTRICO', 'GRAMA'], immuneTo: [] },
      SOMBRIO: { weakTo: ['LUTADOR', 'INSETO', 'FADA'], resistantTo: ['FANTASMA', 'SOMBRIO'], immuneTo: ['PSÍQUICO'] },
      AÇO: { weakTo: ['FOGO', 'LUTADOR', 'TERRA'], resistantTo: ['NORMAL', 'GRAMA', 'GELO', 'VOADOR', 'PSÍQUICO', 'INSETO', 'PEDRA', 'DRAGÃO', 'AÇO', 'FADA'], immuneTo: ['VENENO'] },
      FADA: { weakTo: ['VENENO', 'AÇO'], resistantTo: ['LUTADOR', 'INSETO', 'SOMBRIO'], immuneTo: ['DRAGÃO'] }
    }
  };

  // NOMES DOS STATS PARA EXIBIÇÃO
  const statNames = {
    hp: 'HP',
    attack: 'ATK',
    defense: 'DEF',
    spAttack: 'SP.ATK',
    spDefense: 'SP.DEF',
    speed: 'SPD'
  };

  // INICIALIZAÇÃO
  useEffect(() => {
    if (teamPokemon.length > 0) {
      setSelectedPokemon(teamPokemon[0]);
    }
  }, []);

  // FUNÇÕES AUXILIARES
  const getClassColor = (className) => {
    const colors = {
      'Treinador': '#3498db',
      'Coordenador': '#e74c3c',
      'Criador': '#2ecc71',
      'Pesquisador': '#9b59b6'
    };
    return colors[className] || '#95a5a6';
  };

  const getAvatarColor = (name) => {
    const colors = ['#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
    const index = name.length % colors.length;
    return colors[index];
  };

  const getHPColor = (current, max) => {
    const percentage = (current / max) * 100;
    if (percentage > 50) return '#2ecc71';
    if (percentage > 25) return '#f39c12';
    return '#e74c3c';
  };

  const toggleItemExpansion = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const handleEvolution = () => {
    if (!selectedPokemon.canEvolve) {
      Alert.alert('Evolução', 'Este Pokémon não pode evoluir no momento.');
      return;
    }

    // Verificar se tem Pedra Eterna equipada (previne evolução)
    const hasEverstoneEquipped = false; // Implementar lógica de itens equipados

    if (hasEverstoneEquipped) {
      Alert.alert('Evolução Bloqueada', 'A Pedra Eterna está impedindo a evolução.');
      return;
    }

    if (selectedPokemon.evolutionLevel && selectedPokemon.level >= selectedPokemon.evolutionLevel) {
      Alert.alert(
        'Evolução Disponível!',
        `${selectedPokemon.name} pode evoluir para ${selectedPokemon.nextEvolution}!`,
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Evoluir', onPress: () => performEvolution() }
        ]
      );
    } else if (selectedPokemon.evolutionMethod) {
      Alert.alert(
        'Evolução por Item',
        `${selectedPokemon.name} precisa de ${selectedPokemon.evolutionMethod} para evoluir.`,
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Evolução', `${selectedPokemon.name} precisa alcançar o nível ${selectedPokemon.evolutionLevel} para evoluir.`);
    }
  };

  const performEvolution = () => {
    if (!selectedPokemon) return;

    // Dados de evolução para cada Pokémon
    const evolutionData = {
      'Piplup': {
        name: 'Prinplup',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/394.png',
        types: ['ÁGUA'],
        stats: { hp: 64, attack: 66, defense: 68, spAttack: 81, spDefense: 76, speed: 50 },
        description: 'Prinplup vive sozinho, longe de outros. Tem um orgulho feroz e raramente aceita comida oferecida por pessoas.',
        moves: [
          {
            name: 'Water Pulse',
            type: 'ÁGUA',
            power: 60,
            accuracy: 100,
            pp: { current: 20, max: 20 },
            category: 'Especial',
            contact: false,
            priority: 0,
            description: 'Ataque com ondas de água que pode confundir o oponente.'
          },
          {
            name: 'Peck',
            type: 'VOADOR',
            power: 35,
            accuracy: 100,
            pp: { current: 35, max: 35 },
            category: 'Físico',
            contact: true,
            priority: 0,
            description: 'Ataca o oponente com um bico afiado.'
          },
          {
            name: 'Swagger',
            type: 'NORMAL',
            power: 0,
            accuracy: 85,
            pp: { current: 15, max: 15 },
            category: 'Status',
            contact: false,
            priority: 0,
            description: 'Confunde o oponente mas aumenta seu ataque.'
          },
          {
            name: 'Fury Attack',
            type: 'NORMAL',
            power: 15,
            accuracy: 85,
            pp: { current: 20, max: 20 },
            category: 'Físico',
            contact: true,
            priority: 0,
            description: 'Ataca de 2 a 5 vezes seguidas.'
          }
        ],
        learnset: [
          'Tackle', 'Growl', 'Water Sport', 'Peck', 'Water Pulse', 'Swagger', 'Fury Attack', 'Brine', 'Whirlpool', 'Mist', 'Drill Peck', 'Hydro Pump'
        ],
        canEvolve: true,
        evolutionLevel: 36,
        nextEvolution: 'Empoleon'
      },
      'Prinplup': {
        name: 'Empoleon',
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/395.png',
        types: ['ÁGUA', 'AÇO'],
        stats: { hp: 84, attack: 86, defense: 88, spAttack: 111, spDefense: 101, speed: 60 },
        description: 'Empoleon pode partir icebergs com suas asas afiadas. Não se curva perante ninguém.',
        moves: [
          {
            name: 'Hydro Pump',
            type: 'ÁGUA',
            power: 110,
            accuracy: 80,
            pp: { current: 5, max: 5 },
            category: 'Especial',
            contact: false,
            priority: 0,
            description: 'Ataque devastador de água com alta potência.'
          },
          {
            name: 'Flash Cannon',
            type: 'AÇO',
            power: 80,
            accuracy: 100,
            pp: { current: 10, max: 10 },
            category: 'Especial',
            contact: false,
            priority: 0,
            description: 'Dispara luz que pode diminuir defesa especial.'
          },
          {
            name: 'Drill Peck',
            type: 'VOADOR',
            power: 80,
            accuracy: 100,
            pp: { current: 20, max: 20 },
            category: 'Físico',
            contact: true,
            priority: 0,
            description: 'Ataque perfurante com bico em rotação.'
          },
          {
            name: 'Swagger',
            type: 'NORMAL',
            power: 0,
            accuracy: 85,
            pp: { current: 15, max: 15 },
            category: 'Status',
            contact: false,
            priority: 0,
            description: 'Confunde o oponente mas aumenta seu ataque.'
          }
        ],
        learnset: [
          'Tackle', 'Growl', 'Water Sport', 'Peck', 'Water Pulse', 'Swagger', 'Fury Attack', 'Brine', 'Whirlpool', 'Mist', 'Drill Peck', 'Hydro Pump', 'Flash Cannon', 'Aqua Jet'
        ],
        canEvolve: false,
        evolutionLevel: null,
        nextEvolution: null
      }
    };

    const evolution = evolutionData[selectedPokemon.name];
    if (!evolution) return;

    // Atualizar o Pokémon na equipe
    const updatedTeam = teamPokemon.map(pokemon => {
      if (pokemon.id === selectedPokemon.id) {
        const evolvedPokemon = {
          ...pokemon,
          name: evolution.name,
          sprite: evolution.sprite,
          types: evolution.types,
          stats: evolution.stats,
          description: evolution.description,
          moves: evolution.moves,
          learnset: evolution.learnset,
          canEvolve: evolution.canEvolve,
          evolutionLevel: evolution.evolutionLevel,
          nextEvolution: evolution.nextEvolution,
          // Recalcular HP baseado nos novos stats
          hp: {
            current: Math.floor(((2 * evolution.stats.hp + pokemon.ivs.hp + Math.floor(pokemon.evs.hp / 4)) * pokemon.level / 100) + pokemon.level + 10),
            max: Math.floor(((2 * evolution.stats.hp + pokemon.ivs.hp + Math.floor(pokemon.evs.hp / 4)) * pokemon.level / 100) + pokemon.level + 10)
          }
        };
        return evolvedPokemon;
      }
      return pokemon;
    });

    setTeamPokemon(updatedTeam);
    
    // Atualizar o Pokémon selecionado
    const evolvedSelected = updatedTeam.find(p => p.id === selectedPokemon.id);
    setSelectedPokemon(evolvedSelected);

    Alert.alert('Evolução!', `${selectedPokemon.nickname || selectedPokemon.name} evoluiu para ${evolution.name}!`);
  };

  const playPokemonCry = () => {
    // Implementar reprodução do grito do Pokémon
    Alert.alert('🔊', `Reproduzindo grito de ${selectedPokemon.name}!`);
  };

  const startNicknameEdit = () => {
    setTempNickname(selectedPokemon.nickname || selectedPokemon.name);
    setEditingNickname(true);
  };

  const saveNickname = () => {
    // Implementar salvamento do apelido
    Alert.alert('Apelido Salvo!', `${selectedPokemon.name} agora se chama "${tempNickname}"`);
    setEditingNickname(false);
  };

  const cancelNicknameEdit = () => {
    setTempNickname('');
    setEditingNickname(false);
  };

  // COMPONENTE POKEMONSLOT REUTILIZÁVEL
  const PokemonSlot = ({pokemon, index, onPress}) => {
    const isSelected = selectedPokemon?.id === pokemon.id;
    
    return (
      <TouchableOpacity
        style={[
          styles.pokemonSlot,
          isSelected && styles.selectedPokemonSlot,
          pokemon.isLeader && styles.leaderPokemonSlot
        ]}
        onPress={onPress}
      >
        <View style={styles.pokemonSlotImageContainer}>
          <Image source={{uri: pokemon.sprite}} style={styles.pokemonSlotImage} />
          {pokemon.isShiny && (
            <View style={styles.shinyBadge}>
              <Text style={styles.shinyText}>✨</Text>
            </View>
          )}
          {pokemon.isLeader && (
            <View style={styles.leaderBadge}>
              <Text style={styles.leaderText}>👑</Text>
            </View>
          )}
        </View>
        
        <Text style={styles.pokemonSlotName}>
          {pokemon.nickname || pokemon.name}
        </Text>
        
        <Text style={styles.pokemonSlotLevel}>Lv. {pokemon.level}</Text>
        
        <View style={styles.pokemonSlotTypes}>
          {pokemon.types.map((type, typeIndex) => (
            <View
              key={typeIndex}
              style={[styles.pokemonSlotTypeChip, {backgroundColor: typeColors[type]}]}
            >
              <Text style={styles.pokemonSlotTypeText}>{type}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.hpBarContainer}>
          <View style={styles.hpBarBackground}>
            <View
              style={[
                styles.hpBarFill,
                {
                  width: `${(pokemon.hp.current / pokemon.hp.max) * 100}%`,
                  backgroundColor: getHPColor(pokemon.hp.current, pokemon.hp.max)
                }
              ]}
            />
          </View>
          <Text style={styles.hpText}>
            {pokemon.hp.current}/{pokemon.hp.max}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // RENDERIZAÇÃO DA ABA INFOR
  const renderInforTab = () => {
    if (!selectedPokemon) return null;

    return (
      <ScrollView style={styles.tabScrollContent}>
        <View style={styles.pokemonMainInfo}>
          {/* Nome editável */}
          <View style={styles.pokemonNameSection}>
            {editingNickname ? (
              <View style={styles.nicknameEditContainer}>
                <TextInput
                  style={styles.nicknameInput}
                  value={tempNickname}
                  onChangeText={setTempNickname}
                  placeholder="Digite o apelido"
                  maxLength={12}
                />
                <TouchableOpacity style={styles.saveNicknameButton} onPress={saveNickname}>
                  <Text style={styles.saveNicknameText}>✓</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelNicknameButton} onPress={cancelNicknameEdit}>
                  <Text style={styles.cancelNicknameText}>✗</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.pokemonNameContainer}>
                <Text style={styles.pokemonName}>
                  {selectedPokemon.nickname || selectedPokemon.name}
                </Text>
                <TouchableOpacity style={styles.editNameButton} onPress={startNicknameEdit}>
                  <Text style={styles.editNameIcon}>✏️</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Imagem do Pokémon */}
          <View style={styles.pokemonImageContainer}>
            <Image source={{uri: selectedPokemon.sprite}} style={styles.pokemonImage} />
            {selectedPokemon.isShiny && (
              <View style={styles.shinyIndicator}>
                <Text style={styles.shinyText}>✨ SHINY</Text>
              </View>
            )}
            {selectedPokemon.canEvolve && (
              <TouchableOpacity style={styles.evolutionButton} onPress={handleEvolution}>
                <Text style={styles.evolutionButtonText}>🔄 EVOLUIR</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Informações básicas */}
          <View style={styles.basicInfoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Nível</Text>
              <Text style={styles.infoValue}>{selectedPokemon.level}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Felicidade</Text>
              <Text style={styles.infoValue}>255</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Natureza</Text>
              <Text style={styles.infoValue}>{selectedPokemon.nature}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Habilidade</Text>
              <Text style={styles.infoValue}>{selectedPokemon.ability}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Altura</Text>
              <Text style={styles.infoValue}>{selectedPokemon.height}m</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Peso</Text>
              <Text style={styles.infoValue}>{selectedPokemon.weight}kg</Text>
            </View>
          </View>

          {/* Tipos */}
          <View style={styles.typesSection}>
            <Text style={styles.sectionTitle}>Tipos</Text>
            <View style={styles.typesContainer}>
              {selectedPokemon.types.map((type, index) => (
                <View key={index} style={[styles.typeChip, {backgroundColor: typeColors[type]}]}>
                  <Text style={styles.typeText}>{type}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Grupos de ovos e tempo de eclosão */}
          <View style={styles.breedingSection}>
            <Text style={styles.sectionTitle}>Reprodução</Text>
            <View style={styles.breedingInfo}>
              <Text style={styles.breedingLabel}>Grupos de Ovos:</Text>
              <Text style={styles.breedingValue}>{selectedPokemon.eggGroups.join(', ')}</Text>
            </View>
            <View style={styles.breedingInfo}>
              <Text style={styles.breedingLabel}>Tempo de Eclosão:</Text>
              <Text style={styles.breedingValue}>{selectedPokemon.hatchTime}</Text>
            </View>
          </View>

          {/* Botão para ouvir grito */}
          <TouchableOpacity style={styles.cryButton} onPress={playPokemonCry}>
            <Text style={styles.cryButtonText}>🔊 OUVIR GRITO</Text>
          </TouchableOpacity>

          {/* Descrição */}
          <View style={styles.descriptionSection}>
            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.descriptionText}>{selectedPokemon.description}</Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  // RENDERIZAÇÃO DA ABA MOV'S
  const renderMovesTab = () => {
    if (!selectedPokemon) return null;

    return (
      <ScrollView style={styles.tabScrollContent}>
        <View style={styles.movesContainer}>
          <Text style={styles.sectionTitle}>Movimentos Atuais</Text>
          
          {selectedPokemon.moves.map((move, index) => (
            <View key={index} style={styles.moveCard}>
              <View style={styles.moveHeader}>
                <Text style={styles.moveName}>{move.name}</Text>
                <View style={[styles.moveTypeChip, {backgroundColor: typeColors[move.type]}]}>
                  <Text style={styles.moveTypeText}>{move.type}</Text>
                </View>
              </View>
              
              <View style={styles.moveStats}>
                <View style={styles.moveStatItem}>
                  <Text style={styles.moveStatLabel}>Dano</Text>
                  <Text style={styles.moveStatValue}>{move.power || '-'}</Text>
                </View>
                <View style={styles.moveStatItem}>
                  <Text style={styles.moveStatLabel}>Precisão</Text>
                  <Text style={styles.moveStatValue}>{move.accuracy}%</Text>
                </View>
                <View style={styles.moveStatItem}>
                  <Text style={styles.moveStatLabel}>PP</Text>
                  <Text style={styles.moveStatValue}>{move.pp.current}/{move.pp.max}</Text>
                </View>
                <View style={styles.moveStatItem}>
                  <Text style={styles.moveStatLabel}>Classe</Text>
                  <Text style={styles.moveStatValue}>{move.category}</Text>
                </View>
              </View>
              
              <View style={styles.moveDetails}>
                <View style={styles.moveIndicators}>
                  {move.contact && (
                    <View style={styles.moveIndicator}>
                      <Text style={styles.moveIndicatorText}>👊 Contato</Text>
                    </View>
                  )}
                  {move.priority !== 0 && (
                    <View style={styles.moveIndicator}>
                      <Text style={styles.moveIndicatorText}>
                        ⚡ Prioridade {move.priority > 0 ? '+' : ''}{move.priority}
                      </Text>
                    </View>
                  )}
                </View>
                <Text style={styles.moveDescription}>{move.description}</Text>
              </View>
            </View>
          ))}
          
          <TouchableOpacity style={styles.trainMovesButton}>
            <Text style={styles.trainMovesButtonText}>📚 TREINAR MOVIMENTOS</Text>
          </TouchableOpacity>
          
          {/* Learnset disponível */}
          <View style={styles.learnsetSection}>
            <Text style={styles.sectionTitle}>Movimentos Disponíveis</Text>
            <View style={styles.learnsetGrid}>
              {selectedPokemon.learnset.map((moveName, index) => (
                <View key={index} style={styles.learnsetItem}>
                  <Text style={styles.learnsetText}>{moveName}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  // RENDERIZAÇÃO DA ABA STATUS
  const renderStatusTab = () => {
    if (!selectedPokemon) return null;

    const calculateStat = (base, iv, ev, level, nature = 1.0) => {
      return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level / 100) + 5) * nature;
    };

    const calculateHP = (base, iv, ev, level) => {
      return Math.floor(((2 * base + iv + Math.floor(ev / 4)) * level / 100) + level + 10);
    };

    const totalStats = Object.values(selectedPokemon.stats).reduce((sum, stat) => sum + stat, 0);

    return (
      <ScrollView style={styles.tabScrollContent}>
        <View style={styles.statusContainer}>
          <Text style={styles.sectionTitle}>Estatísticas</Text>
          
          {/* Stats principais */}
          <View style={styles.statsGrid}>
            {Object.entries(selectedPokemon.stats).map(([statKey, baseStat]) => {
              const iv = selectedPokemon.ivs[statKey];
              const ev = selectedPokemon.evs[statKey];
              const isHP = statKey === 'hp';
              const finalStat = isHP 
                ? calculateHP(baseStat, iv, ev, selectedPokemon.level)
                : calculateStat(baseStat, iv, ev, selectedPokemon.level);
              
              return (
                <View key={statKey} style={styles.statRow}>
                  <Text style={styles.statName}>{statNames[statKey]}</Text>
                  <View style={styles.statBarContainer}>
                    <View style={styles.statBarBackground}>
                      <View 
                        style={[
                          styles.statBarFill, 
                          {
                            width: `${Math.min((finalStat / 200) * 100, 100)}%`,
                            backgroundColor: getStatColor(statKey)
                          }
                        ]} 
                      />
                    </View>
                    <Text style={styles.statValue}>{finalStat}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View style={styles.totalStatsContainer}>
            <Text style={styles.totalStatsText}>Total: {totalStats}</Text>
          </View>

          {/* IVs */}
          <Text style={styles.sectionTitle}>Individual Values (IVs)</Text>
          <View style={styles.ivEvGrid}>
            {Object.entries(selectedPokemon.ivs).map(([statKey, value]) => (
              <View key={statKey} style={styles.ivEvItem}>
                <Text style={styles.ivEvLabel}>{statNames[statKey]}</Text>
                <Text style={styles.ivEvValue}>{value}/31</Text>
              </View>
            ))}
          </View>

          {/* EVs */}
          <Text style={styles.sectionTitle}>Effort Values (EVs)</Text>
          <View style={styles.ivEvGrid}>
            {Object.entries(selectedPokemon.evs).map(([statKey, value]) => (
              <View key={statKey} style={styles.ivEvItem}>
                <Text style={styles.ivEvLabel}>{statNames[statKey]}</Text>
                <Text style={styles.ivEvValue}>{value}/252</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.trainingButton}>
            <Text style={styles.trainingButtonText}>💪 INICIAR TREINAMENTO</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  const getStatColor = (statKey) => {
    const colors = {
      hp: '#FF5959',
      attack: '#F5AC78',
      defense: '#FAE078',
      spAttack: '#9DB7F5',
      spDefense: '#A7DB8D',
      speed: '#FA92B2'
    };
    return colors[statKey] || '#95a5a6';
  };

  // RENDERIZAÇÃO DA ABA MAPA DE TIPOS MELHORADA
  const renderTypeMapTab = () => {
    if (!selectedPokemon) return null;

    const allTypes = Object.keys(typeColors);
    
    const getEffectiveness = (attackingType, defendingTypes) => {
      let effectiveness = 1;
      
      defendingTypes.forEach(defendingType => {
        const attacking = typeEffectiveness.attacking[attackingType];
        if (attacking) {
          if (attacking.superEffective.includes(defendingType)) effectiveness *= 2;
          if (attacking.notVeryEffective.includes(defendingType)) effectiveness *= 0.5;
          if (attacking.noEffect.includes(defendingType)) effectiveness *= 0;
        }
      });
      
      return effectiveness;
    };

    const getDefensiveEffectiveness = (attackingType, defendingTypes) => {
      let effectiveness = 1;
      
      defendingTypes.forEach(defendingType => {
        const defending = typeEffectiveness.defending[defendingType];
        if (defending) {
          if (defending.weakTo.includes(attackingType)) effectiveness *= 2;
          if (defending.resistantTo.includes(attackingType)) effectiveness *= 0.5;
          if (defending.immuneTo.includes(attackingType)) effectiveness *= 0;
        }
      });
      
      return effectiveness;
    };

    const getMultiplierColor = (multiplier) => {
      if (multiplier === 0) return '#2c3e50';
      if (multiplier === 0.25) return '#8e44ad';
      if (multiplier === 0.5) return '#e74c3c';
      if (multiplier === 1) return '#95a5a6';
      if (multiplier === 2) return '#27ae60';
      if (multiplier === 4) return '#f39c12';
      return '#95a5a6';
    };

    const getMultiplierText = (multiplier) => {
      if (multiplier === 0) return 'x0';
      if (multiplier === 0.25) return 'x¼';
      if (multiplier === 0.5) return 'x½';
      if (multiplier === 1) return 'x1';
      if (multiplier === 2) return 'x2';
      if (multiplier === 4) return 'x4';
      return 'x1';
    };

    return (
      <ScrollView style={styles.tabScrollContent}>
        <View style={styles.typeMapContainer}>
          <Text style={styles.typeMapTitle}>Mapa de Efetividade de Tipos</Text>
          
          {/* Botões de Modo */}
          <View style={styles.typeMapModeButtons}>
            <TouchableOpacity 
              style={[styles.modeButton, typeMapMode === 'ATACANDO' && styles.activeModeButton]}
              onPress={() => setTypeMapMode('ATACANDO')}
            >
              <Text style={[styles.modeButtonText, typeMapMode === 'ATACANDO' && styles.activeModeButtonText]}>
                ATACANDO
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.modeButton, typeMapMode === 'DEFENDENDO' && styles.activeModeButton]}
              onPress={() => setTypeMapMode('DEFENDENDO')}
            >
              <Text style={[styles.modeButtonText, typeMapMode === 'DEFENDENDO' && styles.activeModeButtonText]}>
                DEFENDENDO
              </Text>
            </TouchableOpacity>
          </View>

          {/* Grid de Tipos */}
          <View style={styles.typeGrid}>
            {allTypes.map((type) => {
              const multiplier = typeMapMode === 'ATACANDO' 
                ? getEffectiveness(selectedPokemon.types[0], [type])
                : getDefensiveEffectiveness(type, selectedPokemon.types);
              
              return (
                <View key={type} style={styles.typeMapItem}>
                  <View style={[styles.typeSquare, {backgroundColor: typeColors[type]}]}>
                    <Text style={styles.typeSquareText}>{type.substring(0, 3).toUpperCase()}</Text>
                  </View>
                  <View style={[styles.multiplierBadge, {backgroundColor: getMultiplierColor(multiplier)}]}>
                    <Text style={styles.multiplierBadgeText}>{getMultiplierText(multiplier)}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          {/* Legenda */}
          <View style={styles.legendSection}>
            <Text style={styles.legendTitle}>Legenda de Efetividade</Text>
            <View style={styles.legendGrid}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, {backgroundColor: '#2c3e50'}]} />
                <Text style={styles.legendText}>x0 - Sem Efeito</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, {backgroundColor: '#8e44ad'}]} />
                <Text style={styles.legendText}>x¼ - Muito Pouco Eficaz</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, {backgroundColor: '#e74c3c'}]} />
                <Text style={styles.legendText}>x½ - Pouco Eficaz</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, {backgroundColor: '#95a5a6'}]} />
                <Text style={styles.legendText}>x1 - Eficaz</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, {backgroundColor: '#27ae60'}]} />
                <Text style={styles.legendText}>x2 - Super Eficaz</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, {backgroundColor: '#f39c12'}]} />
                <Text style={styles.legendText}>x4 - Extremamente Eficaz</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  // RENDERIZAÇÃO DA MOCHILA
  const renderBackpackContent = () => {
    const currentItems = backpackItems[activeBackpackTab];
    
    return (
      <View style={styles.backpackContent}>
        <View style={styles.backpackTabs}>
          {Object.keys(backpackItems).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.backpackTab, activeBackpackTab === tab && styles.activeBackpackTab]}
              onPress={() => setActiveBackpackTab(tab)}
            >
              <Text style={[styles.backpackTabText, activeBackpackTab === tab && styles.activeBackpackTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        
        <ScrollView style={styles.backpackItemsList}>
          {currentItems.map((item) => (
            <View key={item.id} style={styles.backpackItemCard}>
              <TouchableOpacity 
                style={styles.backpackItemHeader}
                onPress={() => toggleItemExpansion(item.id)}
              >
                <View style={styles.backpackItemHeaderLeft}>
                  <Text style={styles.backpackItemEmoji}>{item.emoji}</Text>
                  <View>
                    <Text style={styles.backpackItemName}>
                      {item.name} ({item.nameEn})
                    </Text>
                    <Text style={styles.backpackItemQuantity}>
                      Quantidade: {item.quantity}
                    </Text>
                  </View>
                </View>
                <Text style={styles.backpackExpandIcon}>
                  {expandedItems[item.id] ? '▼' : '▶'}
                </Text>
              </TouchableOpacity>
              
              {expandedItems[item.id] && (
                <View style={styles.backpackItemDetails}>
                  <Text style={styles.backpackItemDescription}>{item.description}</Text>
                  <View style={styles.backpackItemInfoRow}>
                    <Text style={styles.backpackItemEffect}>Efeito: {item.effect}</Text>
                    <Text style={styles.backpackItemRarity}>Raridade: {item.rarity}</Text>
                  </View>
                  {item.canUse && (
                    <TouchableOpacity style={styles.useItemButton}>
                      <Text style={styles.useItemButtonText}>USAR ITEM</Text>
                    </TouchableOpacity>
                  )}
                  {item.isEquippable && (
                    <TouchableOpacity style={styles.equipItemButton}>
                      <Text style={styles.equipItemButtonText}>EQUIPAR ITEM</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ficha do Personagem</Text>
        <TouchableOpacity onPress={() => setShowMenu(!showMenu)}>
          <Text style={styles.menuButton}>☰</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Dropdown */}
      {showMenu && (
        <View style={styles.menuDropdown}>
          {[
            'Perfil (Informações do jogador)',
            'Missões',
            'Radar',
            'Vara de Pescar',
            'Battle',
            'Amigos',
            'Classe',
            'Centro Pokémon',
            'Loja',
            'Notificações',
            'Configurações'
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <Text style={styles.menuItemText}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <ScrollView style={styles.content}>
        {/* INFORMAÇÕES DO PERSONAGEM */}
        <View style={styles.characterSection}>
          <View style={styles.characterHeader}>
            <View style={styles.characterInfo}>
              <Text style={styles.characterName}>{character.name}</Text>
              <View style={[styles.classChip, {backgroundColor: getClassColor(character.class)}]}>
                <Text style={styles.classText}>{character.class}</Text>
              </View>
            </View>
            
            <View style={styles.characterLevel}>
              <Text style={styles.levelText}>NV {character.level}</Text>
            </View>
          </View>

          <View style={styles.characterContent}>
            {/* Avatar */}
            <View style={styles.avatarSection}>
              {character.avatar ? (
                <Image source={{uri: character.avatar}} style={styles.avatarImage} />
              ) : (
                <View style={[styles.avatarPlaceholder, {backgroundColor: getAvatarColor(character.name)}]}>
                  <Text style={styles.avatarText}>{character.name.charAt(0).toUpperCase()}</Text>
                </View>
              )}
            </View>

            {/* Status do Jogador */}
            <View style={styles.playerStatus}>
              <Text style={styles.statusTitle}>Status do Jogador</Text>
              
              <View style={styles.statusGrid}>
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>Idade</Text>
                  <Text style={styles.statusValue}>{character.age}</Text>
                </View>
                
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>Origem</Text>
                  <Text style={styles.statusValue}>{character.origin}</Text>
                </View>
                
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>ID</Text>
                  <Text style={styles.statusValue}>{character.characterId || character.id}</Text>
                </View>
                
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>PCoin</Text>
                  <Text style={styles.statusValue}>{character.pcoin || 0}</Text>
                </View>
                
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>ECoin</Text>
                  <Text style={styles.statusValue}>{character.ecoin || 0}</Text>
                </View>
                
                <View style={styles.statusItem}>
                  <Text style={styles.statusLabel}>Fama</Text>
                  <Text style={styles.statusValue}>{character.fame || 0}</Text>
                </View>
              </View>

              {/* Ranking e Vitórias */}
              <View style={styles.rankingSection}>
                <View style={styles.rankingItem}>
                  <Text style={styles.rankingLabel}>Ranking</Text>
                  <Text style={styles.rankingValue}>{character.ranking || 0}</Text>
                </View>
                
                <View style={styles.victoriesSection}>
                  <View style={styles.victoryItem}>
                    <Text style={styles.victoryLabel}>Vitórias</Text>
                    <Text style={styles.victoryValue}>{character.victories || 0}</Text>
                  </View>
                  <View style={styles.victoryItem}>
                    <Text style={styles.victoryLabel}>Derrotas</Text>
                    <Text style={styles.victoryValue}>{character.defeats || 0}</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* EQUIPE POKÉMON EM DUAS LINHAS HORIZONTAIS */}
        <View style={styles.teamSection}>
          <Text style={styles.teamTitle}>EQUIPE POKÉMON</Text>
          
          {/* Primeira linha - Pokémon 1, 2, 3 */}
          <View style={styles.teamRow}>
            {teamPokemon.slice(0, 3).map((pokemon, index) => (
              <PokemonSlot
                key={index}
                pokemon={pokemon}
                index={index}
                onPress={() => setSelectedPokemon(pokemon)}
              />
            ))}
          </View>
          
          {/* Segunda linha - Pokémon 4, 5, 6 */}
          <View style={styles.teamRow}>
            {teamPokemon.slice(3, 6).map((pokemon, index) => (
              <PokemonSlot
                key={index + 3}
                pokemon={pokemon}
                index={index + 3}
                onPress={() => setSelectedPokemon(pokemon)}
              />
            ))}
          </View>
        </View>

        {/* BOTÕES DE AÇÃO */}
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation.navigate('TeamSwap', {character, teamPokemon})}
          >
            <Text style={styles.actionButtonText}>TROCAR</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>GYM</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => setShowBackpack(!showBackpack)}
          >
            <Text style={styles.actionButtonText}>MOCHILA</Text>
          </TouchableOpacity>
        </View>

        {/* MOCHILA */}
        {showBackpack && renderBackpackContent()}

        {/* INFORMAÇÕES DO POKÉMON SELECIONADO */}
        {selectedPokemon && (
          <View style={styles.pokemonInfoSection}>
            <View style={styles.tabsContainer}>
              {['INFOR', 'MOV\'S', 'STATUS', 'TIPO'].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[styles.tab, activeTab === tab && styles.activeTab]}
                  onPress={() => setActiveTab(tab)}
                >
                  <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.tabContent}>
              {activeTab === 'INFOR' && renderInforTab()}
              {activeTab === 'MOV\'S' && renderMovesTab()}
              {activeTab === 'STATUS' && renderStatusTab()}
              {activeTab === 'TIPO' && renderTypeMapTab()}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
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
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    fontSize: 24,
    color: '#3498db',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  menuButton: {
    fontSize: 24,
    color: '#3498db',
  },
  menuDropdown: {
    position: 'absolute',
    top: 60,
    right: 15,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 1000,
    minWidth: 200,
  },
  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 14,
    color: '#333',
  },
  content: {
    flex: 1,
  },

  // ESTILOS DA SEÇÃO DO PERSONAGEM
  characterSection: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  characterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  characterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  characterName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginRight: 10,
  },
  classChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  classText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  characterLevel: {
    backgroundColor: '#3498db',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  levelText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  characterContent: {
    flexDirection: 'row',
  },
  avatarSection: {
    marginRight: 20,
    alignItems: 'center',
  },
  avatarImage: {
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
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
  },
  playerStatus: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusItem: {
    width: '30%',
    marginBottom: 10,
  },
  statusLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  statusValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  rankingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  rankingItem: {
    alignItems: 'center',
  },
  rankingLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  rankingValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  victoriesSection: {
    flexDirection: 'row',
  },
  victoryItem: {
    alignItems: 'center',
    marginLeft: 20,
  },
  victoryLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  victoryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },

  // ESTILOS DA SEÇÃO DA EQUIPE - DUAS LINHAS HORIZONTAIS
  teamSection: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teamTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 20,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  pokemonSlot: {
    width: '30%',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  selectedPokemonSlot: {
    borderColor: '#3498db',
    backgroundColor: '#e3f2fd',
  },
  leaderPokemonSlot: {
    borderColor: '#f39c12',
    backgroundColor: '#fff8e1',
  },
  pokemonSlotImageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  pokemonSlotImage: {
    width: 60,
    height: 60,
  },
  shinyBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#f39c12',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  shinyText: {
    fontSize: 10,
  },
  leaderBadge: {
    position: 'absolute',
    top: -5,
    left: -5,
    backgroundColor: '#f39c12',
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  leaderText: {
    fontSize: 10,
  },
  pokemonSlotName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 4,
    minHeight: 16,
  },
  pokemonSlotLevel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 8,
  },
  pokemonSlotTypes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 8,
  },
  pokemonSlotTypeChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginHorizontal: 1,
    marginVertical: 1,
  },
  pokemonSlotTypeText: {
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
  },
  hpBarContainer: {
    width: '100%',
    alignItems: 'center',
  },
  hpBarBackground: {
    width: '100%',
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    marginBottom: 2,
  },
  hpBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  hpText: {
    fontSize: 8,
    color: '#666',
    fontWeight: 'bold',
  },

  // ESTILOS DOS BOTÕES DE AÇÃO
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 10,
  },
  actionButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3498db',
    minWidth: 80,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#3498db',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // ESTILOS DA MOCHILA
  backpackContent: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backpackTabs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  backpackTab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginHorizontal: 2,
    alignItems: 'center',
  },
  activeBackpackTab: {
    backgroundColor: '#3498db',
  },
  backpackTabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  activeBackpackTabText: {
    color: 'white',
  },
  backpackItemsList: {
    maxHeight: 300,
  },
  backpackItemCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  backpackItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  backpackItemHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backpackItemEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  backpackItemName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  backpackItemQuantity: {
    fontSize: 12,
    color: '#666',
  },
  backpackExpandIcon: {
    fontSize: 16,
    color: '#666',
  },
  backpackItemDetails: {
    padding: 15,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  backpackItemDescription: {
    fontSize: 12,
    color: '#666',
    marginBottom: 10,
  },
  backpackItemInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  backpackItemEffect: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: 'bold',
  },
  backpackItemRarity: {
    fontSize: 12,
    color: '#e74c3c',
    fontWeight: 'bold',
  },
  useItemButton: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginRight: 10,
  },
  useItemButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  equipItemButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  equipItemButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  // ESTILOS DAS INFORMAÇÕES DO POKÉMON
  pokemonInfoSection: {
    backgroundColor: 'white',
    margin: 10,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#3498db',
    backgroundColor: 'white',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  activeTabText: {
    color: '#3498db',
  },
  tabContent: {
    minHeight: 300,
  },
  tabScrollContent: {
    padding: 20,
  },

  // ESTILOS DA ABA INFOR
  pokemonMainInfo: {
    alignItems: 'center',
  },
  pokemonNameSection: {
    marginBottom: 20,
  },
  pokemonNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pokemonName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginRight: 10,
  },
  editNameButton: {
    padding: 5,
  },
  editNameIcon: {
    fontSize: 16,
  },
  nicknameEditContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nicknameInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    marginRight: 10,
    minWidth: 150,
  },
  saveNicknameButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    marginRight: 5,
  },
  saveNicknameText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelNicknameButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  cancelNicknameText: {
    color: 'white',
    fontWeight: 'bold',
  },
  pokemonImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  pokemonImage: {
    width: 120,
    height: 120,
    marginBottom: 10,
  },
  shinyIndicator: {
    backgroundColor: '#f39c12',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginBottom: 10,
  },
  evolutionButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  evolutionButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  basicInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  infoItem: {
    width: '48%',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  typesSection: {
    width: '100%',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
    textAlign: 'center',
  },
  typesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  typeChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  typeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  breedingSection: {
    width: '100%',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  breedingInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  breedingLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
  },
  breedingValue: {
    fontSize: 12,
    color: '#1a1a1a',
  },
  cryButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  cryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  descriptionSection: {
    width: '100%',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    textAlign: 'center',
  },

  // ESTILOS DA ABA MOV'S
  movesContainer: {
    width: '100%',
  },
  moveCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  moveHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  moveName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  moveTypeChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  moveTypeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  moveStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  moveStatItem: {
    alignItems: 'center',
  },
  moveStatLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 2,
  },
  moveStatValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  moveDetails: {
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 10,
  },
  moveIndicators: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  moveIndicator: {
    backgroundColor: '#3498db',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginRight: 5,
  },
  moveIndicatorText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  moveDescription: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  trainMovesButton: {
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  trainMovesButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  learnsetSection: {
    marginTop: 20,
  },
  learnsetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  learnsetItem: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    margin: 2,
  },
  learnsetText: {
    fontSize: 12,
    color: '#34495e',
  },

  // ESTILOS DA ABA STATUS
  statusContainer: {
    width: '100%',
  },
  statsGrid: {
    marginBottom: 20,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statName: {
    width: 80,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  statBarContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  statBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginRight: 10,
  },
  statBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  statValue: {
    width: 40,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'right',
  },
  totalStatsContainer: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  totalStatsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  ivEvGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  ivEvItem: {
    width: '30%',
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  ivEvLabel: {
    fontSize: 10,
    color: '#666',
    marginBottom: 5,
  },
  ivEvValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  trainingButton: {
    backgroundColor: '#9b59b6',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  trainingButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },

  // ESTILOS DA ABA MAPA DE TIPOS
  typeMapContainer: {
    width: '100%',
  },
  typeMapTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: 20,
  },
  typeMapModeButtons: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ecf0f1',
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  activeModeButton: {
    backgroundColor: '#3498db',
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#34495e',
  },
  activeModeButtonText: {
    color: 'white',
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  typeMapItem: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 15,
  },
  typeSquare: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  typeSquareText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  multiplierBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  multiplierBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  legendSection: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
    textAlign: 'center',
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 11,
    color: '#666',
  },
});

export default CharacterDetailScreen;

