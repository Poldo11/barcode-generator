import { CODIGOS_SERVICO_REGISTRADO, REMETENTE_PADRAO, VALORES_PADRAO } from "@/lib/constants"
import { formatarData } from "@/lib/utils/formatters"

export interface ObjetoSimples {
  sequencial: string
  codigoServico: string
  peso: string
  nomeRemetente: string
  cepRemetente: string
  logradouroRemetente: string
  numeroLogradouroRemetente: string
  complementoLogradouroRemetente: string
  bairroRemetente: string
  cidadeRemetente: string
  ufRemetente: string
  cnpjRemetente: string
  dddRemetente: string
  telefoneRemetente: string
  emailRemetente: string
  nomeDestinatario: string
  cepDestinatario: string
  logradouroDestinatario: string
  numeroLogradouroDestinatario: string
  complementoLogradouroDestinatario: string
  bairroDestinatario: string
  cidadeDestinatario: string
  ufDestinatario: string
  cnpjCpfDestinatario: string
  dddDestinatario: string
  telefoneDestinatario: string
  emailDestinatario: string
  dataPrevistaPostagem: string
}

export interface ObjetoRegistrado {
  destinatario: {
    cpfCnpj: string
    nome: string
    dddTelefone: string
    telefone: string
    dddCelular: string
    celular: string
    email: string
    endereco: {
      cep: string
      logradouro: string
      numero: string
      complemento: string
      bairro: string
      cidade: string
      uf: string
    }
  }
  remetente: {
    cpfCnpj: string
    nome: string
    dddTelefone: string
    telefone: string
    dddCelular: string
    celular: string
    email: string
    endereco: {
      cep: string
      logradouro: string
      numero: string
      complemento: string
      bairro: string
      cidade: string
      uf: string
    }
  }
  codigoServico: string
  pesoInformado: string
  codigoFormatoObjetoInformado: string
  alturaInformada: string
  larguraInformada: string
  comprimentoInformado: string
  diametroInformado: string
  cienteObjetoNaoProibido: number
  observacao: string
  numeroNotaFiscal: string
  chaveNFe: string
  listaServicoAdicional: Array<{
    codigoServicoAdicional: string
    valorDeclarado: number
  }>
  rfidObjeto: string
  sequencial: string
}

export interface ResultadoProcessamento {
  objetosSimples: ObjetoSimples[]
  objetosRegistrados: ObjetoRegistrado[]
}

export function processarDados(dados: any[]): ResultadoProcessamento {
  const objetosSimples: ObjetoSimples[] = []
  const objetosRegistrados: ObjetoRegistrado[] = []

  dados.forEach((linha, indice) => {
    // Garante que os valores estejam formatados corretamente
    const cepRemetente = linha.CEPRemetente ? linha.CEPRemetente.toString().padStart(8, "0") : VALORES_PADRAO.cep
    const cepDestinatario = linha.CEPDestinatario
      ? linha.CEPDestinatario.toString().padStart(8, "0")
      : VALORES_PADRAO.cep

    // Cria o objeto simples (formato original)
    const objetoSimples: ObjetoSimples = {
      sequencial: (indice + 1).toString(),
      codigoServico: VALORES_PADRAO.codigoServicoPAC,
      peso: linha.Peso ? linha.Peso.toString() : VALORES_PADRAO.peso,
      nomeRemetente: linha.NomeRemetente || VALORES_PADRAO.nomeRemetente,
      cepRemetente: cepRemetente,
      logradouroRemetente: linha.LogRemetente || VALORES_PADRAO.logradouro,
      numeroLogradouroRemetente: linha.NumLogRemetente
        ? linha.NumLogRemetente.toString()
        : VALORES_PADRAO.numeroRemetente,
      complementoLogradouroRemetente: linha.CompLogRemetente
        ? linha.CompLogRemetente.toString()
        : VALORES_PADRAO.complementoRemetente,
      bairroRemetente: linha.BairroRemetente ? linha.BairroRemetente.toString() : VALORES_PADRAO.bairro,
      cidadeRemetente: linha.CidRemetente ? linha.CidRemetente.toString() : VALORES_PADRAO.cidade,
      ufRemetente: linha.UFRemetente ? linha.UFRemetente.toString() : VALORES_PADRAO.uf,
      cnpjRemetente: linha.CNPJRemetente ? linha.CNPJRemetente.replace(/[^\d]/g, "") : VALORES_PADRAO.cnpj,
      dddRemetente: linha.DDDRemetente ? linha.DDDRemetente.toString() : "",
      telefoneRemetente: linha.TelRemetente ? linha.TelRemetente.toString() : "",
      emailRemetente: linha.EmailRemetente ? linha.EmailRemetente.toString() : VALORES_PADRAO.email,
      nomeDestinatario: linha.NomeDestinatario ? linha.NomeDestinatario.toString() : VALORES_PADRAO.nomeDestinatario,
      cepDestinatario: cepDestinatario,
      logradouroDestinatario: linha.LogDestinatario ? linha.LogDestinatario.toString() : VALORES_PADRAO.logradouro,
      numeroLogradouroDestinatario: linha.NumLogDestinatario
        ? linha.NumLogDestinatario.toString()
        : VALORES_PADRAO.numeroDestinatario,
      complementoLogradouroDestinatario: linha.CompLogDestinatario
        ? linha.CompLogDestinatario.toString()
        : VALORES_PADRAO.complementoDestinatario,
      bairroDestinatario: linha.BairroDestinatario ? linha.BairroDestinatario.toString() : VALORES_PADRAO.bairro,
      cidadeDestinatario: linha.CidDestinatario ? linha.CidDestinatario.toString() : VALORES_PADRAO.cidade,
      ufDestinatario: linha.UFDestinatario ? linha.UFDestinatario.toString() : VALORES_PADRAO.uf,
      cnpjCpfDestinatario: linha.CNPJCPFDestinatario ? linha.CNPJCPFDestinatario.toString() : VALORES_PADRAO.cnpj,
      dddDestinatario: linha.DDDDestinatario ? linha.DDDDestinatario.toString() : "11",
      telefoneDestinatario: linha.TelDestinatario ? linha.TelDestinatario.toString() : "",
      emailDestinatario: linha.EmailDestinatario ? linha.EmailDestinatario.toString() : VALORES_PADRAO.email,
      dataPrevistaPostagem: linha.DataPrevistaPostagem
        ? formatarData(linha.DataPrevistaPostagem)
        : VALORES_PADRAO.dataPostagem,
    }

    // Cria o objeto registrado com base no novo modelo
    const objetoRegistrado: ObjetoRegistrado = {
      destinatario: {
        cpfCnpj: linha.CNPJCPFDestinatario ? linha.CNPJCPFDestinatario.toString().replace(/[^\d]/g, "") : "",
        nome: linha.NomeDestinatario ? linha.NomeDestinatario.toString() : VALORES_PADRAO.nomeDestinatario,
        dddTelefone: linha.DDDDestinatario ? linha.DDDDestinatario.toString() : "",
        telefone: linha.TelDestinatario ? linha.TelDestinatario.toString() : "",
        dddCelular: linha.DDDDestinatario ? linha.DDDDestinatario.toString() : "",
        celular: linha.TelDestinatario ? linha.TelDestinatario.toString() : "",
        email: linha.EmailDestinatario ? linha.EmailDestinatario.toString() : VALORES_PADRAO.email,
        endereco: {
          cep: cepDestinatario,
          logradouro: linha.LogDestinatario ? linha.LogDestinatario.toString() : VALORES_PADRAO.logradouro,
          numero: linha.NumLogDestinatario ? linha.NumLogDestinatario.toString() : VALORES_PADRAO.numeroDestinatario,
          complemento: linha.CompLogDestinatario ? linha.CompLogDestinatario.toString() : "",
          bairro: linha.BairroDestinatario ? linha.BairroDestinatario.toString() : VALORES_PADRAO.bairro,
          cidade: linha.CidDestinatario ? linha.CidDestinatario.toString() : VALORES_PADRAO.cidade,
          uf: linha.UFDestinatario ? linha.UFDestinatario.toString() : VALORES_PADRAO.uf,
        },
      },
      remetente: REMETENTE_PADRAO,
      codigoServico: VALORES_PADRAO.codigoServicoSEDEX,
      pesoInformado: linha.Peso ? linha.Peso.toString() : VALORES_PADRAO.pesoRegistrado,
      codigoFormatoObjetoInformado: "2",
      alturaInformada: "25",
      larguraInformada: "25",
      comprimentoInformado: "25",
      diametroInformado: "",
      cienteObjetoNaoProibido: 1,
      observacao: "Livro",
      numeroNotaFiscal: "",
      chaveNFe: "",
      listaServicoAdicional: [
        {
          codigoServicoAdicional: "025",
          valorDeclarado: 100.5,
        },
      ],
      rfidObjeto: "",
      sequencial: (indice + 1).toString(),
    }

    // Verifica se é um objeto registrado com base em vários critérios
    const codigoServicoOriginal = linha.CodServico ? linha.CodServico.toString().padStart(5, "0") : ""

    // Verifica se o código de serviço está na lista de códigos de serviço registrados
    const ehRegistrado = CODIGOS_SERVICO_REGISTRADO.includes(codigoServicoOriginal)

    // Verificações adicionais para objetos registrados
    const temCodigoRastreamento = linha.CodigoRastreamento || linha.NumeroRegistro
    const temDeclaracaoValor = linha.ValorDeclarado && Number.parseFloat(linha.ValorDeclarado.toString()) > 0
    const temAvisoRecebimento =
      linha.AvisoRecebimento === true || linha.AvisoRecebimento === "S" || linha.AvisoRecebimento === "sim"

    // Se qualquer uma dessas condições for verdadeira, considere-o um objeto registrado
    if (ehRegistrado || temCodigoRastreamento || temDeclaracaoValor || temAvisoRecebimento) {
      objetosRegistrados.push(objetoRegistrado)
    } else {
      objetosSimples.push(objetoSimples)
    }
  })

  return {
    objetosSimples,
    objetosRegistrados,
  }
}

