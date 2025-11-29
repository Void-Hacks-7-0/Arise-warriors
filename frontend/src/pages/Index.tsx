import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Shield, 
  Wallet, 
  PiggyBank, 
  TrendingUp, 
  GraduationCap, 
  Lock,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Blockchain Security',
    description: 'All transactions secured with immutable blockchain technology',
  },
  {
    icon: Wallet,
    title: 'Digital Wallet',
    description: 'P2P transfers with low fees and instant settlements',
  },
  {
    icon: PiggyBank,
    title: 'Smart Budgeting',
    description: 'AI-driven insights to help you save more effectively',
  },
  {
    icon: TrendingUp,
    title: 'Expense Analytics',
    description: 'Visual breakdown of your spending patterns',
  },
  {
    icon: Lock,
    title: 'Fraud Detection',
    description: 'ML-powered anomaly detection for your protection',
  },
  {
    icon: GraduationCap,
    title: 'Financial Literacy',
    description: 'Interactive modules to improve your financial knowledge',
  },
];

const stats = [
  { value: '50K+', label: 'Active Users' },
  { value: '₹10Cr+', label: 'Transactions Secured' },
  { value: '99.9%', label: 'Uptime' },
  { value: '4.8★', label: 'User Rating' },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">SecureFin</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/auth">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-accent px-4 py-2 rounded-full text-sm text-accent-foreground mb-6">
            <Shield className="w-4 h-4" />
            <span>Blockchain-Powered Finance for Everyone</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground max-w-4xl mx-auto leading-tight">
            Take Control of Your Finances with{' '}
            <span className="text-primary">SecureFin</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-6 max-w-2xl mx-auto">
            A secure, affordable personal finance tracker designed for underserved communities. 
            Track expenses, manage budgets, and make secure P2P transfers with blockchain technology.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8">
                Start Free Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                <p className="text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Everything You Need to Manage Money
            </h2>
            <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
              SecureFin combines powerful features with an intuitive interface, 
              making personal finance management accessible to everyone.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card key={feature.title} className="group hover:border-primary/50 transition-colors">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why SecureFin Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Built for India's Underserved Communities
              </h2>
              <p className="text-muted-foreground mb-8">
                We understand the unique challenges faced by students, young professionals, 
                and rural communities. SecureFin is designed with you in mind.
              </p>
              <ul className="space-y-4">
                {[
                  'Multi-source income tracking (scholarships, part-time jobs)',
                  'Low-cost peer-to-peer transactions',
                  'Regional language support (Hindi)',
                  'Financial literacy modules tailored for Indian context',
                  'Fraud protection with real-time alerts',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="bg-primary/5 rounded-2xl p-8 border border-primary/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <Wallet className="w-8 h-8 text-primary mb-2" />
                    <p className="text-2xl font-bold text-foreground">₹12,500</p>
                    <p className="text-sm text-muted-foreground">Wallet Balance</p>
                  </div>
                  <div className="bg-card p-4 rounded-lg border border-border">
                    <TrendingUp className="w-8 h-8 text-chart-1 mb-2" />
                    <p className="text-2xl font-bold text-foreground">+23%</p>
                    <p className="text-sm text-muted-foreground">Savings Growth</p>
                  </div>
                  <div className="col-span-2 bg-card p-4 rounded-lg border border-border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Security Score</p>
                        <p className="text-xl font-bold text-primary">95/100</p>
                      </div>
                      <Shield className="w-10 h-10 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="bg-primary rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Secure Your Financial Future?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust SecureFin for their daily financial management. 
              Get started in minutes.
            </p>
            <Link to="/auth">
              <Button size="lg" variant="secondary" className="text-lg px-8">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">SecureFin</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 SecureFin. Empowering financial inclusion through technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
