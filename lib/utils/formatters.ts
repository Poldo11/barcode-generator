export function formatarData(dataString: string | number | Date): string {
  if (!dataString) return ""

  // Analisa a data
  const data = new Date(dataString)
  if (isNaN(data.getTime())) return ""

  // Formata como DD/MM/YYYY
  const dia = data.getDate().toString().padStart(2, "0")
  const mes = (data.getMonth() + 1).toString().padStart(2, "0")
  const ano = data.getFullYear()

  return `${dia}/${mes}/${ano}`
}

// Formata data no formato YYYY-MM-DD para API
export function formatarDataAPI(dataString: string | number | Date): string {
  if (!dataString) return ""

  // Analisa a data
  const data = new Date(dataString)
  if (isNaN(data.getTime())) return ""

  // Formata como YYYY-MM-DD
  const ano = data.getFullYear()
  const mes = (data.getMonth() + 1).toString().padStart(2, "0")
  const dia = data.getDate().toString().padStart(2, "0")

  return `${ano}-${mes}-${dia}`
}

// Gera um ID aleatório similar ao exemplo
export function gerarIdAleatorio(): string {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let resultado = "PR"
  for (let i = 0; i < 20; i++) {
    resultado += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
  }
  return resultado
}

// Gera um código de rastreamento aleatório
export function gerarCodigoRastreamento(): string {
  const prefixos = ["AZ", "AC", "BR", "DL", "EC"]
  const prefixo = prefixos[Math.floor(Math.random() * prefixos.length)]
  let numeros = ""
  for (let i = 0; i < 9; i++) {
    numeros += Math.floor(Math.random() * 10)
  }
  return `${prefixo}${numeros}BR`
}

