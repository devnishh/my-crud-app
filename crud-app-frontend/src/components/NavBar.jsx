import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { auth, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-500 p-4 text-white">
      <div className="max-w-4xl mx-auto flex justify-between">
        <div>
          <Link to="/records" className="mr-4 hover:underline">Records</Link>
          <Link to="/categories" className="hover:underline">Categories</Link>
        </div>
        {auth.token && (
          <button onClick={handleLogout} className="hover:underline">Logout</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;