import { defineStore } from 'pinia'
import fetchCollection from '../firebase/dataService'
import PayingSource from '../models/PayingSource'

export const usePayingSourceStore = defineStore('PayingSource', {
  state: () => ({
    items: null,
    loading: false,
    error: null,
  }),

  actions: {
    async loadItems() {
      this.loading = true
      this.error = null

      try {
        const rawItems = await fetchCollection('fonte-pagadora')
        this.items = rawItems.map((item) => new PayingSource(item.id, item.data))
        console.log(this.items)
      } catch (error) {
        this.error = 'Erro ao carregar dados'
        console.error('Erro capturado no loadItems:', error) // Log do erro capturado
      } finally {
        this.loading = false
      }
    },
  },
})
