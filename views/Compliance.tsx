import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useAppContext } from '../App';

export default function Compliance() {
    const { products } = useAppContext();

    const compliantCount = products.filter(p => p.completeness === 100).length;
    const partialCount = products.filter(p => p.completeness < 100 && p.completeness > 50).length;
    const criticalCount = products.filter(p => p.completeness <= 50).length;

    const pieData = [
        { name: 'Compliant', value: compliantCount, color: '#10b981' },
        { name: 'Partial', value: partialCount, color: '#f59e0b' },
        { name: 'Critical', value: criticalCount, color: '#ef4444' },
    ];

    const barData = [
        { name: 'Harvest', score: 95 },
        { name: 'Packing', score: 88 },
        { name: 'Cooling', score: 72 },
        { name: 'Shipping', score: 91 },
        { name: 'Receiving', score: 100 },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-slate-900">Compliance Analytics</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-slate-800 mb-4">Overall Shipment Health</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={pieData} 
                                    innerRadius={60} 
                                    outerRadius={80} 
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-6 mt-4">
                        {pieData.map(d => (
                            <div key={d.name} className="flex items-center gap-2 text-sm">
                                <div className="w-3 h-3 rounded-full" style={{backgroundColor: d.color}}></div>
                                <span>{d.name} ({d.value})</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-slate-800 mb-4">Data Completeness by CTE</h3>
                    <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} />
                                <YAxis dataKey="name" type="category" width={80} />
                                <Tooltip />
                                <Bar dataKey="score" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}