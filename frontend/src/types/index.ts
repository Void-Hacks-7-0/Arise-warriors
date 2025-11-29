// User types
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  language: 'en' | 'hi';
  createdAt: Date;
}

// Transaction types
export interface Transaction {
  id: string;
  userId: string;
  type: 'income' | 'expense' | 'transfer';
  category: TransactionCategory;
  amount: number;
  description: string;
  date: Date;
  blockchainHash?: string;
  status: 'pending' | 'completed' | 'failed';
  fraudRisk?: 'low' | 'medium' | 'high';
}

export type TransactionCategory = 
  | 'food'
  | 'education'
  | 'travel'
  | 'entertainment'
  | 'shopping'
  | 'bills'
  | 'salary'
  | 'scholarship'
  | 'freelance'
  | 'other';

// Budget types
export interface Budget {
  id: string;
  userId: string;
  category: TransactionCategory;
  limit: number;
  spent: number;
  period: 'weekly' | 'monthly';
  startDate: Date;
  endDate: Date;
}

// Wallet types
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: 'INR' | 'SFIN';
  address: string;
  transactions: WalletTransaction[];
}

export interface WalletTransaction {
  id: string;
  from: string;
  to: string;
  amount: number;
  currency: 'INR' | 'SFIN';
  timestamp: Date;
  blockchainHash: string;
  status: 'pending' | 'confirmed' | 'failed';
}

// Financial Literacy types
export interface LiteracyModule {
  id: string;
  title: string;
  description: string;
  content: string;
  duration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: 'budgeting' | 'investing' | 'savings' | 'fraud-prevention';
  quiz: Quiz;
  completed?: boolean;
  progress?: number;
}

export interface Quiz {
  id: string;
  questions: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

// Fraud Alert types
export interface FraudAlert {
  id: string;
  userId: string;
  transactionId: string;
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: 'transaction' | 'budget' | 'fraud' | 'system';
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
}
