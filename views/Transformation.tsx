
import React, { useState } from 'react';
import { ArrowRight, Package, Scale, Plus, Trash2, CheckCircle2, Factory, AlertCircle } from 'lucide-react';
import { useAppContext } from '../App';
import { ProductType, ShipmentStatus } from '../types';

export default function Transformation() {
    const { products, addProduct, setView } = useAppContext();
    const [step, setStep] = useState(1);
    
    // Mock Inventory for Ingredients (Available Raw Materials)
    const rawMaterials = products.filter(p => p.category === ProductType.PRODUCE || p.category === ProductType.SEAFOOD || p.category === ProductType.SPICES);

    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        outputProduct: 'Thai Red Curry Paste (Jar)',
        outputQty: '',
        outputUom: 'Cases',
        outputTlc: `CP-2024-${Math.floor(Math.random() * 10000)}`,
        selectedIngredients: [] as string[]
    });

    const toggleIngredient = (id: string) => {
        setFormData(prev => ({
            ...prev,
            selectedIngredients: prev.selectedIngredients.includes(id) 
                ? prev.selectedIngredients.filter(i => i !== id)
                : [...prev.selectedIngredients, id]
        }));
    };

    const handleSubmit = () => {
        // Create the finished good
        const newProduct = {
            id: `PROD-${Date.now()}`,
            tlc: formData.outputTlc,
            name: formData.outputProduct,
            category: ProductType.PACKAGED,
            supplierId: 'SELF', // Internal production
            supplierName: 'VeriPura Processing Facility',
            receivedDate: formData.date,
            quantity: Number(formData.outputQty),
            uom: formData.outputUom,
            isFTL: true,
            ftlCategory: 'Processed Food (Multi-Ingredient)',
            completeness: 100,
            status: ShipmentStatus.COMPLIANT,
            events: [
                {
                    id: `evt-trans-${Date.now()}`,
                    type: 'Transformation' as const,
                    date: formData.date,
                    location: 'Bangkok Processing Center',
                    performer: 'Production Line A',
                    documents: [],
                    status: 'Complete' as const,
                    details: 'Cooking, Blending, Paste generation',
                    kdeData: {
                        tlcAssigned: formData.outputTlc,
                        "Input TLCs": formData.selectedIngredients.map(id => {
                            const p = products.find(prod => prod.id === id);
                            return `${p?.name} (${p?.tlc})`;
                        }),
                        "Transformation Location": "Bangkok Processing Center"
                    }
                }
            ]
        };

        addProduct(newProduct);
        setStep(3);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="bg-purple-100 p-2 rounded-lg text-purple-700">
                        <Factory size={24} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Log Transformation Event</h1>
                </div>
                <p className="text-slate-500 max-w-2xl">
                    Record the production of a new FTL product from ingredients. 
                    FSMA 204 requires linking <strong>Input Traceability Lot Codes</strong> to the new <strong>Output Traceability Lot Code</strong>.
                </p>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center mb-8 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-purple-700 font-bold' : 'text-slate-400'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 1 ? 'bg-purple-100' : 'bg-slate-100'}`}>1</div>
                    Select Inputs
                </div>
                <div className="w-8 h-px bg-slate-300 mx-4"></div>
                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-purple-700 font-bold' : 'text-slate-400'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 2 ? 'bg-purple-100' : 'bg-slate-100'}`}>2</div>
                    Define Output
                </div>
                <div className="w-8 h-px bg-slate-300 mx-4"></div>
                <div className={`flex items-center gap-2 ${step >= 3 ? 'text-purple-700 font-bold' : 'text-slate-400'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step >= 3 ? 'bg-purple-100' : 'bg-slate-100'}`}>3</div>
                    Complete
                </div>
            </div>

            {step === 1 && (
                <div id="step-inputs" className="animate-in fade-in slide-in-from-right-4">
                    <h2 className="text-lg font-bold text-slate-800 mb-4">Select Ingredients (Inputs)</h2>
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 w-10">Select</th>
                                        <th className="px-6 py-4">Ingredient (Product)</th>
                                        <th className="px-6 py-4">Input TLC</th>
                                        <th className="px-6 py-4">Available Qty</th>
                                        <th className="px-6 py-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {rawMaterials.map(item => (
                                        <tr 
                                            key={item.id} 
                                            id={`row-${item.id}`}
                                            onClick={() => toggleIngredient(item.id)}
                                            className={`cursor-pointer transition-colors ${formData.selectedIngredients.includes(item.id) ? 'bg-purple-50' : 'hover:bg-slate-50'}`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center ${formData.selectedIngredients.includes(item.id) ? 'bg-purple-600 border-purple-600' : 'border-slate-300 bg-white'}`}>
                                                    {formData.selectedIngredients.includes(item.id) && <CheckCircle2 size={14} className="text-white" />}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900">{item.name}</td>
                                            <td className="px-6 py-4 font-mono text-slate-600">{item.tlc}</td>
                                            <td className="px-6 py-4">{item.quantity} {item.uom}</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                                                    Available
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {rawMaterials.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                                No raw materials found in inventory.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                        <button 
                            id="btn-next-to-output"
                            onClick={() => setStep(2)}
                            disabled={formData.selectedIngredients.length === 0}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            Next Step <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div id="step-output" className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4">
                    {/* Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
                            <h2 className="text-lg font-bold text-slate-800 mb-6">Define Output Product</h2>
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Production Date</label>
                                    <input 
                                        type="date" 
                                        className="w-full rounded-lg border-slate-300 focus:ring-purple-500 focus:border-purple-500"
                                        value={formData.date}
                                        onChange={e => setFormData({...formData, date: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Product Description</label>
                                    <input 
                                        type="text" 
                                        className="w-full rounded-lg border-slate-300 focus:ring-purple-500 focus:border-purple-500 font-medium"
                                        value={formData.outputProduct}
                                        onChange={e => setFormData({...formData, outputProduct: e.target.value})}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Quantity Produced</label>
                                        <input 
                                            id="input-out-qty"
                                            type="number" 
                                            className="w-full rounded-lg border-slate-300 focus:ring-purple-500 focus:border-purple-500"
                                            value={formData.outputQty}
                                            onChange={e => setFormData({...formData, outputQty: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Unit of Measure</label>
                                        <select 
                                            className="w-full rounded-lg border-slate-300 focus:ring-purple-500 focus:border-purple-500"
                                            value={formData.outputUom}
                                            onChange={e => setFormData({...formData, outputUom: e.target.value})}
                                        >
                                            <option>Cases</option>
                                            <option>Pallets</option>
                                            <option>Jars</option>
                                            <option>kg</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                                    <label className="block text-xs font-bold text-purple-700 uppercase mb-1">New Traceability Lot Code (Output TLC)</label>
                                    <div className="flex items-center justify-between">
                                        <span className="font-mono text-xl font-bold text-slate-900">{formData.outputTlc}</span>
                                        <span className="text-xs bg-white px-2 py-1 rounded text-purple-600 border border-purple-200">Auto-Generated</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <button 
                                onClick={() => setStep(1)}
                                className="text-slate-600 hover:text-slate-900 font-medium px-4"
                            >
                                Back
                            </button>
                            <button 
                                id="btn-submit-transform"
                                onClick={handleSubmit}
                                disabled={!formData.outputQty}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold shadow-lg shadow-purple-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Log Production
                            </button>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="space-y-6">
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <Scale size={18} className="text-slate-500" /> Selected Inputs
                            </h3>
                            <div className="space-y-3">
                                {formData.selectedIngredients.map(id => {
                                    const p = products.find(prod => prod.id === id);
                                    if (!p) return null;
                                    return (
                                        <div key={id} className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm text-sm">
                                            <div className="font-medium text-slate-900">{p.name}</div>
                                            <div className="text-xs text-slate-500 font-mono mt-1">TLC: {p.tlc}</div>
                                        </div>
                                    )
                                })}
                            </div>
                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <div className="flex items-start gap-2 text-xs text-amber-700 bg-amber-50 p-2 rounded">
                                    <AlertCircle size={14} className="mt-0.5 shrink-0" />
                                    FSMA 204 requires you to maintain records linking these Input TLCs to the Output TLC.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center animate-in fade-in zoom-in">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-purple-600" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Transformation Recorded</h2>
                    <p className="text-slate-600 mb-8 max-w-lg mx-auto">
                        Output Lot <strong>{formData.outputTlc}</strong> has been created and linked to {formData.selectedIngredients.length} ingredient lots. Inventory updated.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button 
                            onClick={() => setView('inventory')}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium"
                        >
                            View Inventory
                        </button>
                         <button 
                            onClick={() => {
                                setStep(1);
                                setFormData(prev => ({...prev, outputTlc: `CP-2024-${Math.floor(Math.random() * 10000)}`, selectedIngredients: []}));
                            }}
                            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2 rounded-lg font-medium"
                        >
                            Record Another
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
