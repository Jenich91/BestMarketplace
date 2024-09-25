import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch orders for a user
export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async ({ userId }) => {
        const response = await fetch(`http://localhost:5000/my-orders?userId=${userId}`);
        if (!response.ok) throw new Error('Error loading orders');
        return await response.json();
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        items: [],
        status: 'idle', // Initial status
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.status = 'loading'; // Set loading status
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.status = 'succeeded'; // Set succeeded status
                state.items = action.payload; // Store fetched orders
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.status = 'failed'; // Set failed status
                state.error = action.error.message; // Store error message
            });
    },
});

// Export reducer and selectors
export default orderSlice.reducer;
export const selectOrders = (state) => state.orders.items; // Selector for getting orders
export const selectOrderStatus = (state) => state.orders.status; // Selector for getting order status
export const selectOrderError = (state) => state.orders.error; // Selector for getting order error