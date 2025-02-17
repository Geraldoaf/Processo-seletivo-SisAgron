<template>
  <q-page padding>
    <!-- Cabeçalho -->
    <div class="row justify-between items-center">
      <h4>Notas Fiscais</h4>
      <div class="row items-center">
        <q-btn-dropdown flat dense icon="more_vert" ref="menuBtn" @click="toggleMenu">
          <q-list>
            <q-item clickable @click="encaminharMalote">
              <q-item-section avatar>
                <q-icon name="local_shipping" />
              </q-item-section>
              <q-item-section>Encaminhar malote</q-item-section>
            </q-item>
            <q-item clickable @click="importarNFe">
              <q-item-section avatar>
                <q-icon name="file_upload" />
              </q-item-section>
              <q-item-section>Nota Fiscal Eletrônica (NFe)</q-item-section>
            </q-item>
            <q-item clickable @click="procurarNfe">
              <q-item-section avatar>
                <q-icon name="search" />
              </q-item-section>
              <q-item-section>Procurar Nota Fiscal Eletrônica (NFe)</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>

        <q-btn
          color="negative"
          icon="delete"
          :disable="selectedIds.length === 0"
          @click="apagarSelecionados"
        />
      </div>
    </div>

    <!-- Tabela -->
    <q-table :rows="rows" :columns="columns" row-key="numero">
      <!-- Checkbox no cabeçalho -->
      <template v-slot:header-cell-selection>
        <q-th>
          <q-checkbox
            v-model="allSelected"
            color="primary"
            dense
            @update:model-value="toggleAllRows"
          />
        </q-th>
      </template>

      <!-- Checkbox nas linhas -->
      <template v-slot:body-cell-selection="props">
        <q-td :props="props">
          <q-checkbox v-model="selectedIds" :val="props.row.numero" color="primary" dense />
        </q-td>
      </template>

      <!-- Formatação para o campo "valor" -->
      <template v-slot:body-cell-valor="props">
        <q-td :props="props">
          {{ formatCurrency(props.row.valor) }}
        </q-td>
      </template>
    </q-table>

    <!-- Modal de Nota Fiscal -->
    <FiscalNoteDialog v-if="mostrarFiscalNoteDialog" @close="mostrarFiscalNoteDialog = false" />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { listenToCollection } from '../firebase/dataService' // Atualize o caminho conforme necessário
import FiscalNoteDialog from '../components/FiscalNoteDialog.vue'

// Variáveis reativas
const rows = ref([]) // Inicialmente vazio
const unsubscribe = ref(null) // Armazena a função para cancelar a escuta

// Definição das colunas da tabela
const columns = [
  { name: 'selection', label: '', align: 'center' }, // Coluna para os checkboxes
  { name: 'numero', label: 'Número', align: 'left', field: 'numero' },
  { name: 'tipo', label: 'Tipo', align: 'left', field: 'tipo' },
  { name: 'emissao', label: 'Emissão', align: 'left', field: 'emissao' },
  { name: 'emissor', label: 'Emissor', align: 'left', field: 'emissor' },
  { name: 'destinatario', label: 'Dest./Remet.', align: 'left', field: 'destinatario' },
  { name: 'valor', label: 'Valor (R$)', align: 'right', field: (row) => formatCurrency(row.valor) },
]

const mostrarFiscalNoteDialog = ref(false)

const selectedIds = ref([])

const allSelected = computed({
  get() {
    return selectedIds.value.length === rows.value.length && rows.value.length > 0
  },
  set(value) {
    toggleAllRows(value)
  },
})

// Funções para seleção de linhas
function toggleAllRows(value) {
  if (value) {
    selectedIds.value = rows.value.map((row) => row.numero)
  } else {
    selectedIds.value = []
  }
}

function apagarSelecionados() {
  rows.value = rows.value.filter((row) => !selectedIds.value.includes(row.numero))
  selectedIds.value = [] // Limpa a seleção após apagar os itens
}

// Função para formatar valores monetários
function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

// Funções do menu dropdown
function encaminharMalote() {
  alert('Encaminhar malote clicado!')
}

function importarNFe() {
  alert('Importar Nota Fiscal Eletrônica clicado!')
}

function procurarNfe() {
  mostrarFiscalNoteDialog.value = true // Exibe o componente modal
}

// Escuta em tempo real ao montar o componente
onMounted(() => {
  unsubscribe.value = listenToCollection('nfe', (data) => {
    // Atualiza as linhas com os dados recebidos em tempo real
    rows.value = data.map((doc) => ({
      numero: doc.data.noNfe,
      tipo: doc.data.tipo,
      emissao: new Date(doc.data.dtEmissao).toLocaleDateString('pt-BR'),
      emissor: doc.data.emisor,
      destinatario: doc.data.destinatarioRemetente,
      valor: doc.data.valorTotal,
    }))
  })
})

// Cancela a escuta ao desmontar o componente
onBeforeUnmount(() => {
  if (unsubscribe.value) {
    unsubscribe.value()
  }
})
</script>

<style scoped>
.q-table {
  font-size: 14px;
}
</style>
