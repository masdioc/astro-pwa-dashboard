// src/components/ProfileCard.tsx
import { useEffect, useRef, useState } from "react";
import { API_URL } from "astro:env/client";

export default function ProfileCard() {
  const [user, setUser] = useState<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string>(
    "https://via.placeholder.com/120"
  );

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(localUser);
    if (localUser.photo_base64) {
      setPhotoUrl(localUser.photo_base64);
    }
  }, []);

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

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
      if (result.photo_base64) {
        setPhotoUrl(result.photo_base64);
        const updatedUser = { ...user, photo_base64: result.photo_base64 };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
    } catch (err) {
      const error = err as Error;
      alert("Upload gagal: " + error.message);
    }
  };

  const capitalize = (text: string) =>
    text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 w-full max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Profil : {capitalize(user.role)}
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
          <strong>Nama:</strong> {user.name}
        </p>
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Username:</strong> {user.username}
        </p>
      </div>
    </div>
  );
}
