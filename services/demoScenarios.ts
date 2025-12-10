
import { DemoScenario } from '../types';
import { Package, ShieldCheck, Globe, Anchor, Factory } from 'lucide-react';

export const DEMO_SCENARIOS: DemoScenario[] = [
    {
        id: 'receiving-manager',
        title: 'Receiving Manager Workflow',
        role: 'U.S. Importer',
        icon: Package,
        description: 'Log a fresh mango shipment from Thailand with full FSMA 204 traceability.',
        durationSeconds: 90,
        persona: { name: 'Sarah', avatarInitials: 'SJ', company: 'Pacific Foods Import Co.' },
        steps: [
            {
                id: 1,
                title: 'Welcome',
                narration: "Welcome! I'm Sarah, the receiving manager at Pacific Foods. Today, we received a shipment of fresh mangoes from Thailand. Let me show you how to log this to maintain FDA compliance.",
                targetElement: '#sidebar',
                path: 'dashboard'
            },
            {
                id: 2,
                title: 'Navigate to Receiving',
                narration: "I navigate to the Receiving section. This is my command center for logging all incoming shipments.",
                targetElement: '#nav-receiving',
                actions: [{ type: 'click', target: '#nav-receiving', delay: 800 }]
            },
            {
                id: 3,
                title: 'Start New Receipt',
                narration: "I'll click 'Log New Receipt' to create a new receiving record.",
                targetElement: '#btn-log-receipt',
                path: 'receiving'
            },
            {
                id: 4,
                title: 'Enter Basic Information',
                narration: "I enter the receiving date and our reference number from the Bill of Lading.",
                targetElement: '#input-date',
                actions: [
                    { type: 'fill', target: '#input-date', value: new Date().toISOString().split('T')[0] },
                ]
            },
            {
                id: 5,
                title: 'Select Supplier',
                narration: "I select Thai Mango Co. The system automatically pulls their facility details.",
                targetElement: '#input-supplier',
                actions: [
                    { type: 'fill', target: '#input-supplier', value: 'SUP-001' }
                ]
            },
            {
                id: 6,
                title: 'Select Product',
                narration: "Next, I select 'Nam Dok Mai Mangoes'. Notice the FDA FTL badge appears, indicating this requires full traceability.",
                targetElement: '#input-product',
                actions: [
                    { type: 'fill', target: '#input-category', value: 'Fresh Produce' },
                    { type: 'fill', target: '#input-product', value: 'Nam Dok Mai Mangoes' }
                ]
            },
            {
                id: 7,
                title: 'Enter Quantity',
                narration: "We received 500 cases. The system handles unit conversions automatically.",
                targetElement: '#input-qty',
                actions: [
                    { type: 'fill', target: '#input-qty', value: '500' },
                    { type: 'fill', target: '#input-uom', value: 'Cases' }
                ]
            },
            {
                id: 8,
                title: 'Traceability Lot Code',
                narration: "I enter the Traceability Lot Code provided by the supplier. This TH-MG code is the key that links everything.",
                targetElement: '#input-tlc',
                actions: [
                    { type: 'click', target: '#btn-step-2', delay: 500 },
                    { type: 'typing', target: '#input-tlc', value: 'TH-MG-2024-1234' }
                ]
            },
            {
                id: 9,
                title: 'View Upstream Data',
                narration: "Here's the powerful part. I can click 'View Upstream Data' to see the harvest and packing details the supplier already uploaded.",
                targetElement: '#link-upstream-data',
                actions: [
                    { type: 'click', target: '#link-upstream-data', delay: 1000 }
                ]
            },
            {
                id: 10,
                title: 'Upload Documents',
                narration: "I upload the Bill of Lading and Phytosanitary Certificate to complete the record.",
                targetElement: '#dropzone-docs',
                actions: [
                     { type: 'click', target: '#btn-close-upstream', delay: 1000 }, // Close modal first
                ]
            },
            {
                id: 11,
                title: 'Review Completeness',
                narration: "The completeness meter is green at 100%. We have all the Key Data Elements required by the rule.",
                targetElement: '#meter-completeness'
            },
            {
                id: 12,
                title: 'Submit',
                narration: "I submit the receiving event. It's now digitally linked to the farm data.",
                targetElement: '#btn-submit-receipt',
                actions: [{ type: 'click', target: '#btn-submit-receipt' }]
            },
            {
                id: 13,
                title: 'View in Inventory',
                narration: "The shipment appears in our inventory, fully compliant and ready for audit.",
                path: 'inventory'
            }
        ]
    },
    {
        id: 'seafood-import',
        title: 'Thai Seafood Traceability',
        role: 'Seafood Importer',
        icon: Anchor,
        description: 'Track wild-caught seafood from the First Land-Based Receiver to import.',
        durationSeconds: 100,
        persona: { name: 'David', avatarInitials: 'DM', company: 'Global Seafoods Inc.' },
        steps: [
            {
                id: 1,
                title: 'Seafood Compliance',
                narration: "Hello, I'm David. Importing seafood under FSMA 204 is complex because we need data from the 'First Land-Based Receiver', often a port facility in Thailand.",
                path: 'dashboard'
            },
            {
                id: 2,
                title: 'Start Receipt',
                narration: "I'm receiving a container of Yellowfin Tuna. Let's log it.",
                targetElement: '#nav-receiving',
                path: 'receiving'
            },
            {
                id: 3,
                title: 'Select Supplier',
                narration: "I select Vietnam Seafood Exports. They are the aggregator, but not the harvester.",
                targetElement: '#input-supplier',
                actions: [
                    { type: 'fill', target: '#input-supplier', value: 'SUP-002' }
                ]
            },
            {
                id: 4,
                title: 'Select Category',
                narration: "Crucially, I select 'Seafood' as the category. Watch how the form adapts.",
                targetElement: '#input-category',
                actions: [
                    { type: 'fill', target: '#input-category', value: 'Seafood' },
                    { type: 'fill', target: '#input-product', value: 'Yellowfin Tuna Loins' },
                    { type: 'fill', target: '#input-qty', value: '2000' }
                ]
            },
            {
                id: 5,
                title: 'Seafood Specifics',
                narration: "The system now demands 'First Land-Based Receiver' data. I must enter the Vessel Name and Harvest Date Range.",
                targetElement: '#section-seafood',
                actions: [
                    { type: 'fill', target: '#input-vessel', value: 'Ocean Spirit II' },
                    { type: 'fill', target: '#input-fao', value: 'FAO Zone 71 (Pacific)' },
                    { type: 'fill', target: '#input-harvest-start', value: '2023-11-20' },
                    { type: 'fill', target: '#input-harvest-end', value: '2023-11-25' }
                ]
            },
            {
                id: 6,
                title: 'Next Step',
                narration: "This ensures we capture the critical link to the wild harvest event.",
                targetElement: '#btn-step-2',
                actions: [{ type: 'click', target: '#btn-step-2' }]
            },
            {
                id: 7,
                title: 'Verify TLC',
                narration: "The Traceability Lot Code was assigned by the port facility when the fish landed. We preserve this code.",
                targetElement: '#input-tlc',
                actions: [{ type: 'fill', target: '#input-tlc', value: 'VN-YF-2023-4421' }]
            },
            {
                id: 8,
                title: 'Submit',
                narration: "I submit the record. We now have end-to-end traceability from the fishing vessel to our warehouse.",
                targetElement: '#btn-submit-receipt',
                actions: [{ type: 'click', target: '#btn-submit-receipt' }]
            }
        ]
    },
    {
        id: 'curry-paste-prod',
        title: 'Curry Paste Production',
        role: 'Food Manufacturer',
        icon: Factory,
        description: 'Perform a Transformation event linking ingredient TLCs to a finished good.',
        durationSeconds: 110,
        persona: { name: 'Priya', avatarInitials: 'PM', company: 'Bangkok Spice Works' },
        steps: [
            {
                id: 1,
                title: 'Transformation Overview',
                narration: "I'm Priya. Making Curry Paste is a 'Transformation' event. I need to link the TLCs of my ingredients (like peppers and shrimp paste) to the finished jar's TLC.",
                path: 'dashboard'
            },
            {
                id: 2,
                title: 'Go to Production',
                narration: "I go to the 'Transformation' log to record today's production batch.",
                targetElement: '#nav-transformation',
                path: 'transformation'
            },
            {
                id: 3,
                title: 'Select Inputs',
                narration: "Here are my available raw materials. I select the Chili Peppers and Shrimp Paste I'm using today.",
                targetElement: '#step-inputs',
                actions: [
                    { type: 'click', target: '#row-RM-001', delay: 500 }, // Chili
                    { type: 'click', target: '#row-RM-003', delay: 500 }  // Shrimp Paste
                ]
            },
            {
                id: 4,
                title: 'Next Step',
                narration: "The system verifies these ingredients are available and compliant.",
                targetElement: '#btn-next-to-output',
                actions: [{ type: 'click', target: '#btn-next-to-output' }]
            },
            {
                id: 5,
                title: 'Define Output',
                narration: "Now I define the finished product: Thai Red Curry Paste.",
                targetElement: '#step-output',
                actions: [
                    { type: 'fill', target: '#input-out-qty', value: '100' }
                ]
            },
            {
                id: 6,
                title: 'Generate Output TLC',
                narration: "The system automatically generates a new Traceability Lot Code (CP-2024-XXXX) for this batch.",
                targetElement: '#step-output'
            },
            {
                id: 7,
                title: 'Log Production',
                narration: "I click 'Log Production'. The system creates the immutable link between the input ingredients and the final product.",
                targetElement: '#btn-submit-transform',
                actions: [{ type: 'click', target: '#btn-submit-transform' }]
            },
            {
                id: 8,
                title: 'Completion',
                narration: "Done. Any buyer scanning the Curry Paste TLC can now trace it back to the specific batch of chili peppers.",
                targetElement: '#btn-submit-transform' // Stay on success screen
            }
        ]
    },
    {
        id: 'compliance-officer',
        title: 'FDA Report Generation',
        role: 'Compliance Officer',
        icon: ShieldCheck,
        description: 'Generate a 24-hour response package for an FDA traceability request.',
        durationSeconds: 95,
        persona: { name: 'Michael', avatarInitials: 'MK', company: 'Pacific Foods Import Co.' },
        steps: [
            {
                id: 1,
                title: 'Welcome',
                narration: "Hi, I'm Michael, the Compliance Officer. We just received an FDA traceability request for our mango shipments. I need to respond within 24 hours.",
                targetElement: '#dashboard-alerts',
                path: 'dashboard'
            },
            {
                id: 2,
                title: 'Navigate to Reports',
                narration: "I navigate to the FDA Reports section. VeriPura has a dedicated tool for these requests.",
                targetElement: '#nav-reports',
                actions: [{ type: 'navigate', target: 'reports' }]
            },
            {
                id: 3,
                title: 'Set Search Criteria',
                narration: "I set the criteria to match the FDA's request: Mangoes from the last 30 days.",
                targetElement: '#report-filters',
                actions: [
                    { type: 'fill', target: '#input-product-search', value: 'Mangoes' },
                    { type: 'fill', target: '#input-date-range', value: 'Last 30 Days' }
                ]
            },
            {
                id: 4,
                title: 'Preview Results',
                narration: "I click 'Preview'. I can see 3 shipments match, and all have complete traceability chains.",
                targetElement: '#btn-preview',
                actions: [{ type: 'click', target: '#btn-preview' }]
            },
            {
                id: 5,
                title: 'Review Traceability',
                narration: "I can expand any row to verify the upstream data before including it in the report.",
                targetElement: '#preview-table-row-0',
            },
            {
                id: 6,
                title: 'Include Documents',
                narration: "I ensure 'Include Linked Documents' is checked so the certificates are attached automatically.",
                targetElement: '#check-include-docs',
                actions: [{ type: 'click', target: '#check-include-docs' }]
            },
            {
                id: 7,
                title: 'Generate Report',
                narration: "I click 'Generate 24h Package'. The system builds the required sortable spreadsheet.",
                targetElement: '#btn-24h-start',
                actions: [{ type: 'click', target: '#btn-24h-start' }]
            },
            {
                id: 8,
                title: 'Review Output',
                narration: "The report is ready. It's an FDA-compliant CSV file with all required columns.",
                targetElement: '#recent-reports-list'
            },
            {
                id: 9,
                title: 'Email to FDA',
                narration: "I can email this package directly to the FDA inspector from the platform.",
                targetElement: '#btn-email-fda',
                actions: [{ type: 'click', target: '#btn-email-fda' }]
            },
            {
                id: 10,
                title: 'Send',
                narration: "I enter the inspector's email and hit send. A secure link is delivered instantly.",
                targetElement: '#btn-send-email',
                actions: [{ type: 'click', target: '#btn-send-email', delay: 1000 }]
            },
            {
                id: 11,
                title: 'Done',
                narration: "Done. The request is fulfilled in minutes, not days. Our compliance log is automatically updated.",
                path: 'dashboard'
            }
        ]
    },
    {
        id: 'exporter-mobile',
        title: 'Mobile Shipment Entry',
        role: 'Asian Exporter',
        icon: Globe,
        description: 'Submit shipment data via the simplified mobile portal.',
        durationSeconds: 110,
        persona: { name: 'Somchai', avatarInitials: 'SP', company: 'Thai Fresh Fruits' },
        steps: [
            {
                id: 1,
                title: 'Portal Welcome',
                narration: "Sawadee krap, I'm Somchai. I use this simple mobile portal to send data to my US customers. No complex login required.",
                path: 'portal-welcome'
            },
            {
                id: 2,
                title: 'Start',
                narration: "I tap 'Submit New Shipment' to begin.",
                targetElement: '#btn-portal-start',
                actions: [{ type: 'click', target: '#btn-portal-start' }]
            },
            {
                id: 3,
                title: 'Product & Qty',
                narration: "I select 'Mangoes' and enter 300 cases.",
                targetElement: '#portal-step-1',
                actions: [
                    { type: 'click', target: '#btn-prod-mango' },
                    { type: 'fill', target: '#input-portal-qty', value: '300' },
                    { type: 'click', target: '#btn-portal-next-1', delay: 800 }
                ]
            },
            {
                id: 4,
                title: 'Harvest Info',
                narration: "I enter the harvest date and select the farm location.",
                targetElement: '#portal-step-2',
                actions: [
                    { type: 'fill', target: '#input-portal-date', value: '2023-12-05' }
                ]
            },
            {
                id: 5,
                title: 'Cooling Info',
                narration: "I confirm the fruit was hydrocooled to 10 degrees. This is a required Key Data Element.",
                targetElement: '#input-portal-cooling',
                actions: [
                    { type: 'click', target: '#toggle-cooling' },
                    { type: 'click', target: '#btn-portal-next-2', delay: 800 }
                ]
            },
            {
                id: 6,
                title: 'Documents',
                narration: "I take a photo of the Phytosanitary Certificate right from my phone.",
                targetElement: '#portal-step-3',
                actions: [
                    { type: 'click', target: '#btn-portal-next-3', delay: 800 }
                ]
            },
            {
                id: 7,
                title: 'Packing & Shipping',
                narration: "I confirm the packing details and enter the shipping container number.",
                targetElement: '#portal-step-4',
                actions: [
                     { type: 'fill', target: '#input-container', value: 'OOLU-9876543' },
                     { type: 'click', target: '#btn-portal-next-4', delay: 800 }
                ]
            },
            {
                id: 8,
                title: 'Review',
                narration: "I review the summary. Everything looks correct.",
                targetElement: '#portal-summary'
            },
            {
                id: 9,
                title: 'Submit',
                narration: "I tap Submit. The data is sent instantly to Pacific Foods in the US.",
                targetElement: '#btn-portal-submit',
                actions: [{ type: 'click', target: '#btn-portal-submit' }]
            },
            {
                id: 10,
                title: 'Done',
                narration: "That's it! My shipment is compliant, and I can get back to work.",
                path: 'portal-success'
            }
        ]
    }
];
