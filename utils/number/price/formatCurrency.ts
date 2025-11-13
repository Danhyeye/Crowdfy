export default function formatCurrency(amount: number, currency: string, showEurosText: boolean = false) {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency === "€" ? "EUR" : currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
    
    return showEurosText && currency === "€" ? `${formatted} euros` : formatted;
  };