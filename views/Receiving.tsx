
import React, { useState } from 'react';
import { Upload, X, FileText, CheckCircle2, AlertCircle, ChevronDown, MapPin, Thermometer, Anchor, Calendar, Ship } from 'lucide-react';
import { useAppContext } from '../App';
import { ProductType, ShipmentStatus } from '../types';

export default function Receiving() {
    const { suppliers, addProduct, setView } = useAppContext();
    const [step, setStep] = useState(1);
    const [showUpstreamModal, setShowUpstreamModal] = useState(false);
    const [formData, setFormData] = useState({
        supplierId: '',
        productName: '',
        category: ProductType.PRODUCE,
        quantity: '',
        uom: 'Cases',
        receivedDate: new Date().toISOString().split('T')[0],
        tlc: `TLC-${Math.floor(Math.random() * 10000)}`,
        // Seafood Specifics
        vesselName: '',
        faoZone: '',
        harvestDateStart: '',
        harvestDateEnd: '',
        files: [] as File[]
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFormData(prev => ({
                ...prev,
                files: [...prev.files, ...Array.from(e.target.files || [])]
            }));
        }
    };

    const removeFile = (index: number) => {
        setFormData(prev => ({
            ...prev,
            files: prev.files.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const supplier = suppliers.find(s => s.id === formData.supplierId);
        
        const kdeData: any = {};
        if (formData.category === ProductType.SEAFOOD) {
            kdeData["Vessel Name"] = formData.vesselName;
            kdeData["Harvest Date Range"] = `${formData.harvestDateStart} to ${formData.harvestDateEnd}`;
            kdeData["FAO Zone"] = formData.faoZone;
            kdeData["First Land-Based Receiver"] = supplier?.name;
        }

        addProduct({
            id: `PROD-${Date.now()}`,
            tlc: formData.tlc,
            name: formData.productName,
            category: formData.category,
            supplierId: formData.supplierId,
            supplierName: supplier?.name || 'Unknown',
            receivedDate: formData.receivedDate,
            quantity: Number(formData.quantity),
            uom: formData.uom,
            isFTL: true,
            completeness: 100,
            status: ShipmentStatus.COMPLIANT,
            events: [
                {
                    id: `evt-rec-${Date.now()}`,
                    type: 'Receiving',
                    date: formData.receivedDate,
                    location: 'VeriPura Distribution Center',
                    performer: 'VeriPura Imports',
                    documents: [],
                    status: 'Complete',
                    details: formData.category === ProductType.SEAFOOD ? `Received from vessel ${formData.vesselName}` : 'Standard receipt',
                    kdeData: {
                        tlcAssigned: formData.category === ProductType.SEAFOOD ? formData.tlc : undefined, // Importer acts as FLBR if direct from vessel
                        ...kdeData
                    }
                }
            ],
        });
        
        setStep(3);
    };

    return (
        <div className="max-w-4xl mx-auto relative" id="receiving-view">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900">Log New Receipt</h1>
                <p className="text-slate-500">Enter details for incoming shipment. Form adapts to product category requirements.</p>
            </div>

            {/* Progress */}
            <div className="flex items-center mb-8">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'} font-bold text-sm`}>1</div>
                <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'} font-bold text-sm`}>2</div>
                <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-emerald-600' : 'bg-slate-200'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'} font-bold text-sm`}>3</div>
            </div>

            {step === 1 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 animate-in fade-in slide-in-from-right-4">
                    <h2 className="text-lg font-semibold mb-6">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Received Date *</label>
                            <input 
                                id="input-date"
                                type="date" 
                                className="w-full rounded-lg border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                                value={formData.receivedDate}
                                onChange={e => setFormData({...formData, receivedDate: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Supplier *</label>
                            <select 
                                id="input-supplier"
                                className="w-full rounded-lg border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                                value={formData.supplierId}
                                onChange={e => setFormData({...formData, supplierId: e.target.value})}
                            >
                                <option value="">Select Supplier</option>
                                {suppliers.map(s => (
                                    <option key={s.id} value={s.id}>{s.name} ({s.country})</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Product Category Selection */}
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Product Category *</label>
                            <select 
                                id="input-category"
                                className="w-full rounded-lg border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                                value={formData.category}
                                onChange={e => setFormData({...formData, category: e.target.value as ProductType})}
                            >
                                {Object.values(ProductType).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Product Name *</label>
                            <input 
                                id="input-product"
                                type="text" 
                                className="w-full rounded-lg border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                                placeholder="e.g. Frozen Shrimp"
                                value={formData.productName}
                                onChange={e => setFormData({...formData, productName: e.target.value})}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Quantity *</label>
                                <input 
                                    id="input-qty"
                                    type="number" 
                                    className="w-full rounded-lg border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                                    value={formData.quantity}
                                    onChange={e => setFormData({...formData, quantity: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Unit</label>
                                <select 
                                    id="input-uom"
                                    className="w-full rounded-lg border-slate-300 focus:ring-emerald-500 focus:border-emerald-500"
                                    value={formData.uom}
                                    onChange={e => setFormData({...formData, uom: e.target.value})}
                                >
                                    <option>Cases</option>
                                    <option>kg</option>
                                    <option>lbs</option>
                                    <option>Pallets</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* SEAFOOD SPECIFIC FIELDS */}
                    {formData.category === ProductType.SEAFOOD && (
                        <div id="section-seafood" className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 animate-in fade-in">
                            <div className="flex items-center gap-2 mb-4 text-blue-800">
                                <Anchor size={20} />
                                <h3 className="font-bold">First Land-Based Receiver Data</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-blue-900 mb-1">Vessel Name / ID</label>
                                    <div className="relative">
                                        <Ship size={16} className="absolute left-3 top-3 text-blue-400" />
                                        <input 
                                            id="input-vessel"
                                            type="text"
                                            placeholder="e.g. Ocean Spirit II" 
                                            className="w-full pl-9 rounded-lg border-blue-200 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.vesselName}
                                            onChange={e => setFormData({...formData, vesselName: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-blue-900 mb-1">FAO Zone / Harvest Location</label>
                                    <div className="relative">
                                        <MapPin size={16} className="absolute left-3 top-3 text-blue-400" />
                                        <input 
                                            id="input-fao"
                                            type="text"
                                            placeholder="e.g. FAO Zone 71" 
                                            className="w-full pl-9 rounded-lg border-blue-200 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.faoZone}
                                            onChange={e => setFormData({...formData, faoZone: e.target.value})}
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-blue-900 mb-1">Harvest Start Date</label>
                                        <input 
                                            id="input-harvest-start"
                                            type="date"
                                            className="w-full rounded-lg border-blue-200 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.harvestDateStart}
                                            onChange={e => setFormData({...formData, harvestDateStart: e.target.value})}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-blue-900 mb-1">Harvest End Date</label>
                                        <input 
                                            id="input-harvest-end"
                                            type="date"
                                            className="w-full rounded-lg border-blue-200 focus:ring-blue-500 focus:border-blue-500"
                                            value={formData.harvestDateEnd}
                                            onChange={e => setFormData({...formData, harvestDateEnd: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex justify-end">
                        <button 
                            id="btn-step-2"
                            onClick={() => setStep(2)}
                            disabled={!formData.supplierId || !formData.productName}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 animate-in fade-in slide-in-from-right-4 relative">
                    <h2 className="text-lg font-semibold mb-6">Traceability & Documents</h2>
                    
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Traceability Lot Code (TLC) *</label>
                        <div className="flex gap-2">
                            <input 
                                id="input-tlc"
                                type="text" 
                                className="flex-1 rounded-lg border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 font-mono"
                                value={formData.tlc}
                                onChange={e => setFormData({...formData, tlc: e.target.value})}
                            />
                            <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-200">
                                Auto-Gen
                            </button>
                        </div>
                        
                        <div className="mt-2 flex items-center justify-between">
                            <p className="text-xs text-slate-500">Must match the TLC assigned by the packing facility.</p>
                            
                            {/* DEMO STEP: Upstream Data Link */}
                            <button 
                                id="link-upstream-data"
                                onClick={() => setShowUpstreamModal(true)}
                                className="text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center"
                            >
                                <CheckCircle2 size={14} className="mr-1" /> View Upstream Data
                            </button>
                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Upload Required Documents</label>
                        <div id="dropzone-docs" className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors relative">
                            <input 
                                type="file" 
                                multiple
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                            />
                            <Upload className="mx-auto h-10 w-10 text-slate-400 mb-3" />
                            <p className="text-sm text-slate-600 font-medium">Click to upload or drag and drop</p>
                            <p className="text-xs text-slate-400 mt-1">BOL, Commercial Invoice, Certificates</p>
                        </div>
                    </div>

                    {formData.files.length > 0 && (
                        <div className="mb-8 space-y-2">
                            {formData.files.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                                    <div className="flex items-center space-x-3">
                                        <FileText className="text-slate-400" size={18} />
                                        <span className="text-sm font-medium text-slate-700">{file.name}</span>
                                        <span className="text-xs text-slate-400">({(file.size / 1024).toFixed(0)} KB)</span>
                                    </div>
                                    <button onClick={() => removeFile(idx)} className="text-slate-400 hover:text-red-500">
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* DEMO STEP: Completeness Meter */}
                    <div id="meter-completeness" className="mb-8 bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-center gap-4">
                        <div className="flex-1">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium text-slate-700">Data Completeness</span>
                                <span className="font-bold text-emerald-600">100%</span>
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div className="bg-emerald-500 h-2 rounded-full w-full"></div>
                            </div>
                        </div>
                        <div className="bg-white px-3 py-1 rounded border border-slate-200 text-xs font-mono text-slate-500">
                            ALL KDEs PRESENT
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
                            id="btn-submit-receipt"
                            onClick={handleSubmit}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium shadow-sm"
                        >
                            Submit Receipt
                        </button>
                    </div>

                    {/* Upstream Data Modal (Simulated) */}
                    {showUpstreamModal && (
                        <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex items-center justify-center p-4 rounded-xl">
                            <div className="bg-white w-full max-w-md border border-slate-200 shadow-xl rounded-lg overflow-hidden animate-in zoom-in-95">
                                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800">Upstream Traceability Data</h3>
                                    <button onClick={() => setShowUpstreamModal(false)} id="btn-close-upstream" className="text-slate-400 hover:text-slate-600">
                                        <X size={18} />
                                    </button>
                                </div>
                                <div className="p-4 space-y-4">
                                    {formData.category === ProductType.SEAFOOD ? (
                                        <>
                                             <div className="flex gap-3">
                                                <div className="mt-0.5 bg-blue-100 p-1.5 rounded text-blue-600"><Ship size={16}/></div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase">Harvest Vessel</p>
                                                    <p className="text-sm font-medium text-slate-900">{formData.vesselName || 'Ocean Spirit II'}</p>
                                                    <p className="text-xs text-slate-500">Landing Date: Dec 01, 2023</p>
                                                </div>
                                            </div>
                                            <div className="bg-green-50 p-3 rounded text-xs text-green-700 border border-green-100">
                                                ✓ Validated against Landing Receipt
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex gap-3">
                                                <div className="mt-0.5 bg-blue-100 p-1.5 rounded text-blue-600"><MapPin size={16}/></div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase">Harvest</p>
                                                    <p className="text-sm font-medium text-slate-900">Chiang Mai Valley Farm</p>
                                                    <p className="text-xs text-slate-500">Dec 01, 2023</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="mt-0.5 bg-cyan-100 p-1.5 rounded text-cyan-600"><Thermometer size={16}/></div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-500 uppercase">Cooling</p>
                                                    <p className="text-sm font-medium text-slate-900">Hydrocooling to 10°C</p>
                                                    <p className="text-xs text-slate-500">Dec 02, 2023</p>
                                                </div>
                                            </div>
                                            <div className="bg-green-50 p-3 rounded text-xs text-green-700 border border-green-100">
                                                ✓ Validated against Supplier Uploads
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {step === 3 && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-12 text-center animate-in fade-in zoom-in">
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="text-emerald-600" size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Receiving Logged Successfully</h2>
                    <p className="text-slate-600 mb-8">
                        The shipment has been added to inventory. Traceability data is being linked from the supplier portal.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button 
                            onClick={() => setView('inventory')}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium"
                        >
                            View Inventory
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
