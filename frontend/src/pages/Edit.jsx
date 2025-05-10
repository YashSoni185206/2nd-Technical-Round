import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const Edit = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [image3, setImage3] = useState(null);
  const [image4, setImage4] = useState(null);
  const [existingImages, setExistingImages] = useState([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Shirt');
  const [inStock, setInStock] = useState(false);
  const [sizes, setSizes] = useState([]);

  const [isModified, setIsModified] = useState(false); // Track if any modification is done

  const sizeOptions = {
    Shirt: ['S - 38', 'M - 40', 'L - 42', 'XL - 44', 'XXL - 46', '3XL - 48'],
    Formalshirt: ['S - 38', 'M - 40', 'L - 42', 'XL - 44', 'XXL - 46', '3XL - 48'],
    Tshirt: ['S - 38', 'M - 40', 'L - 42', 'XL - 44', 'XXL - 46', '3XL - 48'],
    Oversizedtshirt: ['S - 38', 'M - 40', 'L - 42', 'XL - 44', 'XXL - 46', '3XL - 48'],
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/product/single`, {
          headers: { token },
          params: { productId: id },
        });

        if (response.data.success) {
          const product = response.data.product;
          setName(product.name);
          setDescription(product.description);
          setPrice(product.price);
          setCategory(product.category);
          setInStock(product.inStock);
          setSizes(product.sizes);
          setExistingImages(product.image || []);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchProduct();
  }, [id, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isModified) {
      toast.info("No modifications made.");
      return;
    }

    const confirmation = window.confirm("Are you sure you want to update the product?");
    if (confirmation) {
      try {
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('category', category);
        formData.append('inStock', inStock);
        formData.append('sizes', JSON.stringify(sizes));

        image1 && formData.append('image1', image1);
        image2 && formData.append('image2', image2);
        image3 && formData.append('image3', image3);
        image4 && formData.append('image4', image4);

        const response = await axios.put(`${backendUrl}/api/product/edit/${id}`, formData, {
          headers: { token },
        });

        if (response.data.success) {
          toast.success(response.data.message);
          navigate('/list');
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleCancel = () => {
    toast.info("Edit cancelled.");
    navigate('/list');
  };

  const handleInputChange = (setter, value) => {
    setter(value);
    setIsModified(true); // Mark the form as modified
  };

  const handleImageChange = (setter, e) => {
    setter(e.target.files[0]);
    setIsModified(true); // Mark the form as modified
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-start w-full gap-3">
      <div>
        <p className="mb-2">Edit Images</p>
        <div className="flex gap-2">
          {[image1, image2, image3, image4].map((img, idx) => (
            <label key={idx} htmlFor={`image${idx + 1}`}>
              <img
                className="w-20 h-20 object-cover"
                src={
                  img
                    ? URL.createObjectURL(img)
                    : existingImages[idx]
                      ? existingImages[idx]
                      : assets.upload_area
                }
                alt={`preview ${idx + 1}`}
              />
              <input
                type="file"
                id={`image${idx + 1}`}
                hidden
                onChange={(e) => handleImageChange([setImage1, setImage2, setImage3, setImage4][idx], e)}
              />
            </label>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2">Product Name</p>
        <input
          value={name}
          onChange={(e) => handleInputChange(setName, e.target.value)}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Enter Product Name"
          required
        />
      </div>

      <div className="w-full">
        <p className="mb-2">Product Description</p>
        <textarea
          value={description}
          onChange={(e) => handleInputChange(setDescription, e.target.value)}
          className="w-full max-w-[500px] px-3 py-2"
          placeholder="Enter Product Description"
          required
        />
      </div>

      <div className="flex flex-col w-full gap-2 sm:flex-row sm:gap-8">
        <div>
          <p className="mb-2">Product Category</p>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSizes([]); // Reset sizes when category changes
              setIsModified(true); // Mark as modified when category changes
            }}
            className="w-full px-3 py-2"
          >
            {Object.keys(sizeOptions).map((cat, idx) => (
              <option key={idx} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Product Price</p>
          <input
            value={price}
            onChange={(e) => handleInputChange(setPrice, e.target.value)}
            className="w-full px-3 py-2 sm:w-[120px]"
            type="number"
            placeholder="5000"
            required
          />
        </div>
      </div>

      <div>
        <p className="mb-2">Product Sizes</p>
        <div className="flex flex-wrap gap-3">
          {sizeOptions[category]?.map((size, index) => (
            <p
              key={index}
              className={`px-3 py-1 cursor-pointer bg-slate-200 border-2 ${sizes.includes(size) ? 'border-orange-500' : 'border-transparent'} hover:bg-orange-100 hover:border-orange-500 transition duration-200`}
              onClick={() => {
                setSizes((prevSizes) =>
                  prevSizes.includes(size) ? prevSizes.filter((s) => s !== size) : [...prevSizes, size]
                );
                setIsModified(true); // Mark as modified when size is selected/deselected
              }}
            >
              {size}
            </p>
          ))}
        </div>
      </div>

      <div className="flex gap-1 mt-2">
        <input
          type="checkbox"
          id="inStock"
          checked={inStock}
          onChange={() => {
            setInStock((prev) => !prev);
            setIsModified(true); // Mark as modified when inStock checkbox is toggled
          }}
        />
        <label htmlFor="inStock" className="cursor-pointer">
          Product In Stock
        </label>
      </div>

      <div className="flex flex-col sm:flex-row sm:gap-10 mt-5">
        <button
          type="button"
          onClick={handleCancel}
          className="w-40 py-3 text-black bg-gray-200 hover:bg-gray-400 mb-2 sm:mb-0"
        >
          CANCEL
        </button>
        <button
          type="submit"
          disabled={!isModified}
          className={`w-40 py-3 text-white ${isModified ? 'bg-black hover:bg-gray-700' : 'bg-gray-300'} sm:mt-0 mt-2`}
        >
          UPDATE PRODUCT
        </button>
      </div>
    </form>
  );
};

export default Edit;
