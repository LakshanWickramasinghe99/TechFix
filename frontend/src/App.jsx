import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Components/User/Home";
import Navbar from "./Components/Tharaka/Navbar";
import Hero from "./Components/Tharaka/Hero";
import Product from "./Components/Tharaka/product";
import Banner from "./Components/Tharaka/Banner";
import HomePageDown from "./Components/Tharaka/HomePageDown";
import Order from "./Components/Tharaka/Order";
import OrderDetails from "./Components/Tharaka/OrderDetails";
import Cart from "./Components/Tharaka/Cart";
import AddProductPage from "./Components/Nalinda/pages/addproductpage";
import ProductList from "./Components/Nalinda/pages/productlist";
import Dashboard from "./Components/Nalinda/pages/dashboard";
import Analytics from "./Components/Nalinda/pages/analytics";
import AdminLayout  from "./Components/Nalinda/adminlayout";
import EditProduct from "./Components/Nalinda/editproduct";


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<><Hero /><Home /><><Banner /><HomePageDown/></></>} />
        
        <Route path="/product/:id" element={<Product />} />
        <Route path="/order" element={<Order />} />
        <Route path="/order-details" element={<OrderDetails />} />
        <Route path="/cart" element={<Cart />} />
     

      
        <Route path="/admin" element={<AdminLayout />}>
        <Route path="products" element={<ProductList />} />
        <Route path="/admin/editproduct/:id" element={<EditProduct />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="addproduct" element={<AddProductPage />} /> 
        </Route>
        </Routes>
    </Router>

    
  );
}

export default App;
