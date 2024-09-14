import { useState, useRef } from 'react';
import { Routes, Route } from 'react-router-dom'; // Removed Form import
import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import { addProductApi } from '../../../apis/apis';
import ClipLoader from "react-spinners/ClipLoader";


function Spinner() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <ClipLoader color="#3498db" size={50} />
    </div>
  );
}

function ProductForm() {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    quantity: '',
    threshold: '',
    imageFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');
    setSuccess('');
    
    const data = new FormData(formRef.current);

    try {
      const newProduct = await addProductApi(data);
      setSuccess('Product added successfully!');
      console.log('Product Added:', newProduct);
      setFormData({
        name: '',
        price: '',
        quantity: '',
        threshold: '',
        imageFile: null,
      });   
      // Add success notification logic here
    } catch (error) {
      console.error('Error adding product:', error);
      setError('Error adding product. Please try again.');
      // Add error notification logic here
    }
    finally {

      setLoading(false);

    }
  };

  return (
    <form 
      ref={formRef}
      onSubmit={handleSubmit} 
      className="w-full max-w-lg p-8 mx-auto mt-8 space-y-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="mb-4 text-3xl font-bold text-center text-gray-800">Add a New Product</h2>
      {/* Form Fields */}
      <div className="grid grid-cols-1 gap-y-4">
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700" htmlFor="name">Product Name</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter product name" required />
        </div>
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700" htmlFor="price">Price</label>
          <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter price" required />
        </div>
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700" htmlFor="quantity">Quantity</label>
          <input type="number" name="quantity" id="quantity" value={formData.quantity} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter quantity" required />
        </div>
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700" htmlFor="threshold">Threshold</label>
          <input type="number" name="threshold" id="threshold" value={formData.threshold} onChange={handleChange} min="0" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter threshold" required />
        </div>
        <div>
          <label className="block mb-1 text-sm font-semibold text-gray-700" htmlFor="imageFile">Image</label>
          <div className="relative">
            <input type="file" name="imageUrl" id="imageUrl" onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            <label htmlFor="imageFile" className="flex items-center justify-between block w-full px-4 py-3 text-gray-700 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer">
              {formData.imageFile ? formData.imageFile.name : 'Choose file...'}
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 10l5 5 5-5H7z"></path></svg>
            </label>
          </div>
        </div>
      </div>
      {loading && <Spinner />}
      {error && <div className="mt-4 text-red-500">{error}</div>}
      {success && <div className="mt-4 text-green-500">{success}</div>}


      <div className="flex justify-center mt-6">
        <button type="submit" className="px-6 py-3 font-semibold text-white transition-colors duration-300 bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700">
        {loading ? 'Adding Product...' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}


function MainContent() {
  return (
    <div className="w-full px-4 py-8 mx-auto mt-5 sm:px-6 lg:px-8 max-w-9xl">
      <WelcomeBanner customMessage="Add a new Product" />
      <ProductForm />
    </div>
  );
}

function AddProduct() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-col flex-1 overflow-hidden">
        <main>
          <Routes>
            <Route path="/*" element={<MainContent />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default AddProduct;
