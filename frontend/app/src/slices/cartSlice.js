import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Fetch cart items
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async ({ userId }, { rejectWithValue }) => {
        const response = await fetch(`http://localhost:5000/cart/${userId}`);
        if (!response.ok) {
            return rejectWithValue('Error loading cart');
        }
        return await response.json(); // Return cart data
    }
);

// Add item to cart
export const addToCartAsync = createAsyncThunk(
    'cart/addToCart',
    async ({ userId, productId, quantity }, { rejectWithValue }) => {
        const response = await fetch('http://localhost:5000/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, productId, quantity }),
        });

        if (!response.ok) {
            return rejectWithValue('Error adding item to cart');
        }

        return { productId, quantity }; // Return product ID and quantity
    }
);

// Remove item from cart
export const removeFromCartAsync = createAsyncThunk(
    'cart/removeFromCart',
    async ({ userId, productId }, { rejectWithValue }) => {
        const response = await fetch(`http://localhost:5000/cart/${productId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId }), // Send userId in the request body
        });

        if (!response.ok) {
            return rejectWithValue('Error removing item from cart');
        }

        return productId; // Return removed product ID
    }
);

// Update item quantity in cart
export const updateQuantityAsync = createAsyncThunk(
    'cart/updateQuantity',
    async ({ userId, productId, quantity }, { rejectWithValue }) => {
        if (quantity === 0) {
            // If quantity is 0, remove the item
            const response = await fetch(`http://localhost:5000/cart/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) {
                return rejectWithValue('Error removing item from cart');
            }

            return productId; // Return removed product ID
        } else {
            // Update item quantity
            const response = await fetch('http://localhost:5000/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, productId, quantity }),
            });

            if (!response.ok) {
                return rejectWithValue('Error updating item quantity in cart');
            }

            return { productId, quantity }; // Return product ID and new quantity
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: {},
        isLoaded: false, // Flag to track loading state
    },
    reducers: {
        clearCart(state) {
            state.items = {}; // Clear cart state
            localStorage.removeItem('cart'); // Remove cache from localStorage
        },
        loadCartFromLocalStorage(state) {
            const cachedCart = localStorage.getItem('cart');
            if (cachedCart) {
                state.items = JSON.parse(cachedCart); // Load data from localStorage
                state.isLoaded = true;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.items = {};
                action.payload.forEach(item => {
                    state.items[item.productId] = item.quantity; // Fill state with quantities of products
                });
                localStorage.setItem('cart', JSON.stringify(state.items));
                state.isLoaded = true;
            })
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                const { productId, quantity } = action.payload;
                state.items[productId] = (state.items[productId] || 0) + quantity; // Update or add new item quantity
                localStorage.setItem('cart', JSON.stringify(state.items));
            })
            .addCase(removeFromCartAsync.fulfilled, (state, action) => {
                delete state.items[action.payload]; // Remove item from state
                localStorage.setItem('cart', JSON.stringify(state.items));
            })
            .addCase(updateQuantityAsync.fulfilled, (state, action) => {
                const { productId, quantity } = action.payload;
                if (quantity > 0) {
                    state.items[productId] = quantity; // Update quantity
                } else {
                    delete state.items[productId]; // Remove item if quantity is 0
                }
                localStorage.setItem('cart', JSON.stringify(state.items));
            })
            .addCase(fetchCart.rejected, (state, action) => {
                console.error(action.payload); // Log error message on failure
            })
            .addCase(addToCartAsync.rejected, (state, action) => {
                console.error(action.payload); // Log error message on failure
            })
            .addCase(removeFromCartAsync.rejected, (state, action) => {
                console.error(action.payload); // Log error message on failure
            })
            .addCase(updateQuantityAsync.rejected, (state, action) => {
                console.error(action.payload); // Log error message on failure
            });
    },
});

// Export reducer and actions
export default cartSlice.reducer;
export const { clearCart, loadCartFromLocalStorage } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items; // Selector for getting items in the cart