// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   StyleSheet,
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   ScrollView,
//   Image,
//   Platform,
//   KeyboardAvoidingView,
//   Alert,
//   PermissionsAndroid,
// } from 'react-native';
// import { NativeStackScreenProps } from '@react-navigation/native-stack';
// import { MainStackParamList } from '../navigation/types';
// import { Picker } from '@react-native-picker/picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { launchImageLibrary, ImagePickerResponse, MediaType } from 'react-native-image-picker';

// type Props = NativeStackScreenProps<MainStackParamList, 'CreateCharacter'>;

// interface ClassOption {
//   id: string;
//   name: string;
//   description: string;
//   minAge: number;
//   maxAge: number;
//   ageRange: string;
// }

// interface Generation {
//   id: number;
//   name: string;
//   region: string;
// }

// interface Pokemon {
//   id: string;
//   name: string;
//   image: string;
//   generation: number;
// }

// interface CharacterStats {
//   FOR: number;
//   INT: number;
//   SAB: number;
//   CAR: number;
//   VEL: number;
//   ALT: number;
//   FAM: number;
// }

// interface Character {
//   id: string;
//   name: string;
//   avatarUri: string;
//   age: number;
//   class: string;
//   generation: number;
//   starterPokemon: Pokemon;
//   pokemonGender: 'male' | 'female';
//   stats: CharacterStats;
//   createdAt: string;
// }

// const classOptions: ClassOption[] = [
//   {
//     id: 'trainer',
//     name: 'Treinador',
//     description: 'Focado em batalhas e captura de Pokémon.',
//     minAge: 10,
//     maxAge: 25,
//     ageRange: '10-25 anos',
//   },
//   {
//     id: 'researcher',
//     name: 'Pesquisador',
//     description: 'Especialista em descobrir e catalogar Pokémon.',
//     minAge: 18,
//     maxAge: 65,
//     ageRange: '18-65 anos',
//   },
//   {
//     id: 'villain',
//     name: 'Vilão',
//     description: 'Busca poder e dominação no mundo Pokémon.',
//     minAge: 16,
//     maxAge: 50,
//     ageRange: '16-50 anos',
//   },
// ];

// const generations: Generation[] = [
//   { id: 1, name: 'Geração I', region: 'Kanto' },
//   { id: 2, name: 'Geração II', region: 'Johto' },
//   { id: 3, name: 'Geração III', region: 'Hoenn' },
//   { id: 4, name: 'Geração IV', region: 'Sinnoh' },
//   { id: 5, name: 'Geração V', region: 'Unova' },
//   { id: 6, name: 'Geração VI', region: 'Kalos' },
//   { id: 7, name: 'Geração VII', region: 'Alola' },
//   { id: 8, name: 'Geração VIII', region: 'Galar' },
//   { id: 9, name: 'Geração IX', region: 'Paldea' },
// ];

// const starterPokemon: { [key: number]: { trainers: Pokemon[], villains: Pokemon[] } } = {
//   1: {
//     trainers: [
//       { id: '1', name: 'Bulbasaur', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png', generation: 1 },
//       { id: '4', name: 'Charmander', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png', generation: 1 },
//       { id: '7', name: 'Squirtle', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png', generation: 1 },
//     ],
//     villains: [
//       { id: '19', name: 'Rattata', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/19.png', generation: 1 },
//       { id: '41', name: 'Zubat', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/41.png', generation: 1 },
//       { id: '52', name: 'Meowth', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/52.png', generation: 1 },
//     ],
//   },
//   2: {
//     trainers: [
//       { id: '152', name: 'Chikorita', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/152.png', generation: 2 },
//       { id: '155', name: 'Cyndaquil', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/155.png', generation: 2 },
//       { id: '158', name: 'Totodile', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/158.png', generation: 2 },
//     ],
//     villains: [
//       { id: '198', name: 'Murkrow', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/198.png', generation: 2 },
//       { id: '215', name: 'Sneasel', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/215.png', generation: 2 },
//       { id: '228', name: 'Houndour', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/228.png', generation: 2 },
//     ],
//   },
//   3: {
//     trainers: [
//       { id: '252', name: 'Treecko', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/252.png', generation: 3 },
//       { id: '255', name: 'Torchic', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/255.png', generation: 3 },
//       { id: '258', name: 'Mudkip', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/258.png', generation: 3 },
//     ],
//     villains: [
//       { id: '261', name: 'Poochyena', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/261.png', generation: 3 },
//       { id: '293', name: 'Whismur', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/293.png', generation: 3 },
//       { id: '302', name: 'Sableye', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/302.png', generation: 3 },
//     ],
//   },
//   4: {
//     trainers: [
//       { id: '387', name: 'Turtwig', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/387.png', generation: 4 },
//       { id: '390', name: 'Chimchar', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/390.png', generation: 4 },
//       { id: '393', name: 'Piplup', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/393.png', generation: 4 },
//     ],
//     villains: [
//       { id: '399', name: 'Bidoof', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/399.png', generation: 4 },
//       { id: '431', name: 'Glameow', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/431.png', generation: 4 },
//       { id: '434', name: 'Stunky', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/434.png', generation: 4 },
//     ],
//   },
//   5: {
//     trainers: [
//       { id: '495', name: 'Snivy', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/495.png', generation: 5 },
//       { id: '498', name: 'Tepig', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/498.png', generation: 5 },
//       { id: '501', name: 'Oshawott', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/501.png', generation: 5 },
//     ],
//     villains: [
//       { id: '509', name: 'Purrloin', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/509.png', generation: 5 },
//       { id: '551', name: 'Sandile', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/551.png', generation: 5 },
//       { id: '559', name: 'Scraggy', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/559.png', generation: 5 },
//     ],
//   },
//   6: {
//     trainers: [
//       { id: '650', name: 'Chespin', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/650.png', generation: 6 },
//       { id: '653', name: 'Fennekin', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/653.png', generation: 6 },
//       { id: '656', name: 'Froakie', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/656.png', generation: 6 },
//     ],
//     villains: [
//       { id: '661', name: 'Fletchling', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/661.png', generation: 6 },
//       { id: '677', name: 'Espurr', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/677.png', generation: 6 },
//       { id: '686', name: 'Inkay', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/686.png', generation: 6 },
//     ],
//   },
//   7: {
//     trainers: [
//       { id: '722', name: 'Rowlet', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/722.png', generation: 7 },
//       { id: '725', name: 'Litten', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/725.png', generation: 7 },
//       { id: '728', name: 'Popplio', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/728.png', generation: 7 },
//     ],
//     villains: [
//       { id: '734', name: 'Yungoos', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/734.png', generation: 7 },
//       { id: '757', name: 'Salandit', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/757.png', generation: 7 },
//       { id: '769', name: 'Sandygast', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/769.png', generation: 7 },
//     ],
//   },
//   8: {
//     trainers: [
//       { id: '810', name: 'Grookey', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/810.png', generation: 8 },
//       { id: '813', name: 'Scorbunny', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/813.png', generation: 8 },
//       { id: '816', name: 'Sobble', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/816.png', generation: 8 },
//     ],
//     villains: [
//       { id: '821', name: 'Rookidee', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/821.png', generation: 8 },
//       { id: '827', name: 'Nickit', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/827.png', generation: 8 },
//       { id: '859', name: 'Impidimp', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/859.png', generation: 8 },
//     ],
//   },
//   9: {
//     trainers: [
//       { id: '906', name: 'Sprigatito', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/906.png', generation: 9 },
//       { id: '909', name: 'Fuecoco', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/909.png', generation: 9 },
//       { id: '912', name: 'Quaxly', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/912.png', generation: 9 },
//     ],
//     villains: [
//       { id: '924', name: 'Tandemaus', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/924.png', generation: 9 },
//       { id: '944', name: 'Shroodle', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/944.png', generation: 9 },
//       { id: '951', name: 'Capsakid', image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/951.png', generation: 9 },
//     ],
//   },
// };

// const CreateCharacterScreen: React.FC<Props> = ({ navigation }) => {
//   const isVip = false;
//   const [avatarUri, setAvatarUri] = useState<string>('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png');
//   const [name, setName] = useState('');
//   const [selectedClass, setSelectedClass] = useState<ClassOption>(classOptions[0]);
//   const [age, setAge] = useState<number>(selectedClass.minAge);
//   const [selectedGeneration, setSelectedGeneration] = useState<Generation>(generations[0]);
//   const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
//   const [pokemonGender, setPokemonGender] = useState<'male' | 'female'>('male');
//   const [stats, setStats] = useState<CharacterStats>({ FOR: 0, INT: 0, SAB: 0, CAR: 0, VEL: 0, ALT: 0, FAM: 0 });
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');

//   const requestStoragePermission = async (): Promise<boolean> => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
//           {
//             title: 'Permissão de Acesso à Galeria',
//             message: 'O aplicativo precisa acessar sua galeria para selecionar uma foto de avatar.',
//             buttonNeutral: 'Perguntar Depois',
//             buttonNegative: 'Cancelar',
//             buttonPositive: 'OK',
//           }
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } catch (err) {
//         console.warn(err);
//         return false;
//       }
//     }
//     return true;
//   };

//   const selectImage = async () => {
//     const hasPermission = await requestStoragePermission();
//     if (!hasPermission) {
//       Alert.alert('Permissão Negada', 'É necessário permitir o acesso à galeria para selecionar uma imagem.');
//       return;
//     }

//     const options = {
//       mediaType: 'photo' as MediaType,
//       includeBase64: false,
//       maxHeight: 2000,
//       maxWidth: 2000,
//     };

//     launchImageLibrary(options, (response: ImagePickerResponse) => {
//       if (response.didCancel || response.errorMessage) {
//         return;
//       }

//       if (response.assets && response.assets[0]) {
//         const imageUri = response.assets[0].uri;
//         if (imageUri) {
//           setAvatarUri(imageUri);
//         }
//       }
//     });
//   };

//   const calculateStats = useCallback((characterAge: number, className: string): CharacterStats => {
//     const totalPoints = 500;
//     let baseStats = {
//       FOR: 0,
//       INT: 0,
//       SAB: 0,
//       CAR: 0,
//       VEL: 0,
//       ALT: 0,
//       FAM: 0,
//     };

//     switch (className) {
//       case 'trainer':
//         baseStats = {
//           FOR: Math.floor(totalPoints * 0.20),
//           INT: Math.floor(totalPoints * 0.15),
//           SAB: Math.floor(totalPoints * 0.10),
//           CAR: Math.floor(totalPoints * 0.15),
//           VEL: Math.floor(totalPoints * 0.25),
//           ALT: Math.floor(totalPoints * 0.10),
//           FAM: Math.floor(totalPoints * 0.05),
//         };
//         break;
//       case 'researcher':
//         baseStats = {
//           FOR: Math.floor(totalPoints * 0.10),
//           INT: Math.floor(totalPoints * 0.30),
//           SAB: Math.floor(totalPoints * 0.25),
//           CAR: Math.floor(totalPoints * 0.15),
//           VEL: Math.floor(totalPoints * 0.10),
//           ALT: Math.floor(totalPoints * 0.05),
//           FAM: Math.floor(totalPoints * 0.05),
//         };
//         break;
//       case 'villain':
//         baseStats = {
//           FOR: Math.floor(totalPoints * 0.25),
//           INT: Math.floor(totalPoints * 0.20),
//           SAB: Math.floor(totalPoints * 0.10),
//           CAR: Math.floor(totalPoints * 0.25),
//           VEL: Math.floor(totalPoints * 0.15),
//           ALT: Math.floor(totalPoints * 0.03),
//           FAM: Math.floor(totalPoints * 0.02),
//         };
//         break;
//     }

//     const currentTotal = Object.values(baseStats).reduce((sum, val) => sum + val, 0);
//     if (currentTotal !== totalPoints) {
//       const difference = totalPoints - currentTotal;
//       baseStats.FOR += difference;
//     }

//     return baseStats;
//   }, []);

//   const getAvailablePokemon = useCallback((): Pokemon[] => {
//     const generationPokemon = starterPokemon[selectedGeneration.id];
//     if (!generationPokemon) return [];

//     if (selectedClass.id === 'villain') {
//       return generationPokemon.villains;
//     } else {
//       return generationPokemon.trainers;
//     }
//   }, [selectedGeneration.id, selectedClass.id]);

//   useEffect(() => {
//     const newStats = calculateStats(age, selectedClass.id);
//     setStats(newStats);
//   }, [age, selectedClass, calculateStats]);

//   useEffect(() => {
//     const availablePokemon = getAvailablePokemon();
//     if (availablePokemon.length > 0) {
//       setSelectedPokemon(availablePokemon[0]);
//     }
//   }, [getAvailablePokemon]);

//   const getAgeOptions = (): number[] => {
//     const ages = [];
//     for (let i = selectedClass.minAge; i <= selectedClass.maxAge; i++) {
//       ages.push(i);
//     }
//     return ages;
//   };

//   const randomizeGeneration = () => {
//     const randomIndex = Math.floor(Math.random() * generations.length);
//     setSelectedGeneration(generations[randomIndex]);
//   };

//   const getTotalStats = (): number => {
//     return Object.values(stats).reduce((sum, val) => sum + val, 0);
//   };

//   const handleSaveCharacter = async () => {
//   try {
//     setError('');

//     if (!name.trim()) {
//       setError('Por favor, digite o nome do seu personagem.');
//       return;
//     }

//     if (!selectedPokemon) {
//       setError('Por favor, selecione um Pokémon inicial.');
//       return;
//     }

//     if (!isVip) {
//       const existingCharacters = await AsyncStorage.getItem('characters');
//       if (existingCharacters) {
//         try {
//           const characters = JSON.parse(existingCharacters);
//           if (characters.length > 0) {
//             Alert.alert(
//               'Limite Atingido',
//               'Usuários gratuitos podem criar apenas um personagem. Faça upgrade para VIP para criar mais personagens!',
//               [{ text: 'OK' }]
//             );
//             return;
//           }
//         } catch {
//           setError('Erro ao carregar personagens salvos. Tente novamente.');
//           return;
//         }
//       }
//     }

//     setIsLoading(true);

//     const newCharacter: Character = {
//       id: Date.now().toString(),
//       name: name.trim(),
//       avatarUri,
//       age,
//       class: selectedClass.id,
//       generation: selectedGeneration.id,
//       starterPokemon: selectedPokemon,
//       pokemonGender,
//       stats,
//       createdAt: new Date().toISOString(),
//     };

//     const existing = await AsyncStorage.getItem('characters');
//     let characters = [];

//     try {
//       characters = existing ? JSON.parse(existing) : [];
//     } catch {
//       // Se der erro no JSON, começamos do zero
//       characters = [];
//     }

//     characters.push(newCharacter);
//     await AsyncStorage.setItem('characters', JSON.stringify(characters));

//     Alert.alert(
//       'Sucesso!',
//       'Personagem criado com sucesso!',
//       [
//         {
//           text: 'OK',
//           onPress: () => navigation.navigate('Home'),
//         },
//       ]
//     );

//   } catch (err) {
//     console.error('Erro ao criar personagem:', err);
//     setError('Erro ao criar personagem. Por favor, tente novamente.');
//   } finally {
//     setIsLoading(false);
//   }
//   };

//       const newCharacter: Character = {
//         id: Date.now().toString(),
//         name: name.trim(),
//         avatarUri,
//         age,
//         class: selectedClass.id,
//         generation: selectedGeneration.id,
//         starterPokemon: selectedPokemon,
//         pokemonGender,
//         stats,
//         createdAt: new Date().toISOString(),
//       };

//       const existingCharacters = await AsyncStorage.getItem('characters');
//       const characters = existingCharacters ? JSON.parse(existingCharacters) : [];
//       characters.push(newCharacter);
//       await AsyncStorage.setItem('characters', JSON.stringify(characters));

//       Alert.alert(
//         'Sucesso!',
//         'Personagem criado com sucesso!',
//         [
//           {
//             text: 'OK',
//             onPress: () => navigation.navigate('Home'),
//           },
//         ]
//       );

//     } catch (err) {
//       console.error('Erro ao criar personagem:', err);
//       setError('Erro ao criar personagem. Por favor, tente novamente.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleExit = () => {
//     Alert.alert(
//       'Sair',
//       'Tem certeza que deseja sair? As informações não serão salvas.',
//       [
//         { text: 'Cancelar', style: 'cancel' },
//         { text: 'Sair', onPress: () => navigation.navigate('Home') },
//       ]
//     );
//   };

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//     >
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Text style={styles.title}>Criar Personagem</Text>

//         {error ? <Text style={styles.errorText}>{error}</Text> : null}

//         <View style={styles.section}>
//           <Text style={styles.label}>Avatar:</Text>
//           <TouchableOpacity style={styles.imageButton} onPress={selectImage}>
//             <Text style={styles.imageButtonText}>📷 Selecionar da Galeria</Text>
//           </TouchableOpacity>
//           {avatarUri ? (
//             <View style={styles.avatarPreview}>
//               <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
//             </View>
//           ) : null}
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.label}>Nome do Personagem:</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Digite o nome do seu personagem"
//             value={name}
//             onChangeText={setName}
//             editable={!isLoading}
//           />
//           <Text style={styles.hint}>* O nome não poderá ser editado após salvar</Text>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.label}>Classe:</Text>
//           <View style={styles.pickerContainer}>
//             <Picker
//               selectedValue={selectedClass.id}
//               onValueChange={(itemValue) => {
//                 const chosenClass = classOptions.find(c => c.id === itemValue);
//                 if (chosenClass) {
//                   setSelectedClass(chosenClass);
//                   setAge(chosenClass.minAge);
//                 }
//               }}
//               enabled={!isLoading}
//               style={styles.picker}
//             >
//               {classOptions.map((cls) => (
//                 <Picker.Item key={cls.id} label={`${cls.name} (${cls.ageRange})`} value={cls.id} />
//               ))}
//             </Picker>
//           </View>
//           <Text style={styles.classDescription}>{selectedClass.description}</Text>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.label}>Idade:</Text>
//           <View style={styles.pickerContainer}>
//             <Picker
//               selectedValue={age}
//               onValueChange={(itemValue) => setAge(itemValue)}
//               enabled={!isLoading}
//               style={styles.picker}
//             >
//               {getAgeOptions().map((ageOption) => (
//                 <Picker.Item key={ageOption} label={`${ageOption} anos`} value={ageOption} />
//               ))}
//             </Picker>
//           </View>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.label}>Status do Personagem (Total: {getTotalStats()}/500):</Text>
//           <View style={styles.statsContainer}>
//             <View style={styles.statRow}>
//               <Text style={styles.statLabel}>FOR (Força):</Text>
//               <Text style={styles.statValue}>{stats.FOR}</Text>
//             </View>
//             <View style={styles.statRow}>
//               <Text style={styles.statLabel}>INT (Inteligência):</Text>
//               <Text style={styles.statValue}>{stats.INT}</Text>
//             </View>
//             <View style={styles.statRow}>
//               <Text style={styles.statLabel}>SAB (Sabedoria):</Text>
//               <Text style={styles.statValue}>{stats.SAB}</Text>
//             </View>
//             <View style={styles.statRow}>
//               <Text style={styles.statLabel}>CAR (Carisma):</Text>
//               <Text style={styles.statValue}>{stats.CAR}</Text>
//             </View>
//             <View style={styles.statRow}>
//               <Text style={styles.statLabel}>VEL (Velocidade):</Text>
//               <Text style={styles.statValue}>{stats.VEL}</Text>
//             </View>
//             <View style={styles.statRow}>
//               <Text style={styles.statLabel}>ALT (Altura):</Text>
//               <Text style={styles.statValue}>{stats.ALT}</Text>
//             </View>
//             <View style={styles.statRow}>
//               <Text style={styles.statLabel}>FAM (Fama):</Text>
//               <Text style={styles.statValue}>{stats.FAM}</Text>
//             </View>
//           </View>
//         </View>

//         <View style={styles.section}>
//           <Text style={styles.label}>Geração:</Text>
//           <View style={styles.pickerContainer}>
//             <Picker
//             selectedValue={selectedGeneration.id}
//             onValueChange={(itemValue) => {
//             const chosenGeneration = generations.find(g => g.id === itemValue);
//             if (chosenGeneration) {
//             setSelectedGeneration(chosenGeneration);
//             }
//             }}
//             enabled={!isLoading}
//             style={styles.picker}
//             >
//             {generations.map((gen) => (
//             <Picker.Item key={gen.id} label={`${gen.name} - ${gen.region}`} value={gen.id} />
//             ))}
//           </Picker>
//           </View>
//             <TouchableOpacity style={styles.randomButton} onPress={randomizeGeneration}>
//             <Text style={styles.randomButtonText}>🎲 Sorteio</Text>
//           </TouchableOpacity>
//           </View>

//         <View style={styles.section}>
//           <Text style={styles.label}>Pokémon Inicial:</Text>
//           <View style={styles.pickerContainer}>
//             <Picker
//               selectedValue={selectedPokemon?.id || ''}
//               onValueChange={(itemValue) => {
//                 const chosenPokemon = getAvailablePokemon().find(p => p.id === itemValue);
//                 if (chosenPokemon) {
//                   setSelectedPokemon(chosenPokemon);
//                 }
//               }}
//               enabled={!isLoading}
//               style={styles.picker}
//             >
//               {getAvailablePokemon().map((pokemon) => (
//                 <Picker.Item key={pokemon.id} label={pokemon.name} value={pokemon.id} />
//               ))}
//             </Picker>
//           </View>

//           {selectedPokemon && (
//             <View style={styles.pokemonPreview}>
//               <Image source={{ uri: selectedPokemon.image }} style={styles.pokemonImage} />
//               <Text style={styles.pokemonName}>{selectedPokemon.name}</Text>

//               <View style={styles.genderContainer}>
//                 <Text style={styles.genderLabel}>Gênero:</Text>
//                 <View style={styles.genderButtons}>
//                   <TouchableOpacity
//                     style={[styles.genderButton, pokemonGender === 'male' && styles.genderButtonActive]}
//                     onPress={() => setPokemonGender('male')}
//                   >
//                     <Text style={[styles.genderButtonText, pokemonGender === 'male' && styles.genderButtonTextActive]}>
//                       ♂ Masculino
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[styles.genderButton, pokemonGender === 'female' && styles.genderButtonActive]}
//                     onPress={() => setPokemonGender('female')}
//                   >
//                     <Text style={[styles.genderButtonText, pokemonGender === 'female' && styles.genderButtonTextActive]}>
//                       ♀ Feminino
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </View>
//           )}
//         </View>

//         <View style={styles.buttonContainer}>
//           <TouchableOpacity
//             style={[styles.button, styles.exitButton]}
//             onPress={handleExit}
//             disabled={isLoading}
//           >
//             <Text style={styles.exitButtonText}>Sair</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={[styles.button, styles.saveButton, isLoading && styles.buttonDisabled]}
//             onPress={handleSaveCharacter}
//             disabled={isLoading}
//           >
//             {isLoading ? (
//               <ActivityIndicator color="#fff" />
//             ) : (
//               <Text style={styles.saveButtonText}>Salvar Personagem</Text>
//             )}
//           </TouchableOpacity>
//         </View>
//       </ScrollView>
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   scrollContainer: {
//     padding: 20,
//     paddingBottom: 40,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 30,
//     color: '#333',
//   },
//   errorText: {
//     color: '#ff0000',
//     textAlign: 'center',
//     marginBottom: 20,
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   section: {
//     marginBottom: 25,
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 10,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   label: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//     backgroundColor: '#fff',
//   },
//   hint: {
//     fontSize: 12,
//     color: '#666',
//     marginTop: 5,
//     fontStyle: 'italic',
//   },
//   imageButton: {
//     backgroundColor: '#007bff',
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   imageButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   avatarPreview: {
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   avatarImage: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     borderWidth: 2,
//     borderColor: '#ddd',
//   },
//   pickerContainer: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     backgroundColor: '#fff',
//   },
//   picker: {
//     height: 50,
//   },
//   classDescription: {
//     fontSize: 14,
//     color: '#666',
//     marginTop: 8,
//     fontStyle: 'italic',
//   },
//   statsContainer: {
//     marginTop: 10,
//   },
//   statRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingVertical: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   statLabel: {
//     fontSize: 16,
//     color: '#333',
//   },
//   statValue: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#007bff',
//   },
//   generationContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   randomButton: {
//     backgroundColor: '#28a745',
//     padding: 12,
//     borderRadius: 8,
//     marginLeft: 10,
//   },
//   randomButtonText: {
//     color: '#fff',
//     fontSize: 14,
//     fontWeight: 'bold',
//   },
//   pokemonPreview: {
//     alignItems: 'center',
//     marginTop: 15,
//     padding: 15,
//     backgroundColor: '#f8f9fa',
//     borderRadius: 8,
//   },
//   pokemonImage: {
//     width: 120,
//     height: 120,
//     marginBottom: 10,
//   },
//   pokemonName: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 15,
//   },
//   genderContainer: {
//     alignItems: 'center',
//   },
//   genderLabel: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333',
//   },
//   genderButtons: {
//     flexDirection: 'row',
//   },
//   genderButton: {
//     backgroundColor: '#e9ecef',
//     paddingVertical: 8,
//     paddingHorizontal: 15,
//     borderRadius: 20,
//     marginHorizontal: 5,
//   },
//   genderButtonActive: {
//     backgroundColor: '#007bff',
//   },
//   genderButtonText: {
//     fontSize: 14,
//     color: '#333',
//   },
//   genderButtonTextActive: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 30,
//   },
//   button: {
//     flex: 1,
//     paddingVertical: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginHorizontal: 5,
//   },
//   exitButton: {
//     backgroundColor: '#6c757d',
//   },
//   exitButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   saveButton: {
//     backgroundColor: '#28a745',
//   },
//   saveButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   buttonDisabled: {
//     backgroundColor: '#ccc',
//   },
// });

// export default CreateCharacterScreen;


