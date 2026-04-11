import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useSiteSettings() {
  const { data: settingsRecords = [] } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      try {
        return await base44.entities.Settings.list();
      } catch (error) {
        console.error('Error fetching settings:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Convert array of records to object
  const settings = {};
  settingsRecords.forEach(record => {
    settings[record.key] = record.value;
  });

  return {
    settings,
    isLoading: !settingsRecords.length,
  };
}

export function useProducts() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      try {
        const allProducts = await base44.entities.Product.list('-created_date', 100);
        return allProducts.filter(p => p.visible);
      } catch (error) {
        console.error('Error fetching products:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return { products, isLoading };
}

export function useProductById(id) {
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      try {
        return await base44.entities.Product.get(id);
      } catch (error) {
        console.error('Error fetching product:', error);
        return null;
      }
    },
    enabled: !!id,
  });

  return { product, isLoading };
}