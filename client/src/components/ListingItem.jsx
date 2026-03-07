import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { MapPin, BedDouble, Bath } from "lucide-react";
import { motion } from "framer-motion";

export default function ListingItem({ listing }) {
  const defaultImg =
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2075&q=80";

  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="bg-white border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-emerald-900/10 transition-shadow overflow-hidden rounded-2xl w-full sm:w-[320px] lg:w-[300px] flex flex-col relative group"
    >
      <Link to={`/listing/${listing._id}`} className="flex flex-col h-full">
        {/* Image Container with Gradient Overlay */}
        <div className="relative h-[240px] w-full overflow-hidden">
          <img
            src={listing.imageUrls[0] || defaultImg}
            alt="listing cover"
            className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 text-white flex flex-col justify-end p-4">
            <p className="font-bold tracking-wide text-lg drop-shadow-md">
              ₹{listing.offer
                ? listing.discountPrice.toLocaleString("en-IN")
                : listing.regularPrice.toLocaleString("en-IN")}
              {listing.type === "rent" && <span className="text-sm font-medium"> / month</span>}
            </p>
          </div>
          {/* Badge */}
          <div className="absolute top-4 left-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md uppercase tracking-wider">
            {listing.type === "rent" ? "For Rent" : "For Sale"}
          </div>
        </div>

        {/* Content Details */}
        <div className="p-5 flex flex-col flex-1 bg-white">
          <h3 className="text-lg font-bold text-slate-800 truncate mb-2 group-hover:text-emerald-700 transition-colors">
            {listing.name}
          </h3>

          <div className="flex items-start gap-1.5 mb-3 text-slate-500">
            <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-emerald-600" />
            <p className="text-sm truncate w-full font-medium">
              {listing.address}
            </p>
          </div>

          <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">
            {listing.description}
          </p>

          <div className="pt-4 border-t border-slate-100 flex items-center gap-6 text-slate-700">
            <div className="flex items-center gap-2 font-semibold text-sm">
              <BedDouble className="w-4 h-4 text-emerald-600" />
              {listing.bedrooms} {listing.bedrooms > 1 ? "Beds" : "Bed"}
            </div>
            <div className="flex items-center gap-2 font-semibold text-sm">
              <Bath className="w-4 h-4 text-emerald-600" />
              {listing.bathrooms} {listing.bathrooms > 1 ? "Baths" : "Bath"}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

ListingItem.propTypes = {
  listing: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    offer: PropTypes.bool.isRequired,
    regularPrice: PropTypes.number.isRequired,
    discountPrice: PropTypes.number,
    type: PropTypes.string.isRequired,
    bedrooms: PropTypes.number.isRequired,
    bathrooms: PropTypes.number.isRequired,
    imageUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};