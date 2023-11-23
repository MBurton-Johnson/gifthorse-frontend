import "./App.css";
import { BrowserRouter, Routes, Route, Switch } from "react-router-dom";
import { Login } from "./pages/login";
import Home from "./pages/home";
import { Navigation } from "./components/navigation";
import { Logout } from "./pages/logout";
import AddGift from "./pages/addGift";
import MyGifts from './pages/myGifts';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <Navigation></Navigation>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-gift" element={<AddGift />} />
        <Route path="/my-gifts" element={<MyGifts/>} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;