export const formatINR = (paise: number) => {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    }).format((paise || 0) / 100)
  } catch {
    return `₹${((paise || 0) / 100).toFixed(2)}`
  }
}
