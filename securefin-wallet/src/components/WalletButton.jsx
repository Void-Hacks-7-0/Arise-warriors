import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

export default function WalletButton() {
    const [address, setAddress] = useState("");
    const [balance, setBalance] = useState("");
    const [provider, setProvider] = useState(null);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (window.ethereum) {
            const prov = new ethers.BrowserProvider(window.ethereum);
            setProvider(prov);
            window.ethereum.on("accountsChanged", handleAccountsChanged);
        }
        return () => {
            if (window.ethereum) window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
        }
    }, []);

    async function handleAccountsChanged(accounts) {
        if (accounts.length === 0) {
            setAddress("");
            setBalance("");
        } else {
            const addr = accounts[0];
            setAddress(addr);
            if (provider) {
                try {
                    const bal = await provider.getBalance(addr);
                    setBalance(ethers.formatEther(bal));
                } catch (err) {
                    console.error("Error fetching balance:", err);
                }
            }
        }
    }

    async function connectMetaMask() {
        setError("");
        setIsConnecting(true);
        try {
            if (!window.ethereum) {
                throw new Error("MetaMask not installed");
            }
            await window.ethereum.request({ method: "eth_requestAccounts" });

            const signer = await provider.getSigner();
            const addr = await signer.getAddress();
            setAddress(addr);
            const bal = await provider.getBalance(addr);
            setBalance(ethers.formatEther(bal));
        } catch (e) {
            console.error(e);
            setError(e.message || "Connection failed");
        } finally {
            setIsConnecting(false);
        }
    }

    return (
        <div className="card p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg text-slate-900">Wallet Status</h3>
                <div className={`h-2.5 w-2.5 rounded-full ${address ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-slate-300'}`}></div>
            </div>

            {!address ? (
                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 text-center">
                        <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">Connect your wallet to access features</p>
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-center gap-2">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            {error}
                        </div>
                    )}

                    <button
                        onClick={connectMetaMask}
                        disabled={isConnecting}
                        className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isConnecting ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Connecting...
                            </>
                        ) : (
                            "Connect MetaMask"
                        )}
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="space-y-1">
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Address</div>
                        <div className="font-mono text-sm bg-slate-50 p-2.5 rounded border border-slate-200 break-all text-slate-700">
                            {address}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <div className="text-xs font-medium text-slate-500 uppercase tracking-wider">Balance</div>
                        <div className="text-2xl font-bold text-slate-900">
                            {parseFloat(balance).toFixed(4)} <span className="text-sm font-normal text-slate-500">ETH</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                        <button className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                            Publish txHash (Demo)
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
