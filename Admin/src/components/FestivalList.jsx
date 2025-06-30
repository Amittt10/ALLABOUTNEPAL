// //src/components/FestivalList.jsx
// import React, { useEffect, useState } from "react";
// import { fetchFestivals, deleteFestival } from "../api/festivalApi";
// import { useNavigate } from "react-router-dom";
// import "./FestivalList.css";

// export default function FestivalList() {
//   const [festivals, setFestivals] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadFestivals();
//   }, []);

//   const loadFestivals = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchFestivals();
//       setFestivals(data);
//       setError(null);
//     } catch (err) {
//       setError("Failed to load festivals.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this festival?")) return;
//     try {
//       await deleteFestival(id);
//       loadFestivals();
//     } catch {
//       alert("Delete failed. Please try again.");
//     }
//   };

//   return (
//     <div className="festival-list-container">
//       <div className="festival-list-header">
//         <h1>Festival Management</h1>
//         <button className="btn-add" onClick={() => navigate("/festivals/add")}>
//           + Add New Festival
//         </button>
//       </div>

//       {loading && <p>Loading festivals...</p>}
//       {error && <p className="error-text">{error}</p>}

//       {!loading && festivals.length === 0 && <p>No festivals found.</p>}

//       {!loading && festivals.length > 0 && (
//         <table className="festival-table">
//           <thead>
//             <tr>
//               <th>Name (EN)</th>
//               <th>Name (NP)</th>
//               <th>Month</th>
//               <th>Date</th>
//               <th>Category</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {festivals.map((festival) => (
//               <tr key={festival._id}>
//                 <td>{festival.name_en}</td>
//                 <td>{festival.name_np}</td>
//                 <td>{festival.month}</td>
//                 <td>{festival.date}</td>
//                 <td>{festival.category}</td>
//                 <td>
//                   <button
//                     className="btn-edit"
//                     onClick={() => navigate(`/festivals/edit/${festival._id}`)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="btn-delete"
//                     onClick={() => handleDelete(festival._id)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
