import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserStart,
  updateUserFailure,
  updateUserStart,
  updateuserSuccess,
} from "../redux/user/userSlice";
import { Link } from "react-router-dom";

export default function Profile() {
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  // console.log('ican', formData);

  const [successMessage, setSuccessMessage] = useState("");

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setFilePerc(progress);
      },
      () => {
        setFileUploadError(true);
        setSuccessMessage("");
        setTimeout(() => {
          setFileUploadError(false);
        }, 5000);
      },
      () => {
        // Upload completed successfully, handle any additional logic here
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
          setFileUploadError(false);
          setSuccessMessage("Image successfully uploaded!");
          setTimeout(() => {
            setSuccessMessage("");
          }, 5000);
        });
      }
    );
  };

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateuserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  // Handle Delete User
  // const handleDeleteUser = async () => {
  //   try {
  //     dispatch(deleteUserStart());
  //     const res = await fetch(`/api/user/delete/${currentUser._id}`, {
  //       method: "DELETE",
  //     });

  //     const data = await res.json();
  //     if (data.success === false) {
  //       dispatch(deleteUserFailure(data.message));
  //       return;
  //     }

  //     dispatch(deleteUserSuccess(data));
  //   } catch (error) {
  //     dispatch(deleteUserFailure(error.message));
  //   }
  // };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }

      dispatch(deleteUserSuccess(data));
      setSuccessMessage("User has been deleted successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };


  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      // Handle success or error response as needed
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      // Handle fetch error
      dispatch(deleteUserFailure(error.message));
    }
  };

  // HANDLE SHOW LISTINGS

  const handleShowListings = async () => {
    try {
      setShowListingsError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowListingsError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingsError(true);
    }
  };

  // HANDLE DELETE LISTING

  // const handleListingDelete = async (listingId) => {
  //   try {
  //     const res = await fetch(`/api/listing/delete/${listingId}`, {
  //       method: "DELETE",
  //     });
  //     const data = await res.json();
  //     if (data.success === false) {
  //       console.log(data.message);
  //       return;
  //     }

  //     setUserListings((prev) =>
  //       prev.filter((listing) => listing._id !== listingId)
  //     );
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
      setSuccessMessage("Listing deleted successfully!");
      setTimeout(() => {
        setSuccessMessage("");
      }, 5000);
    } catch (error) {
      console.log(error.message);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto space-y-8"
      >
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Your Profile</h1>
          <p className="mt-2 text-sm text-gray-600">Manage your account settings and listings</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col items-center">
                <div className="relative group cursor-pointer">
                  <input
                    onChange={(e) => setFile(e.target.files[0])}
                    type="file"
                    ref={fileRef}
                    hidden
                    accept="image/*"
                  />
                  <img
                    onClick={() => fileRef.current.click()}
                    src={formData.avatar || currentUser.avatar}
                    alt="profile"
                    className="rounded-full h-32 w-32 object-cover border-4 border-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                  />
                  <div
                    onClick={() => fileRef.current.click()}
                    className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <span className="text-white text-sm font-medium">Change</span>
                  </div>
                </div>

                <p className="text-sm mt-4 font-medium h-5">
                  {fileUploadError ? (
                    <span className="text-red-500">Image upload failed (must be less than 2MB)</span>
                  ) : filePerc > 0 && filePerc < 100 ? (
                    <span className="text-emerald-600">Uploading: {filePerc}%</span>
                  ) : filePerc === 100 ? (
                    <span className="text-emerald-600">{successMessage}</span>
                  ) : (
                    <span className="text-transparent">Placeholder</span>
                  )}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <input
                    type="text"
                    id="username"
                    defaultValue={currentUser.username}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    defaultValue={currentUser.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-gray-50/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Leave blank to keep current"
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-gray-50/50"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <button
                  disabled={loading}
                  className="w-full bg-slate-900 text-white font-medium rounded-xl px-4 py-3.5 hover:bg-slate-800 focus:ring-4 focus:ring-slate-900/10 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </button>

                <Link
                  to="/create-listing"
                  className="w-full bg-emerald-600 text-white font-medium rounded-xl px-4 py-3.5 text-center hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-600/20 transition-all"
                >
                  Create New Listing
                </Link>
              </div>
            </form>
          </div>

          <div className="px-8 py-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={handleDeleteUser}
              className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              Delete Account
            </button>
            <button
              onClick={handleSignOut}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="text-center font-medium">
          {error && <p className="text-red-500">{error}</p>}
          {updateSuccess && <p className="text-emerald-600">Profile updated successfully!</p>}
          {showListingsError && <p className="text-red-500">Error fetching listings.</p>}
        </div>

        {/* Show Listings Toggle */}
        <div className="text-center">
          <button
            onClick={handleShowListings}
            className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors inline-flex items-center gap-2"
          >
            Manage Your Listings
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Listings Section */}
        {userListings && userListings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-4 pt-4"
          >
            {userListings.map((listing) => (
              <motion.div
                key={listing._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <Link to={`/listing/${listing._id}`} className="shrink-0">
                  <img
                    src={listing.imageUrls[0]}
                    alt="Listing cover"
                    className="h-20 w-24 object-cover rounded-lg"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to={`/listing/${listing._id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 truncate hover:text-indigo-600 transition-colors">
                      {listing.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-500 truncate mt-1">
                    Listed property
                  </p>
                </div>
                <div className="flex flex-col gap-2 shrink-0">
                  <Link
                    to={`/update-listing/${listing._id}`}
                    className="px-3 py-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors text-center"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleListingDelete(listing._id)}
                    className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
