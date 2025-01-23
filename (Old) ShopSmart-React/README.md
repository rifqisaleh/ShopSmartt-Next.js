# ShopSmart App

Hello Everyone !

ShopSmart is an online store application built using React and TypeScript, designed to provide users with a seamless shopping experience. The app integrates features such as product browsing, category filtering, a shopping cart, user authentication, and more. To access my deployed website, visit: [https://shopsmartappmrs.netlify.app/]

## Overview of the Application
ShopSmart allows users to explore a variety of products, filter by categories, and add items to their shopping cart. Users can log in to manage their accounts, while the shopping cart is accessible to both logged-in and non-logged-in users. The app is designed to be intuitive and responsive, ensuring ease of use across devices.

To log-in to the account use:

Email : sutrisno@mail.com
Password: qwerty
 

## Features Implemented
- **Product Listing and Filtering**: Users can view products and filter them by categories and price range.
- **Landing Page**: Highlights featured products and categories.
- **Shopping Cart**: Allows users to add, remove, and update product quantities.
- **Authentication**: Users can register, log in, and access their dashboard.
- **Responsive Design**: Ensures compatibility with various devices.

## Installation Instructions
1. Clone the repository:
   ```bash
   git clone https://github.com/rifqisaleh/ShopSmartApp-Milestone2.git
   ```
2. Navigate to the project directory:
   ```bash
   cd shopSmart
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technologies Used
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend API**: [Platzi API](https://api.escuelajs.co/)
- **Routing**: React Router
- **State Management**: React Context API
- **Icon**: Font Awesome

## Project Structure
```
shopSmart/
├── public/
├── src/
│   ├──Assets
│   ├──auth
│   │   ├──AuthContext.tsx
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── ProductCard.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── cart.tsx
│   │   ├── layout.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProtectedRoute.tsx
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── LandingPages.tsx
│   │   ├── ProductList.tsx
│   │   ├── ShoppingCart.tsx
│   │   ├── LoginForm.tsx
│   │   ├── registerForm.tsx
│   │   ├── ShippingPolicy.tsx
│   │   ├── shoppingCart.tsx
│   ├── context/
│   │   ├── CartContext.tsx
│   │   ├── AuthContext.tsx
│   ├── App.tsx
│   ├── index.tsx
├── package.json
```

## Contributing
Feel free to fork the repository and submit pull requests. Contributions are welcome!



