import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import ListingItem from "../components/ListingItem";
import { motion } from "framer-motion";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [loading, setLoading] = useState(true);
  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const [resOffer, resRent, resSale] = await Promise.all([
          fetch("/api/listing/get?offer=true&limit=4"),
          fetch("/api/listing/get?type=rent&limit=4"),
          fetch("/api/listing/get?type=sale&limit=4")
        ]);

        const [dataOffer, dataRent, dataSale] = await Promise.all([
          resOffer.json(),
          resRent.json(),
          resSale.json()
        ]);

        if (Array.isArray(dataOffer)) setOfferListings(dataOffer);
        if (Array.isArray(dataRent)) setRentListings(dataRent);
        if (Array.isArray(dataSale)) setSaleListings(dataSale);
      } catch (error) {
        console.log("Error fetching home lists:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  return (
    <div className="bg-[#fafafa]">
      {/* Immersive Hero Section */}
      <div className="relative h-[85vh] min-h-[600px] flex items-center justify-center">
        {/* Architectural Background */}
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="absolute inset-0 bg-slate-900/60"></div>
        </div>

        {/* Hero Content with Framer Motion */}
        <div className="relative z-10 w-full max-w-5xl px-4 text-center mt-16 sm:mt-0 pt-10 sm:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block bg-white/10 backdrop-blur-md text-white px-4 py-1.5 rounded-full text-sm font-semibold tracking-widest border border-white/20 mb-6 uppercase">
              Premium Real Estate Network
            </span>
            <h1 className="text-white font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight tracking-tight mb-6 break-words">
              Discover Exceptionally <br className="hidden md:block" />
              Crafted Properties
            </h1>
            <p className="text-slate-200 text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
              Elevate your standards. Explore our exclusive portfolio of luxury homes, commercial spaces, and architectural masterpieces.
            </p>
          </motion.div>

          {/* Centered Glass Search Box */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="bg-white/10 backdrop-blur-2xl p-2 rounded-2xl border border-white/20 shadow-2xl max-w-3xl mx-auto flex flex-col sm:flex-row gap-2"
          >
            <input
              type="text"
              placeholder="Search by city, neighborhood, or address..."
              className="flex-1 min-w-0 w-full bg-white/90 text-slate-800 placeholder-slate-500 px-6 py-4 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
            <Link
              to="/search"
              className="business-btn-primary py-4 px-8 sm:w-auto w-full font-bold uppercase tracking-wider text-sm whitespace-normal text-center"
            >
              Search Portfolio
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Featured Properties Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col gap-16">

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
          </div>
        )}

        {/* Empty State Graceful Fallback */}
        {!loading && offerListings.length === 0 && rentListings.length === 0 && saleListings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center justify-center text-center py-20 px-4 glass-panel border border-slate-200/50 shadow-sm"
          >
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 mb-4">Exclusive Portfolio Curating</h2>
            <p className="text-slate-500 max-w-lg mb-8 text-lg font-medium">We are currently hand-picking the finest luxury properties for our collection. Check back soon for unparalleled real estate opportunities.</p>
            <Link to="/search" className="business-btn-primary px-8">
              Explore All Regions
            </Link>
          </motion.div>
        )}

        {/* Offers */}
        {offerListings && offerListings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Investment Opportunities</h2>
                <p className="text-slate-500 mt-2 font-medium">Exclusive price reductions on premium properties.</p>
              </div>
              <Link className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline flex items-center gap-1 transition-colors" to={"/search?offer=true"}>
                View all <span className="hidden sm:inline">offers</span> &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Rent */}
        {rentListings && rentListings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Luxury Rentals</h2>
                <p className="text-slate-500 mt-2 font-medium">High-end leasing options for discerning tenants.</p>
              </div>
              <Link className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline flex items-center gap-1 transition-colors" to={"/search?type=rent"}>
                View all <span className="hidden sm:inline">rentals</span> &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Sale */}
        {saleListings && saleListings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Acquisitions</h2>
                <p className="text-slate-500 mt-2 font-medium">Exceptional properties available for purchase.</p>
              </div>
              <Link className="text-emerald-600 font-semibold hover:text-emerald-700 hover:underline flex items-center gap-1 transition-colors" to={"/search?type=sale"}>
                View all <span className="hidden sm:inline">sales</span> &rarr;
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
