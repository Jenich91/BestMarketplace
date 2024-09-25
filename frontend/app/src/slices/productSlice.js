import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async action to fetch products
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        const response = await fetch('http://localhost:5000/products');
        if (!response.ok) {
            return rejectWithValue('Error loading products');
        }
        return await response.json(); // Return product data
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        isLoaded: false,
        status: 'idle', // Initial status
        error: null, // To store error messages
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading'; // Set loading status
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.items = action.payload; // Fill state with products
                state.isLoaded = true; // Set loaded flag
                state.status = 'succeeded'; // Set succeeded status
                localStorage.setItem('products', JSON.stringify(action.payload)); // Save products to localStorage
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed'; // Set failed status
                state.error = action.payload; // Store error message
            });
    },
});

// Export actions and selectors
export const selectProducts = (state) => state.products.items; // Selector for getting products
export const selectProductStatus = (state) => state.products.status; // Selector for getting product status
export const selectProductError = (state) => state.products.error; // Selector for getting product error

export default productSlice.reducer;