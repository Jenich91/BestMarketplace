import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { addToCartAsync } from './slices/cartSlice';
import { selectUser } from './slices/userSlice';
import { fetchProducts, selectProducts } from "./slices/productSlice";
import Header from "./Header";
import styled from 'styled-components';

const ProductDetails = () => {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectUser);
    const products = useSelector(selectProducts);
    const product = products.find(p => p.id === Number(productId));

    useEffect(() => {
        if (!product) {
            dispatch(fetchProducts());
        }
    }, [dispatch, product]);

    const handleAddToCart = async () => {
        if (!user.isAuthenticated) {
            alert("Please log in."); // Message for the user
            navigate("/login"); // Redirect to login page
            return;
        }

        await dispatch(addToCartAsync({ userId: user.userData.id, productId: product.id, quantity: 1 }));
        navigate("/cart");
    };

    if (!product) return <p>Loading...</p>; // Show loading state while fetching products

    return (
        <div>
            <Header />
            <Container>
                <Content>
                    <LeftColumn>
                        <Title>{product.title}</Title>
                        <Image src={`/images/${product.photo}`} alt={product.title} />
                        <VendorInfo>Vendor info: {product.vendorInfo}</VendorInfo>
                    </LeftColumn>

                    <RightColumn>
                        <DescriptionTitle>Product description:</DescriptionTitle>
                        <Description>{product.description}</Description>
                        <PriceAndButtonContainer>
                            <Price>Price: ${product.price}</Price>
                            <AddButton onClick={handleAddToCart}>Add to cart</AddButton>
                        </PriceAndButtonContainer>
                    </RightColumn>
                </Content>
            </Container>
        </div>
    );
};

// Styled components
const Container = styled.div`
    padding: 20px;
    width: 80%;
`;

const Content = styled.div`
    display: flex;
    flex-direction: row;
`;

const LeftColumn = styled.div`
    flex: 1;
    text-align: center;
    margin-right: 20px;
`;

const RightColumn = styled.div`
    flex: 1.5;
    display: flex;
    flex-direction: column;
`;

const Title = styled.h1`
    font-size: 2em;
`;

const Image = styled.img`
    height: calc(100vh / 4);
    object-fit: contain;
`;

const VendorInfo = styled.p`
    margin-top: 10px;
`;

const DescriptionTitle = styled.h2`
    font-size: 1.5em;
`;

const Description = styled.p`
    margin-top: 10px;
`;

const PriceAndButtonContainer = styled.div`
    margin-top: auto; /* Pushes the container up */
    display: flex;
    flex-direction: column; /* Arranges elements vertically */
    align-items: flex-end; /* Aligns to the right */
`;

const Price = styled.h3`
    font-size: 1.5em;
`;

const AddButton = styled.button`
    padding: 10px 20px;
    font-size: 16px;
`;

export default ProductDetails;