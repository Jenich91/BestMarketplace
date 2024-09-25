import React from 'react';
import ProductCard from './ProductCard';
import styled from 'styled-components';

const ProductList = ({ products }) => {
    return (
        <Container>
            {products.map(product => (
                <ProductCard key={product.id} product={product} />
            ))}
        </Container>
    );
};

// Styled components
const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    // padding: 0 20px; // Uncomment if you want to add padding
`;

export default ProductList;