export enum ShipmentStatus {
    PENDING = 'Pending',
    IN_TRANSIT = 'In Transit',
    RECEIVED = 'Received',
    INCOMPLETE = 'Incomplete',
    COMPLIANT = 'Compliant'
}

export enum SupplierStatus {
    VERIFIED = 'Verified',
    PENDING = 'Pending Verification',
    ACTION_REQUIRED = 'Action Required',
    INACTIVE = 'Inactive'
}

export enum ProductType {
    PRODUCE = 'Fresh Produce',
    SEAFOOD = 'Seafood',
    PACKAGED = 'Packaged Food',
    SPICES = 'Herbs & Spices'
}

export interface Address {
    street: string;
    city: string;
    state?: string;
    country: string;
    zip?: string;
}

export interface Supplier {
    id: string;
    name: string;
    country: string;
    contactName: string;
    email: string;
    phone: string;
    status: SupplierStatus;
    complianceScore: number;
    categories: ProductType[];
    lastShipmentDate: string;
}

export interface Document {
    id: string;
    name: string;
    type: 'BOL' | 'Invoice' | 'Certificate' | 'Photo' | 'Lab Report';
    uploadDate: string;
    expiryDate?: string;
    url?: string;
}

export interface TraceabilityEvent {
    id: string;
    type: 'Harvesting' | 'Packing' | 'Cooling' | 'Shipping' | 'Receiving';
    date: string;
    location: string;
    performer: string;
    documents: Document[];
    status: 'Complete' | 'Missing Data';
    details?: string;
    coordinates?: { lat: number; lng: number };
}

export interface Product {
    id: string;
    tlc: string; // Traceability Lot Code
    name: string;
    category: ProductType;
    supplierId: string;
    supplierName: string;
    receivedDate: string;
    quantity: number;
    uom: string;
    isFTL: boolean; // Food Traceability List
    completeness: number; // 0-100
    status: ShipmentStatus;
    events: TraceabilityEvent[];
    expirationDate?: string;
}

export interface Alert {
    id: string;
    title: string;
    description: string;
    severity: 'low' | 'medium' | 'high';
    date: string;
}

export interface AppState {
    suppliers: Supplier[];
    products: Product[];
    alerts: Alert[];
    currentUser: {
        name: string;
        role: 'Admin' | 'Manager' | 'User';
        company: string;
    };
}