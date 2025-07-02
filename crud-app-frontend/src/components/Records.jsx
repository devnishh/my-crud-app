import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Records() {
  const [records, setRecords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', categoryId: '', active: true });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recordsRes, categoriesRes] = await Promise.all([
          axios.get('http://localhost:8080/api/records', {
            headers: { Authorization: `Bearer ${auth.token}` },
          }),
          axios.get('http://localhost:8080/api/categories', {
            headers: { Authorization: `Bearer ${auth.token}` },
          }),
        ]);
        setRecords(recordsRes.data);
        setCategories(categoriesRes.data);
      } catch (err) {
        setError(err.response?.data || 'Failed to fetch data');
      }
    };
    if (auth.token) fetchData();
  }, [auth.token]);

  const handleSubmit = async () => {
    try {
      const record = {
        name: form.name,
        description: form.description,
        category: { id: parseInt(form.categoryId) },
        active: form.active,
      };
      if (editId) {
        await axios.put(`http://localhost:8080/api/records/${editId}`, record, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setRecords(records.map(r => r.id === editId ? { ...record, id: editId, category: categories.find(c => c.id === parseInt(form.categoryId)) } : r));
        setEditId(null);
      } else {
        const response = await axios.post('http://localhost:8080/api/records', record, {
          headers: { Authorization: `Bearer ${auth.token}` },
        });
        setRecords([...records, response.data]);
      }
      setForm({ name: '', description: '', categoryId: '', active: true });
    } catch (err) {
      setError(err.response?.data || 'Operation failed');
    }
  };

  const handleEdit = (record) => {
    setForm({ name: record.name, description: record.description, categoryId: record.category.id, active: record.active });
    setEditId(record.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/records/${id}`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setRecords(records.filter(r => r.id !== id));
    } catch (err) {
      setError(err.response?.data || 'Delete failed');
    }
  };

  const handleBulkDelete = async (ids) => {
    try {
      await axios.post('http://localhost:8080/api/records/bulk-delete', ids, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setRecords(records.filter(r => !ids.includes(r.id)));
    } catch (err) {
      setError(err.response?.data || 'Bulk delete failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Records</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{editId ? 'Edit Record' : 'Add Record'}</h3>
        <div className="space-y-4">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Name"
            className="w-full p-2 border rounded"
            required
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            className="w-full p-2 border rounded"
            required
          />
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select Category</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="mr-2"
            />
            Active
          </label>
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
            <th className="p-2 border">Description</th>
            <th className="p-2 border">Category</th>
            <th className="p-2 border">Active</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map(r => (
            <tr key={r.id}>
              <td className="p-2 border">{r.id}</td>
              <td className="p-2 border">{r.name}</td>
              <td className="p-2 border">{r.description}</td>
              <td className="p-2 border">{r.category.name}</td>
              <td className="p-2 border">{r.active ? 'Yes' : 'No'}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(r)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={() => handleBulkDelete(records.map(r => r.id))}
        className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600"
      >
        Delete All
      </button>
    </div>
  );
}

export default Records;