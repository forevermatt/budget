
export const dangerIfNegative = remaining => isNegative(remaining) ? 'danger' : ''

export const formatAmount = amount => formatAmountWithPrecision(amount, 2)

export const formatAmountAsWholeNumber = amount => formatAmountWithPrecision(amount, 0)

const formatAmountWithPrecision = (amount, precision) => {
  if (amount == undefined) {
    amount = 0
  }
  return (Number(amount) / 100).toFixed(precision)
}

const isNegative = number => (number && (number < 0))
