export type Side = 'long' | 'short';

export interface Trade {
  id: string;
  timestamp: string; // ISO datetime
  symbol: string;
  side: Side;
  quantity: number;
  entryPrice: number;
  exitPrice: number;
  fees?: number;
  account?: string;
  notes?: string;
  raw?: any; // raw CSV row for debugging
}

const parseSide = (sideValue: string | undefined, qty: number): Side => {
  if (sideValue) {
    const s = sideValue.trim().toLowerCase();
    if (s.startsWith('b')) return 'long'; // Buy, BOT, B
    if (s.startsWith('s')) return 'short'; // Sell, SLD, Short
  }

  // If no side, infer from quantity sign (Tradervue behaviour)
  return qty >= 0 ? 'long' : 'short';
};

export function createTradeFromCsvRow(row: any, index: number): Trade {
  // Support both "Date"/"Time" and lowercase variants
  const dateRaw = row.Date ?? row.date;
  const timeRaw = row.Time ?? row.time;

  const datePart =
    typeof dateRaw === 'string' && dateRaw.trim() !== ''
      ? dateRaw.trim()
      : undefined;

  const timePart =
    typeof timeRaw === 'string' && timeRaw.trim() !== ''
      ? timeRaw.trim()
      : '12:00:00'; // Tradervue default when no time

  // If no date provided, fall back to "now"
  const dateTimeString = datePart
    ? `${datePart} ${timePart}`
    : new Date().toISOString();

  const dateObj = datePart ? new Date(dateTimeString) : new Date();
  const timestamp = dateObj.toISOString();

  const symbol = (row.Symbol ?? row.symbol ?? '').trim();

  const quantityRaw = row.Quantity ?? row.quantity ?? row.Qty ?? row.qty;
  const priceRaw = row.Price ?? row.price;

  const quantityNumber = Number(quantityRaw);
  const priceNumber = Number(priceRaw);

  const sideStr = row.Side ?? row.side;
  const side = parseSide(sideStr, quantityNumber);
  const absQty = Math.abs(quantityNumber);

  const commission = Number(row.Commission ?? row.commission ?? 0) || 0;
  const transFee =
    Number(row.TransFee ?? row.transfee ?? row['Trans Fee'] ?? 0) || 0;
  const ecnFee = Number(row.ECNFee ?? row.ecnfee ?? 0) || 0;

  const totalFees = commission + transFee + ecnFee;

  return {
    id: `csv-${index}`,
    timestamp,
    symbol,
    side,
    quantity: absQty,
    entryPrice: priceNumber,
    exitPrice: priceNumber, // same for now; each row is one execution
    fees: totalFees,
    raw: row,
  };
}
