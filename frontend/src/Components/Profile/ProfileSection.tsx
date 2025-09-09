import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import { Failure, Success } from "../Toast";

// ✅ Define the context type
type OutletContextType = {
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
  info: {
    name: string;
    email: string;
    phoneNumber: string;
    profilePhoto: string;
  } | null;
};

const ProfileSection = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    photo: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const { setImage, info } = useOutletContext<OutletContextType>();

  // Load from parent context (info)
  useEffect(() => {
    if (info) {
      setProfile({
        firstName: info.name?.split(" ")[0] || "",
        lastName: info.name?.split(" ")[1] || "",
        email: info.email || "",
        phoneNumber: info.phoneNumber || "",
        photo: info.profilePhoto || "",
      });
    }
  }, [info]);

  // Handle photo preview + state update
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, photo: reader.result as string }));
        setImage(reader.result as string); // update global context
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Save profile API call
  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage("");

      // Prepare payload
      const payload = {
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        profilePhoto: profile.photo, // base64 string
      };

      // Replace with your API endpoint
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/user/updateProfile/${(info as any)?._id}`;
      const res = await axios.patch(url, payload, {withCredentials:true});
      // console.log(res);
      const data = res.data;
      if ((data as any).success) {
        Success("Profile updated successfully ✅");
        // console.log("Updated profile:", data);
      } else {
        Failure((data as any).message || "Failed to update profile ❌");
      }
    } catch (err) {
      console.error(err);
      Failure("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex-1 bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-1">Profile Information</h1>
      <p className="text-gray-500 mb-6">
        Manage your personal information and preferences.
      </p>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Personal Details</h2>

        {/* Profile photo */}
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full relative overflow-hidden">
            {profile.photo ? (
              <img
                src={profile.photo}
                alt="Profile"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                No Photo
              </div>
            )}
            <label
              htmlFor="photo"
              className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer"
            >
              <FaEdit />
              <input
                id="photo"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </label>
          </div>
          <button
            className="border px-4 py-2 rounded-md text-sm"
            onClick={() => document.getElementById("photo")?.click()}
          >
            Change Photo
          </button>
        </div>

        {/* Input fields */}
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, firstName: e.target.value }))
              }
              className="w-full border rounded-md px-4 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Last Name</label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, lastName: e.target.value }))
              }
              className="w-full border rounded-md px-4 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full border rounded-md px-4 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="tel"
              value={profile.phoneNumber}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, phoneNumber: e.target.value }))
              }
              className="w-full border rounded-md px-4 py-2 mt-1"
            />
          </div>
        </form>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="mt-6 bg-black text-white px-6 py-2 rounded-md disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        {/* Status message */}
        {message && (
          <p className="mt-4 text-sm text-center text-gray-600">{message}</p>
        )}
      </div>
    </section>
  );
};

export default ProfileSection;
