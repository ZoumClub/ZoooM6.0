import { Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { CarList } from './CarList';
import { CarForm } from './CarForm';
import { PrivateListings } from './PrivateListings';
import { LogOut, Car, Plus, ClipboardList } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-semibold text-gray-800">Admin Panel</h2>
        </div>
        <nav className="mt-4">
          <Link
            to="/admin/dashboard/cars"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <Car className="h-5 w-5 mr-2" />
            Car Listings
          </Link>
          <Link
            to="/admin/dashboard/cars/new"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Car
          </Link>
          <Link
            to="/admin/dashboard/private-listings"
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <ClipboardList className="h-5 w-5 mr-2" />
            Private Listings
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 w-full"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 p-8 overflow-y-auto">
        <Routes>
          <Route index element={<Navigate to="cars" replace />} />
          <Route path="cars" element={<CarList />} />
          <Route path="cars/new" element={<CarForm />} />
          <Route path="cars/edit/:id" element={<CarForm />} />
          <Route path="private-listings" element={<PrivateListings />} />
          <Route path="*" element={<Navigate to="cars" replace />} />
        </Routes>
      </div>
    </div>
  );
}