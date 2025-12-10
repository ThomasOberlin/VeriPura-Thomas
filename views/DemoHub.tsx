
import React from 'react';
import { Play, Clock, BarChart, ArrowRight, Star } from 'lucide-react';
import { DEMO_SCENARIOS } from '../services/demoScenarios';
import { useAppContext } from '../App';
import { DemoScenario } from '../types';

export default function DemoHub() {
    const { startDemo } = useAppContext();

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-12">
            <div className="text-center space-y-4 py-8">
                <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Interactive Guided Demos</h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                    Experience VeriPura from every perspective. Select a role below to start a voice-guided walkthrough of key workflows.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {DEMO_SCENARIOS.map((scenario: DemoScenario) => {
                    const Icon = scenario.icon;
                    return (
                        <div key={scenario.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
                            <div className="p-6 flex-1">
                                <div className="flex justify-between items-start mb-4">
                                    <div className={`p-3 rounded-xl ${scenario.id === 'receiving-manager' ? 'bg-blue-100 text-blue-600' : scenario.id === 'compliance-officer' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                        <Icon size={24} />
                                    </div>
                                    <div className="flex items-center text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                                        <Clock size={12} className="mr-1" />
                                        {Math.ceil(scenario.durationSeconds / 60)} min
                                    </div>
                                </div>
                                
                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                    {scenario.title}
                                </h3>
                                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                                    {scenario.description}
                                </p>
                                
                                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                        {scenario.persona.avatarInitials}
                                    </div>
                                    <div className="text-xs">
                                        <div className="font-semibold text-slate-900">{scenario.role}</div>
                                        <div className="text-slate-500">{scenario.persona.company}</div>
                                    </div>
                                </div>
                            </div>
                            
                            <button 
                                onClick={() => startDemo(scenario)}
                                className="w-full py-4 bg-slate-50 hover:bg-emerald-600 hover:text-white border-t border-slate-100 text-slate-700 font-bold transition-all flex items-center justify-center gap-2 group-hover:gap-3"
                            >
                                <Play size={18} fill="currentColor" /> Start Demo
                            </button>
                        </div>
                    );
                })}
            </div>

            <div className="bg-slate-900 rounded-2xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Need a custom walkthrough?</h2>
                    <p className="text-slate-400">Our sales team can provide a tailored demonstration using your own product data.</p>
                </div>
                <button className="bg-emerald-500 hover:bg-emerald-400 text-slate-900 px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/20">
                    Book Live Demo
                </button>
            </div>
        </div>
    );
}
