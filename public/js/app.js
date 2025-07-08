// Variáveis globais
let currentListId = null;
let currentListType = null;
let currentListMaxLevel = null;

// Carregar listas de encontro
async function loadLists() {
  try {
    const lists = await apiService.getLists();
    const listsContainer = document.getElementById('lists-container');
    
    if (!lists || lists.length === 0) {
      listsContainer.innerHTML = '<div class="alert alert-info">Nenhuma lista de encontro encontrada.</div>';
      return;
    }
    
    // Separar listas por tipo
    const pokeballs = lists.filter(list => list.type === 'pokeball');
    const fishingRods = lists.filter(list => list.type === 'fishing_rod');
    
    // Criar HTML para as listas
    let html = `
      <div class="row mb-4">
        <div class="col-12">
          <h2>Pokéballs</h2>
        </div>
        ${renderListCards(pokeballs)}
      </div>
      
      <div class="row mb-4">
        <div class="col-12">
          <h2>Varas de Pesca</h2>
        </div>
        ${renderListCards(fishingRods)}
      </div>
    `;
    
    listsContainer.innerHTML = html;
    
    // Adicionar event listeners para os cards
    document.querySelectorAll('.list-card').forEach(card => {
      card.addEventListener('click', async () => {
        const listId = card.dataset.listId;
        const listType = card.dataset.listType;
        const listMaxLevel = card.dataset.listMaxLevel;
        await loadPokemonList(listId, listType, listMaxLevel);
      });
    });
  } catch (error) {
    console.error('Erro ao carregar listas:', error);
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Não foi possível carregar as listas de encontro',
    });
  }
}

// Renderizar cards de listas
function renderListCards(lists) {
  if (!lists || lists.length === 0) {
    return '<div class="col-12"><div class="alert alert-info">Nenhuma lista encontrada.</div></div>';
  }
  
  return lists.map(list => {
    let imageUrl = '';
    
    // Definir imagem com base no subtipo
    if (list.type === 'pokeball') {
      switch (list.subtype) {
        case 'pokeball': imageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png'; break;
        case 'greatball': imageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/great-ball.png'; break;
        case 'ultraball': imageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/ultra-ball.png'; break;
        case 'masterball': imageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/master-ball.png'; break;
        default: imageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
      }
    } else if (list.type === 'fishing_rod' ) {
      switch (list.subtype) {
        case 'old_rod': imageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/old-rod.png'; break;
        case 'good_rod': imageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/good-rod.png'; break;
        case 'super_rod': imageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/super-rod.png'; break;
        default: imageUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/old-rod.png';
      }
    }
    
    return `
      <div class="col-md-3 mb-4">
        <div class="card list-card" data-list-id="${list.id}" data-list-type="${list.type}" data-list-max-level="${list.maxLevel}">
          <img src="${imageUrl}" class="card-img-top" alt="${list.name}">
          <div class="card-body">
            <h5 class="card-title">${list.name}</h5>
            <p class="card-text">${list.description}</p>
            <p class="card-text"><small class="text-muted">Nível máximo: ${list.maxLevel}</small></p>
          </div>
        </div>
      </div>
    `;
  } ).join('');
}

// Carregar lista de Pokémon
async function loadPokemonList(listId, listType, listMaxLevel) {
  try {
    currentListId = listId;
    currentListType = listType;
    currentListMaxLevel = listMaxLevel;
    
    const listDetails = await apiService.getListDetails(listId);
    
    // Mostrar container de Pokémon
    const pokemonContainer = document.getElementById('pokemon-container');
    pokemonContainer.classList.remove('d-none');
    
    // Atualizar título
    document.getElementById('list-title').textContent = `Pokémon em ${listDetails.name}`;
    
    // Renderizar lista de Pokémon
    renderPokemonTable(listDetails.pokemon || []);
    
    // Rolar para o container de Pokémon
    pokemonContainer.scrollIntoView({ behavior: 'smooth' });
  } catch (error) {
    console.error('Erro ao carregar Pokémon:', error);
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Não foi possível carregar os Pokémon desta lista',
    });
  }
}

// Renderizar tabela de Pokémon
function renderPokemonTable(pokemonList) {
  const tableBody = document.getElementById('pokemon-list');
  
  if (!pokemonList || pokemonList.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" class="text-center">Nenhum Pokémon encontrado nesta lista.</td>
      </tr>
    `;
    return;
  }
  
  tableBody.innerHTML = pokemonList.map(pokemon => {
    const isOutOfStock = pokemon.maxQuantity !== null && pokemon.currentQuantity <= 0;
    const rowClass = isOutOfStock ? 'pokemon-row out-of-stock' : 'pokemon-row';
    
    // Formatar movimentos
    const moves = [pokemon.move1, pokemon.move2, pokemon.move3, pokemon.move4]
      .filter(move => move)
      .join(', ');
    
    // Formatar quantidade
    let quantityDisplay = '';
    if (pokemon.maxQuantity === null) {
      quantityDisplay = '<span class="badge bg-info">Ilimitado</span>';
    } else {
      const badgeClass = isOutOfStock ? 'bg-danger' : 'bg-success';
      quantityDisplay = `<span class="badge ${badgeClass}">${pokemon.currentQuantity}/${pokemon.maxQuantity}</span>`;
    }
    
    return `
      <tr class="${rowClass}" data-pokemon-id="${pokemon.id}">
        <td>${pokemon.pokemonSpecies}</td>
        <td>${pokemon.level}</td>
        <td>${parseFloat(pokemon.appearanceChance).toFixed(2)}%</td>
        <td>${quantityDisplay}</td>
        <td>${moves || '-'}</td>
        <td>${pokemon.nature || '-'}</td>
        <td>${pokemon.ability || '-'}</td>
        <td>${pokemon.heldItem || '-'}</td>
        <td>
          <button class="btn btn-sm btn-primary action-btn edit-btn" data-pokemon-id="${pokemon.id}">
            <i class="fas fa-edit"></i>
          </button>
          ${pokemon.maxQuantity !== null ? `
            <button class="btn btn-sm btn-info action-btn restock-btn" data-pokemon-id="${pokemon.id}" data-max-quantity="${pokemon.maxQuantity}">
              <i class="fas fa-sync-alt"></i>
            </button>
          ` : ''}
          <button class="btn btn-sm btn-danger action-btn delete-btn" data-pokemon-id="${pokemon.id}">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');
  
  // Adicionar event listeners para os botões
  addPokemonTableEventListeners();
}

// Adicionar event listeners para a tabela de Pokémon
function addPokemonTableEventListeners() {
  // Botões de edição
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pokemonId = btn.dataset.pokemonId;
      await openPokemonModal('edit', pokemonId);
    });
  });
  
  // Botões de reabastecimento
  document.querySelectorAll('.restock-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const pokemonId = btn.dataset.pokemonId;
      const maxQuantity = btn.dataset.maxQuantity;
      openRestockModal(pokemonId, maxQuantity);
    });
  });
  
  // Botões de exclusão
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const pokemonId = btn.dataset.pokemonId;
      await deletePokemon(pokemonId);
    });
  });
}

// Abrir modal de Pokémon (adicionar/editar)
async function openPokemonModal(mode, pokemonId = null) {
  const modal = new bootstrap.Modal(document.getElementById('pokemon-modal'));
  const modalTitle = document.getElementById('modal-title');
  const form = document.getElementById('pokemon-form');
  
  // Limpar formulário
  form.reset();
  
  // Configurar modal com base no modo
  if (mode === 'add') {
    modalTitle.textContent = 'Adicionar Pokémon';
    document.getElementById('pokemon-id').value = '';
    document.getElementById('list-id').value = currentListId;
    
    // Definir valores padrão
    document.getElementById('pokemon-level').max = currentListMaxLevel;
    document.getElementById('unlimited-check').checked = true;
    document.getElementById('pokemon-quantity').disabled = true;
  } else if (mode === 'edit') {
    modalTitle.textContent = 'Editar Pokémon';
    
    try {
      // Buscar detalhes do Pokémon
      const listDetails = await apiService.getListDetails(currentListId);
      const pokemon = listDetails.pokemon.find(p => p.id == pokemonId);
      
      if (!pokemon) {
        throw new Error('Pokémon não encontrado');
      }
      
      // Preencher formulário
      document.getElementById('pokemon-id').value = pokemon.id;
      document.getElementById('list-id').value = currentListId;
      document.getElementById('pokemon-species').value = pokemon.pokemonSpecies;
      document.getElementById('pokemon-level').value = pokemon.level;
      document.getElementById('pokemon-level').max = currentListMaxLevel;
      document.getElementById('pokemon-chance').value = parseFloat(pokemon.appearanceChance).toFixed(2);
      
      // Quantidade
      const isUnlimited = pokemon.maxQuantity === null;
      document.getElementById('unlimited-check').checked = isUnlimited;
      document.getElementById('pokemon-quantity').disabled = isUnlimited;
      if (!isUnlimited) {
        document.getElementById('pokemon-quantity').value = pokemon.maxQuantity;
      }
      
      // Movimentos
      document.getElementById('pokemon-move1').value = pokemon.move1 || '';
      document.getElementById('pokemon-move2').value = pokemon.move2 || '';
      document.getElementById('pokemon-move3').value = pokemon.move3 || '';
      document.getElementById('pokemon-move4').value = pokemon.move4 || '';
      
      // Outros atributos
      document.getElementById('pokemon-nature').value = pokemon.nature || '';
      document.getElementById('pokemon-ability').value = pokemon.ability || '';
      document.getElementById('pokemon-item').value = pokemon.heldItem || '';
      
      // IVs
      document.getElementById('pokemon-iv-hp').value = pokemon.ivHp || 0;
      document.getElementById('pokemon-iv-attack').value = pokemon.ivAttack || 0;
      document.getElementById('pokemon-iv-defense').value = pokemon.ivDefense || 0;
      document.getElementById('pokemon-iv-sp-attack').value = pokemon.ivSpAttack || 0;
      document.getElementById('pokemon-iv-sp-defense').value = pokemon.ivSpDefense || 0;
      document.getElementById('pokemon-iv-speed').value = pokemon.ivSpeed || 0;
      
      // Lendário
      document.getElementById('pokemon-legendary').checked = pokemon.isLegendary || false;
    } catch (error) {
      console.error('Erro ao carregar detalhes do Pokémon:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: 'Não foi possível carregar os detalhes do Pokémon',
      });
      return;
    }
  }
  
  modal.show();
}

// Abrir modal de reabastecimento
function openRestockModal(pokemonId, maxQuantity) {
  const modal = new bootstrap.Modal(document.getElementById('restock-modal'));
  
  document.getElementById('restock-pokemon-id').value = pokemonId;
  document.getElementById('restock-max').textContent = maxQuantity;
  document.getElementById('restock-quantity').max = maxQuantity;
  
  modal.show();
}

// Salvar Pokémon (adicionar/editar)
async function savePokemon() {
  try {
    const pokemonId = document.getElementById('pokemon-id').value;
    const listId = document.getElementById('list-id').value;
    const isUnlimited = document.getElementById('unlimited-check').checked;
    
    // Construir objeto de dados
    const pokemonData = {
      pokemonSpecies: document.getElementById('pokemon-species').value,
      level: parseInt(document.getElementById('pokemon-level').value),
      appearanceChance: parseFloat(document.getElementById('pokemon-chance').value),
      maxQuantity: isUnlimited ? null : parseInt(document.getElementById('pokemon-quantity').value),
      move1: document.getElementById('pokemon-move1').value,
      move2: document.getElementById('pokemon-move2').value || null,
      move3: document.getElementById('pokemon-move3').value || null,
      move4: document.getElementById('pokemon-move4').value || null,
      nature: document.getElementById('pokemon-nature').value || null,
      ability: document.getElementById('pokemon-ability').value || null,
      heldItem: document.getElementById('pokemon-item').value || null,
      ivHp: parseInt(document.getElementById('pokemon-iv-hp').value) || 0,
      ivAttack: parseInt(document.getElementById('pokemon-iv-attack').value) || 0,
      ivDefense: parseInt(document.getElementById('pokemon-iv-defense').value) || 0,
      ivSpAttack: parseInt(document.getElementById('pokemon-iv-sp-attack').value) || 0,
      ivSpDefense: parseInt(document.getElementById('pokemon-iv-sp-defense').value) || 0,
      ivSpeed: parseInt(document.getElementById('pokemon-iv-speed').value) || 0,
      isLegendary: document.getElementById('pokemon-legendary').checked
    };
    
    let result;
    
    // Adicionar ou atualizar
    if (pokemonId) {
      result = await apiService.updatePokemon(pokemonId, pokemonData);
    } else {
      result = await apiService.addPokemon(listId, pokemonData);
    }
    
    // Fechar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('pokemon-modal'));
    modal.hide();
    
    // Mostrar alerta de sucesso
    Swal.fire({
      icon: 'success',
      title: 'Sucesso',
      text: pokemonId ? 'Pokémon atualizado com sucesso!' : 'Pokémon adicionado com sucesso!',
    });
    
    // Verificar aviso de soma de chances
    if (result.warning) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: result.warning,
      });
    }
    
    // Recarregar lista
    await loadPokemonList(currentListId, currentListType, currentListMaxLevel);
  } catch (error) {
    console.error('Erro ao salvar Pokémon:', error);
    let errorMessage = 'Não foi possível salvar o Pokémon';
    
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage = error.response.data.error;
    }
    
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: errorMessage,
    });
  }
}

// Reabastecer Pokémon
async function restockPokemon() {
  try {
    const pokemonId = document.getElementById('restock-pokemon-id').value;
    const quantity = parseInt(document.getElementById('restock-quantity').value);
    
    await apiService.restockPokemon(pokemonId, quantity);
    
    // Fechar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('restock-modal'));
    modal.hide();
    
    // Mostrar alerta de sucesso
    Swal.fire({
      icon: 'success',
      title: 'Sucesso',
      text: 'Pokémon reabastecido com sucesso!',
    });
    
    // Recarregar lista
    await loadPokemonList(currentListId, currentListType, currentListMaxLevel);
  } catch (error) {
    console.error('Erro ao reabastecer Pokémon:', error);
    let errorMessage = 'Não foi possível reabastecer o Pokémon';
    
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage = error.response.data.error;
    }
    
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: errorMessage,
    });
  }
}

// Excluir Pokémon
async function deletePokemon(pokemonId) {
  try {
    // Confirmar exclusão
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Confirmar exclusão',
      text: 'Tem certeza que deseja remover este Pokémon? Esta ação não pode ser desfeita.',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545',
    });
    
    if (!result.isConfirmed) {
      return;
    }
    
    await apiService.removePokemon(pokemonId);
    
    // Mostrar alerta de sucesso
    Swal.fire({
      icon: 'success',
      title: 'Sucesso',
      text: 'Pokémon removido com sucesso!',
    });
    
    // Recarregar lista
    await loadPokemonList(currentListId, currentListType, currentListMaxLevel);
  } catch (error) {
    console.error('Erro ao excluir Pokémon:', error);
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Não foi possível excluir o Pokémon',
    });
  }
}

// Normalizar chances
async function normalizeChances() {
  try {
    // Confirmar normalização
    const result = await Swal.fire({
      icon: 'question',
      title: 'Normalizar chances',
      text: 'Isso ajustará as chances de todos os Pokémon para que somem exatamente 100%. Deseja continuar?',
      showCancelButton: true,
      confirmButtonText: 'Sim, normalizar',
      cancelButtonText: 'Cancelar',
    });
    
    if (!result.isConfirmed) {
      return;
    }
    
    await apiService.normalizeChances(currentListId);
    
    // Mostrar alerta de sucesso
    Swal.fire({
      icon: 'success',
      title: 'Sucesso',
      text: 'Chances normalizadas com sucesso!',
    });
    
    // Recarregar lista
    await loadPokemonList(currentListId, currentListType, currentListMaxLevel);
  } catch (error) {
    console.error('Erro ao normalizar chances:', error);
    let errorMessage = 'Não foi possível normalizar as chances';
    
    if (error.response && error.response.data && error.response.data.error) {
      errorMessage = error.response.data.error;
    }
    
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: errorMessage,
    });
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Verificar autenticação e carregar listas
  if (isAuthenticated()) {
    loadLists();
  }
  
  // Navegação
  document.getElementById('nav-pokeballs').addEventListener('click', (e) => {
    e.preventDefault();
    const lists = document.querySelectorAll('.list-card[data-list-type="pokeball"]');
    if (lists.length > 0) {
      lists[0].scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  document.getElementById('nav-fishing').addEventListener('click', (e) => {
    e.preventDefault();
    const lists = document.querySelectorAll('.list-card[data-list-type="fishing_rod"]');
    if (lists.length > 0) {
      lists[0].scrollIntoView({ behavior: 'smooth' });
    }
  });
  
  // Botão de adicionar Pokémon
  document.getElementById('add-pokemon-btn').addEventListener('click', () => {
    openPokemonModal('add');
  });
  
  // Botão de normalizar chances
  document.getElementById('normalize-btn').addEventListener('click', () => {
    normalizeChances();
  });
  
  // Checkbox de ilimitado
  document.getElementById('unlimited-check').addEventListener('change', (e) => {
    document.getElementById('pokemon-quantity').disabled = e.target.checked;
  });
  
  // Botão de salvar Pokémon
  document.getElementById('save-pokemon-btn').addEventListener('click', () => {
    savePokemon();
  });
  
  // Botão de reabastecer
  document.getElementById('save-restock-btn').addEventListener('click', () => {
    restockPokemon();
  });
});
