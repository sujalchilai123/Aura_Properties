import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import Spinner from "../components/Spinner";

export default function Search() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [sidebarData, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  // console.log('s-data', sidebarData);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); // Use location.search
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setListings(data);
        if (data.length > 8) {
          setShowMore(true);
        }
      } else {
        setListings([]);
      }
      setLoading(false);
    };

    fetchListings();
  }, [location.search]);
  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({ ...sidebarData, type: e.target.id });
    }

    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebarData, searchTerm: e.target.value });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }

    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";

      const order = e.target.value.split("_")[1] || "desc";

      setSidebardata({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Sidebar Filter - Glass Panel */}
      <div className="glass-panel p-6 md:w-80 h-fit md:sticky top-28 shadow-xl border-slate-200/50">
        <h2 className="text-xl font-bold text-slate-700 mb-6 pb-2 border-b border-slate-200/60">Filter Properties</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Search Term
            </label>
            <input
              type="text"
              id="searchTerm"
              placeholder="E.g. Vintage Villa..."
              className="input-premium focus:ring-1"
              onChange={handleChange}
              value={sidebarData.searchTerm}
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Property Type</label>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  id="all"
                  className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 transition-colors cursor-pointer"
                  onChange={handleChange}
                  checked={sidebarData.type === "all"}
                />
                <span className="text-slate-600 group-hover:text-emerald-700 font-medium">Rent & Sale</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  id="rent"
                  className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 transition-colors cursor-pointer"
                  onChange={handleChange}
                  checked={sidebarData.type === "rent"}
                />
                <span className="text-slate-600 group-hover:text-emerald-700 font-medium">For Rent</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  id="sale"
                  className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 transition-colors cursor-pointer"
                  onChange={handleChange}
                  checked={sidebarData.type === "sale"}
                />
                <span className="text-slate-600 group-hover:text-emerald-700 font-medium">For Sale</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  id="offer"
                  className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 transition-colors cursor-pointer"
                  onChange={handleChange}
                  checked={sidebarData.offer}
                />
                <span className="text-slate-600 group-hover:text-emerald-700 font-medium">Special Offers</span>
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Amenities</label>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  id="parking"
                  className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 transition-colors cursor-pointer"
                  onChange={handleChange}
                  checked={sidebarData.parking}
                />
                <span className="text-slate-600 group-hover:text-emerald-700 font-medium">Parking Lot</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  id="furnished"
                  className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 transition-colors cursor-pointer"
                  onChange={handleChange}
                  checked={sidebarData.furnished}
                />
                <span className="text-slate-600 group-hover:text-emerald-700 font-medium">Furnished</span>
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Sort By</label>
            <select
              className="input-premium py-2.5 cursor-pointer appearance-none"
              name="sort_order"
              id="sort_order"
              onChange={handleChange}
              value={`${sidebarData.sort}_${sidebarData.order}`}
            >
              <option value="regularPrice_desc">Price: High to Low</option>
              <option value="regularPrice_asc">Price: Low to High</option>
              <option value="createdAt_desc">Latest Additions</option>
              <option value="createdAt_asc">Oldest First</option>
            </select>
          </div>

          <button className="business-btn-primary mt-4 py-3.5 tracking-wider w-full">
            Apply Filters
          </button>
        </form>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 pb-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
            Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Listings</span>
          </h1>
          <div className="h-1 flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent ml-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
          {!loading && listings.length === 0 && (
            <div className="col-span-full py-20 text-center glass-panel">
              <p className="text-xl text-slate-500 font-medium">No properties match your exact criteria.</p>
              <p className="text-slate-400 mt-2">Try adjusting your filters to discover more homes.</p>
            </div>
          )}

          {loading && (
            <div className="col-span-full py-20 flex justify-center">
              <Spinner />
            </div>
          )}

          {!loading &&
            listings &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
        </div>

        {showMore && (
          <div className="flex justify-center mt-12">
            <button
              onClick={onShowMoreClick}
              className="bg-white border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 font-bold py-3 px-8 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
            >
              Load More Properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
