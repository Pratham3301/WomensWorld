'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateProduct } from '@/app/actions/product';
import { Save, Image as ImageIcon, AlertCircle, CheckCircle2, Upload, ArrowLeft } from 'lucide-react';

const editSchema = z
  .object({
    name: z.string().min(3, 'Product name must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    price: z
      .string()
      .min(1, 'Price is required')
      .refine((v) => !isNaN(Number(v)) && Number(v) > 0, { message: 'Price must be greater than ₹0' }),
    discountPrice: z
      .string()
      .optional()
      .refine((v) => !v || (!isNaN(Number(v)) && Number(v) >= 0), { message: 'Sale price cannot be negative' }),
    categoryId: z.string().min(1, 'Please select a category'),
    stock: z
      .string()
      .optional()
      .refine((v) => !v || (!isNaN(Number(v)) && Number(v) >= 0 && Number.isInteger(Number(v))), {
        message: 'Stock must be a whole number ≥ 0',
      }),
    isActive: z.boolean().default(true),
    imageUrl: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.discountPrice && data.price) {
        return Number(data.discountPrice) < Number(data.price);
      }
      return true;
    },
    { message: 'Sale price must be less than the regular price', path: ['discountPrice'] }
  );

type EditFormValues = z.infer<typeof editSchema>;

type ProductData = {
  id: string;
  name: string;
  description: string;
  price: number;
  discountPrice: number | null;
  categoryId: string;
  isActive: boolean;
  images: { url: string }[];
  variants: { stock: number }[];
};

type Category = { id: string; name: string };

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-red-600 font-medium">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}

const inputClass = (hasError?: boolean) =>
  `w-full px-4 py-2.5 border rounded-lg text-sm transition-colors bg-[#FDFBF7] focus:outline-none focus:ring-2 ${
    hasError
      ? 'border-red-400 focus:ring-red-200 focus:border-red-500'
      : 'border-[#E8DCC4] focus:ring-[#8B9D83]/30 focus:border-[#8B9D83]'
  }`;

export default function ProductEditClient({
  product,
  categories,
}: {
  product: ProductData;
  categories: Category[];
}) {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const [saved, setSaved] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentStock = product.variants[0]?.stock ?? 10;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<EditFormValues, unknown, EditFormValues>({
    resolver: zodResolver(editSchema) as never,
    defaultValues: {
      name: product.name,
      description: product.description,
      price: String(product.price),
      discountPrice: product.discountPrice ? String(product.discountPrice) : '',
      categoryId: product.categoryId,
      isActive: product.isActive,
      stock: String(currentStock),
      imageUrl: '',
    },
  });

  const watchedPrice = watch('price');

  async function onSubmit(data: EditFormValues) {
    setServerError('');
    setSaved(false);
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        formData.append(key, String(value));
      }
    });
    formData.set('isActive', data.isActive ? 'on' : 'off');

    if (fileInputRef.current?.files?.[0]) {
      formData.append('imageFile', fileInputRef.current.files[0]);
    }

    const result = await updateProduct(product.id, formData);

    if (result.error) {
      setServerError(result.error);
    } else {
      setSaved(true);
      setTimeout(() => router.push('/admin/products'), 1200);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="space-y-8" noValidate>
      {serverError && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm flex items-start gap-3">
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
          <span>{serverError}</span>
        </div>
      )}
      {saved && (
        <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-200 text-sm flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          Product updated! Redirecting...
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* ── Main Info ── */}
        <div className="md:col-span-2 space-y-6 bg-white p-6 rounded-xl border border-[#E8DCC4] shadow-sm">
          <h2 className="text-lg font-medium text-[#4A3B32] border-b border-[#E8DCC4] pb-4">Basic Information</h2>

          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[#4A3B32] mb-1">
                Product Name <span className="text-red-500">*</span>
              </label>
              <input id="name" type="text" {...register('name')} className={inputClass(!!errors.name)} />
              <FieldError message={errors.name?.message} />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-[#4A3B32] mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                rows={4}
                {...register('description')}
                className={inputClass(!!errors.description)}
              />
              <FieldError message={errors.description?.message} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-[#4A3B32] mb-1">
                  Regular Price (₹) <span className="text-red-500">*</span>
                </label>
                <input id="price" type="number" min="1" step="1" {...register('price')} className={inputClass(!!errors.price)} />
                <FieldError message={errors.price?.message} />
              </div>
              <div>
                <label htmlFor="discountPrice" className="block text-sm font-medium text-[#4A3B32] mb-1">
                  Sale Price (₹)
                  {watchedPrice && (
                    <span className="text-xs text-[#8B7355] ml-2 font-normal">max ₹{Number(watchedPrice) - 1}</span>
                  )}
                </label>
                <input
                  id="discountPrice"
                  type="number"
                  min="0"
                  step="1"
                  {...register('discountPrice')}
                  className={inputClass(!!errors.discountPrice)}
                />
                <FieldError message={errors.discountPrice?.message} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-6">
          {/* Organization */}
          <div className="bg-white p-6 rounded-xl border border-[#E8DCC4] shadow-sm space-y-5">
            <h2 className="text-lg font-medium text-[#4A3B32] border-b border-[#E8DCC4] pb-4">Organization</h2>
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-[#4A3B32] mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select id="categoryId" {...register('categoryId')} className={inputClass(!!errors.categoryId)}>
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <FieldError message={errors.categoryId?.message} />
            </div>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                {...register('isActive')}
                className="h-5 w-5 rounded border-[#E8DCC4] text-[#8B9D83] focus:ring-[#8B9D83] cursor-pointer"
              />
              <span className="text-sm font-medium text-[#4A3B32] group-hover:text-[#8B9D83] transition-colors">
                Active (visible on store)
              </span>
            </label>
          </div>

          {/* Current Image */}
          <div className="bg-white p-6 rounded-xl border border-[#E8DCC4] shadow-sm space-y-4">
            <h2 className="text-lg font-medium text-[#4A3B32] border-b border-[#E8DCC4] pb-4">Product Image</h2>

            {/* Current image */}
            {product.images[0]?.url && !previewUrl && (
              <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-[#E8DCC4]">
                <Image src={product.images[0].url} alt="Current image" fill className="object-cover" />
                <div className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-xs text-center py-1.5">
                  Current image
                </div>
              </div>
            )}
            {previewUrl && (
              <div className="relative w-full aspect-square rounded-lg overflow-hidden border border-[#E8DCC4]">
                <Image src={previewUrl} alt="New image preview" fill className="object-cover" />
                <div className="absolute bottom-0 inset-x-0 bg-[#8B9D83]/80 text-white text-xs text-center py-1.5">
                  New image (not saved yet)
                </div>
              </div>
            )}

            <label
              htmlFor="imageFile"
              className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-[#E8DCC4] rounded-lg cursor-pointer hover:border-[#8B9D83] hover:bg-[#F7F4EE] transition-colors"
            >
              <Upload className="h-5 w-5 text-[#8B7355] mb-1" />
              <span className="text-xs text-[#8B7355] font-medium">Replace image</span>
            </label>
            <input
              type="file"
              id="imageFile"
              ref={fileInputRef}
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPreviewUrl(URL.createObjectURL(file));
              }}
            />

            <div className="flex items-center gap-2">
              <div className="flex-grow h-px bg-[#E8DCC4]" />
              <span className="text-[#8B7355] text-xs font-medium uppercase">Or paste URL</span>
              <div className="flex-grow h-px bg-[#E8DCC4]" />
            </div>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8B7355]/40" />
              <input
                id="imageUrl"
                type="text"
                {...register('imageUrl')}
                placeholder="https://..."
                className="w-full pl-9 pr-4 py-2.5 border border-[#E8DCC4] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#8B9D83]/30 focus:border-[#8B9D83] bg-[#FDFBF7]"
              />
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white p-6 rounded-xl border border-[#E8DCC4] shadow-sm space-y-4">
            <h2 className="text-lg font-medium text-[#4A3B32] border-b border-[#E8DCC4] pb-4">Inventory</h2>
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-[#4A3B32] mb-1">
                Stock per size <span className="text-red-500">*</span>
              </label>
              <input id="stock" type="number" min="0" {...register('stock')} className={inputClass(!!errors.stock)} />
              <p className="mt-1 text-xs text-[#8B7355]">Applied to all size variants of this product.</p>
              <FieldError message={errors.stock?.message} />
            </div>
          </div>
        </div>
      </div>

      {/* Submit Row */}
      <div className="flex justify-between items-center pt-6 border-t border-[#E8DCC4]">
        <Link
          href="/admin/products"
          className="flex items-center gap-2 px-4 py-2.5 border border-[#E8DCC4] rounded-lg text-[#4A3B32] hover:bg-[#FDFBF7] font-medium transition-colors text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
        <div className="flex items-center gap-4">
          {Object.keys(errors).length > 0 && (
            <p className="text-sm text-red-600 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4" />
              Fix errors above
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-7 py-2.5 bg-[#4A3B32] text-white rounded-lg hover:bg-[#3A2E27] font-medium disabled:opacity-70 transition-colors shadow-sm text-sm"
          >
            {isSubmitting ? (
              <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  );
}
