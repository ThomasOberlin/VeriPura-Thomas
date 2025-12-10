import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Package, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { useAppContext } from '../App';
import { ShipmentStatus } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip } from 'recharts';

const StatCard = ({ title, value, subtext, icon: Icon, trend, color }: any) => (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
            </div>
            <div className={`p-2 rounded-lg ${color}`}>
                <Icon size={20} className="text-white" />
            </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
            {trend === 'up' ? (
                <span className="text-emerald-600 flex items-center font-medium">
                    <ArrowUpRight size={16} className="mr-1" /> {subtext}
                </span>
            ) : trend === 'down' ? (
                <span className="text-red-500 flex items-center font-medium">
                    <ArrowDownRight size={16} className="mr-1" /> {subtext}
                </span>
            ) : (
                <span className="text-slate-500">{subtext}</span>
            )}
        </div>
    </div>
);

const chartData = [
  { name: 'Mon', compl: 85 },
  { name: 'Tue', compl: 88 },
  { name: 'Wed', compl: 92 },
  { name: 'Thu', compl: 90 },
  { name: 'Fri', compl: 94 },
  { name: 'Sat', compl: 96 },
  { name: 'Sun', compl: 98 },
];

export default function Dashboard() {
    const { products, alerts, setView } = useAppContext();

    const activeShipments = products.length;
    const pendingReview = products.filter(p => p.status === ShipmentStatus.INCOMPLETE).length;
    const avgCompliance = Math.round(products.reduce((acc, curr) => acc + curr.completeness, 0) / products.length) || 0;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Active Shipments" 
                    value={activeShipments} 
                    subtext="+12% from last month" 
                    icon={Package} 
                    trend="up" 
                    color="bg-blue-500" 
                />
                <StatCard 
                    title="Compliance Score" 
                    value={`${avgCompliance}%`} 
                    subtext="Target: 95%" 
                    icon={CheckCircle2} 
                    trend={avgCompliance > 90 ? 'up' : 'down'} 
                    color={avgCompliance > 90 ? 'bg-emerald-500' : 'bg-yellow-500'} 
                />
                <StatCard 
                    title="Pending Review" 
                    value={pendingReview} 
                    subtext="Requires immediate attention" 
                    icon={Clock} 
                    trend="down" 
                    color="bg-orange-500" 
                />
                <StatCard 
                    title="Critical Alerts" 
                    value={alerts.length} 
                    subtext="New notifications" 
                    icon={AlertTriangle} 
                    trend="down" 
                    color="bg-red-500" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Table */}
                <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                        <h3 className="font-semibold text-slate-800">Recent Shipments</h3>
                        <button 
                            onClick={() => setView('inventory')}
                            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                        >
                            View All
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-4">TLC / Product</th>
                                    <th className="px-6 py-4">Supplier</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {products.slice(0, 5).map((product) => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">{product.tlc}</div>
                                            <div className="text-slate-500 text-xs">{product.name}</div>
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
                                                {product.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => setView('product-detail', product.id)}
                                                className="text-slate-400 hover:text-emerald-600"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Side Widgets */}
                <div className="space-y-6">
                    {/* Compliance Trend */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="font-semibold text-slate-800 mb-4">Compliance Trend</h3>
                        <div className="h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorCompl" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <Tooltip />
                                    <Area type="monotone" dataKey="compl" stroke="#10b981" fillOpacity={1} fill="url(#colorCompl)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Quick Alerts */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                        <h3 className="font-semibold text-slate-800 mb-4">Notifications</h3>
                        <div className="space-y-4">
                            {alerts.map((alert) => (
                                <div key={alert.id} className="flex gap-3">
                                    <div className={`mt-1 min-w-[8px] h-2 rounded-full ${
                                        alert.severity === 'high' ? 'bg-red-500' : 
                                        alert.severity === 'medium' ? 'bg-orange-500' : 'bg-blue-500'
                                    }`} />
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">{alert.title}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">{alert.description}</p>
                                        <p className="text-[10px] text-slate-400 mt-1">{alert.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}