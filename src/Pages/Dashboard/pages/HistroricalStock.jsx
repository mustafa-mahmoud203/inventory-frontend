import React, { useState, useEffect } from 'react';
import ClipLoader from 'react-spinners/ClipLoader';
import { getHistoricatStockApi, getProductApi } from '../../../apis/apis.js';
import { useLocation, useParams } from 'react-router-dom';
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import DashboardAvatars from '../partials/dashboard/DashboardAvatars';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg p-8 bg-white rounded-lg shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button 
            onClick={onClose} 
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
        </div>
        <div className="mt-6 space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

function ProductDetails({ productId }) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageSrc, setImageSrc] = useState('default-image-url.jpg');
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await getProductApi(productId);
        setProduct(response.data.product);
        await fetchImage();
      } catch (error) {
        setError("Product may have been deleted");
      } finally {
        setLoading(false);
      }
    };

    const fetchImage = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://n55tyhknxc.execute-api.us-west-2.amazonaws.com/dev/products/static-files/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
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
        setImageLoading(false);
      }
    };

    if (productId) fetchProductData();
  }, [productId]);

  if (loading) return <Spinner />;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-white border rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold">{product.name}</h2>
      <p className="mt-2 text-gray-600">Price: ${product.price}</p>
      <p className="mt-2 text-gray-600">Quantity: {product.quantity}</p>
      <p className="mt-2 text-gray-600">Sold: {product.sold}</p>
      <p className="mt-2 text-gray-600">Threshold: {product.threshold}</p>
      
      <div className="relative flex items-center justify-center w-full h-48 mt-4">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <ClipLoader color="#3498db" size={50} />
          </div>
        )}
        <img 
          src={imageSrc} 
          alt={product.name} 
          className={`object-contain w-full h-full transition-opacity duration-300 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => setImageLoading(false)}
        />
      </div>
    </div>
  );
}

function StockTable() {
  const [stocks, setStocks] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const response = await getHistoricatStockApi();
        setStocks(response.data.historicals);
        console.log(response.data.historicals);
        
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, []);

  const openModal = (productId) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProductId(null);
    setIsModalOpen(false);
  };

  if (loading) return <Spinner />;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Product ID</th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Quantity</th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Created At</th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Updated At</th>
            <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase">Product Details</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {stocks.map(stock => (
            <tr key={stock.id}>
              <td className="px-6 py-4 text-sm text-gray-500">{stock.productID}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{stock.quantity}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{new Date(stock.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 text-sm text-gray-500">{new Date(stock.updatedAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <button
                  onClick={() => openModal(stock.productID)}
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
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Product Details"
      >
        <ProductDetails productId={selectedProductId} />
      </Modal>
    </div>
  );
}

function MainContent() {
  const location = useLocation();
  const { pathname } = location;
  const { id } = useParams();

  useEffect(() => {
    console.log("Current location:", pathname);
  }, [location]);

  return (
    <div className="w-full px-4 py-8 mx-auto mt-5 sm:px-6 lg:px-8 max-w-9xl">
      <WelcomeBanner customMessage="Historical Stock"/>
      <div className="mb-8 sm:flex sm:justify-between sm:items-center">
        <DashboardAvatars />
      </div>
      <StockTable />
    </div>
  );
}

function HistoricalStock() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => setNavVisible(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        navVisible={navVisible}
      />
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        <Header setSidebarOpen={setSidebarOpen} />
        <MainContent />
      </div>
    </div>
  );
}

export default HistoricalStock;
