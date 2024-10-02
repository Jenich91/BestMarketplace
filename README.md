# Веб-приложение BestMarketplace

## Описание проекта

Данное веб-приложение представляет собой интернет-магазин, разработанный для покупателей. Пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Приложение обеспечивает удобный интерфейс и функциональность для управления покупками.
![bestmarketplace_demo GIF](/images/bestmarketplace_demo.gif)

## Технологии

- **Frontend**:
  - **React**: Библиотека для построения пользовательского интерфейса.
  - **React Router**: Для управления маршрутизацией в приложении.
  - **Redux**: Для управления состоянием приложения.
  - **Redux Thunk**: Для обработки асинхронных действий в Redux.
  - **Styled Components**: Для стилизации компонентов.

- **Backend**:
  - **Node.js**: Среда выполнения JavaScript на сервере.
  - **Express**: Фреймворк для создания веб-приложений на Node.js.
  - **Sequelize**: ORM для работы с базой данных.
  - **PostgreSQL**: Реляционная база данных для хранения данных.

## Архитектура приложения

Приложение состоит из шести страниц, каждая из которых выполняет свою уникальную функцию:

### Основные страницы приложения

1. **Главная страница**: 
   - На странице расположены товары, которые можно просмотреть и добавить в корзину.

2. **Страница “Мои заказы”**: 
   - Доступна только авторизованным пользователям; отображает список заказов пользователя.

3. **Страница ‘Корзина’**: 
   - Доступна только авторизованным пользователям; позволяет просмотреть и управлять товарами в корзине.

4. **Страница товара**: 
   - Доступна как авторизованным, так и неавторизованным пользователям; отображает подробную информацию о конкретном товаре.

5. **Страница авторизации**: 
   - Позволяет пользователям входить в систему.

6. **Страница регистрации**: 
   - Позволяет новым пользователям создать аккаунт.

### Ограничения доступа

- Неавторизованные пользователи могут просматривать только страницы всех товаров и подробные страницы товара.
- При попытке добавить товар в корзину неавторизованный пользователь будет перенаправлен на страницу авторизации.

### Навигация

В приложении присутствует классический навбар:
- Название маркетплейса является ссылкой на главную страницу (страницу всех товаров).
- Все иконки в навбаре также представляют собой ссылки.
- Неавторизованные пользователи видят только название/логотип, без иконок.

### Поиск и сортировка

- На странице товаров можно произвести поиск по названию товаров и сортировку по алфавиту/цене (по возрастанию или убыванию).
- На странице ‘Мои заказы’ также доступна сортировка заказов по цене/дате.

### Сохранение данных корзины

Если пользователь вышел из своего аккаунта и заново авторизовался, данные из корзины сохраняются.

## Используемые эндпоинты

- `POST /login` — Авторизация пользователя.
- `POST /signup` — Регистрация нового пользователя.
- `GET /products` — Получение списка всех товаров.
- `GET /products/:id` — Получение информации о конкретном товаре по ID.
- `GET /my-orders` — Получение списка заказов пользователя.
- `POST /my-orders` — Создание нового заказа.
- `GET /cart` — Получение содержимого корзины.
- `POST /cart` — Добавление товара в корзину.
- `PUT /cart` — Обновление содержимого корзины.

## Запуск проекта с использованием Docker Compose

Для запуска сборки выполните следующие шаги:

1. Установите Docker на вашем компьютере.
2. Перейдите в корневую директорию проекта, где находится файл `docker-compose.yml`.
3. Введите в терминале команду:
   ```bash
   docker-compose up --build

## TypeScript версия
В дополнение к оригинальной версии приложения, существует версия с небольшими минорными правками, разработанная с использованием TypeScript и Webpack.
Основные особенности:
    Использование TypeScript: Обеспечивает строгую типизацию, что помогает избежать ошибок на этапе компиляции и улучшает читаемость кода.
    Webpack: Используется для сборки и оптимизации ресурсов приложения, что позволяет уменьшить время загрузки и улучшить производительность.
    Улучшенная совместимость: Исправлены проблемы, связанные с отображением оконок корзины и истории заказов, и размером dropdown списков в браузере Safari.

https://github.com/Jenich91/BestMarketplace-1.1
