import { Supplier, Product, ShipmentStatus, SupplierStatus, ProductType, TraceabilityEvent } from '../types';

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
        name: 'Siam Spices & Herbs',
        country: 'Thailand',
        contactName: 'Araya Srivat',
        email: 'araya@siamspices.example.com',
        phone: '+66 53 112 233',
        status: SupplierStatus.ACTION_REQUIRED,
        complianceScore: 45,
        categories: [ProductType.SPICES, ProductType.PACKAGED],
        lastShipmentDate: '2023-09-15',
    },
    {
        id: 'SUP-004',
        name: 'Mekong Delta Rice Noodles',
        country: 'Vietnam',
        contactName: 'Le Thi Lan',
        email: 'lan@mekongnoodles.example.com',
        phone: '+84 292 377 8899',
        status: SupplierStatus.VERIFIED,
        complianceScore: 92,
        categories: [ProductType.PACKAGED],
        lastShipmentDate: '2023-10-28',
    }
];

const generateEvents = (baseDate: Date, location: string, isComplete: boolean): TraceabilityEvent[] => {
    const events: TraceabilityEvent[] = [];
    
    // 1. Harvest
    const harvestDate = new Date(baseDate);
    harvestDate.setDate(harvestDate.getDate() - 10);
    events.push({
        id: `evt-h-${Math.random()}`,
        type: 'Harvesting',
        date: harvestDate.toISOString().split('T')[0],
        location: `Farm Loc ${location}`,
        performer: 'Farm Co-op A1',
        documents: isComplete ? [{id: 'd1', name: 'Harvest Log', type: 'Certificate', uploadDate: harvestDate.toISOString()}] : [],
        status: isComplete ? 'Complete' : 'Missing Data',
        details: 'Hand harvested, field packed',
        coordinates: { lat: 15.8700, lng: 100.9925 }
    });

    // 2. Packing
    const packDate = new Date(baseDate);
    packDate.setDate(packDate.getDate() - 8);
    events.push({
        id: `evt-p-${Math.random()}`,
        type: 'Packing',
        date: packDate.toISOString().split('T')[0],
        location: `Packhouse ${location}`,
        performer: `${location} Export Group`,
        documents: [{id: 'd2', name: 'Packing List', type: 'Certificate', uploadDate: packDate.toISOString()}],
        status: 'Complete',
        details: 'Sorted, washed, and boxed',
        coordinates: { lat: 13.7563, lng: 100.5018 }
    });

    // 3. Shipping
    const shipDate = new Date(baseDate);
    shipDate.setDate(shipDate.getDate() - 7);
    events.push({
        id: `evt-s-${Math.random()}`,
        type: 'Shipping',
        date: shipDate.toISOString().split('T')[0],
        location: 'Laem Chabang Port',
        performer: 'Ocean Network Express',
        documents: [{id: 'd3', name: 'Bill of Lading', type: 'BOL', uploadDate: shipDate.toISOString()}],
        status: 'Complete',
        details: 'Vessel: Northern Javelin',
        coordinates: { lat: 13.0827, lng: 100.8956 }
    });

    // 4. Receiving (Target)
    events.push({
        id: `evt-r-${Math.random()}`,
        type: 'Receiving',
        date: baseDate.toISOString().split('T')[0],
        location: 'Los Angeles, CA Distribution Center',
        performer: 'VeriPura Imports',
        documents: [{id: 'd4', name: 'Inspection Report', type: 'Certificate', uploadDate: baseDate.toISOString()}],
        status: 'Complete',
        details: 'Received in good condition',
        coordinates: { lat: 34.0522, lng: -118.2437 }
    });

    return events;
};

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
        completeness: 100,
        status: ShipmentStatus.COMPLIANT,
        expirationDate: '2023-11-15',
        events: generateEvents(new Date('2023-10-25'), 'Chiang Mai', true)
    },
    {
        id: 'PROD-002',
        tlc: 'VN-SH-2023-4421',
        name: 'Black Tiger Shrimp (Frozen)',
        category: ProductType.SEAFOOD,
        supplierId: 'SUP-002',
        supplierName: 'Vietnam Seafood Exports',
        receivedDate: '2023-10-26',
        quantity: 1200,
        uom: 'kg',
        isFTL: true,
        completeness: 65,
        status: ShipmentStatus.INCOMPLETE,
        expirationDate: '2024-10-26',
        events: generateEvents(new Date('2023-10-26'), 'Ca Mau', false)
    },
    {
        id: 'PROD-003',
        tlc: 'TH-CU-2023-1102',
        name: 'Green Curry Paste',
        category: ProductType.PACKAGED,
        supplierId: 'SUP-003',
        supplierName: 'Siam Spices & Herbs',
        receivedDate: '2023-10-20',
        quantity: 200,
        uom: 'Cases',
        isFTL: false,
        completeness: 40,
        status: ShipmentStatus.INCOMPLETE,
        expirationDate: '2025-01-20',
        events: generateEvents(new Date('2023-10-20'), 'Bangkok', false)
    },
    {
        id: 'PROD-004',
        tlc: 'VN-RN-2023-9981',
        name: 'Rice Noodles (Dried)',
        category: ProductType.PACKAGED,
        supplierId: 'SUP-004',
        supplierName: 'Mekong Delta Rice Noodles',
        receivedDate: '2023-10-28',
        quantity: 1500,
        uom: 'Units',
        isFTL: false,
        completeness: 100,
        status: ShipmentStatus.RECEIVED,
        expirationDate: '2024-10-28',
        events: generateEvents(new Date('2023-10-28'), 'Can Tho', true)
    },
    {
        id: 'PROD-005',
        tlc: 'TH-LY-2023-5561',
        name: 'Fresh Lychees',
        category: ProductType.PRODUCE,
        supplierId: 'SUP-001',
        supplierName: 'Thai Mango Co. Ltd',
        receivedDate: '2023-10-27',
        quantity: 300,
        uom: 'Cases',
        isFTL: true,
        completeness: 90,
        status: ShipmentStatus.RECEIVED,
        expirationDate: '2023-11-05',
        events: generateEvents(new Date('2023-10-27'), 'Lampang', true)
    }
];

export const MOCK_ALERTS = [
    { id: '1', title: 'Missing Supplier Data', description: 'Vietnam Seafood Exports has not uploaded harvest logs for recent shipment.', severity: 'high', date: '2h ago' },
    { id: '2', title: 'Certificate Expiring', description: 'GMP Certificate for Siam Spices & Herbs expires in 5 days.', severity: 'medium', date: '5h ago' },
    { id: '3', title: 'FDA List Update', description: 'New guidance issued for fresh cheese imports.', severity: 'low', date: '1d ago' },
];