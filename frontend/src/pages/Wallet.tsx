import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { mockWallet, formatCurrency, formatDate } from '@/lib/mock-data';
import { 
  Wallet as WalletIcon, 
  Send, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Copy, 
  CheckCircle2, 
  QrCode,
  History,
  Shield,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Wallet = () => {
  const { toast } = useToast();
  const [wallet, setWallet] = useState(mockWallet);
  const [recipientAddress, setRecipientAddress] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  
  // MetaMask State
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [userBalance, setUserBalance] = useState('');

  useEffect(() => {
    const initProvider = async () => {
      if (window.ethereum) {
        const prov = new ethers.BrowserProvider(window.ethereum);
        setProvider(prov);
        
        // Check if already connected
        try {
          const accounts = await prov.listAccounts();
          if (accounts.length > 0) {
            handleAccountsChanged(accounts);
          }
        } catch (err) {
          console.error("Error checking accounts", err);
        }

        window.ethereum.on('accountsChanged', (accounts: any[]) => {
            // Convert to JsonRpcSigner or just use the address string if that's what handleAccountsChanged expects
            // listAccounts returns JsonRpcSigner[], but accountsChanged returns string[]
            // We'll just re-fetch the signer/address to be safe and consistent
            if (accounts.length > 0) {
                // We can't pass string[] to handleAccountsChanged if it expects JsonRpcSigner[]
                // So let's just trigger a re-sync
                connectMetaMask(); 
            } else {
                handleAccountsChanged([]);
            }
        });
      }
    };
    initProvider();
    
    return () => {
        if (window.ethereum) {
            window.ethereum.removeAllListeners('accountsChanged');
        }
    }
  }, []);

  const handleAccountsChanged = async (accounts: any[]) => {
    if (accounts.length === 0) {
      setIsConnected(false);
      setUserAddress('');
      setUserBalance('');
      setWallet(mockWallet); // Revert to mock data if disconnected
    } else {
      setIsConnected(true);
      // accounts[0] might be a string or a Signer depending on where it comes from.
      // Safest is to get the signer from provider again.
      if (provider) {
        try {
            const signer = await provider.getSigner();
            const address = await signer.getAddress();
            setUserAddress(address);
            
            const balance = await provider.getBalance(address);
            const balanceInEth = ethers.formatEther(balance);
            setUserBalance(balanceInEth);

            // Update wallet state with real data
            setWallet(prev => ({
                ...prev,
                address: address,
                balance: parseFloat(balanceInEth),
                // Keep mock transactions for now as we can't easily fetch history without an indexer
            }));
        } catch (error) {
            console.error("Error fetching account details:", error);
        }
      }
    }
  };

  const connectMetaMask = async () => {
    setIsConnecting(true);
    try {
      if (!window.ethereum) {
        toast({ title: "MetaMask not found", description: "Please install MetaMask extension", variant: "destructive" });
        return;
      }
      
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      if (provider) {
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        // Manually trigger update
        await handleAccountsChanged([address]); 
        toast({ title: "Connected", description: "Wallet connected successfully" });
      }
    } catch (error: any) {
      console.error(error);
      toast({ title: "Connection Failed", description: error.message || "Failed to connect wallet", variant: "destructive" });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(wallet.address);
    setCopiedAddress(true);
    toast({ title: 'Copied!', description: 'Wallet address copied to clipboard' });
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const handleTransfer = async () => {
    if (!recipientAddress || !transferAmount) {
      toast({ title: 'Error', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }

    const amount = parseFloat(transferAmount);
    if (amount > wallet.balance) {
      toast({ title: 'Error', description: 'Insufficient balance', variant: 'destructive' });
      return;
    }

    setIsTransferring(true);
    
    try {
        if (isConnected && provider) {
            // Real Blockchain Transaction
            const signer = await provider.getSigner();
            const tx = await signer.sendTransaction({
                to: recipientAddress,
                value: ethers.parseEther(transferAmount)
            });
            
            toast({ 
                title: 'Transaction Sent', 
                description: `Hash: ${tx.hash.substring(0, 10)}...` 
            });

            await tx.wait();
            
            toast({ 
                title: 'Transfer Confirmed', 
                description: 'Transaction confirmed on the blockchain' 
            });
            
            // Refresh balance
            const balance = await provider.getBalance(userAddress);
            const balanceInEth = ethers.formatEther(balance);
            setUserBalance(balanceInEth);
            setWallet(prev => ({ ...prev, balance: parseFloat(balanceInEth) }));

        } else {
             // Fallback to mock simulation if not connected (though UI should prevent this)
            await new Promise((resolve) => setTimeout(resolve, 2000));
             toast({ 
                title: 'Transfer Initiated (Mock)', 
                description: 'Transaction is being confirmed on the blockchain' 
            });
        }
    } catch (error: any) {
        console.error("Transfer error:", error);
        toast({ title: 'Transfer Failed', description: error.message || "Transaction failed", variant: 'destructive' });
    } finally {
        setIsTransferring(false);
        setRecipientAddress('');
        setTransferAmount('');
    }
  };

  // Generate simple QR code representation (in production, use a proper QR library)
  const QRCodeDisplay = () => (
    <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-lg border border-border">
      <div className="w-48 h-48 bg-foreground p-4 rounded-lg">
        <div className="w-full h-full bg-background rounded grid grid-cols-5 gap-1 p-2">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className={`rounded-sm ${Math.random() > 0.5 ? 'bg-foreground' : 'bg-background'}`}
            />
          ))}
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">Scan to receive payment</p>
        <p className="font-mono text-xs text-foreground break-all max-w-xs">{wallet.address}</p>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Wallet</h1>
            <p className="text-muted-foreground">Manage your blockchain wallet and P2P transfers</p>
          </div>
          {!isConnected && (
              <Button onClick={connectMetaMask} disabled={isConnecting}>
                  {isConnecting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Connecting...
                      </>
                  ) : (
                      <>
                        <WalletIcon className="mr-2 h-4 w-4" />
                        Connect MetaMask
                      </>
                  )}
              </Button>
          )}
          {isConnected && (
              <Badge variant="outline" className="px-3 py-1 border-green-500 text-green-600 bg-green-50">
                  <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                  Connected
              </Badge>
          )}
        </div>

        {/* Balance Card */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <WalletIcon className="h-5 w-5" />
                  <span className="text-sm opacity-90">Available Balance</span>
                </div>
                <p className="text-4xl font-bold">
                    {isConnected ? `${parseFloat(userBalance).toFixed(4)} ETH` : formatCurrency(wallet.balance)}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground">
                    <Shield className="h-3 w-3 mr-1" />
                    Blockchain Secured
                  </Badge>
                </div>
              </div>
              <div className="flex gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0">
                      <QrCode className="h-4 w-4 mr-2" />
                      Receive
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Receive Payment</DialogTitle>
                    </DialogHeader>
                    <QRCodeDisplay />
                    <Button className="w-full mt-4" onClick={handleCopyAddress}>
                      {copiedAddress ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Address
                        </>
                      )}
                    </Button>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="secondary" className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border-0">
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Payment</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label>Recipient Address</Label>
                        <Input
                          placeholder="0x..."
                          value={recipientAddress}
                          onChange={(e) => setRecipientAddress(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Amount ({isConnected ? 'ETH' : '₹'})</Label>
                        <Input
                          type="number"
                          placeholder="0.0"
                          value={transferAmount}
                          onChange={(e) => setTransferAmount(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">
                          Available: {isConnected ? `${userBalance} ETH` : formatCurrency(wallet.balance)}
                        </p>
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={handleTransfer}
                        disabled={isTransferring}
                      >
                        {isTransferring ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Confirming on Blockchain...
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Send Payment
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Wallet Address */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Wallet Address</CardTitle>
            <CardDescription>Your unique blockchain wallet address</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 p-3 bg-accent rounded-lg">
              <code className="flex-1 text-sm font-mono text-accent-foreground break-all">
                {wallet.address}
              </code>
              <Button variant="ghost" size="icon" onClick={handleCopyAddress}>
                {copiedAddress ? (
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5" />
              Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {wallet.transactions.map((tx) => {
                const isIncoming = tx.to === wallet.address;
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-background border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isIncoming ? 'bg-chart-1/10' : 'bg-muted/50'
                      }`}>
                        {isIncoming ? (
                          <ArrowDownLeft className="h-5 w-5 text-chart-1" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {isIncoming ? 'Received' : 'Sent'}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground">
                            {formatDate(tx.timestamp)}
                          </p>
                          <Badge
                            variant={tx.status === 'confirmed' ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${isIncoming ? 'text-chart-1' : 'text-foreground'}`}>
                        {isIncoming ? '+' : '-'}{isConnected ? `${tx.amount} ETH` : formatCurrency(tx.amount)}
                      </p>
                      <p className="text-xs text-muted-foreground font-mono">
                        {tx.blockchainHash}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Wallet;
