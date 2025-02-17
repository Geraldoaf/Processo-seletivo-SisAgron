import { collection, getDocs, addDoc, onSnapshot } from 'firebase/firestore'
import { db } from './firebase'

export default async function fetchCollection(collectionName) {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName))
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }))
  } catch (error) {
    console.error('Erro ao buscar documentos:', error)
    throw error
  }
}

export function listenToCollection(collectionName, callback) {
  try {
    const collectionRef = collection(db, collectionName)

    // Inicia a escuta em tempo real
    const unsubscribe = onSnapshot(
      collectionRef,
      (querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
        callback(data) // Chama o callback com os dados atualizados
      },
      (error) => {
        console.error('Erro ao ouvir documentos em tempo real:', error)
      },
    )

    // Retorna a função para cancelar a escuta
    return unsubscribe
  } catch (error) {
    console.error('Erro ao configurar escuta em tempo real:', error)
    throw error
  }
}

export async function addFiscalNote(notaFiscal) {
  try {
    const notaFiscalData = {
      anexos: notaFiscal.anexos,
      arquivoEspelho: notaFiscal.arquivoEspelho,
      chaveAcesso: notaFiscal.chaveAcesso,
      destinatarioRemetente: notaFiscal.destinatarioRemetente,
      dtEmissao: isValidDate(notaFiscal.dtEmissao) ? notaFiscal.dtEmissao.toISOString() : null,
      dtEntradaSaida: isValidDate(notaFiscal.dtEntradaSaida)
        ? notaFiscal.dtEntradaSaida.toISOString()
        : null,
      emisor: notaFiscal.emisor,
      malote: isValidDate(notaFiscal.malote) ? notaFiscal.malote.toISOString() : null,
      noNfe: notaFiscal.noNfe,
      serieNfe: notaFiscal.serieNfe,
      tags: notaFiscal.tags,
      tipo: notaFiscal.tipo,
      valorTotal: notaFiscal.valorTotal,
    }

    const docRef = await addDoc(collection(db, 'nfe'), notaFiscalData)
    console.log('Documento adicionado com ID:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('Erro ao adicionar documento:', error)
    throw error
  }
}

// Função auxiliar para validar se é uma instância de Date
function isValidDate(date) {
  return date instanceof Date && !isNaN(date)
}
