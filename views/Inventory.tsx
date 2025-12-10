import React, { useState } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronRight, AlertCircle } from 'lucide-react';
import { useAppContext } from '../App';
import { ShipmentStatus } from '../types';

export default function Inventory() {
    const { products, setView } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              p.tlc.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              p.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || p.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-slate-900">Product Inventory</h1>
                <button 
                    onClick={() => setView('receiving')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm"
                >
                    + Log New Receipt
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input 
                        type="text"
                        placeholder="Search by TLC, Product, or Supplier..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-4">
                    <select 
                        className="rounded-lg border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="All">All Statuses</option>
                        <option value={ShipmentStatus.COMPLIANT}>Compliant</option>
                        <option value={ShipmentStatus.PENDING}>Pending</option>
                        <option value={ShipmentStatus.INCOMPLETE}>Incomplete</option>
                    </select>
                    <button className="flex items-center px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-medium">
                        <Filter size={18} className="mr-2" /> More Filters
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4">TLC</th>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Supplier</th>
                                <th className="px-6 py-4">Rec. Date</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Completeness</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => setView('product-detail', product.id)}>
                                    <td className="px-6 py-4 font-mono text-slate-600">{product.tlc}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{product.name}</div>
                                        <div className="text-slate-500 text-xs">{product.category}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{product.supplierName}</td>
                                    <td className="px-6 py-4 text-slate-600">{new Date(product.receivedDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                                ${product.status === ShipmentStatus.COMPLIANT 
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                                    : product.status === ShipmentStatus.INCOMPLETE
                                                    ? 'bg-red-50 text-red-700 border-red-200'
                                                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                }`}>
                                                {product.status === ShipmentStatus.INCOMPLETE && <AlertCircle size={12} className="mr-1" />}
                                                {product.status}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full ${product.completeness === 100 ? 'bg-emerald-500' : product.completeness > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                    style={{ width: `${product.completeness}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs font-medium text-slate-600">{product.completeness}%</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <ChevronRight size={20} className="text-slate-400 group-hover:text-emerald-600 ml-auto" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredProducts.length === 0 && (
                    <div className="p-12 text-center text-slate-500">
                        No products found matching your criteria.
                    </div>
                )}
            </div>
        </div>
    );
}