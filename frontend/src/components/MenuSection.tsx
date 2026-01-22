import { Product } from '../App';

interface MenuSectionProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export function MenuSection({ products, onProductClick }: MenuSectionProps) {
  const categories = Array.from(new Set(products.map(p => p.category)));

  return (
    <div className="space-y-12">
      {categories.map(category => {
        const categoryProducts = products.filter(p => p.category === category);
        
        return (
          <div key={category}>
            <h3 className="text-2xl md:text-3xl text-gray-800 mb-6 pb-2 border-b-2 border-orange-500">
              {category}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoryProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => onProductClick(product)}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-xl"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.nameVi}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm">
                      {product.price.toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="text-xl text-gray-800 mb-2">
                      {product.nameVi}
                    </h4>
                    <p className="text-sm text-gray-500 mb-1">{product.name}</p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {product.descriptionVi}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
