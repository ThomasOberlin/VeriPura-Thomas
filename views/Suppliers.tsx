import React from 'react';
import { MapPin, Mail, Phone, ExternalLink, MoreHorizontal, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useAppContext } from '../App';
import { SupplierStatus } from '../types';

export default function Suppliers() {
    const { suppliers } = useAppContext();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Supplier Management</h1>
                <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm">
                    Invite Supplier
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suppliers.map(supplier => (
                    <div key={supplier.id} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow relative">
                        <div className="absolute top-6 right-6">
                             <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                                ${supplier.status === SupplierStatus.VERIFIED
                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                    : supplier.status === SupplierStatus.ACTION_REQUIRED
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                }`}>
                                {supplier.status === SupplierStatus.VERIFIED ? <ShieldCheck size={12} className="mr-1"/> : null}
                                {supplier.status}
                            </span>
                        </div>

                        <div className="mb-4">
                            <h3 className="text-lg font-bold text-slate-900">{supplier.name}</h3>
                            <div className="flex items-center text-slate-500 text-sm mt-1">
                                <MapPin size={14} className="mr-1" />
                                {supplier.country}
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex items-center text-sm text-slate-600">
                                <Mail size={16} className="mr-3 text-slate-400" />
                                {supplier.email}
                            </div>
                            <div className="flex items-center text-sm text-slate-600">
                                <Phone size={16} className="mr-3 text-slate-400" />
                                {supplier.phone}
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-medium text-slate-500 uppercase">Compliance Score</span>
                                <span className={`text-sm font-bold ${supplier.complianceScore >= 90 ? 'text-emerald-600' : 'text-yellow-600'}`}>
                                    {supplier.complianceScore}%
                                </span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-4">
                                <div 
                                    className={`h-full rounded-full ${supplier.complianceScore >= 90 ? 'bg-emerald-500' : 'bg-yellow-500'}`}
                                    style={{ width: `${supplier.complianceScore}%` }}
                                ></div>
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200 transition-colors">
                                    View Profile
                                </button>
                                <button className="flex-1 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200 transition-colors">
                                    Documents
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}