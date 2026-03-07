import { useState } from "react";
import { motion } from "framer-motion";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate()
  const [files, setFiles] = useState([]);
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

  // console.log('f-data',formData);

  const handleImageSubmit = (e) => {
    e.preventDefault();
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError("Image upload failed (2 mb max per image)");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can upload up to 6 images per listing");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done!`);
        },

        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((getDownloadURL) => {
            resolve(getDownloadURL);
          });
        }
      );
    });
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

  console.log("fdata", formData);

  const handleFormSumbit = async (e) => {
    e.preventDefault();

    try {
      if (formData.imageUrls.length < 1) {
        return setError("You must at least upload one image");
      }

      if (+formData.regularPrice < +formData.discountPrice) {
        return setError("Discount price must be lower thand regular price!");
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
      navigate(`/listing/${data._id}`)
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Create a Listing</h1>
          <p className="mt-2 text-sm text-gray-600">Fill out the details below to list your property</p>
        </div>

        <form onSubmit={handleFormSumbit} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 flex flex-col md:flex-row gap-10">
            {/* Left Column: Details */}
            <div className="flex-1 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Name</label>
                  <input
                    type="text"
                    id="name"
                    maxLength={62}
                    minLength={10}
                    required
                    onChange={handleChange}
                    value={formData.name}
                    placeholder="Enter property name"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <input
                    type="text"
                    id="address"
                    maxLength={62}
                    minLength={10}
                    required
                    onChange={handleChange}
                    value={formData.address}
                    placeholder="Enter full address"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    id="description"
                    required
                    onChange={handleChange}
                    value={formData.description}
                    placeholder="Describe the property"
                    className="w-full px-4 py-3 min-h-[120px] rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-gray-50/50 resize-y"
                  />
                </div>
              </div>

              {/* Checkboxes */}
              <div className="bg-gray-50/50 rounded-xl p-5 border border-gray-100 space-y-4">
                <h3 className="text-sm font-medium text-gray-900 border-b border-gray-200 pb-2">Property Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" id="sale" onChange={handleChange} checked={formData.type === "sale"} className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">For Sale</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" id="rent" onChange={handleChange} checked={formData.type === "rent"} className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">For Rent</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" id="parking" onChange={handleChange} checked={formData.parking} className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Parking Spot</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" id="furnished" onChange={handleChange} checked={formData.furnished} className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Furnished</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group col-span-2">
                    <input type="checkbox" id="offer" onChange={handleChange} checked={formData.offer} className="w-5 h-5 rounded border-gray-300 text-emerald-500 focus:ring-emerald-500" />
                    <span className="text-gray-700 group-hover:text-gray-900 transition-colors">Active Offer / Discount</span>
                  </label>
                </div>
              </div>

              {/* Numbers */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <input type="number" id="bedrooms" min="1" max="10" required onChange={handleChange} value={formData.bedrooms} className="w-20 px-3 py-2 text-center rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  <span className="text-gray-700 font-medium">Bedrooms</span>
                </div>
                <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100">
                  <input type="number" id="bathrooms" min="1" max="10" required onChange={handleChange} value={formData.bathrooms} className="w-20 px-3 py-2 text-center rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  <span className="text-gray-700 font-medium">Bathrooms</span>
                </div>

                <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-xl border border-gray-100 col-span-2">
                  <input type="number" id="regularPrice" min="50" max="10000000" required onChange={handleChange} value={formData.regularPrice} className="w-32 px-3 py-2 text-center rounded-lg border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-medium">Regular Price</span>
                    <span className="text-xs text-gray-500">(₹ / {formData.type === 'rent' ? 'month' : 'total'})</span>
                  </div>
                </div>

                {formData.offer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="flex items-center gap-4 bg-emerald-50/30 p-3 rounded-xl border border-emerald-100 col-span-2"
                  >
                    <input type="number" id="discountPrice" min="0" max="10000000" required onChange={handleChange} value={formData.discountPrice} className="w-32 px-3 py-2 text-center rounded-lg border border-emerald-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                    <div className="flex flex-col">
                      <span className="text-emerald-700 font-medium">Discounted Price</span>
                      <span className="text-xs text-emerald-600">(₹ / {formData.type === 'rent' ? 'month' : 'total'})</span>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Right Column: Images & Submit */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="bg-gray-50/50 rounded-xl p-6 border border-gray-100">
                <div className="mb-4 text-center">
                  <h3 className="font-semibold text-gray-900">Property Images</h3>
                  <p className="text-xs text-gray-500 mt-1">Upload up to 6 high-quality image files. The first one selected will be your cover photo.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    onChange={(e) => setFiles(e.target.files)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all border border-gray-200 rounded-xl bg-white"
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                  />
                  <button
                    type="button"
                    onClick={handleImageSubmit}
                    disabled={uploading}
                    className="shrink-0 px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-600/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
                <p className="text-sm text-red-500 mt-2 text-center h-5">{imageUploadError}</p>

                {/* Image Previews */}
                {formData.imageUrls.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 space-y-3"
                  >
                    {formData.imageUrls.map((url, index) => (
                      <div key={url} className="flex items-center justify-between p-2 bg-white border border-gray-100 rounded-xl shadow-sm group">
                        <img src={url} alt="Listing preview" className="w-16 h-16 object-cover rounded-lg border border-gray-100" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-100"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              <div className="mt-auto">
                <button
                  disabled={loading || uploading}
                  className="w-full bg-slate-900 text-white font-medium rounded-xl px-4 py-4 uppercase tracking-wide hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/10 transition-all disabled:opacity-70 disabled:cursor-not-allowed text-lg shadow-md"
                >
                  {loading ? "Publishing Property..." : "Publish Listing"}
                </button>
                {error && <p className="text-red-500 text-sm mt-3 text-center">{error}</p>}
              </div>

            </div>
          </div>
        </form>
      </motion.main>
    </div>
  );
}
