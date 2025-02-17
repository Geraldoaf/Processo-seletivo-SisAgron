export default class NotaFiscal {
  constructor({
    anexos = [],
    arquivoEspelho,
    chaveAcesso = '',
    destinatarioRemetente,
    dtEmissao,
    dtEntradaSaida,
    emisor,
    malote,
    noNfe,
    serieNfe,
    tags = [],
    tipo,
    valorTotal = 0.0,
  }) {
    this.anexos = anexos
    this.arquivoEspelho = arquivoEspelho
    this.chaveAcesso = chaveAcesso
    this.destinatarioRemetente = destinatarioRemetente
    this.dtEmissao = new Date(dtEmissao.__time__)
    this.dtEntradaSaida = new Date(dtEntradaSaida.__time__)
    this.emisor = emisor
    this.malote = new Date(malote)
    this.noNfe = noNfe
    this.serieNfe = serieNfe
    this.tags = tags
    this.tipo = tipo
    this.valorTotal = valorTotal
  }
}
