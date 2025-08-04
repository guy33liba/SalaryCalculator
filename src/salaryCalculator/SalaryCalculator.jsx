import React, { useState } from "react";
import "./SalaryCalculator.css";

const SalaryCalculator = () => {
  // Constants for 2025 rates
  const TAX_CREDIT_VALUE = 242;
  const TAX_BRACKETS = [
    { limit: 7010, rate: 0.1 },
    { limit: 10060, rate: 0.14 },
    { limit: 16150, rate: 0.2 },
    { limit: 22870, rate: 0.31 },
    { limit: 54300, rate: 0.35 },
    { limit: 75480, rate: 0.47 },
    { limit: Infinity, rate: 0.5 },
  ];
  const NATIONAL_INSURANCE_HEALTH_LIMIT = 7989.6;
  const NATIONAL_INSURANCE_LOW_RATE = 0.0104;
  const NATIONAL_INSURANCE_HIGH_RATE = 0.07;
  const HEALTH_INSURANCE_LOW_RATE = 0.0323;
  const HEALTH_INSURANCE_HIGH_RATE = 0.0517;

  // Input State Variables
  const [brutoSalary, setBrutoSalary] = useState(17000);
  const [monthlyWorkDays, setMonthlyWorkDays] = useState(22);
  const [absentDays, setAbsentDays] = useState(0);
  const [overtime125, setOvertime125] = useState(0);
  const [overtime150, setOvertime150] = useState(0);
  const [taxCredits, setTaxCredits] = useState(7.25);
  const [pensionRate, setPensionRate] = useState(6);
  const [employeerPensionPayment, setEmployeerPensionPayment] = useState(6.5);
  const [compensations, setCompensations] = useState(6);

  // Output State Variables
  const [finalBruto, setFinalBruto] = useState(0);
  const [netoSalary, setNetoSalary] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [totalNationalInsurance, setTotalNationalInsurance] = useState(0);
  const [totalHealthInsurance, setTotalHealthInsurance] = useState(0);
  const [totalPension, setTotalPension] = useState(0);
  const [employerPension, setEmployerPension] = useState(0);
  const [employerComp, setEmployerComp] = useState(0);
  const [employerNI, setEmployerNI] = useState(0);
  const [employerCost, setEmployerCost] = useState(0);

  const calculateSalary = () => {
    // 1. Final Bruto Salary Calculation
    const dailyRate = brutoSalary / monthlyWorkDays;
    const deductionForAbsence = dailyRate * absentDays;
    const hourlyRate = brutoSalary / 182;
    const overtimePay = overtime125 * (hourlyRate * 1.25) + overtime150 * (hourlyRate * 1.5);
    const calculatedFinalBruto = brutoSalary - deductionForAbsence + overtimePay;

    // 2. Income Tax Calculation
    const pensionDeduction = calculatedFinalBruto * (pensionRate / 100);
    let taxableIncome = calculatedFinalBruto - pensionDeduction;
    let taxBeforeCredits = 0;
    let remainingIncome = taxableIncome;
    let accumulatedLimit = 0;

    for (const bracket of TAX_BRACKETS) {
      if (remainingIncome > 0) {
        const bracketLimit = bracket.limit - accumulatedLimit;
        const incomeInBracket = Math.min(remainingIncome, bracketLimit);
        taxBeforeCredits += incomeInBracket * bracket.rate;
        remainingIncome -= incomeInBracket;
        accumulatedLimit = bracket.limit;
      }
    }
    const taxCreditValue = taxCredits * TAX_CREDIT_VALUE;
    const finalTax = Math.max(0, taxBeforeCredits - taxCreditValue);

    // 3. National Insurance & Health Insurance Calculation
    let nationalInsurance = 0;
    let healthInsurance = 0;
    const lowRateIncome = Math.min(calculatedFinalBruto, NATIONAL_INSURANCE_HEALTH_LIMIT);
    const highRateIncome = Math.max(0, calculatedFinalBruto - NATIONAL_INSURANCE_HEALTH_LIMIT);
    nationalInsurance += lowRateIncome * NATIONAL_INSURANCE_LOW_RATE;
    nationalInsurance += highRateIncome * NATIONAL_INSURANCE_HIGH_RATE;
    healthInsurance += lowRateIncome * HEALTH_INSURANCE_LOW_RATE;
    healthInsurance += highRateIncome * HEALTH_INSURANCE_HIGH_RATE;

    // 4. Final Neto Salary
    const totalDeductions = finalTax + nationalInsurance + healthInsurance + pensionDeduction;
    const calculatedNetoSalary = calculatedFinalBruto - totalDeductions;

    // 5. Employer Cost Calculation
    const employerPensionContribution = calculatedFinalBruto * (employeerPensionPayment / 100);
    const employerCompensations = calculatedFinalBruto * (compensations / 100);
    // חישוב ביטוח לאומי של מעסיק - שיעורים מותאמים
    const employerNationalInsurance =
      calculatedFinalBruto > NATIONAL_INSURANCE_HEALTH_LIMIT
        ? (calculatedFinalBruto - NATIONAL_INSURANCE_HEALTH_LIMIT) * 0.075 +
          NATIONAL_INSURANCE_HEALTH_LIMIT * 0.035
        : calculatedFinalBruto * 0.035;

    const calculatedEmployerCost =
      calculatedFinalBruto +
      employerPensionContribution +
      employerCompensations +
      employerNationalInsurance;

    // Update State
    setFinalBruto(calculatedFinalBruto.toFixed(2));
    setNetoSalary(calculatedNetoSalary.toFixed(2));
    setTotalTax(finalTax.toFixed(2));
    setTotalNationalInsurance(nationalInsurance.toFixed(2));
    setTotalHealthInsurance(healthInsurance.toFixed(2));
    setTotalPension(pensionDeduction.toFixed(2));
    setEmployerPension(employerPensionContribution.toFixed(2));
    setEmployerComp(employerCompensations.toFixed(2));
    setEmployerNI(employerNationalInsurance.toFixed(2));
    setEmployerCost(calculatedEmployerCost.toFixed(2));
  };

  return (
    <div className="salary-calculator-container">
      <h1>מחשבון שכר</h1>
      <div className="input-section">
        <label>
          שכר ברוטו בסיסי:
          <input
            type="number"
            value={brutoSalary}
            onChange={(e) => setBrutoSalary(Number(e.target.value))}
          />
        </label>
        <label>
          ימי עבודה בחודש:
          <input
            type="number"
            value={monthlyWorkDays}
            onChange={(e) => setMonthlyWorkDays(Number(e.target.value))}
          />
        </label>
        <label>
          ימי היעדרות:
          <input
            type="number"
            value={absentDays}
            onChange={(e) => setAbsentDays(Number(e.target.value))}
          />
        </label>
        <label>
          שעות נוספות (125%):
          <input
            type="number"
            value={overtime125}
            onChange={(e) => setOvertime125(Number(e.target.value))}
          />
        </label>
        <label>
          שעות נוספות (150%):
          <input
            type="number"
            value={overtime150}
            onChange={(e) => setOvertime150(Number(e.target.value))}
          />
        </label>
        <label>
          נקודות זיכוי:
          <input
            type="number"
            value={taxCredits}
            onChange={(e) => setTaxCredits(Number(e.target.value))}
          />
        </label>
        <label>
          אחוז הפרשה לפנסיה (עובד):
          <input
            type="number"
            value={pensionRate}
            onChange={(e) => setPensionRate(Number(e.target.value))}
          />
        </label>
        <label>
          אחוז הפרשה לפנסיה (מעסיק):
          <input
            type="number"
            value={employeerPensionPayment}
            onChange={(e) => setEmployeerPensionPayment(Number(e.target.value))}
          />
        </label>
        <label>
          אחוז הפרשה לפיצויים:
          <input
            type="number"
            value={compensations}
            onChange={(e) => setCompensations(Number(e.target.value))}
          />
        </label>
      </div>

      <button onClick={calculateSalary}>חשב שכר</button>

      <div className="results-section">
        <h2>סיכום תלוש (עובד)</h2>
        <div className="results-table">
          <p>
            <span>שכר ברוטו סופי:</span> <span>{finalBruto}</span>
          </p>
          <p>
            <span>ניכוי מס הכנסה:</span> <span>{totalTax}</span>
          </p>
          <p>
            <span>ניכוי ביטוח לאומי:</span> <span>{totalNationalInsurance}</span>
          </p>
          <p>
            <span>ניכוי מס בריאות:</span> <span>{totalHealthInsurance}</span>
          </p>
          <p>
            <span>הפרשות לפנסיה (עובד):</span> <span>{totalPension}</span>
          </p>
          <p>
            <span>נקודות זיכוי:</span> <span>{taxCredits}</span>
          </p>
          <p className="total-neto">
            <span>שכר נטו:</span> <span>{netoSalary}</span>
          </p>
        </div>
      </div>

      <div className="results-section employer-cost-section">
        <h2>פירוט עלות מעסיק</h2>
        <div className="results-table">
          <p>
            <span>שכר ברוטו:</span> <span>{finalBruto}</span>
          </p>
          <p>
            <span>הפרשות לפנסיה (מעסיק):</span> <span>{employerPension}</span>
          </p>
          <p>
            <span>הפרשות לפיצויים:</span> <span>{employerComp}</span>
          </p>
          <p>
            <span>ביטוח לאומי (מעסיק):</span> <span>{employerNI}</span>
          </p>
          <p className="total-employer-cost">
            <span>סה"כ עלות מעסיק:</span> <span>{employerCost}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculator;
