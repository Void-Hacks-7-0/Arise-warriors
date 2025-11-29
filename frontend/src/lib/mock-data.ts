import { 
  Transaction, 
  Budget, 
  Wallet, 
  LiteracyModule, 
  FraudAlert, 
  Notification,
  TransactionCategory 
} from '@/types';

// Mock user data
export const mockUser = {
  id: '1',
  email: 'demo@securefin.com',
  name: 'Priya Sharma',
  phone: '+91 98765 43210',
  language: 'en' as const,
  createdAt: new Date('2024-01-01'),
};

// Mock transactions
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    userId: '1',
    type: 'expense',
    category: 'food',
    amount: 250,
    description: 'Lunch at college canteen',
    date: new Date('2024-11-28'),
    status: 'completed',
    blockchainHash: '0x1234...abcd',
    fraudRisk: 'low',
  },
  {
    id: '2',
    userId: '1',
    type: 'expense',
    category: 'education',
    amount: 1500,
    description: 'Online course subscription',
    date: new Date('2024-11-27'),
    status: 'completed',
    blockchainHash: '0x5678...efgh',
    fraudRisk: 'low',
  },
  {
    id: '3',
    userId: '1',
    type: 'income',
    category: 'scholarship',
    amount: 15000,
    description: 'Monthly scholarship',
    date: new Date('2024-11-25'),
    status: 'completed',
    blockchainHash: '0x9abc...ijkl',
    fraudRisk: 'low',
  },
  {
    id: '4',
    userId: '1',
    type: 'expense',
    category: 'travel',
    amount: 500,
    description: 'Metro card recharge',
    date: new Date('2024-11-24'),
    status: 'completed',
    blockchainHash: '0xdef0...mnop',
    fraudRisk: 'low',
  },
  {
    id: '5',
    userId: '1',
    type: 'income',
    category: 'freelance',
    amount: 8000,
    description: 'Web design project',
    date: new Date('2024-11-22'),
    status: 'completed',
    blockchainHash: '0x1111...qrst',
    fraudRisk: 'low',
  },
  {
    id: '6',
    userId: '1',
    type: 'expense',
    category: 'shopping',
    amount: 2500,
    description: 'New headphones',
    date: new Date('2024-11-20'),
    status: 'completed',
    blockchainHash: '0x2222...uvwx',
    fraudRisk: 'medium',
  },
  {
    id: '7',
    userId: '1',
    type: 'expense',
    category: 'bills',
    amount: 999,
    description: 'Mobile recharge',
    date: new Date('2024-11-18'),
    status: 'completed',
    blockchainHash: '0x3333...yzab',
    fraudRisk: 'low',
  },
  {
    id: '8',
    userId: '1',
    type: 'expense',
    category: 'entertainment',
    amount: 350,
    description: 'Movie tickets',
    date: new Date('2024-11-15'),
    status: 'completed',
    blockchainHash: '0x4444...cdef',
    fraudRisk: 'low',
  },
];

// Mock budgets
export const mockBudgets: Budget[] = [
  {
    id: '1',
    userId: '1',
    category: 'food',
    limit: 5000,
    spent: 3200,
    period: 'monthly',
    startDate: new Date('2024-11-01'),
    endDate: new Date('2024-11-30'),
  },
  {
    id: '2',
    userId: '1',
    category: 'education',
    limit: 3000,
    spent: 1500,
    period: 'monthly',
    startDate: new Date('2024-11-01'),
    endDate: new Date('2024-11-30'),
  },
  {
    id: '3',
    userId: '1',
    category: 'travel',
    limit: 2000,
    spent: 1800,
    period: 'monthly',
    startDate: new Date('2024-11-01'),
    endDate: new Date('2024-11-30'),
  },
  {
    id: '4',
    userId: '1',
    category: 'entertainment',
    limit: 1500,
    spent: 800,
    period: 'monthly',
    startDate: new Date('2024-11-01'),
    endDate: new Date('2024-11-30'),
  },
  {
    id: '5',
    userId: '1',
    category: 'shopping',
    limit: 3000,
    spent: 2500,
    period: 'monthly',
    startDate: new Date('2024-11-01'),
    endDate: new Date('2024-11-30'),
  },
];

// Mock wallet
export const mockWallet: Wallet = {
  id: '1',
  userId: '1',
  balance: 12500,
  currency: 'INR',
  address: 'sf_0x742d35Cc6634C0532925a3b844Bc9e7595f',
  transactions: [
    {
      id: 'w1',
      from: 'sf_0x742d35Cc6634C0532925a3b844Bc9e7595f',
      to: 'sf_0x123456789abcdef0123456789abcdef0123',
      amount: 500,
      currency: 'INR',
      timestamp: new Date('2024-11-27'),
      blockchainHash: '0xabc123...def456',
      status: 'confirmed',
    },
    {
      id: 'w2',
      from: 'sf_0x987654321fedcba0987654321fedcba098',
      to: 'sf_0x742d35Cc6634C0532925a3b844Bc9e7595f',
      amount: 2000,
      currency: 'INR',
      timestamp: new Date('2024-11-25'),
      blockchainHash: '0xghi789...jkl012',
      status: 'confirmed',
    },
  ],
};

// Mock literacy modules
export const mockLiteracyModules: LiteracyModule[] = [
  {
    id: '1',
    title: 'Budgeting Basics',
    description: 'Learn how to create and maintain a budget that works for you',
    content: 'A budget is a financial plan that helps you track income and expenses...',
    duration: 15,
    difficulty: 'beginner',
    category: 'budgeting',
    completed: true,
    progress: 100,
    quiz: {
      id: 'q1',
      questions: [
        {
          id: 'q1_1',
          question: 'What is the 50/30/20 rule?',
          options: [
            '50% needs, 30% wants, 20% savings',
            '50% savings, 30% needs, 20% wants',
            '50% wants, 30% savings, 20% needs',
            '50% needs, 30% savings, 20% wants',
          ],
          correctAnswer: 0,
        },
        {
          id: 'q1_2',
          question: 'How often should you review your budget?',
          options: ['Yearly', 'Monthly', 'Weekly', 'Never'],
          correctAnswer: 1,
        },
      ],
    },
  },
  {
    id: '2',
    title: 'Understanding Mutual Funds',
    description: 'A beginner guide to mutual funds and how they work in India',
    content: 'Mutual funds pool money from multiple investors to invest in securities...',
    duration: 20,
    difficulty: 'intermediate',
    category: 'investing',
    completed: false,
    progress: 45,
    quiz: {
      id: 'q2',
      questions: [
        {
          id: 'q2_1',
          question: 'What is NAV in mutual funds?',
          options: [
            'Net Annual Value',
            'Net Asset Value',
            'National Average Value',
            'New Asset Value',
          ],
          correctAnswer: 1,
        },
      ],
    },
  },
  {
    id: '3',
    title: 'Emergency Fund Planning',
    description: 'Why and how to build an emergency fund',
    content: 'An emergency fund is money set aside for unexpected expenses...',
    duration: 10,
    difficulty: 'beginner',
    category: 'savings',
    completed: false,
    progress: 0,
    quiz: {
      id: 'q3',
      questions: [
        {
          id: 'q3_1',
          question: 'How many months of expenses should an emergency fund cover?',
          options: ['1-2 months', '3-6 months', '12 months', '24 months'],
          correctAnswer: 1,
        },
      ],
    },
  },
  {
    id: '4',
    title: 'Protecting Against Online Fraud',
    description: 'Learn to identify and avoid common online scams',
    content: 'Digital payments have made transactions convenient but also attracted fraudsters...',
    duration: 12,
    difficulty: 'beginner',
    category: 'fraud-prevention',
    completed: false,
    progress: 0,
    quiz: {
      id: 'q4',
      questions: [
        {
          id: 'q4_1',
          question: 'What should you never share with anyone?',
          options: [
            'Bank name',
            'Account holder name',
            'OTP and PIN',
            'Branch address',
          ],
          correctAnswer: 2,
        },
      ],
    },
  },
];

// Mock fraud alerts
export const mockFraudAlerts: FraudAlert[] = [
  {
    id: '1',
    userId: '1',
    transactionId: '6',
    severity: 'medium',
    message: 'Unusual spending pattern detected: Large shopping expense outside your typical behavior',
    timestamp: new Date('2024-11-20'),
    acknowledged: false,
  },
  {
    id: '2',
    userId: '1',
    transactionId: '99',
    severity: 'high',
    message: 'Multiple login attempts from unknown device detected',
    timestamp: new Date('2024-11-19'),
    acknowledged: true,
  },
];

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'budget',
    title: 'Budget Alert',
    message: 'You have spent 90% of your Travel budget',
    read: false,
    timestamp: new Date('2024-11-28'),
  },
  {
    id: '2',
    userId: '1',
    type: 'fraud',
    title: 'Security Alert',
    message: 'Unusual transaction detected. Please review.',
    read: false,
    timestamp: new Date('2024-11-27'),
  },
  {
    id: '3',
    userId: '1',
    type: 'transaction',
    title: 'Payment Received',
    message: 'You received ₹8,000 from freelance project',
    read: true,
    timestamp: new Date('2024-11-22'),
  },
];

// Helper functions
export const getCategoryColor = (category: TransactionCategory): string => {
  const colors: Record<TransactionCategory, string> = {
    food: 'hsl(var(--chart-1))',
    education: 'hsl(var(--chart-2))',
    travel: 'hsl(var(--chart-3))',
    entertainment: 'hsl(var(--chart-4))',
    shopping: 'hsl(var(--chart-5))',
    bills: 'hsl(var(--primary))',
    salary: 'hsl(158 64% 51%)',
    scholarship: 'hsl(141 69% 58%)',
    freelance: 'hsl(172 66% 50%)',
    other: 'hsl(0 0% 45%)',
  };
  return colors[category];
};

export const getCategoryIcon = (category: TransactionCategory): string => {
  const icons: Record<TransactionCategory, string> = {
    food: '🍔',
    education: '📚',
    travel: '🚗',
    entertainment: '🎬',
    shopping: '🛒',
    bills: '📄',
    salary: '💰',
    scholarship: '🎓',
    freelance: '💼',
    other: '📌',
  };
  return icons[category];
};

export const formatCurrency = (amount: number, currency: string = 'INR'): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency === 'SFIN' ? 'INR' : currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('₹', currency === 'SFIN' ? 'ⓢ ' : '₹');
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date));
};
