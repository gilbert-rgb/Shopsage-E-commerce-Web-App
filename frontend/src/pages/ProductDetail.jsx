// src/pages/ProductDetail.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  // Simulated fetch
  useEffect(() => {
    const mockProduct = {
      id,
      name: 'Sample Product',
      description: 'This is a detailed product description.',
      price: 99.99,
      image: 'https://via.placeholder.com/300',
    };
    setProduct(mockProduct);
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-64 object-cover rounded mb-4"
      />
      <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
      <p className="text-gray-700 mb-4">{product.description}</p>
      <p className="text-xl font-semibold text-blue-600">${product.price}</p>
    </div>
  );
};

export default ProductDetail;
