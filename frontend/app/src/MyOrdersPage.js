import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser } from './slices/userSlice';
import { fetchOrders } from './slices/orderSlice';
import OrderCard from './OrderCard';
import Sort from './Sort';
import Header from "./Header";
import styled from 'styled-components';

const MyOrdersPage = () => {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const orders = useSelector(state => state.orders.items);
    const [sortOrder, setSortOrder] = useState('asc');
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        if (user.isAuthenticated) {
            dispatch(fetchOrders({ userId: user.userData.id }));
        }
    }, [dispatch, user]);

    useEffect(() => {
        setFilteredOrders(orders);
    }, [orders]);

    const handleSort = (sortType) => {
        let sortedOrders;
        if (sortType === 'date') {
            sortedOrders = [...filteredOrders].sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
        } else if (sortType === 'price') {
            sortedOrders = [...filteredOrders].sort((a, b) =>
                sortOrder === 'asc' ? a.totalCost - b.totalCost : b.totalCost - a.totalCost
            );
        }
        setFilteredOrders(sortedOrders);
    };

    const toggleSortOrder = () => {
        setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
        handleSort('price');
    };

    return (
        <Container>
            <Header />
            <Content>
                <SortContainer>
                    <Sort
                        onSort={handleSort}
                        sortOrder={sortOrder}
                        toggleSortOrder={toggleSortOrder}
                    />
                </SortContainer>

                <OrderList>
                    {filteredOrders.length === 0 ? (
                        <p>No orders found.</p>
                    ) : (
                        filteredOrders.map(order => (
                            <OrderCard key={order.id} order={order} />
                        ))
                    )}
                </OrderList>
            </Content>
        </Container>
    );
};

// Styled components
const Container = styled.div`
    padding: 10px;
`;

const Content = styled.div`
    margin: 10px;
`;

const SortContainer = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
`;

const OrderList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export default MyOrdersPage;