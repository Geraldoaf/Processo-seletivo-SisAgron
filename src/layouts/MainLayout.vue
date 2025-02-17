<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Cabeçalho -->
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title>SisAgron - Processo Seletivo</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <!-- Drawer -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header>Navegação</q-item-label>]

        <router-link to="/" class="router-link">
          <q-item clickable>
            <q-item-section avatar>
              <q-icon name="code" />
            </q-item-section>
            <q-item-section>Fonte de pagamento</q-item-section>
          </q-item>
        </router-link>

        <router-link to="/NotaFiscal" class="router-link">
          <q-item clickable>
            <q-item-section avatar>
              <q-icon name="receipt" />
            </q-item-section>
            <q-item-section>Notas fiscais</q-item-section>
          </q-item>
        </router-link>
      </q-list>
    </q-drawer>

    <!-- Conteúdo Principal -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const leftDrawerOpen = ref(false)

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<style scoped>
.router-link {
  text-decoration: none;
  color: black;
}
.router-link-active {
  color: black;
}
</style>
