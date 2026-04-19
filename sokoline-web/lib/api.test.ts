import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getProduct } from './api';

describe('getProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch a product successfully', async () => {
    const mockProduct = { id: 1, name: 'Test Product', slug: 'test-product' };
    
    // Mock global fetch
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockProduct,
    });

    const result = await getProduct('test-product');
    
    expect(result).toEqual(mockProduct);
    expect(fetch).toHaveBeenCalledWith('https://api.sokoline.app/api/products/test-product/', expect.any(Object));
  });

  it('should return null when fetch fails', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
    });

    const result = await getProduct('non-existent');
    
    expect(result).toBeNull();
  });

  it('should return null and log error when an exception occurs', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network Error'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await getProduct('error-trigger');
    
    expect(result).toBeNull();
    expect(consoleSpy).toHaveBeenCalled();
  });
});
