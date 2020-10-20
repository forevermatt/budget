
export const formatDate = timestamp => (new Date(timestamp)).toLocaleDateString()

/**
 * Format the given timestamp as a yyyy-mm-dd date, per ISO-8601. If no
 * timestamp is given, returns an empty string.
 *
 * @param timestamp
 * @returns {string}
 */
export const formatDateISO8601 = timestamp => {
  if (timestamp) {
    let date = new Date(timestamp)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()

    const monthString = String(month).padStart(2, '0')
    const dayString = String(day).padStart(2, '0')
    return `${year}-${monthString}-${dayString}`
  } else {
    return ''
  }
}

export const getCurrentYearMonthString = () => {
  return getYearMonthStringForMonthsBefore(0, new Date())
}

const getYearMonthStringForMonthsBefore = (numMonthsAgo, when) => {
  var currentYear = when.getFullYear()
  var currentMonth = when.getMonth() // 0 to 11
  var desiredDate = new Date(currentYear, currentMonth - numMonthsAgo)
  var fullYear = desiredDate.getFullYear()
  var desiredMonth = (desiredDate.getMonth() + 1) // 1 to 12
  return fullYear + '-' + String('0' + desiredMonth).slice(-2)
}
