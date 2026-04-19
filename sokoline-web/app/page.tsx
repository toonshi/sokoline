import HeroSection from "@/components/HeroSection";
import Image from "next/image";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/api";
import { mockProducts } from "@/lib/mockProducts";
import { ShoppingBag, Star, ArrowRight } from "lucide-react";

export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts({ limit: "6" }),
    getCategories()
  ]);
  
  const newestItems = products.length > 0 ? products : mockProducts.slice(0, 6);

  return (
    <main className="max-w-7xl mx-auto px-6 mb-20">
      <HeroSection />
      
      {/* Newest Items Section (PRISTINE Style) */}
      <div className="mt-6 px-6 py-12 bg-gray-100 rounded-xl">
        <h2 className="mb-12 text-2xl text-center font-semibold">Newest items</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newestItems.map((item) => (
                <div key={item.id} className="group">
                    <Link href={`/products/${item.slug}`}>
                        <div className="relative aspect-square w-full overflow-hidden rounded-t-xl bg-white">
                            {item.images?.[0] ? (
                              <Image src={item.images[0].image} alt={item.name} fill className="object-cover transition-transform group-hover:scale-105" />
                            ) : (
                              <div className="flex items-center justify-center h-full text-gray-200">
                                <ShoppingBag size={64} />
                              </div>
                            )}
                        </div>

                        <div className="p-6 bg-white rounded-b-xl">
                            <h2 className="text-xl font-bold text-gray-900 group-hover:text-teal-500 transition-colors">{item.name}</h2>
                            <p className="text-gray-500 mt-2 font-medium text-lg">Price: ${item.price}</p>
                            <div className="flex items-center gap-1 mt-4">
                               <Star size={12} className="fill-orange-400 text-orange-400" />
                               <span className="text-xs font-semibold text-gray-600">{(item.average_rating || 0).toFixed(1)}</span>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
      </div>

      {/* Categories Section (PRISTINE Style) */}
      <div className="mt-6 px-6 py-12 bg-gray-100 rounded-xl">
        <h2 className="mb-12 text-2xl text-center font-semibold">Categories</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
                <div key={category.id}>
                    <Link href={`/products?category=${category.slug}`}>
                        <div className="p-6 bg-white rounded-xl hover:shadow-md transition-all text-center">
                            <h2 className="text-lg font-bold text-gray-900">{category.name}</h2>
                            <p className="text-gray-400 text-xs mt-1 uppercase tracking-tighter">Explore</p>
                        </div>
                    </Link>
                </div>
            ))}
            {categories.length === 0 && [1,2,3,4,5,6].map(i => (
              <div key={i} className="p-6 bg-white rounded-xl text-center animate-pulse">
                <div className="h-4 w-16 bg-gray-100 mx-auto rounded" />
              </div>
            ))}
        </div>
      </div>

      <footer className="mt-12 py-12 px-6 flex flex-col md:flex-row justify-between bg-gray-800 rounded-xl">
        <div className="w-full md:w-2/3 pr-10 mb-8 md:mb-0">
          <h3 className="mb-5 font-semibold text-gray-400 uppercase tracking-widest text-xs">About</h3>
          <p className="text-lg text-gray-500 leading-relaxed">
            metric is the campus-first commerce infrastructure. We empower students to launch verified ventures and reach their peer network with professional-grade storefront tools.
          </p>
        </div>

        <div className="w-full md:w-1/3">
          <h3 className="mb-5 font-semibold text-gray-400 uppercase tracking-widest text-xs">Menu</h3>

          <ul className="space-y-3">
            <li>
              <Link href="#" className="text-lg text-teal-500 hover:text-teal-700 transition-colors font-medium">About</Link>
            </li>
            <li>
              <Link href="#" className="text-lg text-teal-500 hover:text-teal-700 transition-colors font-medium">Contact</Link>
            </li>
            <li>
              <Link href="#" className="text-lg text-teal-500 hover:text-teal-700 transition-colors font-medium">Privacy policy</Link>
            </li>
            <li>
              <Link href="#" className="text-lg text-teal-500 hover:text-teal-700 transition-colors font-medium">Terms of use</Link>
            </li>
          </ul>
        </div>
      </footer>
    </main>
  );
}
