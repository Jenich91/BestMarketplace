const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

// Подключение к базе данных PostgreSQL
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
});

// Define models
const User = sequelize.define('user', {
    login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    freezeTableName: true,
});

const Product = sequelize.define('product', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    photo: {
        type: DataTypes.STRING, // File name
        allowNull: true,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    vendorInfo: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    price: {
        type: DataTypes.DECIMAL(10, 2), // For storing prices
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    freezeTableName: true,
});

const Order = sequelize.define('order', {
    orderDate: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    deliveryAddress: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    deliveryDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    orderStatus: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Pending',
    },
    totalCost: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0.00, // Initially 0
    },
}, {
    freezeTableName: true,
});

// Relationships
User.hasMany(Order);
Order.belongsTo(User);

const OrderProduct = sequelize.define('order_product', {
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
}, {
    freezeTableName: true,
});

Order.belongsToMany(Product, { through: OrderProduct });
Product.belongsToMany(Order, { through: OrderProduct });

const Cart = sequelize.define('cart', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
    },
}, {
    freezeTableName: true,
});

// Relationships for Cart
User.hasMany(Cart);
Cart.belongsTo(User);
Product.hasMany(Cart);
Cart.belongsTo(Product);

// Функция для создания таблиц и заполнения данными
async function initializeDatabase() {
    try {
        await sequelize.sync({ force: true }); // Создает таблицы, если их нет, и очищает их при необходимости

        // Заполнение таблицы Product начальными данными
        await Product.bulkCreate([
            {
                title: 'Apple iPhone 13',
                photo: 'iphone13.png',
                description: 'The Apple iPhone 13 is the latest addition to the iPhone family, featuring the powerful A15 Bionic chip that ensures lightning-fast performance and exceptional battery life. With a stunning Super Retina XDR display, your photos and videos will come to life with vibrant colors and incredible detail. Capture your memories with the advanced dual-camera system, which includes Night mode for low-light photography and Cinematic mode for professional-quality video recording. The iPhone 13 also supports 5G connectivity, allowing for faster downloads and streaming. With its sleek design and durable construction, this smartphone is perfect for anyone looking for a premium device that combines style with functionality.',
                vendorInfo: 'Apple',
                price: 999.99,
            },
            {
                title: 'Samsung Galaxy S21',
                photo: 'galaxy_s21.png',
                description: 'Experience the future of mobile technology with the Samsung Galaxy S21. This flagship smartphone boasts a stunning Dynamic AMOLED display that offers vibrant colors and deep contrasts, making everything from gaming to streaming a visual delight. Equipped with a powerful Exynos processor and ample RAM, multitasking is seamless and efficient. The Galaxy S21 features a triple-camera system that allows you to capture stunning photos in any lighting condition, while the 8K video recording capability brings your memories to life like never before. With its sleek design and premium materials, the Galaxy S21 is not just a phone; it’s a statement.',
                vendorInfo: 'Samsung',
                price: 799.99,
            },
            {
                title: 'Google Pixel 6',
                photo: 'pixel_6.png',
                description: 'The Google Pixel 6 redefines smartphone photography with its advanced AI capabilities and exceptional camera technology. Featuring a unique design and an impressive OLED display, this smartphone offers an immersive viewing experience for all your media needs. The Pixel 6 comes with stock Android for a clean user interface and timely updates directly from Google. Its powerful Tensor chip enhances performance while optimizing battery life, ensuring that you stay connected throughout the day. With features like Magic Eraser for photo editing and real-time translation capabilities, the Pixel 6 is perfect for tech-savvy users who value innovation.',
                vendorInfo: 'Google',
                price: 599.99,
            },
            {
                title: 'OnePlus 9',
                photo: 'oneplus_9.png',
                description: 'Introducing the OnePlus 9, designed for speed and performance without compromise. This smartphone features a fluid AMOLED display that refreshes at 120Hz for an ultra-smooth experience whether you’re gaming or scrolling through social media. The OnePlus 9’s Hasselblad camera partnership ensures stunning photography with natural colors and incredible detail in every shot. With Warp Charge technology, you can quickly recharge your phone in minutes, giving you more time to enjoy what matters most. Its sleek design and powerful hardware make it an excellent choice for anyone looking to elevate their mobile experience.',
                vendorInfo: 'OnePlus',
                price: 729.99,
            },
            {
                title: 'Xiaomi Mi 11',
                photo: 'mi_11.png',
                description: 'The Xiaomi Mi 11 is a flagship smartphone packed with cutting-edge technology and features that cater to every need. With its stunning AMOLED display that supports HDR10+ content, every image comes alive with rich colors and deep blacks. The Snapdragon processor ensures top-notch performance whether you’re gaming or multitasking between apps. The Mi 11’s triple-camera setup allows you to capture breathtaking photos in any environment, while its sleek design makes it comfortable to hold and use throughout the day. Enjoy seamless connectivity with 5G support and an array of smart features designed to enhance your daily life.',
                vendorInfo: 'Xiaomi',
                price: 749.99,
            },
            {
                title: 'Sony Xperia 5 III',
                photo: 'xperia_5_iii.png',
                description: 'The Sony Xperia 5 III is engineered for those who appreciate high-quality media consumption and photography. Featuring a vibrant OLED display with a cinematic aspect ratio, it’s perfect for watching movies or playing games on-the-go. The Xperia’s triple-lens camera system provides versatility in shooting options, allowing you to switch between wide-angle shots to telephoto zoom effortlessly. With advanced audio technology integrated into its design, enjoy immersive sound quality whether you’re listening to music or watching videos. The Xperia 5 III combines style, performance, and functionality in one compact device.',
                vendorInfo: 'Sony',
                price: 999.99,
            },
            {
                title: 'Nokia G50',
                photo: 'nokia_g50.png',
                description: 'The Nokia G50 is designed for those who want reliability without breaking the bank. Equipped with a large display that enhances your viewing experience, it’s perfect for streaming videos or browsing social media feeds. With its robust battery life, you can stay connected longer without worrying about charging frequently. The G50 supports 5G connectivity, ensuring faster download speeds when browsing or streaming content online. Its durable design means it can withstand everyday wear and tear while providing essential smartphone functionalities at an affordable price.',
                vendorInfo: 'Nokia',
                price: 299.99,
            },
            {
                title: 'Motorola Moto G Power',
                photo: 'moto_g_power.png',
                description: 'The Motorola Moto G Power is all about long-lasting battery life without sacrificing performance or features. With its massive battery capacity, this phone can last up to three days on a single charge—perfect for users who are always on-the-go. The vibrant display brings your content to life while the capable camera system captures great photos in various conditions. Enjoy smooth performance thanks to its efficient processor that handles everyday tasks effortlessly. The Moto G Power combines functionality with endurance in one affordable package.',
                vendorInfo: 'Motorola',
                price: 249.99,
            },
            {
                title: 'Huawei P40 Pro',
                photo: 'huawei_p40_pro.png',
                description: 'The Huawei P40 Pro stands out with its exceptional camera capabilities and elegant design. Featuring a quad-camera setup powered by advanced AI technology, it delivers stunning photography results even in low-light conditions. The immersive OLED display enhances your viewing experience whether you’re gaming or watching videos online. With fast charging support and long-lasting battery life, this smartphone keeps up with your busy lifestyle while providing seamless performance across all applications.',
                vendorInfo: 'Huawei',
                price: 899.99,
            },
            {
                title: 'Oppo Find X3 Pro',
                photo: 'oppo_find_x3_pro.png',
                description: 'The Oppo Find X3 Pro redefines luxury smartphones with its exquisite design and top-tier specifications. Its stunning AMOLED display offers vibrant colors and deep contrasts for an unparalleled visual experience—perfect for gaming or media consumption. The Find X3 Pro’s advanced camera system captures exceptional images with clarity and detail thanks to its innovative sensor technology. Enjoy fast charging capabilities that ensure you spend less time plugged in and more time enjoying what matters most.',
                vendorInfo: 'Oppo',
                price: 1149.99,
            },
        ]);

        console.log('Database initialized and products added.');
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

// Функция для подключения с повторными попытками
const connectWithRetry = () => {
    return sequelize.sync()
        .then(() => {
            console.log('PostgreSQL connected')
            // Запуск инициализации базы данных
            setTimeout(initializeDatabase, 5000);
        })
        .catch(err => {
            console.error('Error connecting to PostgreSQL:', err);
            setTimeout(connectWithRetry, 5000); // Повторная попытка через 5 секунд
        });
};
// Запускаем подключение
connectWithRetry();

// Sync database
sequelize.sync()
.then(() => console.log('Sync connected'))
.catch(err => console.log('Error connecting to PostgreSQL:', err));

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000; // Set port

// Middleware
app.use(cors());
app.use(express.json());

// User registration
app.post('/signup', async (req, res) => {
    const { login, password } = req.body;

    try {
        const newUser = await User.create({ login, password });
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error });
    }
});

// User login
app.post('/login', async (req, res) => {
    const { login, password } = req.body;

    try {
        const user = await User.findOne({ where: { login, password } });

        if (user) {
            const { password, ...userData } = user.get(); // Exclude password from response
            res.status(200).json({ message: 'Login successful', userData });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Get all products
app.get('/products', async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error });
    }
});

// Get product by ID
app.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByPk(id);

        if (product) {
            res.json(product);

        } else {
            res.status(404).json({ error: 'Product not found' });
        }

    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error });
    }
});

// Get cart items by user ID
app.get('/cart/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const cartItems = await Cart.findAll({ where: { userId }, include: Product });

        if (cartItems.length === 0) return res.status(404).json({ error:'Cart is empty' });

        res.json(cartItems);

    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error });
    }
});

// Add item to cart
app.post('/cart', async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        if (quantity === 0) { // Remove item if quantity is 0
            await Cart.destroy({ where:{ userId, productId }});
            return res.status(200).json({ message:'Item removed from cart' });
        }

        const existingItem = await Cart.findOne({ where:{ userId, productId }});

        if (existingItem) { // Update existing item
            existingItem.quantity = quantity;
            await existingItem.save();
        } else { // Create new item in cart
            await Cart.create({ userId, productId, quantity });
        }

        res.status(201).json({ message:'Item added to cart' });

    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ error });
    }
});

// Remove item from cart
app.delete('/cart/:productId', async (req, res) => {

    const userId = req.body.userId;
    const productId = req.params.productId;

    try {

        if (!userId) return res.status(400).json({ error:'User ID is required' });

        const result = await Cart.destroy({ where:{ userId, productId }});

        if (result === 0) return res.status(404).json({ error:'Item not found in cart' });

        res.json({ message:'Item removed from cart' });

    } catch (error) {

        console.error('Error removing item from cart:', error);
        res.status(500).json({ error });
    }
});

// Create new order
app.post('/my-orders', async (req, res) => {

    try {

        const { userId, deliveryAddress, deliveryDate } = req.body;

        const cartItems = await Cart.findAll({ where:{ userId } });

        if (cartItems.length === 0) return res.status(400).json({ error:'Cart is empty' });

        const totalCostPromises = cartItems.map(async(item) => {

            const product = await Product.findByPk(item.productId);
            return item.quantity * product.price;
        });

        const totalCostArray = await Promise.all(totalCostPromises);
        const totalAmount = totalCostArray.reduce((total, amount) => total + amount, 0);

        const newOrder = await Order.create({
            userId,
            totalCost : totalAmount ,
            deliveryAddress ,
            deliveryDate ,
        });

        await Promise.all(cartItems.map(item => OrderProduct.create({
            orderId:newOrder.id ,
            productId:item.productId ,
            quantity:item.quantity ,
        })));

        await Cart.destroy({ where:{ userId }});

        res.status(201).json({ message:'Order created', orderId:newOrder.id });

    } catch (error) {

        console.error('Error creating order:', error);
        res.status(500).json({ error:'Internal server error' });
    }
});

// Get user's orders
app.get('/my-orders', async (req,res) => {

    try {

        const userId = req.query.userId;

        const orders = await Order.findAll({
            where:{userId},
            include:[{
                model : Product ,
                through : OrderProduct ,
                attributes:['id','title','photo','price'],
            }],
        });

        if (!orders.length ) return res.status(404).json({ message:'Orders not found' });

        res.status(200).json(orders);

    } catch(error){

        console.error('Error fetching orders:',error);
        res.status(500).json({error:'Internal server error'});
    }
});


// Подключение к базе данных
sequelize.sync()
    .then(() => console.log('PostgreSQL connected'))
    .catch(err => console.log('Error connecting to PostgreSQL:', err));

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
