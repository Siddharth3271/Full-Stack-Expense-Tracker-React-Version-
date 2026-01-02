import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransaction";
import EditTransaction from "./pages/EditTransaction";
import CreateCategory from "./pages/CreateCategory";
import Categories from "./pages/ViewCategory";
import EditCategory from "./pages/EditCategory";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* redirect to login automatically */}
        <Route path="/" element={<Navigate to="/login"/>}/>

        {/* login page */}
        <Route path="/login" element={<Login/>}/>

        {/* dashboard page */}
        <Route path="/dashboard" element={<Dashboard/>}/>

        {/* add transaction page */}
        <Route path="/add-transaction" element={<AddTransaction/>} />

        {/* edit transaction page */}
        <Route path="/edit-transaction/:id" element={<EditTransaction/>} />

        {/* adding categories */}
        <Route path="/add-category" element={<CreateCategory/>} />

        {/* View Categories */}
        <Route path="/categories" element={<Categories/>} />

        {/*Edit category*/}
        <Route path="/edit-category/:id" element={<EditCategory />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;