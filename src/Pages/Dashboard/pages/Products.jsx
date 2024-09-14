import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "../partials/Sidebar";
import Header from "../partials/Header";
import WelcomeBanner from "../partials/dashboard/WelcomeBanner";
import DashboardAvatars from "../partials/dashboard/DashboardAvatars";
import { deleteProductApi, editProductApi, getProductsApi } from "../../../apis/apis";

  import ClipLoader from "react-spinners/ClipLoader";

function ProductCard({ product, onDelete, onEdit }) {
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
          console.log(imageSrc);
          
          setIsImageLoading(false); // Image has finished loading
        } else {
          console.error('Failed to fetch image:', response.status, response.statusText);
          setIsImageLoading(false); // Stop spinner on error as well
        }
      } catch (error) {
        console.error('Error fetching image:', error);
        setIsImageLoading(false); // Stop spinner on error as well
      }
    };

    fetchImage();
  }, [productId, token]);

  return (
    <div className="overflow-hidden transition-transform duration-300 transform bg-white rounded-lg shadow-md hover:scale-105">
      {isImageLoading ? (
        <div className="flex items-center justify-center h-64">
          <ClipLoader color={"#123abc"} loading={isImageLoading} size={50} />
        </div>
      ) : (
        <img 
          src={imageSrc} 
          alt={product.name} 
          className="object-cover w-full h-64"
          onClick={() => onEdit(product)}
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
        <p className="mt-2 text-lg font-medium text-gray-700">${product.price}</p>
        <div className="flex items-center justify-between mt-4">
          <p className="text-gray-600">Quantity: {product.quantity}</p>
          <p className="text-gray-600">Sold: {product.sold}</p>
        </div>
        <p className="mt-2 text-gray-600">Threshold: {product.threshold}</p>
        <button 
          className="w-full px-4 py-2 mt-4 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 focus:ring-4 focus:ring-red-300"
          onClick={() => onDelete(product.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
function ProductGrid({ products, onDelete, onEdit }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onDelete={onDelete} onEdit={onEdit} />
      ))}
    </div>
  );
}

function EditProductModal({ isOpen, product, onClose, onSave }) {
  if (!product) return null; // Prevent the modal from rendering if no product is selected

  const [formData, setFormData] = useState(product);

  useEffect(() => {
    if (product) {
      setFormData(product);
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="p-6 bg-white rounded-lg shadow-lg w-96">
        <h2 className="mb-4 text-xl font-bold">Edit Product</h2>
        <div className="space-y-4">
          <h6>Name: </h6>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Product Name"
          />
          <h6>Price: </h6>
          <input
            type="number"
            name="price"
            value={formData.price || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Price"
          />
          <h6>Quantity: </h6>
          <input
            type="number"
            name="quantity"
            value={formData.quantity || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Quantity"
          />
          <h6>Threshold: </h6>
          <input
            type="number"
            name="threshold"
            value={formData.threshold || ''}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="Threshold"
          />
        </div>
        <div className="mt-4 space-x-2">
          <button 
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            onClick={() => onSave(formData)}
          >
            Save
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
function MainContent() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Current location:", location.pathname);
    getProductsApi()
      .then(response => {
        console.log(response.data);
        setProducts(response.data.products);
        setIsLoading(false); // Stop loading spinner after products are fetched
      })
      .catch(error => {
        console.error("Error fetching products:", error);
        setIsLoading(false); // Stop loading spinner on error
      });
  }, [location]);

  const handleDelete = async (productId) => {
    await deleteProductApi(productId);
    const newProducts = products.filter(p => p.id !== productId);
    setProducts(newProducts);
  };

  const handleEdit = async (product) => {
    try {
      setSelectedProduct(product);
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to initiate editing:", error);
    }
  };

  const handleModalClose = () => {
    console.log("Closing modal");
    setModalOpen(false);
    setSelectedProduct(null);
  };

  const handleSave = async (updatedProduct) => {
    try {
      const data = {
        "name": updatedProduct.name,
        "price": updatedProduct.price,
        "quantity": updatedProduct.quantity,
        "threshold": updatedProduct.threshold,
      };
      console.log("Updated product data:",  updatedProduct.id, data);

      const token = localStorage.getItem("token");
      
      const response = await editProductApi(
        updatedProduct.id, 
        data, 
      );
    
      console.log(response);
      
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === response.data.id ? response.data : p
        )
      );
    
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to save product:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <ClipLoader color={"#123abc"} loading={isLoading} size={150} />
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-8 mx-auto mt-5 sm:px-6 lg:px-8 max-w-9xl">
      <WelcomeBanner customMessage="All Products" />
      <div className="mb-8 sm:flex sm:justify-between sm:items-center">
        <DashboardAvatars />
        <div className="grid justify-start grid-flow-col gap-2 sm:auto-cols-max sm:justify-end">
        </div>
      </div>
      <ProductGrid products={products} onDelete={handleDelete} onEdit={handleEdit} />
      <EditProductModal 
        isOpen={isModalOpen} 
        product={selectedProduct} 
        onClose={handleModalClose} 
        onSave={handleSave} 
      />
    </div>
  );
}


function Products() {
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
}

export default Products;
