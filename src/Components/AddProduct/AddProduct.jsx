import React, { useState, useEffect } from "react";
import "./AddProduct.css";
import upload_area from "../Assets/upload_area.svg";

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(upload_area);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "women",
    new_price: "",
    old_price: ""
  });
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (image) {
      const url = URL.createObjectURL(image);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url); // Clean up the URL object
    } else {
      setImageUrl(upload_area);
    }
  }, [image]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productDetails.name || !productDetails.new_price || !productDetails.old_price || !image) {
      alert("Please fill out all fields and upload an image.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('product', image);

    try {
      const uploadResponse = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });
      const uploadData = await uploadResponse.json();

      if (uploadData.success) {
        const product = { ...productDetails, image: uploadData.image_url };

        const productResponse = await fetch('http://localhost:4000/addproduct', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(product),
        });
        const productData = await productResponse.json();

        if (productData.success) {
          alert("Product Added");
          // Clear form fields after submission
          setProductDetails({
            name: "",
            image: "",
            category: "women",
            new_price: "",
            old_price: ""
          });
          setImage(null);
        } else {
          alert("Failed to add product");
        }
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("There was an error uploading the product!", error);
      alert("Error uploading product. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="addproduct">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="addproduct-itemfield">
          <label>Product Title</label>
          <input
            type="text"
            name="name"
            value={productDetails.name}
            onChange={handleInputChange}
            placeholder="Type here"
            required
          />
        </div>
        <div className="addproduct-price">
          <div className="addproduct-itemfield">
            <label>Price</label>
            <input
              type="number"
              name="old_price"
              value={productDetails.old_price}
              onChange={handleInputChange}
              placeholder="Type here"
              required
            />
          </div>
          <div className="addproduct-itemfield">
            <label>Offer Price</label>
            <input
              type="number"
              name="new_price"
              value={productDetails.new_price}
              onChange={handleInputChange}
              placeholder="Type here"
              required
            />
          </div>
        </div>
        <div className="addproduct-itemfield">
          <label>Product Category</label>
          <select
            value={productDetails.category}
            name="category"
            onChange={handleInputChange}
            required
          >
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kid">Kid</option>
          </select>
        </div>
        <div className="addproduct-itemfield">
          <label>Product Image</label>
          <p>(file types: .jpeg, .jpg, .png)</p>
          <label htmlFor="file-input">
            <img
              className="addproduct-thumbnail-img"
              src={imageUrl}
              alt="Product Thumbnail"
            />
          </label>
          <input
            type="file"
            name="image"
            id="file-input"
            onChange={handleImageChange}
            accept=".jpeg,.jpg,.png"
            hidden
            required
          />
        </div>
        <button className="addproduct-btn" type="submit" disabled={isUploading}>
          {isUploading ? "Uploading..." : "ADD"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
