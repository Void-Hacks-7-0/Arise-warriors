import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing";
import WalletPage from "../pages/WalletPage";

export default function Router() {
    return (
        <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/wallet" element={<WalletPage />} />
        </Routes>
    );
}
