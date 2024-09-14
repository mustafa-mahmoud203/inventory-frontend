import  { useState,useEffect } from 'react';
import { Routes, Route, useLocation, useParams } from 'react-router-dom';

import Sidebar from '../partials/Sidebar';
import Header from '../partials/Header';
import WelcomeBanner from '../partials/dashboard/WelcomeBanner';
import DashboardAvatars from '../partials/dashboard/DashboardAvatars';
import FilterButton from '../components/DropdownFilter';
import Datepicker from '../components/Datepicker';


function MainContent() {
  const location = useLocation(); 
  const { pathname } = location;
  const { id } = useParams();
    console.log(id);
  useEffect(() => {
    // Print the current location to the console
    console.log("Current location:", pathname);
  }, [location]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto mt-5">
      <WelcomeBanner customMessage="Edit a product"/>
      <div className="sm:flex sm:justify-between sm:items-center mb-8">
        <DashboardAvatars />
        <div className="grid grid-flow-col sm:auto-cols-max justify-start sm:justify-end gap-2">
          {/* <FilterButton /> */}
          {/* <Datepicker /> */}
        </div>
      </div>
    </div>
  );
}

function EditProduct() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          <main>
            {/* <AdminOrders /> */}
            <Routes>
              <Route path="/*" element={<MainContent />} />
            </Routes>
          </main>
        </div>
      </div>
  );
}

export default EditProduct;
