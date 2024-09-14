import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import WelcomeBanner from "../partials/dashboard/WelcomeBanner";
import DashboardAvatars from "../partials/dashboard/DashboardAvatars";
import { getOrdersUserApi } from "../../../apis/apis";
import ClipLoader from "react-spinners/ClipLoader";

function OrderCard({ order, imageUrls }) {
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    if (imageUrls[order.id]) {
      setIsImageLoading(false);
    }
  }, [imageUrls, order.id]);

  return (
    <tr key={order.id} className="transition duration-300 ease-in-out bg-white hover:bg-gray-50">
      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
        {order.product.name}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{order.quantity}</td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{order.product.price}</td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        {order.product.price * order.quantity}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
        {isImageLoading ? (
          <div className="flex items-center justify-center w-20 h-20">
            <ClipLoader color={"#123abc"} loading={isImageLoading} size={20} />
          </div>
        ) : (
          <img
            src={imageUrls[order.id] || '/path/to/fallback/image.png'}
            alt={order.product.name}
            className="object-cover w-40 h-40 rounded-lg shadow-lg"
          />
        )}
      </td>
    </tr>
  );
}

function MainContent() {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [imageUrls, setImageUrls] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userString = localStorage.getItem("user");

    let userId = null;
    try {
      const user = JSON.parse(userString);
      userId = user?.sub;
    } catch (error) {
      console.error("Error parsing user from local storage:", error);
    }

    if (userId) {
      getOrdersUserApi(userId)
        .then(async (response) => {
          if (response.status !== 200) {
            throw new Error(`API returned status ${response.status}`);
          }

          const ordersData = response.data.orders;
          setOrders(ordersData);

          const urls = {};
          for (const order of ordersData) {
            if (order.product.imageUrl) {
              try {
                const imageResponse = await fetch(`https://n55tyhknxc.execute-api.us-west-2.amazonaws.com/dev/products/static-files/${order.product.id}`, {
                  headers: {
                    Authorization: `${token}`,
                  },
                });

                if (imageResponse.ok) {
                  const blob = await imageResponse.blob();
                  const objectURL = URL.createObjectURL(blob);
                  urls[order.id] = objectURL;
                } else {
                  console.error("Failed to fetch image:", imageResponse.status, imageResponse.statusText);
                }
              } catch (error) {
                console.error("Error fetching image:", error);
              }
            }
          }
          setImageUrls(urls);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
          setIsLoading(false);
        });
    } else {
      console.error("No token found");
      setIsLoading(false);
    }
  }, [location]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <ClipLoader color={"#123abc"} loading={isLoading} size={150} />
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 mx-auto mt-5 sm:px-6 lg:px-8 max-w-9xl">
      <WelcomeBanner customMessage="Your orders" />
      <div className="mb-8 sm:flex sm:justify-between sm:items-center">
        <DashboardAvatars />
      </div>
      <div className="overflow-x-auto rounded-lg shadow-md">
        {orders.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="text-white bg-gradient-to-r from-indigo-600 to-purple-600">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">Product Name</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">Quantity</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">Price</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">Total Price</th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase">Image</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} imageUrls={imageUrls} />
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-500">No orders found.</p>
        )}
      </div>
    </div>
  );
}

function UserOrders() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="shadow-inner bg-gray-50">
          <Routes>
            <Route path="/" element={<MainContent />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default UserOrders;
