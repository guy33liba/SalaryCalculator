import React, { useEffect, useState } from "react";
import "./CurrencyChanger.css";
const CurrencyChanger = () => {
  const exchangeRates = {
    USD: {
      EUR: 0.93,
      GBP: 0.8,
      JPY: 156.4,
      CAD: 1.37,
      AUD: 1.51,
    },
    EUR: {
      USD: 1.07,
      GBP: 0.86,
      JPY: 168.0,
      CAD: 1.47,
      AUD: 1.62,
    },
    GBP: {
      USD: 1.25,
      EUR: 1.16,
      JPY: 195.0,
      CAD: 1.7,
      AUD: 1.88,
    },
    JPY: {
      USD: 0.0064,
      EUR: 0.006,
      GBP: 0.0051,
      CAD: 0.0088,
      AUD: 0.0096,
    },
    CAD: {
      USD: 0.73,
      EUR: 0.68,
      GBP: 0.58,
      JPY: 113.8,
      AUD: 1.1,
    },
    AUD: {
      USD: 0.66,
      EUR: 0.61,
      GBP: 0.53,
      JPY: 104.2,
      CAD: 0.91,
    },
  };
  const currencies = Object.keys(exchangeRates);

  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [result, setResult] = useState(null);

  const convertCurrency = () => {
    // if (exchangeRates[fromCurrency] && exchangeRates[fromCurrency][toCurrency]) {
    //   const rate = exchangeRates[fromCurrency][toCurrency];
    //   const convertedAmount = amount * rate;
    //   setResult(convertedAmount.toFixed(2));
    // } else {
    //   const rateFrom = exchangeRates[fromCurrency]["USD"];
    //   const rateTo = exchangeRates["USD"][toCurrency];
    //   const convertedAmount = amount * rateFrom * rateTo;
    //   setResult(convertedAmount.toFixed(2));
    // }
    if (fromCurrency === toCurrency) {
      setResult(amount.toFixed(2));
      return;
    }

    const visited = new Set();
    const queue = [{ currency: fromCurrency, rate: 1 }];

    while (queue.length > 0) {
      const { currency, rate } = queue.shift();

      if (currency === toCurrency) {
        setResult((amount * rate).toFixed(2));
        return;
      }

      visited.add(currency);

      const neighbors = exchangeRates[currency] || {};
      for (const [nextCurrency, nextRate] of Object.entries(neighbors)) {
        if (!visited.has(nextCurrency)) {
          queue.push({ currency: nextCurrency, rate: rate * nextRate });
        }
      }
    }

    setResult("שגיאה: אין מסלול המרה זמין");
  };
  useEffect(() => {
    convertCurrency();
  }, [amount, fromCurrency, toCurrency]);
  return (
    <div className="currencyChangerWrapper">
      <div className="converterContainer">
        <h1 className="converterTitle">Currency Converter</h1>
        <div className="inputSection">
          <div className="inputGroup">
            <label htmlFor="amount" className="label">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              id="amount"
              onChange={(e) => setAmount(e.target.value)}
              className="inputField"
            />
          </div>
          <div className="currencySelectors">
            <div className="inputGroup currentSelect">
              <label htmlFor="fromCurrency" className="label">
                To
              </label>
              <select
                id="fromCurrency"
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="selectField"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
            <span className="arrowIcon">→</span>
            <div className="inputGroup currencySelect">
              <label htmlFor="toCurrency" className="label">
                From
              </label>
              <select
                id="toCurrency"
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="selectField"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* Result section */}
        <div className="resultSection">
          <h2 className="resultLabel">Converted Amount</h2>
          <p className="resultAmount animatePulse">
            {result !== null ? result : "..."} {toCurrency}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrencyChanger;
