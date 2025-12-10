import React from 'react';
import { FileText, Download, Filter, Search } from 'lucide-react';
import { useAppContext } from '../App';

export default function Reports() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">FDA Report Generator</h1>
            <p className="text-slate-500">Generate FSMA 204 compliant traceability spreadsheets for FDA requests.</p>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="font-bold text-slate-800 mb-4">Report Configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Traceability Lot Code(s)</label>
                         <input type="text" placeholder="Enter TLC..." className="w-full rounded-lg border-slate-300" />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Date Range</label>
                         <input type="date" className="w-full rounded-lg border-slate-300" />
                    </div>
                    <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Format</label>
                         <select className="w-full rounded-lg border-slate-300">
                             <option>FDA Sortable Spreadsheet (CSV)</option>
                             <option>PDF Summary</option>
                             <option>JSON Data Package</option>
                         </select>
                    </div>
                </div>
                
                <div className="flex items-center gap-6 mb-8">
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" defaultChecked />
                        <span className="text-sm text-slate-700">Include Linked Documents</span>
                    </label>
                    <label className="flex items-center gap-2">
                        <input type="checkbox" className="rounded text-emerald-600 focus:ring-emerald-500" defaultChecked />
                        <span className="text-sm text-slate-700">Include Supplier Profiles</span>
                    </label>
                </div>

                <div className="flex justify-end">
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm flex items-center gap-2">
                        <FileText size={18} /> Generate Report
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 bg-slate-50 font-medium text-sm text-slate-500">
                    Previous Reports
                </div>
                <div className="divide-y divide-slate-100">
                    {[1,2,3].map(i => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-100 text-blue-700 p-2 rounded">
                                    <FileText size={18} />
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">FDA_Request_Oct2023_{i}.csv</p>
                                    <p className="text-xs text-slate-500">Generated on Oct {20-i}, 2023 by Sarah Jenkins</p>
                                </div>
                            </div>
                            <button className="text-slate-400 hover:text-emerald-600">
                                <Download size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}