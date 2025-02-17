<template>
  <q-dialog full-width v-model="isOpen" @hide="emitClose">
    <q-card class="custom-card q-pa-md">
      <q-card-section>
        <div class="text-h6 text-center">Processo de Importação</div>
      </q-card-section>

      <q-stepper v-model="step" flat animated class="q-mt-md">
        <q-step name="1" title="Selecione um Nome" icon="person">
          <q-card-section>
            <p class="text-subtitle2">Escolha um nome da lista abaixo:</p>

            <div class="q-my-md flex flex-center">
              <q-spinner v-if="payingSourceStore.loading" />
            </div>

            <q-select
              v-if="!payingSourceStore.loading && nameOptions.length"
              v-model="selectedNameId"
              :options="nameOptions"
              label="Selecione um nome"
              outlined
              dense
              class="full-width"
            />

            <div v-else-if="!payingSourceStore.loading" class="text-caption text-center q-my-md">
              Nenhum nome disponível.
            </div>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn
              label="Próximo"
              color="primary"
              @click="goToNextStep"
              :disable="!selectedNameId"
              dense
            />
          </q-card-actions>
        </q-step>

        <q-step name="2" title="Notas Fiscais" icon="receipt">
          <q-card-section>
            <p class="text-subtitle2">Selecione as notas fiscais que deseja incluir:</p>

            <div v-if="loadingNotasFiscais" class="flex flex-center q-my-md">
              <q-spinner />
            </div>

            <div v-if="!loadingNotasFiscais && notasFiscais.length" class="scroll">
              <q-table :rows="notasFiscais" :columns="columns" row-key="id" flat dense>
                <template v-slot:header-cell-checkbox>
                  <q-checkbox v-model="selectAll" @update:model-value="toggleSelectAll" dense />
                </template>

                <template v-slot:body-cell-checkbox="{ row }">
                  <q-checkbox v-model="selectedNotasIds" :val="row.id" dense />
                </template>
              </q-table>
            </div>

            <div v-else-if="!loadingNotasFiscais" class="text-caption text-center q-my-md">
              Nenhuma nota fiscal disponível.
            </div>
          </q-card-section>

          <q-card-actions align="right" class="row no-wrap justify-between q-mt-sm">
            <q-btn label="Voltar" flat @click="goToPreviousStep" dense />
            <q-btn
              label="Próximo"
              color="primary"
              @click="goToNextStep"
              :disable="!selectedNotasIds.length"
              dense
            />
          </q-card-actions>
        </q-step>

        <q-step name="3" title="Concluído" icon="done">
          <q-card-section>
            <div class="text-center">
              <p class="text-h6">Exportação Concluída</p>
              <p class="text-subtitle2">
                As notas fiscais selecionadas foram exportadas com sucesso!
              </p>
            </div>
          </q-card-section>

          <q-card-actions align="center">
            <q-btn label="OK" color="primary" @click="emitClose" dense />
          </q-card-actions>
        </q-step>
      </q-stepper>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import axios from 'axios'
import { usePayingSourceStore } from '../stores/PayingSourceStore'
import { addFiscalNote } from '../firebase/dataService'

const isOpen = ref(true)
const step = ref('1')

const payingSourceStore = usePayingSourceStore()

onMounted(() => {
  payingSourceStore.loadItems()
})

const nameOptions = computed(
  () =>
    payingSourceStore.items?.map((item) => ({
      label: item.nome,
      value: item.numDocUnico,
    })) || [],
)

const selectedNameId = ref(null)

const loadingNotasFiscais = ref(false)
const notasFiscais = ref([])

const columns = [
  { name: 'checkbox', required: true, label: '', align: 'center', field: 'checkbox' },
  {
    name: 'chaveAcesso',
    required: true,
    label: 'Chave de Acesso',
    align: 'left',
    field: 'chaveAcesso',
  },
  {
    name: 'emissor',
    required: true,
    label: 'Emissor',
    align: 'left',
    field: 'emisor',
  },
  {
    name: 'valorTotal',
    required: true,
    label: 'Valor Total',
    align: 'right',
    field: 'valorTotal',
  },
  {
    name: 'dtEmissao',
    required: true,
    label: 'Data de Emissão',
    align: 'center',
    field: 'dtEmissao',
  },
]

const selectedNotasIds = ref([])
const selectAll = ref(false)

function toggleSelectAll(value) {
  if (value) {
    selectedNotasIds.value = notasFiscais.value.map((nota) => nota.id)
  } else {
    selectedNotasIds.value = []
  }
}

watch(selectedNotasIds, (newVal) => {
  selectAll.value = newVal.length === notasFiscais.value.length
})

function goToNextStep() {
  const currentStep = parseInt(step.value)

  if (currentStep === 1) {
    fetchNotasFiscais()
  }

  if (currentStep === 2) {
    exportSelectedNotasToFirebase()
  }

  if (currentStep < 3) {
    step.value = (currentStep + 1).toString()
  }
}

function goToPreviousStep() {
  const currentStep = parseInt(step.value)
  if (currentStep > 1) {
    step.value = (currentStep - 1).toString()
  }
}

function emitClose() {
  isOpen.value = false
}

async function fetchNotasFiscais() {
  if (!selectedNameId.value) return

  loadingNotasFiscais.value = true

  try {
    console.log(selectedNameId.value)
    console.log('Valor acima')
    const response = await axios.get(`http://geraldo-server.ddns.net:25571/api/nfe`, {
      params: {
        cpfCnpj: selectedNameId.value.value,
        n: 5,
      },
    })

    notasFiscais.value = response.data.map((nota, index) => ({
      id: index.toString(),
      chaveAcesso: nota.chaveAcesso || '',
      emisor: nota.emisor || '',
      valorTotal: nota.valorTotal || '',
      destinatarioRemetente: selectedNameId.value.label,
      dtEmissao: nota.dtEmissao || {},
      anexos: nota.anexos || [],
      arquivoEspelho: nota.arquivoEspelho || '',
      malote: nota.malote || new Date(),
      noNfe: nota.noNfe || '',
      serieNfe: nota.serieNfe || '',
      tags: nota.tags || [],
      tipo: nota.tipo || '',
      dtEntradaSaida: new Date(),
    }))
  } catch (error) {
    console.error('Erro ao buscar notas fiscais:', error)
    notasFiscais.value = []
  } finally {
    loadingNotasFiscais.value = false
  }
}

async function exportSelectedNotasToFirebase() {
  try {
    const selectedNotas = notasFiscais.value.filter((nota) =>
      selectedNotasIds.value.includes(nota.id),
    )

    for (const nota of selectedNotas) {
      await addFiscalNote(nota)
      console.log(`Nota fiscal ${nota.chaveAcesso} exportada com sucesso.`)
    }
  } catch (error) {
    console.error('Erro ao exportar notas fiscais:', error)
  }
}
</script>

<style scoped>
.full-width {
  width: calc(100% - 32px); /* Ajusta o card para caber perfeitamente */
}

.table-container {
  width: calc(100% - 16px); /* Ajusta a largura da tabela */
}

.q-table td,
.q-table th {
  white-space: nowrap; /* Evita quebra de linha nos valores */
}
</style>
