
import { Supplier, Product, ShipmentStatus, SupplierStatus, ProductType, TraceabilityEvent, TraceabilityPlan } from '../types';

export const MOCK_SUPPLIERS: Supplier[] = [
    {
        id: 'SUP-001',
        name: 'Thai Mango Co. Ltd',
        country: 'Thailand',
        contactName: 'Somchai Prasert',
        email: 'somchai@thaimango.example.com',
        phone: '+66 2 123 4567',
        status: SupplierStatus.VERIFIED,
        complianceScore: 98,
        categories: [ProductType.PRODUCE],
        lastShipmentDate: '2023-10-25',
    },
    {
        id: 'SUP-002',
        name: 'Vietnam Seafood Exports',
        country: 'Vietnam',
        contactName: 'Nguyen Van Minh',
        email: 'minh@vnseafood.example.com',
        phone: '+84 28 3822 1234',
        status: SupplierStatus.PENDING,
        complianceScore: 75,
        categories: [ProductType.SEAFOOD],
        lastShipmentDate: '2023-10-20',
    },
    {
        id: 'SUP-003',
        name: 'Green Leaf Farms',
        country: 'Mexico',
        contactName: 'Carlos Rodriguez',
        email: 'carlos@greenleaf.example.com',
        phone: '+52 55 1234 5678',
        status: SupplierStatus.VERIFIED,
        complianceScore: 95,
        categories: [ProductType.PRODUCE, ProductType.READY_TO_EAT],
        lastShipmentDate: '2023-10-29',
    },
    {
        id: 'SUP-004',
        name: 'Normandy Cheese Artisans',
        country: 'France',
        contactName: 'Marie Dubois',
        email: 'marie@normandycheese.example.com',
        phone: '+33 2 31 45 67 89',
        status: SupplierStatus.VERIFIED,
        complianceScore: 100,
        categories: [ProductType.DAIRY],
        lastShipmentDate: '2023-11-01',
    },
    {
        id: 'SUP-005',
        name: 'Golden State Sprouts',
        country: 'USA',
        contactName: 'John Smith',
        email: 'john@goldensprouts.example.com',
        phone: '+1 555 0199',
        status: SupplierStatus.VERIFIED,
        complianceScore: 92,
        categories: [ProductType.PRODUCE],
        lastShipmentDate: '2023-11-02',
    },
    {
        id: 'SUP-006',
        name: 'Bangkok Spice Traders',
        country: 'Thailand',
        contactName: 'Ploy Thong',
        email: 'ploy@bkspice.example.com',
        phone: '+66 2 999 8888',
        status: SupplierStatus.VERIFIED,
        complianceScore: 96,
        categories: [ProductType.SPICES],
        lastShipmentDate: '2023-11-10',
    }
];

export const MOCK_PLAN: TraceabilityPlan = {
    procedureDescription: "Records are maintained in the VeriPura cloud platform. Original paper records are scanned upon receipt. Electronic records are retained for 2 years.",
    ftlIdentificationProcedure: "We cross-reference all incoming products against the FDA Food Traceability List (FTL) database API. Items flagged as FTL (e.g., leafy greens, histamine-producing fish, soft cheeses) require mandatory CTE/KDE capture.",
    tlcAssignmentProcedure: "For Initial Packing or Transformation events performed by our facilities, unique alphanumeric TLCs are generated using the standard: [LOC_ID]-[DATE]-[SEQ]. Incoming TLCs are preserved.",
    pointOfContact: {
        name: "Sarah Jenkins",
        phone: "+1 (555) 019-2834",
        email: "compliance@veripura.com"
    },
    farmMaps: [
        {
            id: "MAP-001",
            name: "Field A - Romaine",
            location: "Baja California, MX",
            coordinates: [{ lat: 32.5, lng: -116.9 }, { lat: 32.6, lng: -116.8 }]
        }
    ]
};

// SCENARIO 1: FRESH PRODUCE (Melons/Mangoes)
const generateProduceEvents = (baseDate: Date, location: string, tlc: string): TraceabilityEvent[] => {
    const events: TraceabilityEvent[] = [];
    const harvestDate = new Date(baseDate); harvestDate.setDate(harvestDate.getDate() - 10);
    
    events.push({
        id: `evt-h-${Math.random()}`, type: 'Harvesting', date: harvestDate.toISOString().split('T')[0],
        location: `Farm Field 7, ${location}`, performer: 'Farm Co-op A1',
        documents: [{id: 'd1', name: 'Harvest Log', type: 'Certificate', uploadDate: harvestDate.toISOString()}],
        status: 'Complete', details: 'Hand harvested', coordinates: { lat: 15.8700, lng: 100.9925 },
        kdeData: { "Commodity": "Fresh Mangoes", "Quantity": "2000 lbs", "Field Name": "Sector 7", "ReferenceDoc": "H-LOG-223" }
    });

    const coolDate = new Date(baseDate); coolDate.setDate(coolDate.getDate() - 9);
    events.push({
        id: `evt-c-${Math.random()}`, type: 'Cooling', date: coolDate.toISOString().split('T')[0],
        location: `Packhouse Cooling Shed, ${location}`, performer: `${location} Export Group`,
        documents: [], status: 'Complete', details: 'Hydrocooling to 10°C',
        kdeData: { "Cooling Method": "Hydrocooling", "Location of Harvest": `Farm Field 7, ${location}` }
    });

    const packDate = new Date(baseDate); packDate.setDate(packDate.getDate() - 8);
    events.push({
        id: `evt-ip-${Math.random()}`, type: 'Initial Packing', date: packDate.toISOString().split('T')[0],
        location: `Packhouse Main Line, ${location}`, performer: `${location} Export Group`,
        documents: [{id: 'd2', name: 'Packing List', type: 'Certificate', uploadDate: packDate.toISOString()}],
        status: 'Complete', details: 'Graded, washed, and boxed. TLC Assigned.', coordinates: { lat: 13.7563, lng: 100.5018 },
        kdeData: { tlcAssigned: tlc, tlcSource: `${location} Export Group`, "Product": "Nam Dok Mai Mangoes", "Harvest Location": `Farm Field 7, ${location}`, "Cooling Location": `Packhouse Cooling Shed` }
    });

    const shipDate = new Date(baseDate); shipDate.setDate(shipDate.getDate() - 7);
    events.push({
        id: `evt-s-${Math.random()}`, type: 'Shipping', date: shipDate.toISOString().split('T')[0],
        location: 'Laem Chabang Port', performer: 'Ocean Network Express',
        documents: [{id: 'd3', name: 'Bill of Lading', type: 'BOL', uploadDate: shipDate.toISOString()}],
        status: 'Complete', details: 'Loaded onto vessel',
        kdeData: { "Traceability Lot Code": tlc, "Shipped From": `${location} Export Group`, "Shipped To": "VeriPura Imports, Los Angeles" }
    });

    events.push({
        id: `evt-r-${Math.random()}`, type: 'Receiving', date: baseDate.toISOString().split('T')[0],
        location: 'Los Angeles, CA Distribution Center', performer: 'VeriPura Imports',
        documents: [{id: 'd4', name: 'Inspection Report', type: 'Certificate', uploadDate: baseDate.toISOString()}],
        status: 'Complete', details: 'Received and verified',
        kdeData: { "Traceability Lot Code": tlc, "Immediate Previous Source": "Ocean Network Express", "TLC Source Location": `${location} Export Group` }
    });
    return events;
};

// SCENARIO 2: SEAFOOD
const generateFishEvents = (baseDate: Date, tlc: string): TraceabilityEvent[] => {
    const events: TraceabilityEvent[] = [];
    const harvestDate = new Date(baseDate); harvestDate.setDate(harvestDate.getDate() - 12);
    
    events.push({
        id: `evt-h-fish`, type: 'Harvesting', date: harvestDate.toISOString().split('T')[0],
        location: 'FAO Zone 71', performer: 'Vessel: Ocean Spirit II',
        documents: [{id: 'd1', name: 'Captain\'s Log', type: 'Certificate', uploadDate: harvestDate.toISOString()}],
        status: 'Complete', details: 'Wild caught via Longline', coordinates: { lat: 5.5, lng: 130.0 },
        kdeData: { "Vessel Name": "Ocean Spirit II", "Call Sign": "VN-9982", "Species": "Yellowfin Tuna" }
    });

    const landDate = new Date(baseDate); landDate.setDate(landDate.getDate() - 10);
    events.push({
        id: `evt-lr-fish`, type: 'First Land-Based Receiver', date: landDate.toISOString().split('T')[0],
        location: 'Da Nang Port', performer: 'Da Nang Fisheries Co.',
        documents: [{id: 'd2', name: 'Landing Receipt', type: 'Certificate', uploadDate: landDate.toISOString()}],
        status: 'Complete', details: 'Offloaded, weighed. TLC Assigned.', coordinates: { lat: 16.0544, lng: 108.2022 },
        kdeData: { tlcAssigned: tlc, tlcSource: "Da Nang Fisheries Co.", "Harvest Date Range": `${harvestDate.toISOString().split('T')[0]}`, "ReferenceDoc": "LAND-REC-001" }
    });

    const shipDate = new Date(baseDate); shipDate.setDate(shipDate.getDate() - 7);
    events.push({
        id: `evt-s-fish`, type: 'Shipping', date: shipDate.toISOString().split('T')[0],
        location: 'Da Nang Port', performer: 'Maersk Line',
        documents: [{id: 'd4', name: 'Bill of Lading', type: 'BOL', uploadDate: shipDate.toISOString()}],
        status: 'Complete', details: 'Container: MRSK9876543',
        kdeData: { "Traceability Lot Code": tlc }
    });

    events.push({
        id: `evt-r-fish`, type: 'Receiving', date: baseDate.toISOString().split('T')[0],
        location: 'Long Beach, CA', performer: 'VeriPura Imports',
        documents: [], status: 'Complete', details: 'Temperature logger check passed',
        kdeData: { "Traceability Lot Code": tlc, "TLC Source": "Da Nang Fisheries Co." }
    });
    return events;
}

// SCENARIO 3: TRANSFORMATION (Bagged Salad)
const generateTransformationEvents = (baseDate: Date, newTlc: string): TraceabilityEvent[] => {
    const events: TraceabilityEvent[] = [];
    const transDate = new Date(baseDate); transDate.setDate(transDate.getDate() - 3);
    
    events.push({
        id: `evt-t-${Math.random()}`, type: 'Transformation', date: transDate.toISOString().split('T')[0],
        location: 'Green Leaf Processing Facility, MX', performer: 'Green Leaf Farms',
        documents: [{id: 't1', name: 'Production Log', type: 'Certificate', uploadDate: transDate.toISOString()}],
        status: 'Complete', details: 'Washing, Cutting, Mixing, Bagging', coordinates: { lat: 32.4, lng: -116.8 },
        kdeData: {
            tlcAssigned: newTlc,
            "Input 1": "Romaine (TLC: RM-2023-A)",
            "Input 2": "Radicchio (TLC: RD-2023-B)",
            "Output Product": "Spring Mix Salad 10oz"
        }
    });

    events.push({
        id: `evt-ts-${Math.random()}`, type: 'Shipping', date: baseDate.toISOString().split('T')[0],
        location: 'Otay Mesa Border Crossing', performer: 'CrossBorder Logistics',
        documents: [{id: 't2', name: 'BOL', type: 'BOL', uploadDate: baseDate.toISOString()}],
        status: 'Complete', details: 'Shipped to US Distribution Center',
        kdeData: { "Traceability Lot Code": newTlc, "Shipped From": "Green Leaf Processing Facility, MX" }
    });
    return events;
}

// SCENARIO 4: SOFT CHEESE (Ingredients not on FTL)
const generateCheeseEvents = (baseDate: Date, tlc: string): TraceabilityEvent[] => {
    const events: TraceabilityEvent[] = [];
    const transDate = new Date(baseDate); transDate.setDate(transDate.getDate() - 5);

    // Note: No Receiving KDEs for Milk/Salt as they are not FTL.
    // Traceability STARTS at Transformation.
    
    events.push({
        id: `evt-ch-trans`, type: 'Transformation', date: transDate.toISOString().split('T')[0],
        location: 'Normandy, France', performer: 'Normandy Cheese Artisans',
        documents: [{id: 'c1', name: 'Production Batch Log', type: 'Certificate', uploadDate: transDate.toISOString()}],
        status: 'Complete', details: 'Pasteurization and Curdling. TLC Assigned.', coordinates: { lat: 49.1829, lng: -0.3707 },
        kdeData: {
            tlcAssigned: tlc,
            "Input Ingredients": "Milk (Non-FTL), Salt (Non-FTL), Cultures",
            "Output Product": "Brie de Meaux",
            "Note": "Ingredients are exempt from FTL receiving records."
        }
    });

    const shipDate = new Date(baseDate); shipDate.setDate(shipDate.getDate() - 2);
    events.push({
        id: `evt-ch-ship`, type: 'Shipping', date: shipDate.toISOString().split('T')[0],
        location: 'Le Havre Port', performer: 'CMA CGM',
        documents: [{id: 'c2', name: 'Air Waybill', type: 'BOL', uploadDate: shipDate.toISOString()}],
        status: 'Complete', details: 'Air Freight to JFK',
        kdeData: { "Traceability Lot Code": tlc, "Shipped From": "Normandy Cheese Artisans" }
    });

    events.push({
        id: `evt-ch-rec`, type: 'Receiving', date: baseDate.toISOString().split('T')[0],
        location: 'New York, NY Distribution Center', performer: 'VeriPura Imports',
        documents: [], status: 'Complete', details: 'Received at cold storage',
        kdeData: { "Traceability Lot Code": tlc, "Immediate Previous Source": "Normandy Cheese Artisans" }
    });

    return events;
}

// SCENARIO 5: SPROUTS (Initial Packer tracks seed info)
const generateSproutsEvents = (baseDate: Date, tlc: string): TraceabilityEvent[] => {
    const events: TraceabilityEvent[] = [];
    const packDate = new Date(baseDate); packDate.setDate(packDate.getDate() - 2);

    // Initial Packing - Sprouter must record Seed details even though Seed grower is exempt
    events.push({
        id: `evt-sp-ip`, type: 'Initial Packing', date: packDate.toISOString().split('T')[0],
        location: 'Sacramento, CA', performer: 'Golden State Sprouts',
        documents: [{id: 's1', name: 'Seed Tag Info', type: 'Certificate', uploadDate: packDate.toISOString()}],
        status: 'Complete', details: 'Sprouting and Packing. TLC Assigned.', coordinates: { lat: 38.5816, lng: -121.4944 },
        kdeData: {
            tlcAssigned: tlc,
            "Seed Lot Code": "SEED-LOT-998",
            "Seed Supplier": "NorCal Seeds Inc.",
            "Seed Description": "Alfalfa Seeds (Organic)",
            "Date Received": "2023-10-20"
        }
    });

    events.push({
        id: `evt-sp-ship`, type: 'Shipping', date: baseDate.toISOString().split('T')[0],
        location: 'Sacramento, CA', performer: 'Golden State Sprouts',
        documents: [{id: 's2', name: 'Invoice', type: 'Invoice', uploadDate: baseDate.toISOString()}],
        status: 'Complete', details: 'Direct Store Delivery',
        kdeData: { "Traceability Lot Code": tlc }
    });

    return events;
}

export const MOCK_PRODUCTS: Product[] = [
    {
        id: 'PROD-001',
        tlc: 'TH-MG-2023-8892',
        name: 'Nam Dok Mai Mangoes',
        category: ProductType.PRODUCE,
        supplierId: 'SUP-001',
        supplierName: 'Thai Mango Co. Ltd',
        receivedDate: '2023-10-25',
        quantity: 500,
        uom: 'Cases',
        isFTL: true,
        ftlCategory: 'Tropical Tree Fruits',
        completeness: 100,
        status: ShipmentStatus.COMPLIANT,
        expirationDate: '2023-11-15',
        events: generateProduceEvents(new Date('2023-10-25'), 'Chiang Mai', 'TH-MG-2023-8892')
    },
    {
        id: 'PROD-002',
        tlc: 'VN-YF-2023-4421',
        name: 'Yellowfin Tuna Loins',
        category: ProductType.SEAFOOD,
        supplierId: 'SUP-002',
        supplierName: 'Vietnam Seafood Exports',
        receivedDate: '2023-10-26',
        quantity: 1200,
        uom: 'kg',
        isFTL: true,
        ftlCategory: 'Finfish (Histamine-producing)',
        completeness: 100,
        status: ShipmentStatus.COMPLIANT,
        expirationDate: '2024-10-26',
        events: generateFishEvents(new Date('2023-10-26'), 'VN-YF-2023-4421')
    },
    {
        id: 'PROD-003',
        tlc: 'MX-SM-2023-9911',
        name: 'Fresh Spring Mix Salad',
        category: ProductType.READY_TO_EAT,
        supplierId: 'SUP-003',
        supplierName: 'Green Leaf Farms',
        receivedDate: '2023-10-29',
        quantity: 5000,
        uom: 'Units',
        isFTL: true,
        ftlCategory: 'Leafy Greens (Fresh-Cut)',
        completeness: 95,
        status: ShipmentStatus.COMPLIANT,
        expirationDate: '2023-11-05',
        events: generateTransformationEvents(new Date('2023-10-29'), 'MX-SM-2023-9911')
    },
    {
        id: 'PROD-004',
        tlc: 'FR-BR-2023-1101',
        name: 'Brie de Meaux AOC',
        category: ProductType.DAIRY,
        supplierId: 'SUP-004',
        supplierName: 'Normandy Cheese Artisans',
        receivedDate: '2023-11-01',
        quantity: 200,
        uom: 'Wheels',
        isFTL: true,
        ftlCategory: 'Cheeses (Soft)',
        completeness: 100,
        status: ShipmentStatus.COMPLIANT,
        expirationDate: '2023-12-15',
        events: generateCheeseEvents(new Date('2023-11-01'), 'FR-BR-2023-1101')
    },
    {
        id: 'PROD-005',
        tlc: 'US-SP-2023-228',
        name: 'Alfalfa Sprouts',
        category: ProductType.PRODUCE,
        supplierId: 'SUP-005',
        supplierName: 'Golden State Sprouts',
        receivedDate: '2023-11-02',
        quantity: 1000,
        uom: 'Clamshells',
        isFTL: true,
        ftlCategory: 'Sprouts',
        completeness: 100,
        status: ShipmentStatus.COMPLIANT,
        expirationDate: '2023-11-09',
        events: generateSproutsEvents(new Date('2023-11-02'), 'US-SP-2023-228')
    },
    // New Raw Materials for Curry Paste Demo
    {
        id: 'RM-001',
        tlc: 'RM-CHI-24-001',
        name: 'Fresh Red Chili Peppers',
        category: ProductType.PRODUCE,
        supplierId: 'SUP-006',
        supplierName: 'Bangkok Spice Traders',
        receivedDate: '2024-01-10',
        quantity: 500,
        uom: 'kg',
        isFTL: true,
        ftlCategory: 'Peppers (Fresh)',
        completeness: 100,
        status: ShipmentStatus.COMPLIANT,
        events: []
    },
    {
        id: 'RM-002',
        tlc: 'RM-GAL-24-002',
        name: 'Fresh Galangal',
        category: ProductType.PRODUCE,
        supplierId: 'SUP-006',
        supplierName: 'Bangkok Spice Traders',
        receivedDate: '2024-01-10',
        quantity: 200,
        uom: 'kg',
        isFTL: false, // Galangal not on FTL (but part of recipe)
        ftlCategory: undefined,
        completeness: 100,
        status: ShipmentStatus.COMPLIANT,
        events: []
    },
    {
        id: 'RM-003',
        tlc: 'RM-SHR-24-003',
        name: 'Shrimp Paste',
        category: ProductType.SEAFOOD,
        supplierId: 'SUP-002',
        supplierName: 'Vietnam Seafood Exports',
        receivedDate: '2024-01-08',
        quantity: 100,
        uom: 'kg',
        isFTL: true,
        ftlCategory: 'Crustaceans',
        completeness: 100,
        status: ShipmentStatus.COMPLIANT,
        events: []
    }
];

export const MOCK_ALERTS = [
    { id: '1', title: 'Transformation Record Issue', description: 'Input TLC missing for Spring Mix batch MX-SM-2023.', severity: 'medium', date: '2h ago' },
    { id: '2', title: 'Traceability Plan Review', description: 'Annual review of traceability plan due in 15 days.', severity: 'low', date: '5h ago' },
    { id: '3', title: 'FDA Request Simulation', description: '24-hour response drill initiated.', severity: 'high', date: '1d ago' },
];