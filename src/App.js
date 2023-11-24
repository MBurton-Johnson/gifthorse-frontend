import "./App.css";
import { BrowserRouter, Routes, Route, Switch } from "react-router-dom";
import { Login } from "./pages/login";
import Home from "./pages/home";
import { Navigation } from "./components/navigation/navigation";
import { Logout } from "./pages/logout";
import AddGift from "./pages/addGift";
import MyGifts from './pages/myGifts';
import MyRecipients from './pages/myRecipients'; 
import RecipientDetails from './pages/recipientDetails';
import MyOccasions from './pages/myOccasions'; 
import OccasionDetails from './pages/occasionDetails';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <Navigation></Navigation>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-gift" element={<AddGift />} />
        <Route path="/my-gifts" element={<MyGifts/>} />
        <Route path="/my-recipients" element={<MyRecipients />} />
        <Route path="/recipient-details/:recipientId" element={<RecipientDetails />} />
        <Route path="/my-occasions" element={<MyOccasions />} />
        <Route path="/occasion-details/:recipientId/:occasionId" element={<OccasionDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;