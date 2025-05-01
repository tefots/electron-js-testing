interface EditProductData {
    id: number;
    productName: string;
    category: string;
    price: number;
    quantity: number;
    description: string;
    imageURL: string;
  }
  

export async function generateStaticParams() {
    try {
      const result = await window.electronAPI.getProducts();
      if (result.success) {
        return result.products.map((product: EditProductData) => ({
          id: String(product.id),
        }));
      } else {
        console.error("Failed to fetch products:", result.error);
        return [];
      }
    } catch (error) {
      console.error("Error in generateStaticParams:", error);
      return [];
    }
  }