import React, { useEffect, useState, useRef } from 'react';
import { Play, Pause, SkipForward, X, Volume2, VolumeX, Minimize2, Maximize2, ChevronRight, Check, RotateCcw, LayoutGrid } from 'lucide-react';
import { voiceService } from '../services/voice';
import { DemoScenario } from '../types';
import { useAppContext } from '../App';

interface DemoOverlayProps {
    scenario: DemoScenario;
    onClose: () => void;
}

export default function DemoOverlay({ scenario, onClose }: DemoOverlayProps) {
    const { setView } = useAppContext();
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [spotlightStyle, setSpotlightStyle] = useState<React.CSSProperties>({});
    const [showSpotlight, setShowSpotlight] = useState(false);
    
    const isMounted = useRef(true);
    const safetyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const step = scenario.steps[currentStepIndex];

    useEffect(() => {
        return () => { 
            isMounted.current = false; 
            if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);
            voiceService.cancel(); 
        };
    }, []);

    // Effect 1: Handle Visuals & Actions
    useEffect(() => {
        if (!isComplete) {
            handleStepVisuals();
        }
    }, [currentStepIndex, isComplete]);

    // Effect 2: Handle Audio & Safety Timer
    useEffect(() => {
        if (safetyTimerRef.current) clearTimeout(safetyTimerRef.current);

        if (isPlaying && !isComplete) {
            const currentStep = scenario.steps[currentStepIndex];
            
            // Calculate a safety fallback duration based on text length (approx 200 words per minute)
            // Minimum 3 seconds, plus 500ms buffer
            const estimatedDuration = Math.max(3000, (currentStep.narration.split(' ').length / 3) * 1000) + 1000;

            voiceService.speak(currentStep.narration, () => {
                if (isMounted.current && isPlaying) {
                    // Slight natural pause before advancing
                    setTimeout(() => nextStep(), 1200);
                }
            });

            // Safety timer: If audio engine fails to fire onEnd, force advance
            safetyTimerRef.current = setTimeout(() => {
                if (isMounted.current && isPlaying && currentStepIndex === currentStep.id - 1) { // check if we haven't already moved
                    console.warn("Audio safety timer triggered - auto-advancing");
                    nextStep();
                }
            }, estimatedDuration + 2000); // Add 2s buffer to estimated time
        } else {
            voiceService.cancel();
        }
    }, [currentStepIndex, isPlaying, isComplete]);

    const handleStepVisuals = async () => {
        const currentStep = scenario.steps[currentStepIndex];
        
        if (currentStep.path) {
            setView(currentStep.path);
            await new Promise(r => setTimeout(r, 500)); 
        }

        if (currentStep.actions) {
            for (const action of currentStep.actions) {
                if (!isMounted.current) return;
                await performAction(action);
            }
        }

        if (currentStep.targetElement) {
            setTimeout(() => {
                if(isMounted.current) highlightElement(currentStep.targetElement!);
            }, 600);
        } else {
            setShowSpotlight(false);
        }
    };

    const performAction = async (action: any) => {
        if (action.delay) await new Promise(r => setTimeout(r, action.delay));

        if (action.type === 'navigate') {
            setView(action.target);
            await new Promise(r => setTimeout(r, 500));
        }
        else if (action.type === 'click') {
            const el = document.querySelector(action.target) as HTMLElement;
            if (el) {
                el.style.transform = "scale(0.95)";
                el.style.transition = "transform 0.1s";
                setTimeout(() => { if (el) el.style.transform = "scale(1)"; }, 100);
                el.click();
            }
        }
        else if (action.type === 'fill' || action.type === 'typing') {
            const el = document.querySelector(action.target) as HTMLInputElement;
            if (el) {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
                if (nativeInputValueSetter) {
                    nativeInputValueSetter.call(el, action.value);
                    el.dispatchEvent(new Event('input', { bubbles: true }));
                } else {
                    el.value = action.value;
                }
            }
        }
    };

    const highlightElement = (selector: string) => {
        const el = document.querySelector(selector);
        if (el) {
            const rect = el.getBoundingClientRect();
            setSpotlightStyle({
                top: rect.top - 4,
                left: rect.left - 4,
                width: rect.width + 8,
                height: rect.height + 8,
            });
            setShowSpotlight(true);
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            setShowSpotlight(false);
        }
    };

    const nextStep = () => {
        setCurrentStepIndex(prev => {
            if (prev < scenario.steps.length - 1) {
                return prev + 1;
            } else {
                setIsPlaying(false);
                setIsComplete(true);
                return prev;
            }
        });
    };

    const togglePlay = () => setIsPlaying(prev => !prev);
    const toggleMute = () => {
        voiceService.toggle(isMuted);
        setIsMuted(!isMuted);
    };

    // --- Render Completion Screen ---
    if (isComplete) {
        return (
            <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300 pointer-events-auto">
                <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center border border-slate-200 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                    
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <Check className="w-8 h-8 text-emerald-600" />
                    </div>
                    
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Demo Complete</h2>
                    <p className="text-slate-500 mb-8 leading-relaxed">
                        You have completed the <span className="font-semibold text-slate-900">{scenario.title}</span> workflow.
                    </p>
                    
                    <div className="space-y-3">
                        <button 
                            onClick={() => {
                                onClose();
                                setView('demo-hub');
                            }}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                        >
                            <LayoutGrid size={18} /> Select Another Demo
                        </button>
                        
                        <button 
                            onClick={() => {
                                setIsComplete(false);
                                setCurrentStepIndex(0);
                                setIsPlaying(true);
                            }}
                            className="w-full py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                        >
                            <RotateCcw size={18} /> Replay Scenario
                        </button>
                        
                        <button 
                            onClick={onClose}
                            className="w-full py-2 text-slate-400 hover:text-slate-600 text-sm font-medium mt-2"
                        >
                            Close Overlay
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- Render Controls ---
    return (
        <div className="fixed inset-0 z-[100] pointer-events-none">
            {showSpotlight && !isComplete && (
                <div 
                    className="absolute border-4 border-emerald-500 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)] transition-all duration-500 ease-in-out box-content pointer-events-none z-[101]"
                    style={spotlightStyle}
                >
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-emerald-500 rounded-full animate-ping"></div>
                </div>
            )}

            {/* Compact Control Panel */}
            <div className={`absolute left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-auto z-[102] ${isMinimized ? 'bottom-8' : 'bottom-12'}`}>
                {isMinimized ? (
                    // Minimized Pill View
                    <div className="flex items-center gap-3 bg-slate-900/95 text-white rounded-full shadow-2xl backdrop-blur border border-slate-700 px-4 py-2">
                         <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-xs">
                            {scenario.persona.avatarInitials}
                        </div>
                        <span className="text-sm font-medium whitespace-nowrap">Step {currentStepIndex + 1}/{scenario.steps.length}</span>
                        <div className="h-4 w-px bg-slate-700 mx-1"></div>
                        <button onClick={togglePlay} className="p-1 hover:text-emerald-400">
                             {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                        </button>
                        <button onClick={nextStep} className="p-1 hover:text-emerald-400">
                             <SkipForward size={16} />
                        </button>
                        <div className="h-4 w-px bg-slate-700 mx-1"></div>
                        <button onClick={() => setIsMinimized(false)} className="p-1 hover:text-emerald-400">
                            <Maximize2 size={16} />
                        </button>
                    </div>
                ) : (
                    // Expanded Card View
                    <div className="w-[90vw] max-w-lg bg-slate-900/95 text-white rounded-2xl shadow-2xl backdrop-blur p-5 border border-slate-700 flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-sm">
                                    {scenario.persona.avatarInitials}
                                </div>
                                <div>
                                    <div className="text-xs text-emerald-400 font-bold uppercase tracking-wider">{scenario.role}</div>
                                    <div className="font-semibold text-sm leading-tight">{scenario.title}</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setIsMinimized(true)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                                    <Minimize2 size={18} />
                                </button>
                                <button onClick={onClose} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="min-h-[3.5rem] text-base font-medium text-slate-100 leading-relaxed">
                            {step.narration}
                        </div>

                        <div className="flex items-center justify-between mt-1">
                            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                                <span>Step {currentStepIndex + 1} / {scenario.steps.length}</span>
                                <div className="w-24 h-1 bg-slate-700 rounded-full overflow-hidden ml-2">
                                    <div 
                                        className="h-full bg-emerald-500 transition-all duration-500" 
                                        style={{ width: `${((currentStepIndex + 1) / scenario.steps.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button onClick={toggleMute} className="p-2 hover:bg-slate-800 rounded-full text-slate-300">
                                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                                </button>
                                <button 
                                    onClick={togglePlay} 
                                    className="w-10 h-10 bg-white text-slate-900 rounded-full flex items-center justify-center hover:bg-emerald-50 transition-colors shadow-lg"
                                >
                                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                                </button>
                                <button onClick={nextStep} className="p-2 hover:bg-slate-800 rounded-full text-slate-300">
                                    <SkipForward size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}