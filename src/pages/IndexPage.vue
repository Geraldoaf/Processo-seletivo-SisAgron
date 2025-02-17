<template>
  <q-page>
    <q-list bordered style="width: 100%">
      <div v-if="error">{{ error }}</div>
      <div v-else>
        <div v-for="(item, index) in items" :key="index">
          <q-card class="my-card">
            <q-card-section>
              <div class="card-content">
                <div class="icon-container">
                  <q-icon name="account_circle" size="32px" />
                </div>
                <div class="text-container">
                  <div class="title">{{ item.nome }}</div>
                  <div class="subtitle">CPF/CNPJ: {{ item.numDocUnico }}</div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-list>
  </q-page>
</template>

<script>
import { usePayingSourceStore } from '../stores/PayingSourceStore'

export default {
  setup() {
    const payingSourceStore = usePayingSourceStore()

    payingSourceStore.loadItems()
    console.log(payingSourceStore.items)
    return {
      items: payingSourceStore.items,
      loading: payingSourceStore.loading,
      error: payingSourceStore.error,
    }
  },
}
</script>

<style scoped>
.my-card {
  width: 100%; /* Faz o card ocupar toda a largura disponível */
  max-width: 1200px; /* Define um limite máximo de largura para telas muito grandes */
  margin: 8px auto; /* Adiciona espaçamento entre os cards e centraliza */
  cursor: pointer;
  transition: transform 0.2s;
  display: flex;
  align-items: center;
}
.my-card:hover {
  transform: scale(1.02);
}
.card-content {
  display: flex;
  align-items: center;
}
.icon-container {
  margin-right: 16px;
}
.text-container {
  display: flex;
  flex-direction: column;
}
.title {
  font-weight: bold;
  font-size: 16px;
}
.subtitle {
  font-size: 14px;
  color: gray;
}
</style>
