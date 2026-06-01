import './App.css';
import Navbar from './Components/NavBar/Navbar';
import { BrowserRouter, Routes,Route} from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCategory from './Pages/ShopCategory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import LoginSignup from './Pages/LoginSignup';
import Offers from './Components/Offers/Offers';
import new_collections from './Components/Assests/new_collections';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assests/banner_mens.png'
import women_banner from './Components/Assests/banner_women.png'
import kid_banner from './Components/Assests/banner_kids.png'
import ShopContextProvider from './Context/ShopContext';
import ProductDisplay from './Components/ProductDisplay/ProductDisplay';

function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element ={<Shop/>}/>
        <Route path='/mens' element ={<ShopCategory banner={men_banner} category="men"/>}/>
        <Route path='/womens' element ={<ShopCategory banner={women_banner} category="women"/>}/>
        <Route path='/kids' element ={<ShopCategory banner={kid_banner} category="kid"/>}/>
        <Route path="product" element={<Product/>}>
         <Route path=':productId' element={<Product/>}/>

        </Route>
        <Route path='/cart' element ={<Cart/>}/>
        <Route path='/login' element ={<LoginSignup/>}/>

      </Routes>
      <Footer/>
      </BrowserRouter>
      
    </div>
  );
}

export default App;
