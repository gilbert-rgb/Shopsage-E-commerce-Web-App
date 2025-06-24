import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from '../contexts/ProductContext';
import { UserContext } from '../contexts/UserContext';

const Products = () => {
  const { currentUser } = useContext(UserContext);
  const { products, deleteProduct } = useContext(ProductContext);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Products ({products?.length || 0})</h2>

      {products && products.length < 1 ? (
        <p>No products available at the moment.</p>
      ) : (
        <ul>
          {/* Admin can view and manage all products */}
          {currentUser && currentUser.is_admin && products.map((product) => (
            <li key={product.id} className="flex items-center mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
              {/* Product Info */}
              <div className="flex-1">
                <Link to={`/product/${product.id}`} className="text-blue-600 hover:underline">
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                </Link>
                <p className="text-gray-600">{product.description}</p>
                <p className="font-semibold text-gray-800 mt-2">Price: ${product.price}</p>
                <p className="text-gray-500">Stock: {product.stock}</p>
              </div>

              {/* Admin Actions */}
              <div className="flex flex-col gap-2 ml-4">
                <Link to={`/edit-product/${product.id}`}>
                  <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}

          {/* Normal users only see products with stock > 0 */}
          {currentUser && !currentUser.is_admin && products.map((product) => (
            product.stock > 0 && (
              <li key={product.id} className="flex items-center mb-4 p-4 bg-gray-100 rounded-lg shadow-md">
                <div>
                  <Link to={`/product/${product.id}`} className="text-blue-600 hover:underline">
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                  </Link>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-gray-800 font-semibold mt-2">Price: ${product.price}</p>
                  <p className="text-gray-500">Stock: {product.stock}</p>
                </div>
              </li>
            )
          ))}
        </ul>
      )}
    </div>
  );
};

export default Products;
