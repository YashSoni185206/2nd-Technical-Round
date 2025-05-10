import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl, currency } from './../App';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this product?");
    if (isConfirmed) {
      try {
        const response = await axios.post(
          backendUrl + '/api/product/remove',
          { id },
          { headers: { token } }
        );
        if (response.data.success) {
          toast.success(response.data.message);
          await fetchList();
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const handleEdit = (productId) => {
    // Navigate to the Edit page with the productId
    navigate(`/edit/${productId}`);
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <p className="mb-2">All Products List</p>
      <div className="flex flex-col w-full gap-2">
        <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 border bg-gray-100 text-sm">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
        </div>

        {list.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[1fr_3fr_1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 border text-sm"
          >
            <img className="w-12" src={item.image[0]} alt="" />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <div className="flex gap-6 justify-end md:justify-center">
              <button
                className="text-sm text-blue-white cursor-pointer border border-black px-2 py-1 rounded-[10px] hover:bg-green-500 hover:text-black transition duration-200"
                onClick={() => handleEdit(item._id)} // Navigate to Edit page with product ID
              >
                Edit
              </button>
              <p
                onClick={() => removeProduct(item._id)}
                className="text-lg cursor-pointer md:text-center hover:text-red-500 transition duration-200"
              >
                X
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default List;
