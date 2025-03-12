import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const moedaMask = (value: string) => {
  const cleanValue = value.replace(/\D/g, '')
  const numberValue = Number(cleanValue) / 100
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(numberValue)
}

export function formatWhatsAppNumber(phone: string) {
  // Remove any non-digits
  const cleanNumber = phone.replace(/\D/g, '')

  // Remove the '9' from third position if it exists
  const numberWithout9 = cleanNumber.substring(0, 2) + cleanNumber.substring(3)

  // Add country code and WhatsApp suffix
  return `55${numberWithout9}@c.us`
}

export function formatPhoneNumber(phone: string) {
  const cleaned = phone.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return phone
}

export function extractYouTubeID(url: string) {
  const regExp =
    /^.*(youtu.be\/|v\/|embed\/|watch\?v=|\/videos\/|watch\?v%3D|watch\?v%3D|watch\?list=)([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[2].length === 11 ? match[2] : null
}

// Função para formatar o CPF
export function formatCPF(value: string) {
  return value
    .replace(/\D/g, '') // Remove todos os caracteres não numéricos
    .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o primeiro ponto
    .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o segundo ponto
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2') // Adiciona o hífen
    .slice(0, 14) // Limita o tamanho do CPF
}

export const formatPhone = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '')

  // Limit to max 11 digits
  const trimmed = digits.slice(0, 11)

  // Apply mask based on length
  if (trimmed.length <= 2) {
    return `(${trimmed}`
  }
  if (trimmed.length <= 7) {
    return `(${trimmed.slice(0, 2)})${trimmed.slice(2)}`
  }
  return `(${trimmed.slice(0, 2)})${trimmed.slice(2, 7)}-${trimmed.slice(7)}`
}

export const formatHeight = (value: string): string => {
  // Remove non-digits and dots
  const cleaned = value.replace(/[^\d.]/g, '')
  // Split by dot if exists
  const parts = cleaned.split('.')

  if (parts.length > 1) {
    // If we have a decimal point, format to x.xx
    return `${parts[0].slice(0, 1)}.${parts[1].slice(0, 2)}`
  }

  // If no decimal point, add it after first digit
  if (cleaned.length > 0) {
    return `${cleaned.slice(0, 1)}.${cleaned.slice(1, 3)}`
  }

  return cleaned
}

export const formatWeight = (value: string): string => {
  // Remove não-dígitos exceto ponto
  const cleaned = value.replace(/[^\d.]/g, '')

  // Divide nos pontos
  const parts = cleaned.split('.')

  if (parts.length > 1) {
    // Se tem ponto decimal, mantém até 3 dígitos antes e 1 depois
    const integerPart = parts[0].slice(0, 3)
    const decimalPart = parts[1].slice(0, 1)
    return `${integerPart}.${decimalPart}`
  }

  // Se não tem ponto e tem mais que 3 dígitos
  if (cleaned.length > 3) {
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 4)}`
  }

  return cleaned
}

export function formatBytes(
  bytes: number,
  opts: {
    decimals?: number
    sizeType?: 'accurate' | 'normal'
  } = {}
) {
  const { decimals = 0, sizeType = 'normal' } = opts

  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const accurateSizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB']
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(decimals)} ${
    sizeType === 'accurate' ? (accurateSizes[i] ?? 'Bytes') : (sizes[i] ?? 'Bytes')
  }`
}
