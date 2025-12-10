import React, { useState } from 'react';
import { Camera, Check, Upload, ChevronRight, Globe, LogOut } from 'lucide-react';
import { useAppContext } from '../App';

export default function SupplierPortal() {
    const { togglePortal } = useAppContext();
    const [step, setStep] = useState(0);

    // Simplified state for demo
    const [formData, setFormData] = useState({
        product: 'Mangoes',
        quantity: '',
        harvestDate: ''
    });

    if (step === 0) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-emerald-600 p-8 text-center text-white">
                        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                            <Globe size={32} />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">TraceIT by VeriPura</h1>
                        <p className="opacity-90">Supplier Portal Access</p>
                        <p className="text-sm mt-2 font-medium bg-emerald-700/50 py-1 px-3 rounded-full inline-block">Welcome, Thai Mango Co.</p>
                    </div>
                    <div className="p-8 space-y-6">
                        <div className="space-y-4">
                            <button className="w-full flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                                <span className="flex items-center gap-3">🇺🇸 English</span>
                                <Check size={20} className="text-emerald-600" />
                            </button>
                            <button className="w-full flex items-center justify-between p-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors opacity-60">
                                <span className="flex items-center gap-3">🇹🇭 Thai (ภาษาไทย)</span>
                            </button>
                        </div>
                        <button 
                            onClick={() => setStep(1)}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95"
                        >
                            Submit New Shipment
                        </button>
                        <button 
                            onClick={togglePortal}
                            className="w-full py-3 text-slate-500 font-medium text-sm hover:text-slate-800"
                        >
                            Exit Demo Mode
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Mobile Header */}
            <div className="bg-white p-4 shadow-sm flex items-center justify-between sticky top-0 z-10">
                <div className="font-bold text-slate-900">New Shipment</div>
                <div className="text-sm font-medium text-slate-500">Step {step} of 3</div>
            </div>

            <div className="p-4 max-w-md mx-auto space-y-6">
                
                {step === 1 && (
                    <div className="animate-in slide-in-from-right-8 duration-300">
                        <label className="block text-sm font-bold text-slate-900 mb-2">What are you shipping?</label>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {['Mangoes', 'Lychees', 'Basil', 'Durian'].map(p => (
                                <button 
                                    key={p}
                                    onClick={() => setFormData({...formData, product: p})}
                                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                                        formData.product === p 
                                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800 font-bold' 
                                        : 'border-slate-200 bg-white text-slate-600'
                                    }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>

                        <label className="block text-sm font-bold text-slate-900 mb-2">Quantity (Cases)</label>
                        <input 
                            type="number" 
                            className="w-full p-4 rounded-xl border-slate-300 text-lg mb-6"
                            placeholder="0"
                            value={formData.quantity}
                            onChange={e => setFormData({...formData, quantity: e.target.value})}
                        />

                        <button 
                            onClick={() => setStep(2)}
                            disabled={!formData.quantity}
                            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl disabled:opacity-50"
                        >
                            Next Step
                        </button>
                    </div>
                )}

                {step === 2 && (
                    <div className="animate-in slide-in-from-right-8 duration-300">
                        <label className="block text-sm font-bold text-slate-900 mb-2">Harvest Date</label>
                        <input 
                            type="date" 
                            className="w-full p-4 rounded-xl border-slate-300 text-lg mb-6 bg-white"
                            onChange={e => setFormData({...formData, harvestDate: e.target.value})}
                        />

                        <label className="block text-sm font-bold text-slate-900 mb-2">Field Location</label>
                        <select className="w-full p-4 rounded-xl border-slate-300 text-lg mb-6 bg-white">
                            <option>Farm A - North Sector</option>
                            <option>Farm B - River Side</option>
                        </select>

                        <button 
                            onClick={() => setStep(3)}
                            disabled={!formData.harvestDate}
                            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl disabled:opacity-50"
                        >
                            Next Step
                        </button>
                         <button onClick={() => setStep(1)} className="w-full py-4 text-slate-500 font-medium">Back</button>
                    </div>
                )}

                {step === 3 && (
                    <div className="animate-in slide-in-from-right-8 duration-300 text-center">
                        <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-8 mb-6">
                            <Camera className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                            <p className="font-medium text-slate-600">Take Photo of Harvest Log</p>
                        </div>

                        <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-8 mb-8">
                            <Upload className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                            <p className="font-medium text-slate-600">Upload Phytosanitary Cert</p>
                        </div>

                        <button 
                            onClick={() => setStep(4)}
                            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl"
                        >
                            Submit Shipment
                        </button>
                         <button onClick={() => setStep(2)} className="w-full py-4 text-slate-500 font-medium">Back</button>
                    </div>
                )}

                {step === 4 && (
                     <div className="animate-in zoom-in duration-300 text-center pt-10">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Success!</h2>
                        <p className="text-slate-600 mb-8">Shipment data sent to VeriPura Imports.</p>
                        <button 
                            onClick={() => setStep(0)}
                            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl"
                        >
                            Done
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}