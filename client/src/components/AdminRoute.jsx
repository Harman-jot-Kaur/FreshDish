import { Navigate } from 'react-router-dom';


const AdminRoute = ({ user, kitchenOnly, loading, children }) => {
  if (loading) return null; // or a loader if you prefer
  if (!user) return <Navigate to="/login" replace />;
  const canAccess = kitchenOnly ? user.role === 'kitchen' : user.role === 'admin' || user.role === 'kitchen';
  if (!canAccess) return <Navigate to="/menu" replace />;
  return children;
};

export default AdminRoute;
