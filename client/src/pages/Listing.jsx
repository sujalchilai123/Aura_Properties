import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import {
  Bath,
  BedDouble,
  Armchair,
  MapPin,
  Car,
  Share2,
} from "lucide-react";

import "swiper/css/bundle";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const [contact, setContact] = useState(false)
  const { currentUser } = useSelector((state) => state.user);

  SwiperCore.use([Navigation]);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);


  return (
    <main className="min-h-screen pb-20 pt-20">
      {loading && (
        <div className="flex justify-center items-center py-32">
          <Spinner />
        </div>
      )}
      {error && (
        <div className="flex justify-center items-center py-32">
          <p className="text-2xl text-slate-600 bg-white/50 backdrop-blur-md px-8 py-4 rounded-xl shadow-sm border border-slate-200">
            Something went wrong fetching this property.
          </p>
        </div>
      )}

      {listing && !loading && !error && (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
          <div className="rounded-3xl overflow-hidden shadow-2xl relative">
            <Swiper navigation className="h-[400px] sm:h-[500px] lg:h-[600px]">
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className="w-full h-full"
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-10"></div>

            <div
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 border border-slate-200/50 shadow-lg rounded-full w-12 h-12 flex justify-center items-center bg-white/80 backdrop-blur-md cursor-pointer hover:bg-emerald-50 hover:scale-110 transition-all duration-300 group"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => {
                  setCopied(false);
                }, 2000);
              }}
            >
              <Share2 className="text-emerald-700 w-5 h-5 group-hover:text-emerald-800" />
            </div>

            {copied && (
              <p className="absolute top-20 right-4 sm:top-20 sm:right-6 z-20 rounded-lg bg-slate-800 text-white shadow-xl px-4 py-2 font-medium animate-pulse text-sm">
                Link copied!
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8 relative z-10 -mt-16 lg:-mt-24 px-4 sm:px-8">
            <div className="lg:col-span-2 glass-panel p-6 sm:p-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-800 tracking-tight leading-tight mb-2">
                {listing.name}
              </h1>
              <p className="flex items-center gap-2 text-slate-500 text-base sm:text-lg mb-8 font-medium">
                <MapPin className="text-emerald-500 w-5 h-5" />
                {listing.address}
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <span className="bg-emerald-100 text-emerald-800 text-sm sm:text-base font-bold px-4 py-1.5 rounded-full shadow-sm border border-emerald-200 uppercase tracking-wide">
                  {listing.type === "rent" ? "For Rent" : "For Sale"}
                </span>
                {listing.offer && (
                  <span className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm sm:text-base font-bold px-4 py-1.5 rounded-full shadow-md uppercase tracking-wide hover:shadow-lg transition-shadow">
                    ₹{+listing.regularPrice - +listing.discountPrice} OFF
                  </span>
                )}
              </div>

              <div className="prose prose-slate max-w-none">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="w-8 h-1 bg-emerald-500 rounded-full inline-block"></span>
                    Property Description
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {listing.description}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="w-8 h-1 bg-teal-500 rounded-full inline-block"></span>
                  Amenities & Details
                </h3>
                <ul className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-slate-700 font-medium">
                  <li className="flex flex-col items-center justify-center gap-2 bg-slate-50/80 p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <BedDouble className="w-8 h-8 text-emerald-600 mb-1" />
                    <span>{listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `${listing.bedrooms} Bed`}</span>
                  </li>
                  <li className="flex flex-col items-center justify-center gap-2 bg-slate-50/80 p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <Bath className="w-8 h-8 text-emerald-600 mb-1" />
                    <span>{listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : `${listing.bathrooms} Bath`}</span>
                  </li>
                  <li className="flex flex-col items-center justify-center gap-2 bg-slate-50/80 p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <Car className="w-8 h-8 text-emerald-600 mb-1" />
                    <span>{listing.parking ? "Parking" : "No Parking"}</span>
                  </li>
                  <li className="flex flex-col items-center justify-center gap-2 bg-slate-50/80 p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                    <Armchair className="w-8 h-8 text-emerald-600 mb-1" />
                    <span>{listing.furnished ? "Furnished" : "Unfurnished"}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Pricing and Contact Side Card */}
            <div className="lg:col-span-1">
              <div className="glass-panel p-6 sm:p-8 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
                <div className="mb-6 pb-6 border-b border-slate-200/60">
                  <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-1">Asking Price</p>
                  <p
                    className="text-3xl sm:text-4xl lg:text-3xl xl:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 break-words"
                    title={`₹${listing.offer ? listing.discountPrice.toLocaleString("en-IN") : listing.regularPrice.toLocaleString("en-IN")}`}
                  >
                    ₹{listing.offer
                      ? listing.discountPrice.toLocaleString("en-IN")
                      : listing.regularPrice.toLocaleString("en-IN")}
                  </p>
                  {listing.type === "rent" && <p className="text-slate-500 mt-1 font-medium text-lg">/ month</p>}
                </div>

                {currentUser && listing.userRef !== currentUser._id && !contact && (
                  <button
                    onClick={() => setContact(true)}
                    className="w-full bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-xl uppercase font-bold text-sm tracking-wider py-4 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-300"
                  >
                    Contact Landlord
                  </button>
                )}

                {contact && (
                  <div className="mt-4">
                    <Contact listing={listing} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
