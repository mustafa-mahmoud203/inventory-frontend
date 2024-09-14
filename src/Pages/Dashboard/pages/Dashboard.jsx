import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../partials/Sidebar.jsx';
import Header from '../partials/Header.jsx';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner.jsx';
import DashboardAvatars from '../partials/dashboard/DashboardAvatars.jsx';
import { getTrends, getProductApi } from '../../../apis/apis.js';
import ClipLoader from "react-spinners/ClipLoader";


const MainContent = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getTrends();
        console.log(res.data);
        
        setProducts(res.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  const fetchProductDetails = async (id) => {
    const response = await getProductApi(id);;
    return response.data.product;
  };

  return (
    <div className="w-full px-4 py-8 mx-auto mt-5 sm:px-6 lg:px-8 max-w-9xl">
      <WelcomeBanner customMessage="Sales Trends last 7 days" />
      <div className="mb-8 sm:flex sm:justify-between sm:items-center">
        <DashboardAvatars />
        <div className="grid justify-start grid-flow-col gap-2 sm:auto-cols-max sm:justify-end">
          {/* <FilterButton /> */}
          {/* <Datepicker /> */}
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard 
              key={product.productID} 
              productID={product.productID} 
              quantity={product.quantity} 
              totalPrice={product.totalPrice} 
              fetchProductDetails={fetchProductDetails}
            />
          ))}
        </div>
      )}
    </div>
  );
};


const ProductCard = ({ productID, quantity, totalPrice, fetchProductDetails }) => {
  const [details, setDetails] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`https://n55tyhknxc.execute-api.us-west-2.amazonaws.com/dev/products/static-files/${productID}`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        if (response.ok) {
          const blob = await response.blob();
          const objectURL = URL.createObjectURL(blob);
          setImageSrc(objectURL);
        } else {
          console.error('Failed to fetch image:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching image:', error);
      } finally {
        setIsImageLoading(false); // Stop spinner after image fetch attempt
      }
    };

    fetchImage();
  }, [productID, token]);

  useEffect(() => {
    const loadDetails = async () => {
      const details = await fetchProductDetails(productID);
      setDetails(details);
    };
    loadDetails();
  }, [productID, fetchProductDetails]);

  return (
    <div className="overflow-hidden transition-transform duration-300 transform bg-white rounded-lg shadow-md hover:scale-105">
      {isImageLoading ? (
        <div className="flex items-center justify-center h-64">
          <ClipLoader color={"#123abc"} loading={isImageLoading} size={50} />
        </div>
      ) : (
        <img 
          src={imageSrc || 'placeholder.jpg'} 
          alt={details?.name || 'Product'} 
          className="object-cover w-full h-64"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800">{details?.name || 'Product Name'}</h3>
        <p className="mt-2 text-lg font-medium text-gray-700">${details?.price || '0.00'}</p>
        <div className="flex items-center justify-between mt-4">
          <p className="text-gray-600">Quantity: {quantity}</p>
          <p className="text-gray-600">Total Price: ${totalPrice}</p>
        </div>
      </div>
    </div>
  );
};


const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <Routes>
            <Route path="/*" element={<MainContent />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
