import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { useOutletContext } from "react-router-dom";

const ProfileSection = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    photo: "",
  });

const setImage = useOutletContext<React.Dispatch<React.SetStateAction<string | null>>>();


  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("user-profile");
    if (savedProfile) {
      setProfile(JSON.parse(savedProfile));
    } else {
      setProfile({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+91 (555) 123-4567",
        photo: "",
      });
      
    }
  }, []);

  // Image preview handler
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, photo: reader.result as string });
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem("user-profile", JSON.stringify(profile));
    alert("✅ Profile updated!");
  };

  return (
    <section className="flex-1 bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-1">Profile Information</h1>
      <p className="text-gray-500 mb-6">
        Manage your personal information and preferences.
      </p>

      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">Personal Details</h2>

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
            <label htmlFor="photo" className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow cursor-pointer">
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
          <button className="border px-4 py-2 rounded-md text-sm" onClick={() => document.getElementById("photo")?.click()}>
            Change Photo
          </button>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">First Name</label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) =>
                setProfile({ ...profile, firstName: e.target.value })
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
                setProfile({ ...profile, lastName: e.target.value })
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
                setProfile({ ...profile, email: e.target.value })
              }
              className="w-full border rounded-md px-4 py-2 mt-1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Phone</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              className="w-full border rounded-md px-4 py-2 mt-1"
            />
          </div>
        </form>

        <button
          onClick={handleSave}
          className="mt-6 bg-black text-white px-6 py-2 rounded-md"
        >
          Save Changes
        </button>
      </div>
    </section>
  );
};

export default ProfileSection;
