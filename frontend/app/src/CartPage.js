import {useDispatch, useSelector} from "react-redux";
import {addToCartAsync, clearCart, removeFromCartAsync, selectCartItems, updateQuantityAsync} from "./slices/cartSlice";
import {selectProducts} from "./slices/productSlice";
import {selectUser} from "./slices/userSlice";
import {useState} from "react";
import {useFetchData} from "./MainPage";
import Header from "./Header";
import CartItem from "./CartItem";
import OrderDialog from "./OrderDialog";

const CartPage = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const products = useSelector(selectProducts);
    const user = useSelector(selectUser);
    const [dialogOpen, setDialogOpen] = useState(false); // Состояние для управления открытием диалога

    useFetchData(user);

    const handleCreateOrder = async ({ deliveryAddress, deliveryDate }) => {
        const response = await fetch('http://localhost:5000/my-orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: user.userData.id,
                deliveryAddress,
                deliveryDate,
            }),
        });

        if (response.ok) {
            alert("Заказ успешно создан!");
            dispatch(clearCart()); // Очищаем состояние корзины на клиенте
        } else {
            alert("Ошибка при создании заказа");
        }
    };

    const handleOpenDialog = () => {
        if (Object.keys(cartItems).length === 0) {
            alert("Корзина пуста");
        } else {
            setDialogOpen(true); // Открываем диалог, если корзина не пуста
        }
    };

    const handleQuantityChange = async (productId, quantity) => {
        if (quantity > 0) {
            await dispatch(updateQuantityAsync({ userId: user.userData.id, productId: productId, quantity }));
            await dispatch(addToCartAsync({ userId: user.userData.id, productId: productId, quantity }));
        } else {
            await handleRemove(productId); // Удаляем товар, если количество 0
        }
    };

    const handleRemove = async (productId) => {
        await dispatch(removeFromCartAsync({ userId: user.userData.id, productId }));
    };

    const cartProducts = Object.keys(cartItems).map(productId => {
        const product = products.find(p => p.id === Number(productId));
        return {
            ...product,
            quantity: cartItems[productId],
        };
    });

    const totalPrice = cartProducts.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalCount = cartProducts.reduce((count, item) => count + item.quantity, 0);

    return (
        <div>
            <Header />
            <div style={cartPageStyle}>
                <div style={productListStyle}>
                    {cartProducts.length === 0 ? (
                        <p>Корзина пуста</p>
                    ) : (
                        cartProducts.map(item => (
                            <CartItem
                                key={item.id}
                                product={item}
                                onRemove={handleRemove}
                                onQuantityChange={handleQuantityChange}
                            />
                        ))
                    )}
                </div>
                <div style={orderSummaryStyle}>
                    <h2>Итог заказа:</h2>
                    <p>Количество товаров: {totalCount}</p>
                    <p>Общая цена: <b>{Number(totalPrice).toFixed(2)}</b></p>
                    <button style={buttonStyle} onClick={handleOpenDialog}>Создать заказ</button>
                </div>
            </div>

            {/* Диалоговое окно для создания заказа */}
            <OrderDialog
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onSubmit={handleCreateOrder}
            />
        </div>
    );
};

const buttonStyle = {
    height: '20%',
    width: '75%',
};

const cartPageStyle = {
    display: 'flex',
    flexDirection: 'row',
    margin: '10px',
    marginTop: '52px',
};

const productListStyle = {
    display: 'flex',
    flexWrap: 'wrap', // Позволяет карточкам переноситься на новую строку
    justifyContent: 'space-between', // Можно использовать flex-start или center в зависимости от вашего дизайна
    flex: 80,
    minWidth: '33vh',
    marginRight: '2%',
};

const orderSummaryStyle = {
    flex: 20,
    border: '1px solid #ccc',
    padding: '0px 20px 20px 20px',
    textAlign: 'center',
    height: '100%',
    // marginRight: '10%',
};

export default CartPage;