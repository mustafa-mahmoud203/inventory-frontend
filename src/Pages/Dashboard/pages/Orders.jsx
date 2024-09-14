import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import {
  getHistoricatStockApi,
  getOrdersApi,
  getProductApi,
  getUserApi,
} from "../../../apis/apis.js";
import { useLocation } from "react-router-dom";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import WelcomeBanner from "../partials/dashboard/WelcomeBanner";
import DashboardAvatars from "../partials/dashboard/DashboardAvatars";

function Spinner() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <ClipLoader color="#3498db" size={50} />
    </div>
  );
}

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ease-in-out bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg p-8 transition-transform duration-300 ease-in-out transform scale-105 bg-white rounded-lg shadow-xl hover:scale-100">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 transition-colors duration-300 rounded-full hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            ✖
          </button>
        </div>
        <div className="mt-6 space-y-4">{children}</div>
      </div>
    </div>
  );
}

function UserDetails({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId) {
      console.log(userId);

      setLoading(true);
      getUserApi(userId)
        .then((response) => {
          console.log(response.data);

          setUser(response.data.user);
          setLoading(false);
        })
        .catch(() => {
          setError("User may have been deleted");
          setLoading(false);
        });
    }
  }, [userId]);

  if (loading) return <Spinner />;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold">{user.name}</h2>
      <p className="mt-2 text-gray-600">ID: {user.id}</p>
      <p className="mt-2 text-gray-600">Email: {user.email}</p>
      <p className="mt-2 text-gray-600">Phone: {user.phone}</p>
      <p className="mt-2 text-gray-600">Admin: {user.isAdmin ? "Yes" : "No"}</p>
    </div>
  );
}

function ProductDetails({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (productId) {
      setLoading(true);
      getProductApi(productId)
        .then((response) => {
          console.log(response.data);

          setProduct(response.data.product);
          setLoading(false);
        })
        .catch(() => {
          setError("Product may have been deleted");
          setLoading(false);
        });
    }
  }, [productId]);

  if (loading) return <Spinner />;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <p className="mt-2 text-gray-600 ">ID: {product.id}</p>
      <p className="mt-2 text-gray-600">Name: {product.name}</p>
      <p className="mt-2 text-gray-600">Price: {product.price}</p>
      <p className="mt-2 text-gray-600">Quantity: {product.quantity}</p>
      <p className="mt-2 text-gray-600">Threshold: {product.threshold}</p>
      <p className="mt-2 text-gray-600">Sold: {product.sold}</p>
    </div>
  );
}

function OrderTable() {
  const [orders, setOrders] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrdersApi()
      .then((response) => {
        setOrders(response.data.orders);
        console.log(response.data);
        
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, []);

  const openUserModal = (userId) => {
    setSelectedUserId(userId);
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setSelectedUserId(null);
    setIsUserModalOpen(false);
  };

  const openProductModal = (productId) => {
    setSelectedProductId(productId);
    setIsOrderModalOpen(true);
  };

  const closeProductModal = () => {
    setSelectedProductId(null);
    setIsOrderModalOpen(false);
  };

  if (loading) return <Spinner />;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Order ID
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Product ID
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Quantity
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              User Details
            </th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
              Product Details
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                {order.id}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {order.productID}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                {order.quantity}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                <button
                  onClick={() => openUserModal(order.userID)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  View User
                </button>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                <button
                  onClick={() => openProductModal(order.productID)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  View Product
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        isOpen={isUserModalOpen}
        onClose={closeUserModal}
        title="User Details"
      >
        <UserDetails userId={selectedUserId} />
      </Modal>

      <Modal
        isOpen={isOrderModalOpen}
        onClose={closeProductModal}
        title="Order Details"
      >
        <ProductDetails productId={selectedProductId} />
      </Modal>
    </div>
  );
}

function MainContent() {
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    console.log("Current location:", pathname);
  }, [location]);

  return (
    <div className="w-full px-4 py-8 mx-auto mt-5 sm:px-6 lg:px-8 max-w-9xl">
      <WelcomeBanner customMessage="User and Order Details" />
      <div className="mb-8 sm:flex sm:justify-between sm:items-center">
        <DashboardAvatars />
      </div>
      <OrderTable />
    </div>
  );
}

function OrderDetails() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <MainContent />
      </div>
    </div>
  );
}

export default OrderDetails;
