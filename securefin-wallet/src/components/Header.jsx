import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-16 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">S</div>
                    <span className="font-bold text-xl tracking-tight text-slate-900">SecureFin</span>
                </Link>
                <nav className="flex gap-1">
                    <Link
                        to="/"
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/wallet"
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/wallet') ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                    >
                        Wallet
                    </Link>
                </nav>
            </div>
        </header>
    )
}
