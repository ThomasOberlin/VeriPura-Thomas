import React from 'react';
import { User, Building, Bell, Lock } from 'lucide-react';

export default function Settings() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex border-b border-slate-200">
                    <button className="px-6 py-4 text-sm font-medium text-emerald-600 border-b-2 border-emerald-600">Company Profile</button>
                    <button className="px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-800">Users</button>
                    <button className="px-6 py-4 text-sm font-medium text-slate-500 hover:text-slate-800">Notifications</button>
                </div>
                
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                            <input type="text" defaultValue="VeriPura Imports Inc." className="w-full rounded-lg border-slate-300" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">FDA Registration Number</label>
                            <input type="text" defaultValue="12345678900" className="w-full rounded-lg border-slate-300" />
                        </div>
                        <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-slate-700 mb-1">Business Address</label>
                             <input type="text" defaultValue="123 Market St, Suite 400, San Francisco, CA 94105" className="w-full rounded-lg border-slate-300" />
                        </div>
                    </div>
                    
                    <div className="pt-6 border-t border-slate-100 flex justify-end">
                        <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium">Save Changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
}