import { useState } from 'react';

const useCart = () => {
    const [cart, setCart] = useState([]);

    const addItem = (item) => {
        setCart((prevCart) => [...prevCart, item]);
    };

    const removeItem = (itemId) => {
        setCart((prevCart) => prevCart.filter(item => item.id !== itemId));
    };

    const updateItem = (itemId, newItem) => {
        setCart((prevCart) => 
            prevCart.map(item => (item.id === itemId ? newItem : item))
        );
    };

    const clearCart = () => {
        setCart([]);
    };

    return { cart, addItem, removeItem, updateItem, clearCart };
};

export default useCart;