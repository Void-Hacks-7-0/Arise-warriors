import React from "react";
import WalletButton from "../components/WalletButton";
import WalletPanel from "../components/WalletPanel";

export default function WalletPage() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
                <WalletPanel />
            </div>
            <aside>
                <WalletButton />
            </aside>
        </div>
    )
}
