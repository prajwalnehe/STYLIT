import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const Home = () => {
  const [email, setEmail] = useState('');

  // Product data - Popular T-Shirts
  const popularProducts = [
    {
      id: 1,
      name: 'T-Shirt Name 10',
      price: { min: 22, max: 26 },
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
      category: 'Men'
    },
    {
      id: 2,
      name: 'T-Shirt Name 9',
      price: { min: 22, max: 26 },
      image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop',
      category: 'Women'
    },
    {
      id: 3,
      name: 'T-Shirt Name 8',
      price: { min: 22, max: 26 },
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
      category: 'Men'
    },
    {
      id: 4,
      name: 'T-Shirt Name 7',
      price: { min: 26, max: 30 },
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=800&auto=format&fit=crop',
      category: 'Women'
    }
  ];

  // On Sale Products
  const saleProducts = [
    {
      id: 5,
      name: 'T-Shirt Name 1',
      price: { min: 36, max: 42 },
      discount: 20,
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=800&auto=format&fit=crop',
      category: 'Women'
    },
    {
      id: 6,
      name: 'T-Shirt Name 4',
      price: { min: 37, max: 43 },
      discount: 20,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
      category: 'Men'
    },
    {
      id: 7,
      name: 'T-Shirt Name 6',
      price: { min: 36, max: 42 },
      discount: 10,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop',
      category: 'Men'
    },
    {
      id: 8,
      name: 'T-Shirt Name 7',
      price: { min: 26, max: 30 },
      discount: 10,
      image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=800&auto=format&fit=crop',
      category: 'Women'
    }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with ${email}!`);
    setEmail('');
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <main>
        {/*           Hero Section: Full Screen Banner using Cloudinary Image
          NOTE: Ensure this image link is accessible, or swap for a reliable Unsplash link if issues persist.
        */}
        <section className="relative min-h-[600px] md:min-h-[700px] flex items-center bg-gray-100">
          {/* Full-Screen Background Image */}
          <img
            src="https://res.cloudinary.com/duc9svg7w/image/upload/v1765128866/White_Black_Sneakers_Landscape_Banner_2048_x_594_px_kn5az8.svg"
            alt="Slick Modern Awesome Collection"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Dark Overlay to improve text readability */}
          <div className="absolute inset-0 bg-black opacity-30"></div>

          {/* Content Overlayed on the Image */}
          <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10 text-white">
            <div className="text-left space-y-6 max-w-lg">
              <h2 className="text-xl md:text-2xl font-bold tracking-tight uppercase">WOMEN</h2>
              <h3 className="text-5xl md:text-7xl font-extrabold leading-tight">
                Slick.<br />Modern.<br />Awesome.
              </h3>
              <Link 
                to="/shop" 
                className="inline-block bg-white text-black px-10 py-4 text-sm font-semibold uppercase tracking-wide hover:bg-gray-200 transition-colors"
              >
                Shop Collection
              </Link>
            </div>
          </div>
        </section>

        {/* Secondary Banner section (Pants image) */}
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">New Arrivals</h2>
          </div>
          <div className="relative overflow-hidden group">
            <img
              src="https://res.cloudinary.com/duc9svg7w/image/upload/v1765128846/pants_gm97ca.svg"
              alt="Pants Collection Banner"
              className="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 group-hover:bg-opacity-20 transition-all duration-300">
              <Link 
                to="/shop/pants"
                className="text-white text-3xl font-bold uppercase border-2 border-white px-8 py-4 transition-colors duration-300 hover:bg-white hover:text-black"
              >
                Shop Pants
              </Link>
            </div>
          </div>
        </section>

        {/* Popular T-Shirts Section */}
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Popular T-Shirts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product) => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden mb-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                <p className="text-gray-600">
                  ${product.price.min}.00 - ${product.price.max}.00
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* The Base Collection Banner - Remains the same */}
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <img
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"
              alt="Base Collection 1"
              className="w-full h-[500px] object-cover"
            />
            <img
              src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"
              alt="Base Collection 2"
              className="w-full h-[500px] object-cover"
            />
          </div>
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">MEN</h2>
            <p className="text-lg md:text-xl text-gray-600 mb-6">The base collection - Ideal every day.</p>
            <button className="bg-black text-white px-8 py-4 text-sm font-semibold uppercase tracking-wide hover:bg-gray-800 transition-colors">
              Shop Now
            </button>
          </div>
        </section>

        {/* Be Different Collection Banner - Remains the same */}
        <section className="relative py-20 px-4 md:px-8 bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto relative">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop"
              alt="Be Different Collection"
              className="w-full h-[600px] object-cover opacity-60"
            />
            <div className="absolute inset-0 flex items-center justify-end pr-8 md:pr-16">
              <div className="text-right space-y-4 max-w-md">
                <p className="text-sm uppercase tracking-widest">NEW COLLECTION</p>
                <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                  Be different in your own way!
                </h2>
                <p className="text-lg">Find your unique style.</p>
                <button className="bg-white text-black px-8 py-4 text-sm font-semibold uppercase tracking-wide hover:bg-gray-200 transition-colors mt-4">
                  Shop Collection
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Spring Summer Collection Banner - Remains the same */}
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?q=80&w=800&auto=format&fit=crop"
                alt="Spring Summer Collection"
                className="w-full h-[500px] object-cover"
              />
            </div>
            <div className="bg-pink-50 p-8 md:p-12 space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold">WOMEN</h2>
              <h3 className="text-3xl md:text-4xl font-bold">Spring Summer Collection</h3>
              <p className="text-gray-600 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
              </p>
              <button className="bg-black text-white px-8 py-4 text-sm font-semibold uppercase tracking-wide hover:bg-gray-800 transition-colors">
                See Whole Collection
              </button>
            </div>
          </div>
        </section>

        {/* On Sale T-Shirts Section - Remains the same */}
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto bg-gray-50">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">On Sale T-Shirts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {saleProducts.map((product) => (
              <Link 
                key={product.id} 
                to={`/product/${product.id}`}
                className="group cursor-pointer relative"
              >
                <div className="relative overflow-hidden mb-4">
                  <span className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 text-sm font-bold z-10">
                    -{product.discount}%
                  </span>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
                <p className="text-gray-600">
                  ${product.price.min}.00 - ${product.price.max}.00
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Reviews Section - Remains the same */}
        <section className="py-16 px-4 md:px-8 max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Reviews</h2>
          <div className="bg-gray-50 p-8 md:p-12 rounded-lg">
            <p className="text-gray-700 leading-relaxed mb-6 italic">
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris. Good quality T-shirts."
            </p>
            <div className="flex items-center justify-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-yellow-400 w-5 h-5" />
              ))}
            </div>
            <p className="font-semibold">JANE DOE</p>
          </div>
        </section>

        {/* Featured Products Section - Remains the same */}
        <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop"
                alt="Men Collection"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-6">
                <h3 className="text-2xl font-bold mb-2">MEN</h3>
                <p className="text-lg">Collection</p>
              </div>
            </div>
            <div className="relative group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop"
                alt="Women Collection"
                className="w-full h-[500px] object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-6">
                <h3 className="text-2xl font-bold mb-2">WOMEN</h3>
                <p className="text-lg">Collection</p>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Subscription - Remains the same */}
        <section className="py-20 px-4 md:px-8 bg-pink-50">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Subscribe To Get Offers In Your Inbox</h2>
            <p className="text-gray-600">
              Stay updated with our latest collections and exclusive offers.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
              <button
                type="submit"
                className="bg-black text-white px-8 py-3 text-sm font-semibold uppercase tracking-wide hover:bg-gray-800 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;