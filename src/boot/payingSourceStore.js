import { usePayingSourceStore } from '../stores/PayingSourceStore'

export default async () => {
  const payingSourceStore = usePayingSourceStore()
  try {
    await payingSourceStore.loadItems()
  } catch (error) {
    console.error('Erro ao carregar dados no boot:', error)
  }
}
