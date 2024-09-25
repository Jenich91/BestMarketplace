import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from './slices/productSlice';
import { fetchCart, loadCartFromLocalStorage } from './slices/cartSlice';
import ProductList from './ProductList';
import Header from './Header';
import SearchAndSort from './SearchAndSort';
import { selectUser } from './slices/userSlice';

export const useFetchData = (user) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            // Load products from local storage or server
            const cachedProducts = localStorage.getItem('products');
            if (!cachedProducts) {
                await dispatch(fetchProducts());
            } else {
                const products = JSON.parse(cachedProducts);
                dispatch({ type: 'products/fetchProducts/fulfilled', payload: products });
            }

            // If user is authenticated, load the cart
            if (user.isAuthenticated) {
                dispatch(loadCartFromLocalStorage());
                await dispatch(fetchCart({ userId: user.userData.id }));
            }
        };

        fetchData();
    }, [dispatch, user]);
};

const MainPage = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const productsData = useSelector(state => state.products.items);

    const [filteredProducts, setFilteredProducts] = useState(productsData);
    const [sortOrder, setSortOrder] = useState('asc');

    useFetchData(user);

    useEffect(() => {
        setFilteredProducts(productsData);
    }, [productsData]);

    const handleSearch = (searchTerm) => {
        const filtered = productsData.filter(product =>
            product.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    const handleSort = (sortType) => {
        let sorted;
        if (sortType === 'alphabetical') {
            sorted = [...filteredProducts].sort((a, b) => a.title.localeCompare(b.title));
        } else if (sortType === 'price') {
            sorted = [...filteredProducts].sort((a, b) => sortOrder === 'asc' ? a.price - b.price : b.price - a.price);
        }
        setFilteredProducts(sorted);
    };

    const toggleSortOrder = () => {
        setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        handleSort('price');
    };

    return (
        <div>
            <Header />
            <div style={mainPageContainer}>
                <SearchAndSort
                    onSearch={handleSearch}
                    onSort={handleSort}
                    sortOrder={sortOrder}
                    toggleSortOrder={toggleSortOrder}
                />
                <ProductList products={filteredProducts} />
            </div>
        </div>
    );
};

const mainPageContainer = {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px', // Добавлено для отступов
};

export default MainPage;