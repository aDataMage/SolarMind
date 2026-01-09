/**
 * Tests for Product Catalog Tool
 * 
 * Validates: Requirements 2.3
 * Feature: solar-multi-agent-assistant
 */

import { describe, it, expect } from 'vitest';
import {
  searchProductCatalog,
  formatProductForDisplay,
  type ProductSearchParams,
} from '@/lib/infrastructure/ai/tools/product-catalog-tool';
import type { SolarProduct } from '@/lib/domain/models/product';

describe('Product Catalog Tool', () => {
  describe('searchProductCatalog', () => {
    it('should return all products when no filters applied', () => {
      const result = searchProductCatalog({});

      expect(result.products.length).toBeGreaterThan(0);
      expect(result.totalFound).toBe(result.products.length);
    });

    it('should filter by category - inverters', () => {
      const params: ProductSearchParams = {
        category: 'inverter',
      };

      const result = searchProductCatalog(params);

      expect(result.products.length).toBeGreaterThan(0);
      result.products.forEach((product) => {
        expect(product.category).toBe('inverter');
      });
    });

    it('should filter by category - batteries', () => {
      const params: ProductSearchParams = {
        category: 'battery',
      };

      const result = searchProductCatalog(params);

      expect(result.products.length).toBeGreaterThan(0);
      result.products.forEach((product) => {
        expect(product.category).toBe('battery');
      });
    });

    it('should filter by maximum budget', () => {
      const params: ProductSearchParams = {
        maxBudget: 300000,
      };

      const result = searchProductCatalog(params);

      expect(result.products.length).toBeGreaterThan(0);
      result.products.forEach((product) => {
        expect(product.price).toBeLessThanOrEqual(300000);
      });
    });

    it('should filter by minimum capacity for inverters', () => {
      const params: ProductSearchParams = {
        category: 'inverter',
        minCapacity: 3000, // 3000W minimum
      };

      const result = searchProductCatalog(params);

      expect(result.products.length).toBeGreaterThan(0);
      result.products.forEach((product) => {
        expect(product.specifications.capacity).toBeGreaterThanOrEqual(3000);
      });
    });

    it('should filter by brand', () => {
      const params: ProductSearchParams = {
        brand: 'SolarMax',
      };

      const result = searchProductCatalog(params);

      expect(result.products.length).toBeGreaterThan(0);
      result.products.forEach((product) => {
        expect(product.brand.toLowerCase()).toContain('solarmax');
      });
    });

    it('should combine multiple filters', () => {
      const params: ProductSearchParams = {
        category: 'inverter',
        maxBudget: 400000,
        brand: 'SolarMax',
      };

      const result = searchProductCatalog(params);

      expect(result.products.length).toBeGreaterThan(0);
      result.products.forEach((product) => {
        expect(product.category).toBe('inverter');
        expect(product.price).toBeLessThanOrEqual(400000);
        expect(product.brand.toLowerCase()).toContain('solarmax');
      });
    });

    it('should return empty array when no products match filters', () => {
      const params: ProductSearchParams = {
        category: 'inverter',
        maxBudget: 10000, // Very low budget
      };

      const result = searchProductCatalog(params);

      expect(result.products).toHaveLength(0);
      expect(result.totalFound).toBe(0);
    });

    it('should sort products by price ascending', () => {
      const params: ProductSearchParams = {
        category: 'inverter',
      };

      const result = searchProductCatalog(params);

      for (let i = 1; i < result.products.length; i++) {
        expect(result.products[i].price).toBeGreaterThanOrEqual(
          result.products[i - 1].price
        );
      }
    });

    it('should include filters in result', () => {
      const params: ProductSearchParams = {
        category: 'battery',
        maxBudget: 500000,
      };

      const result = searchProductCatalog(params);

      expect(result.filters).toEqual(params);
    });
  });

  describe('formatProductForDisplay', () => {
    it('should format product with all details', () => {
      const product: SolarProduct = {
        id: 'test-001',
        name: 'Test Inverter 3kVA',
        model: 'TEST-001',
        category: 'inverter',
        brand: 'TestBrand',
        specifications: {
          capacity: 3000,
          capacityUnit: 'W',
          voltage: 24,
          efficiency: 0.94,
        },
        price: 350000,
        currency: 'NGN',
        inStock: true,
        description: 'A test inverter for unit testing.',
        features: [],
      };

      const formatted = formatProductForDisplay(product);

      expect(formatted).toContain('Test Inverter 3kVA');
      expect(formatted).toContain('TestBrand');
      expect(formatted).toContain('3000W');
      expect(formatted).toContain('In Stock');
      expect(formatted).toContain('A test inverter for unit testing.');
    });

    it('should show out of stock status', () => {
      const product: SolarProduct = {
        id: 'test-002',
        name: 'Out of Stock Product',
        model: 'TEST-002',
        category: 'battery',
        brand: 'TestBrand',
        specifications: {
          capacity: 5000,
          capacityUnit: 'Wh',
        },
        price: 800000,
        currency: 'NGN',
        inStock: false,
        description: 'Currently unavailable.',
        features: [],
      };

      const formatted = formatProductForDisplay(product);

      expect(formatted).toContain('Out of Stock');
    });
  });
});
