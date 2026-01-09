/**
 * Product domain models for solar catalog.
 * Requirements: 1.2, 2.3
 */

export type ProductCategory = 'inverter' | 'battery' | 'panel' | 'accessory' | 'complete_system';

export interface ProductSpecifications {
    /** Power capacity in Watts or VA */
    capacity?: number;
    /** Unit for capacity (W, kW, Wh, kWh, VA, kVA) */
    capacityUnit?: string;
    /** Voltage (e.g., 12V, 24V, 48V) */
    voltage?: number;
    /** Efficiency percentage */
    efficiency?: number;
    /** Dimensions (L x W x H) */
    dimensions?: string;
    /** Warranty period in years */
    warrantyYears?: number;
    [key: string]: any;
}

export interface SolarProduct {
    id: string;
    name: string;
    model: string;
    category: ProductCategory;
    brand: string;
    price: number;
    currency: string;
    description: string;
    features: string[];
    specifications: ProductSpecifications;
    inStock: boolean;
    metadata?: Record<string, any>;
}
