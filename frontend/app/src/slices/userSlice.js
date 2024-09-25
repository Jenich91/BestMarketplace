import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async action for user login
export const fetchLogin = createAsyncThunk(
    'user/login',
    async ({ login, password }, { rejectWithValue }) => {
        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            return rejectWithValue(errorData.message);
        }

        return await response.json(); // Return user data
    }
);

// Create user slice
export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userData: (() => {
            const data = localStorage.getItem('userData');
            try {
                return data ? JSON.parse(data) : null; // Parse if data exists, otherwise null
            } catch {
                return null; // Return null on parsing error
            }
        })(),
        isAuthenticated: !!localStorage.getItem('userData'),
        status: 'idle', // Initial status for loading state
        error: null, // To store error messages
    },
    reducers: {
        logout(state) {
            state.userData = null;
            state.isAuthenticated = false;
            localStorage.removeItem('userData'); // Remove user data from localStorage
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLogin.pending, (state) => {
                state.status = 'loading'; // Set loading status when logging in
            })
            .addCase(fetchLogin.fulfilled, (state, action) => {
                state.userData = action.payload.userData; // Store user data
                state.isAuthenticated = true;
                state.status = 'succeeded'; // Set succeeded status

                localStorage.setItem('userData', JSON.stringify(action.payload.userData)); // Save user data to localStorage
            })
            .addCase(fetchLogin.rejected, (state, action) => {
                state.status = 'failed'; // Set failed status on error
                state.error = action.payload; // Store error message
                console.error(action.payload); // Log error message
                alert(action.payload); // Alert the error message to the user
            });
    },
});

// Export actions and selectors
export const { logout } = userSlice.actions;
export const selectUser = (state) => state.user;

export default userSlice.reducer;