import React from 'react';
import styled from 'styled-components';
import { useProductNavigation } from "./ProductCard";

const CardContainer = styled.div`
  display: flex;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
  min-width: 60vh;
`;

const InfoContainer = styled.div`
  flex: 1;
  padding-right: 10px;
`;

const ProductContainer = styled.div`
  flex: 5;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
`;

const ProductImage = styled.img`
  height: calc(100vh / 6);
  object-fit: contain;
`;

const StatusContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const OrderCard = ({ order }) => {
    const deliveryDateFormatted = new Date(order.deliveryDate).toLocaleDateString();
    const orderDateFormatted = new Date(order.orderDate).toLocaleDateString();
    const { handleCardClick } = useProductNavigation();

    return (
        <CardContainer>
            <InfoContainer>
                <h3>Order Nº: {order.id}</h3>
                <AddressText>Delivery address: {order.deliveryAddress}</AddressText>
                <AddressText>Delivery date: {deliveryDateFormatted}</AddressText>
                <p>Order date: {orderDateFormatted}</p>
            </InfoContainer>

            <ProductContainer>
                {order.products.slice(0, 3).map(product => (
                    <ProductImage
                        onClick={() => handleCardClick(product.id)}
                        key={product.id}
                        src={`/images/${product.photo}`}
                        alt={product.title} />
                ))}
            </ProductContainer>

            <StatusContainer>
                <p>Order status: {order.orderStatus}</p>
                <p>Total cost: ${parseFloat(order.totalCost).toFixed(2)}</p> {/* Ensure totalCost is a number */}
            </StatusContainer>
        </CardContainer>
    );
};

// Styled components for additional styling
const AddressText = styled.p`
  padding-left: 10%; /* Added padding for address text */
`;

export default OrderCard;