
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
  Plus,
  Book,
  LifeBuoy,
  PlayCircle
} from 'lucide-react';

import { MOCK_ALERTS, MOCK_PRODUCTS, MOCK_SUPPLIERS, MOCK_PLAN } from './services/mockData';
import { AppState, Product, Supplier, TraceabilityPlan, DemoScenario } from './types';

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
import TraceabilityPlanView from './views/TraceabilityPlan';
import FAQ from './views/FAQ';
import DemoHub from './views/DemoHub';

// Components
import DemoOverlay from './components/DemoOverlay';

// Context
interface AppContextType extends AppState {
    addProduct: (p: Product) => void;
    updateTraceabilityPlan: (plan: TraceabilityPlan) => void;
    currentView: string;
    setView: (view: string, params?: any) => void;
    viewParams: any;
    togglePortal: () => void;
    isPortalMode: boolean;
    startDemo: (scenario: DemoScenario) => void;
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
        traceabilityPlan: MOCK_PLAN,
        currentUser: { name: 'Sarah Jenkins', role: 'Admin', company: 'VeriPura Imports Inc.' }
    });

    const [currentView, setCurrentView] = useState('dashboard');
    const [viewParams, setViewParams] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isPortalMode, setIsPortalMode] = useState(false);
    const [showTour, setShowTour] = useState(true);
    
    // Demo State
    const [activeDemo, setActiveDemo] = useState<DemoScenario | null>(null);

    useEffect(() => {
        // Initialize Mock Data
        setState(prev => ({
            ...prev,
            suppliers: MOCK_SUPPLIERS,
            products: MOCK_PRODUCTS,
            alerts: MOCK_ALERTS as any,
            traceabilityPlan: MOCK_PLAN
        }));
    }, []);

    const addProduct = (product: Product) => {
        setState(prev => ({
            ...prev,
            products: [product, ...prev.products]
        }));
    };

    const updateTraceabilityPlan = (plan: TraceabilityPlan) => {
        setState(prev => ({
            ...prev,
            traceabilityPlan: plan
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

    const startDemo = (scenario: DemoScenario) => {
        setActiveDemo(scenario);
        // Force reset view to scenario start path if defined, else dashboard
        // Note: DemoOverlay will handle initial path navigation
    };

    const endDemo = () => {
        setActiveDemo(null);
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
            case 'traceability-plan': return <TraceabilityPlanView />;
            case 'faq': return <FAQ />;
            case 'demo-hub': return <DemoHub />;
            // Portal views that might be triggered by demo
            case 'portal-welcome': return <SupplierPortal />;
            case 'portal-success': return <SupplierPortal />;
            default: return <Dashboard />;
        }
    };

    const NavItem = ({ id, label, icon: Icon }: { id: string, label: string, icon: any }) => (
        <button
            id={id} // Added ID for demo highlighting
            onClick={() => handleSetView(id.replace('nav-', ''))} 
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === id.replace('nav-', '') 
                ? 'bg-emerald-600 text-white' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </button>
    );

    const contextValue = { 
        ...state, 
        addProduct, 
        updateTraceabilityPlan, 
        currentView, 
        setView: handleSetView, 
        viewParams, 
        togglePortal, 
        isPortalMode,
        startDemo 
    };

    if (isPortalMode && !activeDemo) {
        return (
            <AppContext.Provider value={contextValue}>
                <SupplierPortal />
            </AppContext.Provider>
        );
    }

    return (
        <AppContext.Provider value={contextValue}>
            {activeDemo && <DemoOverlay scenario={activeDemo} onClose={endDemo} />}
            
            <div className={`flex h-screen bg-slate-50 overflow-hidden ${activeDemo ? 'pointer-events-none' : ''}`}>
                 {/* Sidebar - Desktop */}
                {!isPortalMode && (
                    <aside id="sidebar" className="hidden md:flex flex-col w-64 bg-slate-900 text-white h-full shadow-xl z-20">
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
                            <NavItem id="nav-dashboard" label="Dashboard" icon={LayoutDashboard} />
                            <NavItem id="nav-receiving" label="Receiving" icon={PackageCheck} />
                            <NavItem id="nav-inventory" label="Inventory" icon={Boxes} />
                            
                            <div className="px-4 pt-6 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Partners</div>
                            <NavItem id="nav-suppliers" label="Suppliers" icon={Users} />
                            <NavItem id="nav-documents" label="Documents" icon={FileText} />
                            
                            <div className="px-4 pt-6 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Compliance</div>
                            <NavItem id="nav-traceability-plan" label="Traceability Plan" icon={Book} />
                            <NavItem id="nav-reports" label="FDA Reports" icon={FileText} />
                            <NavItem id="nav-compliance" label="Analytics" icon={Activity} />
                        </div>

                        <div className="p-4 border-t border-slate-800 space-y-2">
                             <button
                                onClick={() => handleSetView('demo-hub')}
                                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-emerald-900/30 text-emerald-400 hover:bg-emerald-900/50 transition-colors border border-emerald-900"
                             >
                                <PlayCircle size={20} />
                                <span className="font-medium">Interactive Demos</span>
                             </button>
                             <NavItem id="nav-faq" label="Help & FAQ" icon={LifeBuoy} />
                             <NavItem id="nav-settings" label="Settings" icon={Settings} />
                        </div>
                    </aside>
                )}

                {/* Main Content */}
                <div className="flex-1 flex flex-col h-full overflow-hidden">
                    {/* Header */}
                    {!isPortalMode && (
                        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 z-10">
                            <div className="flex items-center">
                                <button 
                                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                    className="md:hidden p-2 rounded-md hover:bg-slate-100 mr-2"
                                >
                                    <Menu size={24} className="text-slate-600" />
                                </button>
                                <h2 className="text-xl font-semibold text-slate-800 capitalize">
                                    {currentView === 'demo-hub' ? 'Demo Hub' : currentView.replace('-', ' ')}
                                </h2>
                            </div>

                            <div id="header-actions" className="flex items-center space-x-4">
                                <button id="dashboard-alerts" className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors">
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
                    )}

                    {/* Content Body */}
                    <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                        {renderView()}
                    </main>
                </div>

                {/* Onboarding Tour Modal */}
                {showTour && !activeDemo && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={() => setShowTour(false)}></div>
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full relative z-10 p-8 text-center animate-in fade-in zoom-in duration-300">
                             <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                                <Activity className="text-emerald-600" size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">FSMA 204 Ready</h2>
                            <p className="text-slate-600 mb-8">
                                TraceIT is now fully compliant with the Food Traceability Rule.
                                Track CTEs/KDEs, maintain your Traceability Plan, and generate 24-hour response packages.
                            </p>
                            <div className="space-y-3">
                                <button 
                                    onClick={() => setShowTour(false)}
                                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-emerald-600/20"
                                >
                                    Access Dashboard
                                </button>
                                <button 
                                    onClick={() => { setShowTour(false); handleSetView('demo-hub'); }}
                                    className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                                >
                                    <PlayCircle size={18} /> Interactive Demos
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppContext.Provider>
    );
}
