
import React, { useState } from 'react';
import { Camera, Check, Upload, ChevronRight, Globe, Thermometer, Box, Truck, MapPin, Sprout } from 'lucide-react';
import { useAppContext } from '../App';

export default function SupplierPortal() {
    const { togglePortal } = useAppContext();
    const [step, setStep] = useState(0);

    const [formData, setFormData] = useState({
        product: 'Mangoes',
        quantity: '',
        harvestDate: '',
        farmName: '', // New Field
        farmLocation: '', // New Field
        isCooled: false,
        container: ''
    });

    if (step === 0) {
        return (
            <div id="portal-welcome" className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
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
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                            <strong>Note for Packers:</strong> You must enter Harvest Data on behalf of the grower to generate the initial Traceability Lot Code (TLC).
                        </div>
                        <button 
                            id="btn-portal-start"
                            onClick={() => setStep(1)}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95"
                        >
                            Submit New Shipment
                        </button>
                        <button onClick={togglePortal} className="w-full text-slate-400 text-sm">Exit Demo</button>
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
                <div className="text-sm font-medium text-slate-500">Step {step} of 6</div>
            </div>

            <div className="p-4 max-w-md mx-auto space-y-6">
                
                {/* Step 1: Product */}
                {step === 1 && (
                    <div id="portal-step-1" className="animate-in slide-in-from-right-8 duration-300">
                        <label className="block text-sm font-bold text-slate-900 mb-2">What are you shipping?</label>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {['Mangoes', 'Lychees', 'Basil', 'Durian'].map(p => (
                                <button 
                                    key={p} id={`btn-prod-${p.toLowerCase()}`}
                                    onClick={() => setFormData({...formData, product: p})}
                                    className={`p-4 rounded-xl border-2 text-center ${formData.product === p ? 'border-emerald-600 bg-emerald-50 text-emerald-800' : 'border-slate-200 bg-white'}`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
                        <label className="block text-sm font-bold text-slate-900 mb-2">Quantity (Cases)</label>
                        <input id="input-portal-qty" type="number" className="w-full p-4 rounded-xl border-slate-300 text-lg mb-6" placeholder="0" value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})} />
                        <button id="btn-portal-next-1" onClick={() => setStep(2)} disabled={!formData.quantity} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl disabled:opacity-50">Next Step</button>
                    </div>
                )}

                {/* Step 2: Harvest (Updated for Farm Info) */}
                {step === 2 && (
                    <div id="portal-step-2" className="animate-in slide-in-from-right-8 duration-300">
                        <div className="flex items-center gap-2 mb-4 text-emerald-700 font-semibold">
                            <Sprout size={20} />
                            <span>Grower / Farm Details</span>
                        </div>
                        
                        <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-4 mb-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-1">Harvest Date</label>
                                <input id="input-portal-date" type="date" className="w-full p-3 rounded-lg border-slate-300" onChange={e => setFormData({...formData, harvestDate: e.target.value})} />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-1">Farm / Grower Name</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Chiang Mai Valley Farm"
                                    className="w-full p-3 rounded-lg border-slate-300" 
                                    value={formData.farmName}
                                    onChange={e => setFormData({...formData, farmName: e.target.value})}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-slate-900 mb-1">Farm Location (GLN or Address)</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                    <input 
                                        type="text" 
                                        placeholder="Region or GPS Coords"
                                        className="w-full p-3 pl-10 rounded-lg border-slate-300" 
                                        value={formData.farmLocation}
                                        onChange={e => setFormData({...formData, farmLocation: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
                            <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2"><Thermometer size={16}/> Cooling Info</label>
                            <button id="toggle-cooling" onClick={() => setFormData(p => ({...p, isCooled: !p.isCooled}))} className={`w-full p-3 rounded-lg border flex items-center justify-between ${formData.isCooled ? 'bg-cyan-50 border-cyan-200 text-cyan-700' : 'bg-slate-50 border-slate-200'}`}>
                                <span>Hydrocooled to 10°C</span>
                                {formData.isCooled ? <Check size={18}/> : <div className="w-4 h-4 border rounded-full"/>}
                            </button>
                            <input id="input-portal-cooling" type="hidden"/>
                        </div>
                        
                        <button id="btn-portal-next-2" onClick={() => setStep(3)} disabled={!formData.harvestDate} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl disabled:opacity-50">Next Step</button>
                    </div>
                )}

                {/* Step 3: Documents */}
                {step === 3 && (
                    <div id="portal-step-3" className="animate-in slide-in-from-right-8 duration-300 text-center">
                        <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-8 mb-6 cursor-pointer hover:bg-slate-50">
                            <Camera className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                            <p className="font-medium text-slate-600">Scan Harvest Log / Ticket</p>
                        </div>
                        <button id="btn-portal-next-3" onClick={() => setStep(4)} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl">Next Step</button>
                    </div>
                )}

                {/* Step 4: Packing & Shipping */}
                {step === 4 && (
                    <div id="portal-step-4" className="animate-in slide-in-from-right-8 duration-300">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 mb-4">
                            <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2"><Box size={16}/> Packing Facility (Initial Packer)</label>
                            <div className="text-sm text-slate-600">Thai Fresh Fruits - Main Packhouse</div>
                            <div className="mt-2 bg-emerald-50 text-emerald-700 text-xs p-2 rounded border border-emerald-100 font-mono">
                                Generating TLC: TH-MG-2024-1234
                            </div>
                        </div>
                        <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6">
                            <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2"><Truck size={16}/> Shipping Container</label>
                            <input id="input-container" type="text" placeholder="e.g. ABCD-1234567" className="w-full p-2 border border-slate-300 rounded-lg uppercase font-mono" onChange={e => setFormData({...formData, container: e.target.value})} />
                        </div>
                        <button id="btn-portal-next-4" onClick={() => setStep(5)} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl">Review Summary</button>
                    </div>
                )}

                {/* Step 5: Review */}
                {step === 5 && (
                    <div id="portal-summary" className="animate-in slide-in-from-right-8 duration-300">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">Shipment Summary</h2>
                        <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden mb-6">
                            <div className="p-4 flex justify-between"><span className="text-slate-500">Product</span> <span className="font-bold">{formData.product}</span></div>
                            <div className="p-4 flex justify-between"><span className="text-slate-500">Qty</span> <span className="font-bold">{formData.quantity} Cases</span></div>
                            <div className="p-4 flex justify-between"><span className="text-slate-500">Harvest Date</span> <span className="font-bold">{formData.harvestDate}</span></div>
                            <div className="p-4 flex justify-between"><span className="text-slate-500">Grower</span> <span className="font-bold text-right">{formData.farmName || 'N/A'}</span></div>
                        </div>
                        <button id="btn-portal-submit" onClick={() => setStep(6)} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg">Submit Shipment</button>
                    </div>
                )}

                {/* Success */}
                {step === 6 && (
                    <div id="portal-success" className="animate-in zoom-in duration-300 text-center pt-10">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Check className="w-10 h-10 text-emerald-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Success!</h2>
                        <p className="text-slate-600 mb-8">Data sent to VeriPura Imports.</p>
                        <button onClick={() => setStep(0)} className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl">Done</button>
                    </div>
                )}
            </div>
        </div>
    );
}
