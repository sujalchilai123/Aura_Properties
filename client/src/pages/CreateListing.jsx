import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ImagePlus,
  Upload,
  X,
  Home,
  MapPin,
  FileText,
  Settings2,
  IndianRupee,
  BedDouble,
  Bath,
  Car,
  Sofa,
  Tag,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  CloudUpload,
} from "lucide-react";

// ─── Client-side image compression ───────────────────────────────
const compressImage = (file, maxWidth = 1920, quality = 0.75) => {
  return new Promise((resolve, reject) => {
    // Skip non-image files
    if (!file.type.startsWith("image/")) {
      return reject(new Error("Not an image file"));
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let { width, height } = img;

        // Scale down if wider than maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) return reject(new Error("Compression failed"));
            const compressedFile = new File([blob], file.name, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = e.target.result;
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
};

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    sale: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Drag & Drop handlers
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);
  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(e.dataTransfer.files);
    }
  }, []);

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      setUploadProgress({});

      try {
        // Compress all images first
        const compressedFiles = [];
        for (let i = 0; i < files.length; i++) {
          setUploadProgress((prev) => ({ ...prev, [i]: 5 })); // Show compression started
          try {
            const compressed = await compressImage(files[i]);
            compressedFiles.push(compressed);
          } catch {
            // If compression fails, use original
            compressedFiles.push(files[i]);
          }
          setUploadProgress((prev) => ({ ...prev, [i]: 20 })); // Compression done
        }

        // Upload all compressed files via backend API
        const formDataUpload = new FormData();
        compressedFiles.forEach((file) => {
          formDataUpload.append("images", file);
        });

        // Use XMLHttpRequest for progress tracking
        const urls = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", "/api/upload");

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 80) + 20;
              // Update all file progresses proportionally
              const progressUpdate = {};
              for (let i = 0; i < compressedFiles.length; i++) {
                progressUpdate[i] = percent;
              }
              setUploadProgress(progressUpdate);
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200) {
              const data = JSON.parse(xhr.responseText);
              if (data.success) {
                resolve(data.urls);
              } else {
                reject(new Error(data.message || "Upload failed"));
              }
            } else {
              reject(new Error("Upload failed with status " + xhr.status));
            }
          };

          xhr.onerror = () => reject(new Error("Network error during upload"));
          xhr.send(formDataUpload);
        });

        setFormData({
          ...formData,
          imageUrls: formData.imageUrls.concat(urls),
        });
        setImageUploadError(false);
        setUploading(false);
        setUploadProgress({});
        // Clear file input
        setFiles([]);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err) {
        setImageUploadError(err.message || "Image upload failed. Please try again.");
        setUploading(false);
        setUploadProgress({});
      }
    } else if (files.length === 0) {
      setImageUploadError("Please select images first");
    } else {
      setImageUploadError("You can upload up to 6 images per listing");
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleFormSumbit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1) {
        return setError("You must upload at least one image");
      }

      if (+formData.regularPrice < +formData.discountPrice) {
        return setError("Discount price must be lower than regular price!");
      }

      setLoading(true);
      setError(false);
      const res = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
        }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 pt-24 pb-8 px-4 sm:px-6 lg:px-8">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            List Your Property
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight">
            Create a Listing
          </h1>
          <p className="mt-3 text-gray-500 max-w-lg mx-auto">
            Showcase your property to thousands of potential buyers and tenants
          </p>
        </motion.div>

        <form onSubmit={handleFormSumbit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* ═══ Left Column: Property Details ═══ */}
            <div className="lg:col-span-3 space-y-6">
              {/* Basic Info Section */}
              <motion.div
                custom={0}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                    <Home className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Property Details
                    </h2>
                    <p className="text-sm text-gray-500">
                      Basic information about your property
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Property Name
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        maxLength={62}
                        minLength={10}
                        required
                        onChange={handleChange}
                        value={formData.name}
                        placeholder="e.g. Modern 3BHK Apartment in Bandra"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-gray-50/50 text-gray-800 placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        id="address"
                        maxLength={62}
                        minLength={10}
                        required
                        onChange={handleChange}
                        value={formData.address}
                        placeholder="Full property address"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-gray-50/50 text-gray-800 placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Description
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                      <textarea
                        id="description"
                        required
                        onChange={handleChange}
                        value={formData.description}
                        placeholder="Describe the property features, surroundings, amenities..."
                        rows={4}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-gray-50/50 text-gray-800 placeholder:text-gray-400 resize-y min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Listing Type */}
              <motion.div
                custom={1}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
                    <Tag className="w-5 h-5 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Listing Type
                    </h2>
                    <p className="text-sm text-gray-500">
                      Choose how you want to list the property
                    </p>
                  </div>
                </div>

                {/* Sale / Rent Toggle */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <label
                    className={`relative flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      formData.type === "sale"
                        ? "border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-sm"
                        : "border-gray-200 bg-gray-50/50 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id="sale"
                      onChange={handleChange}
                      checked={formData.type === "sale"}
                      className="sr-only"
                    />
                    <IndianRupee className="w-5 h-5" />
                    <span className="font-semibold">For Sale</span>
                    {formData.type === "sale" && (
                      <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-indigo-500" />
                    )}
                  </label>
                  <label
                    className={`relative flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                      formData.type === "rent"
                        ? "border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-sm"
                        : "border-gray-200 bg-gray-50/50 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      id="rent"
                      onChange={handleChange}
                      checked={formData.type === "rent"}
                      className="sr-only"
                    />
                    <Home className="w-5 h-5" />
                    <span className="font-semibold">For Rent</span>
                    {formData.type === "rent" && (
                      <CheckCircle2 className="absolute top-2 right-2 w-4 h-4 text-indigo-500" />
                    )}
                  </label>
                </div>

                {/* Feature Toggles */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      id: "parking",
                      label: "Parking",
                      icon: Car,
                      checked: formData.parking,
                    },
                    {
                      id: "furnished",
                      label: "Furnished",
                      icon: Sofa,
                      checked: formData.furnished,
                    },
                    {
                      id: "offer",
                      label: "Offer",
                      icon: Tag,
                      checked: formData.offer,
                    },
                  ].map(({ id, label, icon: Icon, checked }) => (
                    <label
                      key={id}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                        checked
                          ? "border-emerald-400 bg-emerald-50/50 text-emerald-700"
                          : "border-gray-200 bg-gray-50/50 text-gray-500 hover:border-gray-300"
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={id}
                        onChange={handleChange}
                        checked={checked}
                        className="sr-only"
                      />
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-semibold">{label}</span>
                    </label>
                  ))}
                </div>
              </motion.div>

              {/* Room & Price Details */}
              <motion.div
                custom={2}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                    <Settings2 className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Rooms & Pricing
                    </h2>
                    <p className="text-sm text-gray-500">
                      Set room count and pricing details
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <BedDouble className="w-4 h-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700">
                        Bedrooms
                      </label>
                    </div>
                    <input
                      type="number"
                      id="bedrooms"
                      min="1"
                      max="10"
                      required
                      onChange={handleChange}
                      value={formData.bedrooms}
                      className="w-full px-3 py-2.5 text-center text-lg font-semibold rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                    />
                  </div>
                  <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Bath className="w-4 h-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700">
                        Bathrooms
                      </label>
                    </div>
                    <input
                      type="number"
                      id="bathrooms"
                      min="1"
                      max="10"
                      required
                      onChange={handleChange}
                      value={formData.bathrooms}
                      className="w-full px-3 py-2.5 text-center text-lg font-semibold rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50/80 rounded-xl p-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                      <IndianRupee className="w-4 h-4 text-gray-500" />
                      <label className="text-sm font-medium text-gray-700">
                        Regular Price
                      </label>
                      <span className="text-xs text-gray-400 ml-auto">
                        ₹ / {formData.type === "rent" ? "month" : "total"}
                      </span>
                    </div>
                    <input
                      type="number"
                      id="regularPrice"
                      min="50"
                      max="10000000"
                      required
                      onChange={handleChange}
                      value={formData.regularPrice}
                      className="w-full px-4 py-2.5 text-lg font-semibold rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-white"
                    />
                  </div>

                  <AnimatePresence>
                    {formData.offer && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-200"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <Tag className="w-4 h-4 text-emerald-600" />
                          <label className="text-sm font-medium text-emerald-700">
                            Discounted Price
                          </label>
                          <span className="text-xs text-emerald-500 ml-auto">
                            ₹ / {formData.type === "rent" ? "month" : "total"}
                          </span>
                        </div>
                        <input
                          type="number"
                          id="discountPrice"
                          min="0"
                          max="10000000"
                          required
                          onChange={handleChange}
                          value={formData.discountPrice}
                          className="w-full px-4 py-2.5 text-lg font-semibold rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* ═══ Right Column: Images & Submit ═══ */}
            <div className="lg:col-span-2 space-y-6">
              {/* Image Upload Section */}
              <motion.div
                custom={1}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                    <ImagePlus className="w-5 h-5 text-rose-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Property Photos
                    </h2>
                    <p className="text-sm text-gray-500">
                      Upload up to 6 images (auto-compressed)
                    </p>
                  </div>
                </div>

                {/* Drag & Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 ${
                    dragOver
                      ? "border-indigo-400 bg-indigo-50/50 scale-[1.02]"
                      : "border-gray-200 bg-gray-50/30 hover:border-indigo-300 hover:bg-indigo-50/20"
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    onChange={(e) => setFiles(e.target.files)}
                    className="hidden"
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                  />
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                        dragOver ? "bg-indigo-100" : "bg-gray-100"
                      }`}
                    >
                      <CloudUpload
                        className={`w-7 h-7 ${
                          dragOver ? "text-indigo-500" : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">
                        {dragOver
                          ? "Drop images here"
                          : "Drag & drop or click to browse"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG, WEBP • Images auto-compressed
                      </p>
                    </div>
                  </div>
                  {files.length > 0 && (
                    <p className="mt-3 text-sm font-medium text-indigo-600">
                      {files.length} file{files.length > 1 ? "s" : ""} selected
                    </p>
                  )}
                </div>

                {/* Upload Button */}
                <button
                  type="button"
                  onClick={handleImageSubmit}
                  disabled={uploading || files.length === 0}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Compressing & Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Upload Images
                    </>
                  )}
                </button>

                {/* Upload Progress Bars */}
                <AnimatePresence>
                  {uploading && Object.keys(uploadProgress).length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-2"
                    >
                      {Object.entries(uploadProgress).map(
                        ([index, progress]) => (
                          <div key={index} className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>Image {parseInt(index) + 1}</span>
                              <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
                                transition={{ duration: 0.3 }}
                              />
                            </div>
                          </div>
                        )
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Error message */}
                <AnimatePresence>
                  {imageUploadError && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-3 flex items-center gap-2 text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg"
                    >
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      {imageUploadError}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Image Previews — Grid */}
                <AnimatePresence>
                  {formData.imageUrls.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-6"
                    >
                      <p className="text-xs font-medium text-gray-500 mb-3 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        {formData.imageUrls.length} image
                        {formData.imageUrls.length > 1 ? "s" : ""} uploaded
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {formData.imageUrls.map((url, index) => (
                          <motion.div
                            key={url}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="relative group aspect-square rounded-xl overflow-hidden border border-gray-100"
                          >
                            <img
                              src={url}
                              alt={`Property ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                            {index === 0 && (
                              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-indigo-600 text-white text-[10px] font-bold rounded-md">
                                COVER
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center bg-black/60 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Publish Button */}
              <motion.div
                custom={3}
                variants={sectionVariants}
                initial="hidden"
                animate="visible"
                className="sticky bottom-6"
              >
                <button
                  disabled={loading || uploading}
                  className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold rounded-2xl px-6 py-4 hover:from-slate-800 hover:to-slate-700 focus:ring-4 focus:ring-slate-900/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed text-lg shadow-lg shadow-slate-900/10 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Publishing Property...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Publish Listing
                    </>
                  )}
                </button>
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-500 text-sm mt-3 text-center flex items-center justify-center gap-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </form>
      </motion.main>
    </div>
  );
}
