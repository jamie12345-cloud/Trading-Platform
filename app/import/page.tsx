'use client';

import { useState, useMemo, ChangeEvent } from 'react';
import Papa from 'papaparse';
import { Trade, createTradeFromCsvRow } from '@/types/trade';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const REQUIRED_COLUMNS = [
  ['date'], // required
  ['symbol'], // required
  ['quantity', 'qty'], // required
  ['price'], // required
  // Time and Side are optional in Tradervue generic format
];

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const validateTrade = (trade: Trade): string | null => {
  if (!trade.timestamp || Number.isNaN(Date.parse(trade.timestamp))) {
    return 'Missing or invalid timestamp';
  }
  if (!trade.symbol) {
    return 'Missing symbol';
  }
  if (!isFiniteNumber(trade.quantity) || trade.quantity === 0) {
    return 'Quantity must be a non-zero number';
  }
  if (!isFiniteNumber(trade.entryPrice)) {
    return 'Entry price is missing or invalid';
  }
  if (!isFiniteNumber(trade.exitPrice)) {
    return 'Exit price is missing or invalid';
  }
  return null;
};

const formatNumber = (value?: number) =>
  isFiniteNumber(value) ? value.toFixed(2) : '-';

const formatDateTime = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Invalid date' : date.toLocaleString();
};

export default function ImportPage() {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setStatusMessage('No file selected.');
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setParseErrors([
        `File is too large. Please upload a CSV smaller than ${
          MAX_FILE_SIZE_BYTES / (1024 * 1024)
        }MB.`,
      ]);
      setTrades([]);
      setStatusMessage(null);
      event.target.value = '';
      return;
    }

    setParseErrors([]);
    setStatusMessage('Parsing file...');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<any>) => {
        const newErrors: string[] = [];
        const validTrades: Trade[] = [];

        if (results.errors?.length) {
          results.errors.forEach((error) => {
            const rowNumber =
              typeof error.row === 'number' ? error.row + 1 : 'unknown';
            newErrors.push(`Parse error on row ${rowNumber}: ${error.message}`);
          });
        }

        const fields = results.meta?.fields ?? [];
        const normalizedFields = fields.map((field) => field.toLowerCase());
        const missingColumns = REQUIRED_COLUMNS.filter(
          (columnVariants) => !columnVariants.some((variant) => normalizedFields.includes(variant))
        );
        if (missingColumns.length) {
          newErrors.push(
            `Missing required column(s): ${missingColumns.map((variants) => variants.join(' or ')).join(', ')}`
          );
        }

        results.data.forEach((row: any, index: number) => {
          try {
            const trade = createTradeFromCsvRow(row, index);
            const validationError = validateTrade(trade);
            if (validationError) {
              newErrors.push(`Row ${index + 2}: ${validationError}`);
              return;
            }
            validTrades.push(trade);
          } catch (error) {
            newErrors.push(
              `Row ${index + 2}: ${
                error instanceof Error
                  ? error.message
                  : 'Unexpected error parsing row'
              }`
            );
          }
        });

        setTrades(validTrades);
        setParseErrors(newErrors);
        setStatusMessage(
          validTrades.length
            ? `Loaded ${validTrades.length} trade${
                validTrades.length === 1 ? '' : 's'
              }.`
            : null
        );
        event.target.value = '';
      },
      error: (error) => {
        setParseErrors([`Failed to parse file: ${error.message}`]);
        setTrades([]);
        setStatusMessage(null);
        event.target.value = '';
      },
    });
  };

  const tableRows = useMemo(() => {
    return trades.map((trade) => {
      let gross = (trade.exitPrice - trade.entryPrice) * trade.quantity;
      if (trade.side === 'short') {
        gross = gross * -1;
      }
      const pnl = gross - (trade.fees || 0);

      return {
        ...trade,
        pnl,
      };
    });
  }, [trades]);

  return (
    <div className="page-container">
      <h1 className="page-title">Import</h1>

      <div className="csv-upload">
        <label className="csv-label">
          Import trades (CSV):
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileUpload}
          />
        </label>
        <p className="csv-help">
          Expected format (Tradervue Generic): Date, Time, Symbol, Quantity, Price, Side, Commission, TransFee, ECNFee, Option.
          At minimum your file must include: Date, Symbol, Quantity and Price. Time and Side are optional.
        </p>
      </div>

      {statusMessage && <p className="status-message">{statusMessage}</p>}

      {parseErrors.length > 0 && (
        <div className="csv-errors" role="alert">
          <p>Some rows could not be processed:</p>
          <ul>
            {parseErrors.map((error, index) => (
              <li key={`${error}-${index}`}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <table className="trades-table">
        <thead>
          <tr>
            <th>Date/Time</th>
            <th>Symbol</th>
            <th>Side</th>
            <th>Qty</th>
            <th>Entry</th>
            <th>Exit</th>
            <th>Fees</th>
            <th>P&L</th>
          </tr>
        </thead>
        <tbody>
          {trades.length === 0 ? (
            <tr>
              <td colSpan={8}>No trades loaded yet. Upload a CSV to begin.</td>
            </tr>
          ) : (
            tableRows.map((row, index) => (
              <tr key={`${row.id}-${index}`}>
                <td>{formatDateTime(row.timestamp)}</td>
                <td>{row.symbol}</td>
                <td>{row.side}</td>
                <td>{row.quantity}</td>
                <td>{formatNumber(row.entryPrice)}</td>
                <td>{formatNumber(row.exitPrice)}</td>
                <td>{formatNumber(row.fees)}</td>
                <td className={row.pnl >= 0 ? 'pnl-positive' : 'pnl-negative'}>
                  {formatNumber(row.pnl)}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
