import { useEffect, useRef, useState } from "react";
import { API_URL } from "astro:env/client";

export default function ProfileCard() {
  const [user, setUser] = useState<any>({});
  const [photoUrl, setPhotoUrl] = useState("https://via.placeholder.com/120");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user from localStorage
  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(localUser);
    if (localUser.photo) {
      setPhotoUrl(localUser.photo);
    }
  }, []);

  // Upload handler
  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];

    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar");
      return;
    }

    // Validasi ukuran file (max 2MB)
    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      alert("Ukuran file maksimal 2MB");
      return;
    }

    // ✅ Langsung tampilkan preview lokal
    const localPreview = URL.createObjectURL(file);
    setPhotoUrl(localPreview);

    const formData = new FormData();
    formData.append("photo", file);
    formData.append("user_id", user.id);

    try {
      const res = await fetch(`${API_URL}/api/update-photo`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload gagal");

      const result = await res.json();

      if (result.photo) {
        // Pakai URL dari server (jika berbeda dari preview)
        setPhotoUrl(result.photo);
        const updatedUser = { ...user, photo: result.photo };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (err) {
      alert("Upload gagal, silakan coba lagi");
      console.error(err);
    }
  };

  const capitalize = (text: string) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 w-full max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">
        Profil: {capitalize(user.role)}
      </h1>

      <div className="flex justify-center mb-4">
        <img
          src={photoUrl}
          alt="Foto Profil"
          className="w-28 h-28 rounded-full object-cover border-2 border-blue-500 shadow"
        />
      </div>

      <label className="block mb-4 text-sm font-medium text-gray-700 dark:text-gray-300">
        Ganti Foto:
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
          onChange={handleUpload}
        />
      </label>

      <div className="text-left text-sm sm:text-base space-y-2">
        <p>
          <strong>Nama:</strong> {user.name || "-"}
        </p>
        <p>
          <strong>Email:</strong> {user.email || "-"}
        </p>
        <p>
          <strong>Username:</strong> {user.username || "-"}
        </p>
      </div>
    </div>
  );
}
