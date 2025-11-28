import React from "react";
import { Link } from "react-router-dom";

export default function Landing() {
    return (
        <div className="relative overflow-hidden pt-16 pb-32">
            <div className="container mx-auto px-4 text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium mb-8 border border-indigo-100">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    Live on Testnet
                </div>

                <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
                    The Future of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Secure Finance</span>
                </h1>

                <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                    Experience the next generation of immutable ledger technology. Connect your wallet, publish transactions, and verify integrity on-chain.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/wallet" className="btn-primary flex items-center justify-center gap-2">
                        Launch Wallet
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                    </Link>
                    <a href="#" className="px-6 py-2.5 bg-white text-slate-700 font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm">
                        View Documentation
                    </a>
                </div>
            </div>

            {/* Abstract Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-3xl opacity-60"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-100/50 rounded-full blur-3xl opacity-60"></div>
            </div>
        </div>
    )
}
