// //src/components/FestivalEdit.jsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { fetchFestivalById, updateFestival } from '../api/festivalApi';
// import '../components/Dashboard.css';

// export default function FestivalEdit() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     name_en: '',
//     name_np: '',
//     date: '',
//     month: '',
//     category: '',
//     description: '',
//     significance: '',
//     duration: '',
//     location: '',
//     image: null, // new image file
//   });

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [error, setError] = useState('');

//   const nepaliMonths = [
//     "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
//     "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra"
//   ];

//   const categories = ['religious', 'cultural', 'national'];

//   useEffect(() => {
//     const loadFestival = async () => {
//       setLoading(true);
//       try {
//         const data = await fetchFestivalById(id);
//         setFormData({
//           name_en: data.name_en || '',
//           name_np: data.name_np || '',
//           date: data.date || '',
//           month: data.month || '',
//           category: data.category || '',
//           description: data.description || '',
//           significance: data.significance || '',
//           duration: data.duration || '',
//           location: data.location || '',
//           image: null, // clear image input initially
//         });
//         setError('');
//       } catch (err) {
//         setError('Failed to load festival data.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     loadFestival();
//   }, [id]);

//   const handleChange = e => {
//     const { name, value, files } = e.target;
//     if (files) {
//       setFormData(prev => ({ ...prev, [name]: files[0] }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setError('');
//     setSaving(true);

//     if (!formData.name_en || !formData.name_np || !formData.date || !formData.month || !formData.category) {
//       setError('Please fill all required fields.');
//       setSaving(false);
//       return;
//     }

//     try {
//       const payload = new FormData();
//       for (const key in formData) {
//         if (formData[key]) {
//           payload.append(key, formData[key]);
//         }
//       }

//       await updateFestival(id, payload);
//       navigate('/festivals');
//     } catch (err) {
//       setError('Failed to update festival. Please try again.');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) return <p>Loading festival data...</p>;

//   return (
//     <div className="festival-form-container">
//       <h1 className="festival-list-title">Edit Festival</h1>
//       <form onSubmit={handleSubmit} className="festival-form">
//         {error && <p className="error-text">{error}</p>}

//         <label>
//           Name (English) <span className="required">*</span>
//           <input
//             type="text"
//             name="name_en"
//             value={formData.name_en}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         <label>
//           Name (Nepali) <span className="required">*</span>
//           <input
//             type="text"
//             name="name_np"
//             value={formData.name_np}
//             onChange={handleChange}
//             required
//           />
//         </label>

//         <label>
//           Date <span className="required">*</span>
//           <input
//             type="text"
//             name="date"
//             value={formData.date}
//             onChange={handleChange}
//             placeholder="e.g. 15-25 or Full Moon"
//             required
//           />
//         </label>

//         <label>
//           Month <span className="required">*</span>
//           <select name="month" value={formData.month} onChange={handleChange} required>
//             <option value="">Select month</option>
//             {nepaliMonths.map(month => (
//               <option key={month} value={month}>{month}</option>
//             ))}
//           </select>
//         </label>

//         <label>
//           Category <span className="required">*</span>
//           <select name="category" value={formData.category} onChange={handleChange} required>
//             <option value="">Select category</option>
//             {categories.map(cat => (
//               <option key={cat} value={cat}>{cat}</option>
//             ))}
//           </select>
//         </label>

//         <label>
//           Description
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             rows={3}
//           />
//         </label>

//         <label>
//           Significance
//           <textarea
//             name="significance"
//             value={formData.significance}
//             onChange={handleChange}
//             rows={3}
//           />
//         </label>

//         <label>
//           Duration
//           <input
//             type="text"
//             name="duration"
//             value={formData.duration}
//             onChange={handleChange}
//             placeholder="e.g. 2 days"
//           />
//         </label>

//         <label>
//           Location
//           <input
//             type="text"
//             name="location"
//             value={formData.location}
//             onChange={handleChange}
//           />
//         </label>

//         <label>
//           Change Festival Image
//           <input
//             type="file"
//             name="image"
//             accept="image/*"
//             onChange={handleChange}
//           />
//         </label>

//         <button type="submit" className="festival-btn" disabled={saving}>
//           {saving ? 'Saving...' : 'Update Festival'}
//         </button>
//       </form>
//     </div>
//   );
// }
