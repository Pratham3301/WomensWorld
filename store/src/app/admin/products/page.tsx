import prisma from '@/lib/prisma';
import Link from 'next/link';
import { Plus, Trash2, Eye, EyeOff, Pencil } from 'lucide-react';
import { deleteProduct, toggleProductStatus } from '@/app/actions/product';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      variants: true,
      images: true,
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-serif text-[#4A3B32]">Products</h1>
          <p className="text-sm text-[#8B7355] mt-1">Manage your store&apos;s inventory and catalog.</p>
        </div>
        <Link 
          href="/admin/products/create"
          className="flex items-center px-4 py-2 bg-[#4A3B32] text-white rounded-lg hover:bg-[#3A2E27] transition-colors shadow-sm text-sm font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-[#E8DCC4] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-[#E8DCC4]">
            <thead className="bg-[#FDFBF7]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#8B7355] uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#8B7355] uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#8B7355] uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#8B7355] uppercase tracking-wider">
                  Total Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-[#8B7355] uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-[#8B7355] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#E8DCC4]">
              {products.map((product) => {
                const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                
                return (
                  <tr key={product.id} className="hover:bg-[#FDFBF7]/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden bg-gray-100 border border-[#E8DCC4]">
                          {product.images[0]?.url && (
                            <img src={product.images[0].url} alt={product.name} className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-[#4A3B32]">{product.name}</div>
                          <div className="text-xs text-[#8B7355] truncate max-w-[200px]">{product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#8B9D83]/10 text-[#8B9D83]">
                        {product.category.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4A3B32]">
                      ₹{product.price.toLocaleString('en-IN')}
                      {product.discountPrice && (
                        <span className="text-xs text-[#C5A46D] font-medium ml-2">→ ₹{product.discountPrice.toLocaleString('en-IN')}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#4A3B32]">{totalStock} units</div>
                      <div className="text-xs text-[#8B7355]">{product.variants.length} variant(s)</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <form action={async () => {
                        'use server';
                        await toggleProductStatus(product.id, product.isActive);
                      }}>
                        <button type="submit" className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          product.isActive 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        } transition-colors`}>
                          {product.isActive ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                          {product.isActive ? 'Active' : 'Draft'}
                        </button>
                      </form>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-[#8B9D83] hover:text-[#4A3B32] p-1 transition-colors"
                          title="Edit product"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <form action={async () => {
                          'use server';
                          await deleteProduct(product.id);
                        }}>
                          <button type="submit" className="text-red-500 hover:text-red-700 p-1 transition-colors" title="Delete product">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#8B7355]">
                    No products found. Start by adding a new product.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
