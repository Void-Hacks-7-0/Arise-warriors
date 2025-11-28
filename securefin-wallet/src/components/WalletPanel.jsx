import React from "react";

export default function WalletPanel() {
    const mockTransactions = [
        { id: "0x123...abc", date: "2023-10-25 14:30", type: "Publish", status: "Confirmed" },
        { id: "0x456...def", date: "2023-10-24 09:15", type: "Publish", status: "Confirmed" },
        { id: "0x789...ghi", date: "2023-10-23 18:45", type: "Publish", status: "Pending" },
    ];

    return (
        <div className="card h-full flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h2 className="font-semibold text-lg text-slate-900">Transaction History</h2>
                <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">Testnet</span>
            </div>

            <div className="p-6 flex-1">
                {mockTransactions.length > 0 ? (
                    <div className="overflow-hidden rounded-lg border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tx Hash</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Type</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-200">
                                {mockTransactions.map((tx, idx) => (
                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-indigo-600 cursor-pointer hover:underline">{tx.id}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{tx.date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">{tx.type}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${tx.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <h3 className="text-sm font-medium text-slate-900">No transactions yet</h3>
                        <p className="mt-1 text-sm text-slate-500">Publish a hash to see it appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
