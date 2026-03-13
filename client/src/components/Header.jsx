import { Search, UserCircle, Menu } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Header() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [searchTerm, setSearchTerm] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle transparent to solid background on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);

  // If we are on the home page and not scrolled, background should be transparent.
  const isHome = location.pathname === "/";
  const navClass = isHome && !isScrolled
    ? "bg-black/20 backdrop-blur-md border border-white/10"
    : "bg-white/90 backdrop-blur-2xl border border-slate-200/60 shadow-xl shadow-slate-200/20";

  const textColor = isHome && !isScrolled ? "text-white" : "text-slate-800";
  const searchBg = isHome && !isScrolled ? "bg-white/10 hover:bg-white/20" : "bg-slate-100 hover:bg-slate-200/80";
  const placeholderColor = isHome && !isScrolled ? "placeholder-white/70" : "placeholder-slate-400";
  const searchTextColor = isHome && !isScrolled ? "text-white" : "text-slate-800";
  const iconColor = isHome && !isScrolled ? "text-white/80" : "text-slate-400";

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed w-full top-4 sm:top-6 z-50 flex justify-center px-4 pointer-events-none"
    >
      <div className={`pointer-events-auto flex justify-between items-center w-full max-w-5xl rounded-full px-5 py-3 sm:px-8 sm:py-4 transition-all duration-500 ${navClass}`}>
        <Link to={"/"} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md group-hover:rotate-12 transition-transform duration-300">
            <span className="text-white font-bold text-lg leading-none tracking-tighter">A</span>
          </div>
          <h1 className={`font-extrabold text-xl sm:text-2xl tracking-tight hidden sm:flex items-center ${textColor}`}>
            Aura<span className="font-light ml-1 opacity-80">Properties</span>
          </h1>
        </Link>

        {/* Search Bar - Hidden on mobile */}
        <div className="hidden lg:block flex-1 max-w-md mx-8">
          <form
            onSubmit={handleSubmit}
            className={`${searchBg} transition-all duration-300 px-5 py-2.5 rounded-full items-center flex border border-transparent focus-within:border-emerald-500/30 focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:bg-white`}
          >
            <Search className={`w-4 h-4 mr-2 ${iconColor}`} />
            <input
              type="text"
              placeholder="Search premium locations..."
              className={`bg-transparent focus:outline-none w-full text-sm font-medium ${searchTextColor} ${placeholderColor}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </div>

        <nav className="flex items-center gap-6 sm:gap-8">
          <ul className={`hidden md:flex gap-8 items-center text-sm font-bold tracking-wide ${textColor}`}>
            <li>
              <Link to={"/"} className="hover:text-emerald-500 transition-colors opacity-90 hover:opacity-100">
                Portfolio
              </Link>
            </li>
            <li>
              <Link to={"/about"} className="hover:text-emerald-500 transition-colors opacity-90 hover:opacity-100">
                About Us
              </Link>
            </li>
          </ul>

          <div className="flex items-center gap-4">
            <Link to={"/profile"}>
              {currentUser ? (
                <img
                  src={currentUser.avatar || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                  className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover border-2 border-emerald-500 shadow-md hover:ring-4 ring-emerald-500/30 transition-all duration-300"
                  alt="User"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
                  }}
                />
              ) : (
                <div className={`flex items-center gap-2 hover:text-emerald-500 transition-colors font-semibold text-sm ${textColor}`}>
                  <UserCircle className="w-6 h-6 sm:w-7 sm:h-7" />
                  <span className="hidden sm:inline">Sign In</span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`md:hidden p-2 rounded-full hover:bg-white/10 transition-colors ${textColor}`}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full mt-2 px-4 pointer-events-auto md:hidden"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200/60 p-5 flex flex-col gap-4">
            <form
              onSubmit={(e) => {
                setIsMobileMenuOpen(false);
                handleSubmit(e);
              }}
              className="bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl flex items-center focus-within:border-emerald-500/50"
            >
              <Search className="w-4 h-4 mr-2 text-slate-400" />
              <input
                type="text"
                placeholder="Search premium locations..."
                className="bg-transparent focus:outline-none w-full text-sm font-medium text-slate-800 placeholder-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
            <div className="flex flex-col gap-3 text-sm font-bold text-slate-700">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-center"
              >
                Portfolio
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-3 hover:bg-slate-50 rounded-xl transition-colors text-center"
              >
                About Us
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
