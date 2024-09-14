import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import WelcomeBanner from "../partials/dashboard/WelcomeBanner";
import DashboardAvatars from "../partials/dashboard/DashboardAvatars";
import { getProductsApi, addOrderApi } from "../../../apis/apis";
import ClipLoader from "react-spinners/ClipLoader";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// ProductCard Component
function ProductCard({ product, onOrder }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const productId = product.id;
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`https://n55tyhknxc.execute-api.us-west-2.amazonaws.com/dev/products/static-files/${productId}`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        if (response.ok) {
          const blob = await response.blob();
          const objectURL = URL.createObjectURL(blob);
          setImageSrc(objectURL);
          setIsImageLoading(false);
        } else {
          console.error('Failed to fetch image:', response.status, response.statusText);
          setIsImageLoading(false);
        }
      } catch (error) {
        console.error('Error fetching image:', error);
        setIsImageLoading(false);
      }
    };

    fetchImage();
  }, [productId, token]);

  return (
    <div className="overflow-hidden transition-transform duration-300 transform bg-white rounded-lg shadow-lg hover:shadow-xl hover:scale-105 hover:bg-gray-50">
      {isImageLoading ? (
        <div className="flex items-center justify-center h-64 bg-gray-200">
          <ClipLoader color={"#123abc"} loading={isImageLoading} size={50} />
        </div>
      ) : (
        <img 
          src={imageSrc} 
          alt={product.name} 
          className="object-cover w-full h-64 transition-transform duration-300 hover:scale-105"
          onClick={() => onOrder(product)}
        />
      )}
      <div className="p-6">
        <h3 className="text-2xl font-semibold text-gray-800">{product.name}</h3>
        <p className="mt-2 text-xl font-medium text-gray-700">${product.price}</p>
        <div className="flex items-center justify-between mt-4 text-gray-600">
          <p>Quantity: {product.quantity}</p>
          <p>Sold: {product.sold}</p>
        </div>
        <p className="mt-2 text-gray-600">Threshold: {product.threshold}</p>
        <button 
          className="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:ring-4 focus:ring-yellow-300"
          onClick={() => onOrder(product)}
        >
          Order Now!
        </button>
      </div>
    </div>
  );
}

// ProductGrid Component
function ProductGrid({ products, onOrder }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onOrder={onOrder} />
      ))}
    </div>
  );
}

// OrderProductModal Component
function OrderProductModal({ isOpen, product, onClose, onSave }) {
  if (!product) return null;

  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price,
    quantity: 1,
    totalPrice: product.price,
    productId: product.id
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        quantity: 1,
        totalPrice: product.price,
        productId: product.id
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const quantity = name === 'quantity' ? parseInt(value) : formData.quantity;
    const totalPrice = formData.price * quantity;
    setFormData({ ...formData, [name]: value, totalPrice });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded-lg shadow-lg w-96">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">Place Order</h2>
        <div className="space-y-4">
          <label className="block text-gray-700">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            disabled
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <label className="block text-gray-700">Price:</label>
          <input
            type="number"
            name="price"
            value={formData.price || ''}
            disabled
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
          <label className="block text-gray-700">Quantity:</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Quantity"
          />
          <label className="block text-gray-700">Total Price:</label>
          <input
            type="number"
            name="totalPrice"
            value={formData.totalPrice || ''}
            disabled
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
        <div className="mt-4 space-x-2">
          <button 
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            onClick={() => onSave(formData)}
          >
            Place Order
          </button>
          <button 
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// MainContent Component
function MainContent() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProductsApi()
      .then(response => {
        setProducts(response.data.products);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      });
  }, [location]);

  const handleOrder = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddOrder = async (orderData) => {
    try {
      const data = {
        productID: orderData.productId,
        quantity: orderData.quantity,
      };

      const token = localStorage.getItem("token");

      const response = await addOrderApi(data, token);

      if (response.status === 201) {
        toast.success("Order placed successfully!");
      } else {
        toast.error("Failed to place the order. Please try again.");
      }

      setModalOpen(false);
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error("Failed to place the order. Please try again.");
    }
  };

  return (
    <div className="p-6">
      <WelcomeBanner />
      <DashboardAvatars />
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <ClipLoader color={"#123abc"} loading={isLoading} size={50} />
        </div>
      ) : (
        <ProductGrid products={products} onOrder={handleOrder} />
      )}
      <OrderProductModal 
        isOpen={isModalOpen} 
        product={selectedProduct} 
        onClose={handleModalClose} 
        onSave={handleAddOrder} 
      />
      <ToastContainer /> {/* Add ToastContainer here */}
    </div>
  );
}

// UserHome Component
function UserHome() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-x-hidden overflow-y-auto">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main>
          <Routes>
            <Route path="/" element={<MainContent />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default UserHome;
