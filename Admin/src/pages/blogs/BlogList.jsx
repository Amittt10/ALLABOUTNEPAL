import React, { useEffect, useState } from "react";
import { fetchBlogs, deleteBlog } from "../../api/blogApi";
import { useNavigate } from "react-router-dom";
import "./BlogList.css";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();

  const loadBlogs = async () => {
    try {
      const { data } = await fetchBlogs();
      setBlogs(data);
    } catch (err) {
      console.error("Error fetching blogs", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;
    try {
      await deleteBlog(id);
      loadBlogs();
    } catch (err) {
      console.error("Failed to delete blog", err);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  return (
    <div className="blog-list-container">
      <h2>All Blogs</h2>
      <button className="add-btn" onClick={() => navigate("/admin/blogs/add")}>
        ➕ Add Blog
      </button>
      <table className="blog-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Snippet</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog._id}>
              <td>{blog.title}</td>
              <td>{blog.snippet}</td>
              <td>{blog.category}</td>
              <td>
                <button onClick={() => navigate(`/admin/blogs/edit/${blog.slug}`)}>✏️ Edit</button>
                <button onClick={() => handleDelete(blog._id)}>🗑️ Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlogList;
