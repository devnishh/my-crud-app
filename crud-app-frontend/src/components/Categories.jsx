import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '' });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/categories', {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setCategories(response.data);
      } catch (err) {
        setError(err.response?.data || 'Failed to fetch categories');
      }
    };
    if (auth.token) fetchCategories();
  }, [auth.token]);

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`http://localhost:8080/api/categories/${editId}`, { name: form.name }, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setCategories(categories.map(c => c.id === editId ? { ...c, name: form.name } : c));
        setEditId(null);
      } else {
        const response = await axios.post('http://localhost:8080/api/categories', { name: form.name }, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setCategories([...categories, response.data]);
      }
      setForm({ name: '' });
    } catch (err) {
      setError(err.response?.data || 'Operation failed');
    }
  };

  const handleEdit = (category) => {
    setForm({ name: category.name });
    setEditId(category.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setCategories(categories.filter(c => c.id !== id));
    } catch (err) {
      setError(err.response?.data || 'Delete failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{editId ? 'Edit Category' : 'Add Category'}</h3>
        <div className="space-y-4">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Category Name"
            className="w-full p-2 border rounded"
            required
          />
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {editId ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(c => (
            <tr key={c.id}>
              <td className="p-2 border">{c.id}</td>
              <td className="p-2 border">{c.name}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(c)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Categories;