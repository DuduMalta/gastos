// Referência ao banco de dados
const database = firebase.database();
const gastosRef = database.ref('gastos');

// Array para armazenar gastos localmente
let gastos = [];

// Elementos do DOM
const btnAddGasto = document.getElementById('btnAddGasto');
const btnViewGastos = document.getElementById('btnViewGastos');
const gastosList = document.getElementById('gastosList');
const totalGastos = document.getElementById('totalGastos');

// Ouvinte para atualizações em tempo real
gastosRef.on('value', (snapshot) => {
  gastos = [];
  snapshot.forEach((childSnapshot) => {
    const gasto = childSnapshot.val();
    gasto.id = childSnapshot.key; // Adiciona o ID do Firebase
    gastos.push(gasto);
  });
  atualizarLista();
});

// Função para adicionar gasto
btnAddGasto.addEventListener('click', () => {
  const valor = prompt("💰 Qual foi o valor do gasto? (Ex: 50.00)");
  
  if (valor && !isNaN(valor)) {
    const descricao = prompt("📝 Qual foi a descrição? (Ex: Mercado)");
    
    if (descricao) {
      const data = new Date().toLocaleDateString('pt-BR');
      const novoGasto = {
        data,
        descricao,
        valor: parseFloat(valor)
      };
      
      // Adiciona ao Firebase
      gastosRef.push(novoGasto)
        .then(() => alert(`✅ Gasto registrado: ${descricao} - R$${valor}`))
        .catch((error) => alert(`❌ Erro: ${error.message}`));
    }
  } else {
    alert("❌ Valor inválido! Use números (Ex: 50.00)");
  }
});

// Função para atualizar a lista
function atualizarLista() {
  gastosList.innerHTML = '';
  
  if (gastos.length === 0) {
    gastosList.innerHTML = '<p>Nenhum gasto registrado ainda.</p>';
    totalGastos.textContent = '';
    return;
  }
  
  gastos.forEach(gasto => {
    const gastoItem = document.createElement('div');
    gastoItem.className = 'gasto-item';
    gastoItem.innerHTML = `
      <span>${gasto.descricao} (${gasto.data})</span>
      <span>R$ ${gasto.valor.toFixed(2)}</span>
    `;
    gastosList.appendChild(gastoItem);
  });
  
  const total = gastos.reduce((sum, gasto) => sum + gasto.valor, 0);
  totalGastos.textContent = `Total gasto: R$ ${total.toFixed(2)}`;
}