import { useEffect, useState } from "react";

const SettingsSection = () => {
  const [settings, setSettings] = useState({
    enableNotifications: true,
    subscribeNewsletter: false,
    darkMode: false,
    language: "English",
    currency: "INR",
  });

  useEffect(() => {
    const saved = localStorage.getItem("user-settings");
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("user-settings", JSON.stringify(settings));
    alert("Settings saved successfully!");
  };

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: typeof prev[key] === "boolean" ? !prev[key] : prev[key],
    }));
  };

  const handleChange = (key: keyof typeof settings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <section className="flex-1 bg-white rounded-lg shadow p-6">
      <h1 className="text-2xl font-bold mb-1">Settings</h1>
      <p className="text-gray-600 mb-6">
        Customize your account preferences and settings for a better shopping experience.
      </p>

      <div className="border-t pt-6 space-y-6">

        <div>
          <h2 className="text-lg font-semibold mb-2">Notifications</h2>
          <div className="flex items-center gap-4 mb-2">
            <label className="text-sm">Enable Notifications:</label>
            <input
              type="checkbox"
              checked={settings.enableNotifications}
              onChange={() => handleToggle("enableNotifications")}
            />
          </div>
          <div className="flex gap-2 text-sm">
            <button
              onClick={() => handleChange("enableNotifications", true)}
              className="border px-3 py-1 rounded"
            >
              Enable
            </button>
            <button
              onClick={() => handleChange("enableNotifications", false)}
              className="border px-3 py-1 rounded"
            >
              Disable
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Newsletter</h2>
          <div className="flex items-center gap-4 mb-2">
            <label className="text-sm">Subscribe to Newsletter:</label>
            <input
              type="checkbox"
              checked={settings.subscribeNewsletter}
              onChange={() => handleToggle("subscribeNewsletter")}
            />
          </div>
          <div className="flex gap-2 text-sm">
            <button
              onClick={() => handleChange("subscribeNewsletter", true)}
              className="border px-3 py-1 rounded"
            >
              Enable
            </button>
            <button
              onClick={() => handleChange("subscribeNewsletter", false)}
              className="border px-3 py-1 rounded"
            >
              Disable
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Appearance</h2>
          <div className="flex items-center gap-4 mb-2">
            <label className="text-sm">Dark Mode:</label>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={() => handleToggle("darkMode")}
            />
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Language</h2>
          <select
            value={settings.language}
            onChange={(e) => handleChange("language", e.target.value)}
            className="border px-2 py-1 rounded w-full md:w-1/2"
          >
            <option value="English">English</option>
            <option value="Hindi">Hindi</option>
            <option value="Spanish">Spanish</option>
          </select>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Currency</h2>
          <select
            value={settings.currency}
            onChange={(e) => handleChange("currency", e.target.value)}
            className="border px-2 py-1 rounded w-full md:w-1/2"
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>

        <button
          onClick={handleSave}
          className="mt-4 bg-black text-white px-5 py-2 rounded"
        >
          Save Settings
        </button>
      </div>
    </section>
  );
};

export default SettingsSection;
