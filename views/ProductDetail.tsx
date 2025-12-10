import React from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Truck, 
  Package, 
  Thermometer, 
  FileText, 
  Share2, 
  Printer, 
  Download,
  AlertTriangle
} from 'lucide-react';
import { useAppContext } from '../App';
import { ShipmentStatus } from '../types';

export default function ProductDetail({ productId }: { productId: string }) {
    const { products, setView } = useAppContext();
    const product = products.find(p => p.id === productId);

    if (!product) return <div>Product not found</div>;

    return (
        <div className="space-y-6">
            <button 
                onClick={() => setView('inventory')}
                className="flex items-center text-slate-500 hover:text-slate-800 transition-colors"
            >
                <ArrowLeft size={18} className="mr-1" /> Back to Inventory
            </button>

            {/* Header */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-2xl">
                            {product.category === 'Fresh Produce' ? '🥭' : product.category === 'Seafood' ? '🦐' : '📦'}
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-700">{product.tlc}</span>
                                <span>•</span>
                                <span>{product.supplierName}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-700 font-medium">
                            <Printer size={18} /> Print
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium shadow-sm">
                            <Share2 size={18} /> Share with FDA
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Timeline - Left 2/3 */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-slate-900 mb-6">Traceability Chain</h2>
                        
                        <div className="relative pl-8 space-y-12 before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                            {product.events.map((event, index) => {
                                const Icon = 
                                    event.type === 'Harvesting' ? MapPin :
                                    event.type === 'Packing' ? Package :
                                    event.type === 'Shipping' ? Truck :
                                    event.type === 'Receiving' ? MapPin : AlertTriangle;

                                return (
                                    <div key={event.id} className="relative">
                                        {/* Node Icon */}
                                        <div className={`absolute -left-[41px] w-8 h-8 rounded-full border-4 border-white flex items-center justify-center
                                            ${event.status === 'Complete' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'}
                                        `}>
                                            <Icon size={14} />
                                        </div>

                                        <div className="bg-slate-50 rounded-lg p-5 border border-slate-100 relative group hover:border-emerald-200 transition-colors">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-bold text-slate-900">{event.type}</h3>
                                                    <p className="text-sm text-slate-500">{event.location}</p>
                                                </div>
                                                <span className="text-xs font-mono text-slate-400">{event.date}</span>
                                            </div>
                                            
                                            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                                                <div>
                                                    <span className="text-slate-500 block text-xs">Performed By</span>
                                                    <span className="font-medium text-slate-800">{event.performer}</span>
                                                </div>
                                                {event.documents.length > 0 && (
                                                    <div>
                                                        <span className="text-slate-500 block text-xs">Documents</span>
                                                        <div className="flex gap-2 mt-1">
                                                            {event.documents.map(doc => (
                                                                <span key={doc.id} className="inline-flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-xs border border-emerald-100 cursor-pointer hover:bg-emerald-100">
                                                                    <FileText size={12} className="mr-1" /> {doc.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {event.type === 'Cooling' && (
                                                <div className="mt-3 flex items-center text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit">
                                                    <Thermometer size={14} className="mr-1" /> Temp Check: 4°C (Pass)
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    
                    {/* Simulated Map Visual */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-80 relative bg-slate-100 flex items-center justify-center">
                        <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover bg-center"></div>
                        <div className="relative z-10 text-center">
                            <GlobeViz />
                            <p className="mt-4 text-sm font-medium text-slate-500">Supply Chain Geolocation Visualization</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info - Right 1/3 */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">Compliance Status</h3>
                        <div className="flex items-center justify-center mb-6 relative">
                            <div className="w-32 h-32 rounded-full border-8 border-slate-100 flex items-center justify-center relative">
                                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                                    <circle 
                                        cx="50" cy="50" r="46" 
                                        fill="none" 
                                        stroke={product.completeness >= 100 ? '#10b981' : product.completeness > 50 ? '#f59e0b' : '#ef4444'} 
                                        strokeWidth="8"
                                        strokeDasharray={`${product.completeness * 2.89} 289`}
                                    />
                                </svg>
                                <span className="text-3xl font-bold text-slate-800">{product.completeness}%</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">KDEs Captured</span>
                                <span className="font-medium">18/20</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Critical Events</span>
                                <span className="font-medium">{product.events.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">FTL Status</span>
                                <span className="font-medium text-emerald-600 bg-emerald-50 px-2 rounded">Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Document Library Mini */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                         <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">All Documents</h3>
                         <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded cursor-pointer border border-transparent hover:border-slate-200 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="bg-red-100 p-2 rounded text-red-600"><FileText size={16}/></div>
                                    <div className="text-sm">
                                        <p className="font-medium text-slate-800">Bill of Lading</p>
                                        <p className="text-xs text-slate-500">PDF • 2.4 MB</p>
                                    </div>
                                </div>
                                <Download size={16} className="text-slate-400" />
                            </div>
                            <div className="flex items-center justify-between p-2 hover:bg-slate-50 rounded cursor-pointer border border-transparent hover:border-slate-200 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 p-2 rounded text-blue-600"><FileText size={16}/></div>
                                    <div className="text-sm">
                                        <p className="font-medium text-slate-800">Commercial Invoice</p>
                                        <p className="text-xs text-slate-500">PDF • 1.1 MB</p>
                                    </div>
                                </div>
                                <Download size={16} className="text-slate-400" />
                            </div>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Simple SVG visualizer for the map placeholder
const GlobeViz = () => (
    <svg width="200" height="100" viewBox="0 0 200 100" className="mx-auto drop-shadow-lg">
        {/* Route Line */}
        <path d="M 20 50 Q 100 10 180 50" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="6 4" />
        {/* Origin */}
        <circle cx="20" cy="50" r="6" fill="#10b981" />
        <text x="20" y="70" fontSize="10" textAnchor="middle" fill="#64748b">Thailand</text>
        {/* Dest */}
        <circle cx="180" cy="50" r="6" fill="#3b82f6" />
        <text x="180" y="70" fontSize="10" textAnchor="middle" fill="#64748b">USA</text>
        {/* Ship */}
        <circle cx="100" cy="30" r="4" fill="white" stroke="#10b981" strokeWidth="2" />
    </svg>
);