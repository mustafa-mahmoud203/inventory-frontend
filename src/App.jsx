import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

import Dashboard from './Pages/Dashboard/pages/Dashboard.jsx'; 
import AddProduct from "./Pages/Dashboard/pages/AddProduct.jsx";
import EditProduct from "./Pages/Dashboard/pages/EditProduct.jsx";
import HistoricalStock from "./Pages/Dashboard/pages/HistroricalStock.jsx";
import Orders from "./Pages/Dashboard/pages/Orders.jsx";
import Products from "./Pages/Dashboard/pages/Products.jsx";
import UserOrders from "./Pages/Dashboard/pages/UserOrders.jsx";
import UserHome from './Pages/Dashboard/pages/UserHome.jsx'; 
import LoginPage from './Pages/login/login.jsx'; 
import SignupPage from './Pages/signup/signup.jsx';
import NotFound from './Pages/NotFound/NotFound.jsx';
import { useEffect, useState } from "react";
import { useDispatch  } from "react-redux";
import { loginUser } from "./components/redux/slices/login-data/login-data.js";
function ProtectedRoute({ children, redirectTo }) {
  const loginData = localStorage.getItem("user")
  
 return loginData ? children : <Navigate to={redirectTo} />;
}

function App() {


  const dispatch = useDispatch();
  let loginData = useSelector((state) => state.login.user);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (loginData) {
      dispatch(loginUser(loginData));
      setIsAdmin(loginData.isAdmin);
    }

  }, [loginData, dispatch]);

//   useEffect(() => {
//     const fetchData = async () => {
//       const yourJwtToken = localStorage.getItem("token"); // Replace with your actual JWT token

//       try {
//         console.log("1111111111111111111111111111111111111111111111111111111111111111111111111");
        
//         const response = await fetch('https://l02f2osx17.execute-api.us-west-2.amazonaws.com/dev/users', {
//           method: 'GET',
//           headers: {
//             'Authorization': `${yourJwtToken}`,
//             'Content-Type': 'application/json',
//           },
//         });
// console.log("2222222222222222222222222222222222222222222222222222222222222222222222");

//         if (!response.ok) {
//           throw new Error(`HTTP error! Status: ${response.status}`);
//         }
//         console.log("3333333333333333333333333333333333333333333333");
        
//         const data = await response.json();
//         console.log('Response data:', data);
//       } catch (error) {
//         console.error('Fetch error:', error);
//       }
//     };

//     fetchData();
//   }, []); 
  

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute redirectTo="/login">
              {isAdmin ? <Dashboard /> : <UserHome />}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-product" 
          element={
            <ProtectedRoute redirectTo="/login">
              {isAdmin ? <AddProduct /> : <UserHome />}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/edit-product" 
          element={
            <ProtectedRoute redirectTo="/login">
              {isAdmin ? <EditProduct /> : <UserHome />}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/historical-stock" 
          element={
            <ProtectedRoute redirectTo="/login">
              {isAdmin ? <HistoricalStock /> : <UserHome />}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/orders" 
          element={
            <ProtectedRoute redirectTo="/login">
              {isAdmin ? <Orders /> : <UserHome />}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/products" 
          element={
            <ProtectedRoute redirectTo="/login">
              {isAdmin ? <Products /> : <UserHome />}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/home" 
          element={
            <ProtectedRoute redirectTo="/login">
              {!isAdmin ? <UserHome /> : <Dashboard />}
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user-orders" 
          element={
            <ProtectedRoute redirectTo="/login">
              {!isAdmin ? <UserOrders /> : <Dashboard />}
            </ProtectedRoute>
          } 
        />
      {/* Wildcard Route to handle 404 */}
      <Route path="/" element={<LoginPage />} />      

      <Route path="*" element={<NotFound data={{status: 404, message: "Not Found"}} />} />      
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
