import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  LayoutDashboard, 
  PackageCheck, 
  Boxes, 
  Users, 
  FileText, 
  Settings, 
  Activity, 
  Globe, 
  LogOut, 
  Bell, 
  Menu,
  X,
  User,
  HelpCircle,
  Plus
} from 'lucide-react';

import { MOCK_ALERTS, MOCK_PRODUCTS, MOCK_SUPPLIERS } from './services/mockData';
import { AppState, Product, Supplier } from './types';

// Views
import Dashboard from './views/Dashboard';
import Inventory from './views/Inventory';
import Receiving from './views/Receiving';
import Suppliers from './views/Suppliers';
import Reports from './views/Reports';
import Compliance from './views/Compliance';
import SettingsView from './views/Settings';
import SupplierPortal from './views/SupplierPortal';
import ProductDetail from './views/ProductDetail';

// Context
interface AppContextType extends AppState {
    addProduct: (p: Product) => void;
    currentView: string;
    setView: (view: string, params?: any) => void;
    viewParams: any;
    togglePortal: () => void;
    isPortalMode: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext must be used within AppProvider");
    return context;
};

export default function App() {
    const [state, setState] = useState<AppState>({
        suppliers: [],
        products: [],
        alerts: [],
        currentUser: { name: 'Sarah Jenkins', role: 'Admin', company: 'VeriPura Imports Inc.' }
    });

    const [currentView, setCurrentView] = useState('dashboard');
    const [viewParams, setViewParams] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isPortalMode, setIsPortalMode] = useState(false);
    const [showTour, setShowTour] = useState(true);

    useEffect(() => {
        // Initialize Mock Data
        setState(prev => ({
            ...prev,
            suppliers: MOCK_SUPPLIERS,
            products: MOCK_PRODUCTS,
            alerts: MOCK_ALERTS as any
        }));
    }, []);

    const addProduct = (product: Product) => {
        setState(prev => ({
            ...prev,
            products: [product, ...prev.products]
        }));
    };

    const handleSetView = (view: string, params: any = null) => {
        setCurrentView(view);
        setViewParams(params);
        setIsMobileMenuOpen(false);
    };

    const togglePortal = () => {
        setIsPortalMode(!isPortalMode);
        setCurrentView(isPortalMode ? 'dashboard' : 'portal-welcome');
    };

    // --- RENDER HELPERS ---

    const renderView = () => {
        if (isPortalMode) {
            return <SupplierPortal />;
        }

        switch (currentView) {
            case 'dashboard': return <Dashboard />;
            case 'receiving': return <Receiving />;
            case 'inventory': return <Inventory />;
            case 'product-detail': return <ProductDetail productId={viewParams} />;
            case 'suppliers': return <Suppliers />;
            case 'reports': return <Reports />;
            case 'compliance': return <Compliance />;
            case 'settings': return <SettingsView />;
            default: return <Dashboard />;
        }
    };

    const NavItem = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
        <button
            onClick={() => handleSetView(id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === id 
                ? 'bg-emerald-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </button>
    );

    if (isPortalMode) {
        return (
            <AppContext.Provider value={{ ...state, addProduct, currentView, setView: handleSetView, viewParams, togglePortal, isPortalMode }}>
                <SupplierPortal />
            </AppContext.Provider>
        );
    }

    return (
        <AppContext.Provider value={{ ...state, addProduct, currentView, setView: handleSetView, viewParams, togglePortal, isPortalMode }}>
            <div className="flex h-screen bg-slate-50 overflow-hidden">
                {/* Sidebar - Desktop */}
                <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-full shadow-xl z-20">
                    <div className="p-6 flex flex-col space-y-1 border-b border-slate-800">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                                <Activity className="text-white" size={20} />
                            </div>
                            <span className="text-xl font-bold tracking-tight">TraceIT</span>
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest pl-10">by VeriPura</div>
                    </div>

                    <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                        <div className="px-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Operations</div>
                        <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
                        <NavItem id="receiving" label="Receiving" icon={PackageCheck} />
                        <NavItem id="inventory" label="Inventory" icon={Boxes} />
                        
                        <div className="px-4 pt-6 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Partners</div>
                        <NavItem id="suppliers" label="Suppliers" icon={Users} />
                        <NavItem id="documents" label="Documents" icon={FileText} />
                        
                        <div className="px-4 pt-6 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Compliance</div>
                        <NavItem id="reports" label="FDA Reports" icon={FileText} />
                        <NavItem id="compliance" label="Compliance" icon={Activity} />
                    </div>

                    <div className="p-4 border-t border-slate-800">
                         <NavItem id="settings" label="Settings" icon={Settings} />
                         <button onClick={togglePortal} className="mt-2 w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-emerald-400 hover:bg-slate-800 transition-colors">
                            <Globe size={20} />
                            <span className="font-medium">Supplier Portal Demo</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    {/* Header */}
                    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10">
                        <div className="flex items-center">
                            <button 
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 rounded-md hover:bg-slate-100 mr-2"
                            >
                                <Menu size={24} className="text-slate-600" />
                            </button>
                            <h2 className="text-xl font-semibold text-slate-800 capitalize">
                                {currentView.replace('-', ' ')}
                            </h2>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
                                <Bell size={20} />
                                {state.alerts.length > 0 && (
                                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                                )}
                            </button>
                            <button 
                                onClick={() => setShowTour(true)}
                                className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
                            >
                                <HelpCircle size={20} />
                            </button>
                            <div className="h-8 w-px bg-slate-200 mx-2"></div>
                            <div className="flex items-center space-x-3">
                                <div className="text-right hidden sm:block">
                                    <div className="text-sm font-medium text-slate-900">{state.currentUser.name}</div>
                                    <div className="text-xs text-slate-500">{state.currentUser.role}</div>
                                </div>
                                <div className="h-9 w-9 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                                    SJ
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content Body */}
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                        {renderView()}
                    </main>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="fixed inset-0 z-50 md:hidden">
                        <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                        <div className="absolute left-0 top-0 bottom-0 w-64 bg-slate-900 shadow-xl flex flex-col">
                            <div className="p-6 flex items-center justify-between border-b border-slate-800">
                                <div>
                                    <span className="text-xl font-bold text-white tracking-tight block">TraceIT</span>
                                    <span className="text-[10px] text-slate-400 uppercase tracking-widest block">by VeriPura</span>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400">
                                    <X size={24} />
                                </button>
                            </div>
                            <div className="flex-1 p-4 space-y-1 overflow-y-auto">
                                <NavItem id="dashboard" label="Dashboard" icon={LayoutDashboard} />
                                <NavItem id="receiving" label="Receiving" icon={PackageCheck} />
                                <NavItem id="inventory" label="Inventory" icon={Boxes} />
                                <NavItem id="suppliers" label="Suppliers" icon={Users} />
                                <NavItem id="reports" label="FDA Reports" icon={FileText} />
                                <NavItem id="compliance" label="Compliance" icon={Activity} />
                                <NavItem id="settings" label="Settings" icon={Settings} />
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Onboarding Tour Modal */}
                {showTour && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setShowTour(false)}></div>
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative z-10 p-8 text-center animate-in fade-in zoom-in duration-300">
                             <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                                <Activity className="text-emerald-600" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to TraceIT</h2>
                            <p className="text-slate-600 mb-8">
                                TraceIT by VeriPura is your comprehensive platform for FSMA 204 traceability compliance. 
                                Connect seamlessly with your Asian supply chain partners.
                            </p>
                            <div className="space-y-3">
                                <button 
                                    onClick={() => setShowTour(false)}
                                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-emerald-600/20"
                                >
                                    Get Started
                                </button>
                                <button 
                                    onClick={() => setShowTour(false)}
                                    className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors"
                                >
                                    Watch Tutorial
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppContext.Provider>
    );
}