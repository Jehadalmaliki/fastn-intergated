import React, { useState, useEffect } from 'react';

function App() {
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://api.live.fastn.ai/api/v1/MultiDataSourceProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-fastn-api-key': '7eea2bf5-0ca0-4483-9206-ab53769ad5b0',
          'fastn-space-id': '9d3087b0-06cd-4808-a941-33b70b02d2e1',
          'stage': 'LIVE'
        },
        body: JSON.stringify({"input":{}})
      });
      const responseData = await response.json();

      const shopifyProducts = responseData.ShopifyProducts.output.products.map(product => ({
        id: product.id,
        title: product.title,
        body_html: product.body_html,
        vendor: product.vendor,
        image: product.images.length > 0 ? product.images[0].src : '',
        price: product.variants.length > 0 ? product.variants[0].price : null
      }));

      const bigcommerceProducts = responseData.BigecommecrProducts.output.data.map(product => ({
        id: product.id,
        title: product.name,
        body_html: product.description,
        vendor: 'Bigcommerce', // Assuming vendor for Bigcommerce products
        image: '', // Add image source if available
        price: product.price // Add price for Bigcommerce products
      }));

      // Merge the arrays of products
      const mergedProducts = [...shopifyProducts, ...bigcommerceProducts];

      // Set the state with all products
      setAllProducts(mergedProducts);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div style={{ backgroundColor: '#f4f4f4', fontFamily: 'Arial, sans-serif', color: '#333', padding: '20px' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Product List</h1>
      
      <table className="product-table" style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px', border: '1px solid #ccc' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ccc' }}>Image</th>
            <th style={{ border: '1px solid #ccc' }}>Title</th>
            <th style={{ border: '1px solid #ccc' }}>Description</th>
            <th style={{ border: '1px solid #ccc' }}>Vendor</th>
            <th style={{ border: '1px solid #ccc' }}>Price</th>
          </tr>
        </thead>
        <tbody>
          {allProducts.map(product => (
            <tr key={product.id}>
              <td style={{ border: '1px solid #ccc' }}><img src={product.image} alt={product.title} style={{ width: '100px', height: 'auto' }} /></td>
              <td style={{ border: '1px solid #ccc' }}>{product.title}</td>
              <td style={{ border: '1px solid #ccc' }} dangerouslySetInnerHTML={{ __html: product.body_html }}></td>
              <td style={{ border: '1px solid #ccc' }}>{product.vendor}</td>
              <td style={{ border: '1px solid #ccc' }}>{product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

