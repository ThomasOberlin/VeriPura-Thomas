import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, BookOpen, ShieldQuestion, FileText, HelpCircle } from 'lucide-react';

type Category = 'General' | 'FSMA Compliance' | 'Technical';

const FAQS = [
    {
        question: "What foods are on the Food Traceability List (FTL)?",
        answer: "The FTL includes specific foods that require additional recordkeeping. Key categories include soft cheeses (e.g., Brie, Queso Fresco), shell eggs, nut butters, fresh cucumbers, herbs (fresh), leafy greens, melons, peppers, sprouts, tomatoes, and specific finfish (e.g., Tuna) and crustaceans. You can verify specific items using the FTL Search tool in the dashboard.",
        category: 'FSMA Compliance'
    },
    {
        question: "Do I need to track ingredients that are not on the FTL?",
        answer: "Generally, no. For example, if you manufacture soft cheese (an FTL food), you must maintain Transformation KDEs for the cheese itself. However, you do NOT need to maintain Receiving KDEs for the milk, salt, or enzymes if those ingredients are not on the FTL. The traceability chain for the cheese starts at the Transformation event.",
        category: 'FSMA Compliance'
    },
    {
        question: "What is a Traceability Lot Code (TLC) Source?",
        answer: "The TLC Source is the place where a Traceability Lot Code is assigned. This occurs during specific events: Initial Packing of a Raw Agricultural Commodity (RAC), the First Land-Based Receiving of seafood, or the Transformation of a food. If you are a Distributor, you are generally NOT a TLC Source and must simply pass along the existing TLC.",
        category: 'FSMA Compliance'
    },
    {
        question: "How do I handle Fishing Vessels under the rule?",
        answer: "Fishing vessels are largely exempt. However, the 'First Land-Based Receiver' (the entity taking possession on land) must create the initial traceability records. They must assign a TLC and capture harvest date ranges and locations (which they may need to obtain from the vessel).",
        category: 'FSMA Compliance'
    },
    {
        question: "What is the 24-Hour Response requirement?",
        answer: "In the event of an FDA request (usually during an outbreak investigation), you must provide an electronic sortable spreadsheet containing relevant Key Data Elements (KDEs) within 24 hours. Use the 'FDA Reports' section in TraceIT to generate this file automatically.",
        category: 'FSMA Compliance'
    },
    {
        question: "How do I update my Traceability Plan?",
        answer: "Go to the 'Traceability Plan' section in the sidebar. You can edit your procedures for TLC assignment, FTL identification, and manage your Farm Maps there. The rule requires you to review this plan at least every 2 years or when practices change.",
        category: 'General'
    },
    {
        question: "How do I invite a supplier to the portal?",
        answer: "Navigate to the 'Suppliers' tab and click 'Invite Supplier'. They will receive an email with a link to the simplified mobile-friendly portal where they can enter shipment data and upload documents without needing a full account.",
        category: 'General'
    },
    {
        question: "Can I upload photos of paper records?",
        answer: "Yes. In the 'Receiving' flow or the Supplier Portal, you can use your device's camera to capture Bills of Lading, Harvest Logs, or Invoices. The system links these images to the specific CTE.",
        category: 'Technical'
    },
    {
        question: "What happens if a supplier sends incomplete data?",
        answer: "The shipment will be flagged as 'Incomplete' in your dashboard. You can click on the shipment to view exactly which Key Data Elements (KDEs) are missing and send a request to the supplier to provide them.",
        category: 'General'
    }
];

export default function FAQ() {
    const [searchTerm, setSearchTerm] = useState('');
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');

    const filteredFaqs = FAQS.filter(faq => {
        const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center py-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-4">How can we help you?</h1>
                <div className="max-w-xl mx-auto relative">
                    <Search className="absolute left-4 top-3.5 text-slate-400" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search for questions, rules, or features..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border-slate-300 shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-4">
                {['All', 'General', 'FSMA Compliance', 'Technical'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat as any)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                            activeCategory === cat 
                            ? 'bg-slate-900 text-white shadow-md' 
                            : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
                {filteredFaqs.map((faq, index) => {
                    // We need a stable key, but index changes with filter. 
                    // In a real app, data would have IDs. Using question as key here.
                    const isOpen = openIndex === index;
                    
                    return (
                        <div 
                            key={faq.question} 
                            className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                                isOpen ? 'border-emerald-500 shadow-md ring-1 ring-emerald-500' : 'border-slate-200 hover:border-emerald-300'
                            }`}
                        >
                            <button 
                                onClick={() => setOpenIndex(isOpen ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${
                                        faq.category === 'FSMA Compliance' ? 'bg-amber-100 text-amber-700' :
                                        faq.category === 'Technical' ? 'bg-blue-100 text-blue-700' :
                                        'bg-slate-100 text-slate-700'
                                    }`}>
                                        {faq.category === 'FSMA Compliance' ? <ShieldQuestion size={20} /> :
                                         faq.category === 'Technical' ? <FileText size={20} /> :
                                         <HelpCircle size={20} />}
                                    </div>
                                    <span className="font-semibold text-slate-900 text-lg">{faq.question}</span>
                                </div>
                                {isOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
                            </button>
                            
                            {isOpen && (
                                <div className="px-6 pb-6 pt-0 animate-in slide-in-from-top-2 duration-200">
                                    <div className="pl-[60px] text-slate-600 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

                {filteredFaqs.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        <BookOpen className="mx-auto h-12 w-12 mb-3 text-slate-300" />
                        <p>No results found for "{searchTerm}"</p>
                        <button 
                            onClick={() => {setSearchTerm(''); setActiveCategory('All');}}
                            className="mt-2 text-emerald-600 hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            {/* Support Contact */}
            <div className="bg-slate-900 text-white rounded-xl p-8 mt-12 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                    <h3 className="text-xl font-bold mb-2">Still have questions?</h3>
                    <p className="text-slate-400">Our compliance experts are available 24/7 for urgent FDA response assistance.</p>
                </div>
                <div className="flex gap-4">
                    <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition-colors">
                        Contact Support
                    </button>
                    <button className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors">
                        View Documentation
                    </button>
                </div>
            </div>
        </div>
    );
}