import { DebitType, Periodicity } from '@prisma/client';

export interface RecordData {
  currentDate: number;
  monthlyInterestPaid: number;
  monthlyPayment: number;
  remainingBalance: number;
}

export interface PayScheduleData {
  title: string;
  initialBalance: number;
  extraPayAmount: number;
  monthlyInterestRateFraction: number;
  minPayAmount: number;
  data: RecordData[];
}

export interface CombineGraphData {
  title: string[];
  debtFreeMonth: number;
  combinedBalanceWithFirstMonthInterest: number;
  combinedInitialBalance: number;
  extraPayAmount: number;
  monthlyInterestRateFraction: number;
  minPayAmount: number;
  data: RecordData[];
}

export interface DebtRecord {
  id: string;
  title: string | null;
  extraPayAmount: number;
  initialBalance: number;
  monthlyInterestRateFraction: number;
  minPayAmount: number;
  data: Array<{
    currentDate: number;
    monthlyInterestPaid: number;
    monthlyPayment: number;
    remainingBalance: number;
  }>;
}

export interface AllUserFinancialRecords {
  id: string;
  title: string;
  extraPayAmount: number;
  initialBalance: number;
  monthlyInterestRateFraction: number;
  minPayAmount: number;
  data: {
    currentDate: number;
    monthlyInterestPaid: number;
    monthlyPayment: number;
    remainingBalance: number;
  }[];
}

export interface Error {
  error: string;
  status: number;
}

export interface ICreateRecordRequestBody {
  id?: string;
  userId: string;
  debtTitle: string;
  interestRate: number;
  debtType: DebitType;
  periodicity: Periodicity;
  initialBalance: number;
  minPayAmount: number;
  extraPayAmount: number;
  payDueDate: Date;
}

export interface ICreateRecord {
  interestRate: number;
  title: string;
  type: string;
  periodicity: string;
  initialBalance: number;
  minPayAmount: number;
  payDueDate: Date;
  extraPayAmount: number;
  userId: string;
}

export interface TransformedData {
  title: string[];
  combinedInitialBalance: number;
  monthlyInterestRateFraction: number;
  combinedBalanceWithFirstMonthInterest: number;
  minPayAmount: number;
  debtFreeMonth: number;
  extraPayAmount: number;
  data: {
    currentDate: number;
    monthlyInterestPaid: number;
    monthlyPayment: number;
    remainingBalance: number;
  }[];
}

export interface CardData {
  title: string;
  monthlyPayment: number;
  remainingBalance: number;
  monthlyInterestPaid: number;
  monthlyInterestRate: number;
}

export interface Payment {
  id: string;
  title: string;
  monthlyInterestRate: number;
  monthlyInterestPaid: number;
  monthlyPayment: number;
  initialBalance: number;
  minPayAmount: number;
  remainingBalance: number;
  extraPayAmount: number;
  paymentDate: string;
}

export interface Debt {
  title: string | null;
  type: string;
  periodicity: string;
  initialBalance: number;
  interestRate: number;
  minPayAmount: number;
  payDueDate: Date;
  PaymentSchedule: Payment[];
}
export interface PaymentCalculationResult {
  userId: string;
  paymentDate: string;
  totalInitialBalance: number;
  extraPayAmount: number;
  totalPayment: number;
  totalInterestPaid: number;
  balance: number;
  data: {
    id?: string;
    title: string;
    monthlyInterestRate: number;
    monthlyInterestPaid: number;
    initialBalance: number;
    monthlyPayment: number;
    remainingBalance: number;
    minPayAmount: number;
  }[];
}
