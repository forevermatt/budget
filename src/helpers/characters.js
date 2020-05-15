
export const getNumericCharFrom = code => {
  if (code >= 48 && code < 58) {
    return String(code - 48)
  } else if (code >= 96 && code < 106) {
    return String(code - 96)
  }
  return ''
}

export const isBackspace = code => (code === 8)

export const isPrintable = code => {
  return (code >= 32 && code < 112) ||
         (code >= 123 && code < 127) ||
         (code >= 186)
}
