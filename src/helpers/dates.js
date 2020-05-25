
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
