import { useQuery } from 'react-query';

const fetchProductData = async (productId) => {
    const response = await fetch(`https://api.example.com/products/${productId}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return await response.json();
};

const useProduct = (productId) => {
    return useQuery(['product', productId], () => fetchProductData(productId), {
        enabled: !!productId,
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 30, // 30 minutes
    });
};

export default useProduct;
