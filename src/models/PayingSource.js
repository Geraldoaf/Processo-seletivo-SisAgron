export default class PayingSource {
  constructor(id, data) {
    this.id = id
    this.nome = data.nome
    this.agencia = data.agencia
    this.nomeBanco = data.nomeBanco
    this.numBanco = data.numBanco
    this.numConta = data.numConta
    this.numDocUnico = data.numDocUnico
  }
}
