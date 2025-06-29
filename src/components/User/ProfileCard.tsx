import { useEffect, useRef, useState } from "react";
import { API_URL } from "astro:env/client";

export default function ProfileCard() {
  const [user, setUser] = useState<any>({});
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>({});
  const [photoUrl, setPhotoUrl] = useState("https://via.placeholder.com/120");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [provinsiList, setProvinsiList] = useState([]);
  const [kabupatenList, setKabupatenList] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [desaList, setDesaList] = useState([]);

  useEffect(() => {
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(localUser);
    setForm(localUser);
    if (localUser.photo) {
      setPhotoUrl(localUser.photo);
    }
    // console.log(localUser);
  }, []);

  useEffect(() => {
    if (!editMode) return;
    fetch(`${API_URL}/api/wilayahs/provinces`)
      .then((res) => res.json())
      .then(setProvinsiList);
  }, [editMode]);

  useEffect(() => {
    if (!form.provinsi_id) return;
    fetch(`${API_URL}/api/wilayahs/provinces/${form.provinsi_id}/regencies`)
      .then((res) => res.json())
      .then(setKabupatenList);
  }, [form.provinsi_id]);

  useEffect(() => {
    if (!form.kabupaten_id) return;
    fetch(`${API_URL}/api/wilayahs/regencies/${form.kabupaten_id}/districts`)
      .then((res) => res.json())
      .then(setKecamatanList);
  }, [form.kabupaten_id]);

  useEffect(() => {
    if (!form.kecamatan_id) return;
    fetch(`${API_URL}/api/wilayahs/districts/${form.kecamatan_id}/villages`)
      .then((res) => res.json())
      .then(setDesaList);
  }, [form.kecamatan_id]);

  const handleUpload = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return alert("File harus berupa gambar");
    if (file.size > 2 * 1024 * 1024) return alert("Ukuran maksimal 2MB");

    const preview = URL.createObjectURL(file);
    setPhotoUrl(preview);

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
        const updatedUser = { ...user, photo: result.photo };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setPhotoUrl(result.photo);
      }
    } catch (err) {
      alert("Upload gagal, coba lagi");
      console.error(err);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    const body = {
      ...form,
      province_id: form.provinsi_id,
      regence_id: form.kabupaten_id,
      district_id: form.kecamatan_id,
      village_id: form.desa_id,
    };

    try {
      // 1. Kirim update ke server
      const res = await fetch(
        `${API_URL}/api/users/update-profile/${user.id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (!res.ok) throw new Error("Gagal simpan");

      // 2. Ambil ulang user terbaru setelah update
      const getUser = await fetch(`${API_URL}/api/users/${user.id}`);
      const updatedUser = await getUser.json();

      // 3. Simpan ke localStorage dan state
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setForm(updatedUser);
      setEditMode(false);
      alert("Profil berhasil diperbarui");
    } catch (err) {
      alert("Gagal menyimpan profil");
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
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          onChange={handleUpload}
        />
      </label>

      <div className="text-left text-sm sm:text-base space-y-2">
        {["name", "email", "username"].map((field) => (
          <p key={field}>
            <strong>{capitalize(field)}:</strong>{" "}
            {editMode ? (
              <input
                type="text"
                name={field}
                value={form[field] || ""}
                onChange={handleChange}
                className="ml-2 p-1 border rounded w-2/3"
              />
            ) : (
              user[field] || "-"
            )}
          </p>
        ))}

        {editMode ? (
          <>
            <p>
              <strong>Provinsi:</strong>
              <select
                name="provinsi_id"
                value={form.provinsi_id || ""}
                onChange={handleChange}
                className="ml-2 border rounded p-1"
              >
                <option value="">Pilih Provinsi</option>
                {provinsiList.map((item: any) => (
                  <option key={item.code} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </select>
            </p>
            <p>
              <strong>Kabupaten:</strong>
              <select
                name="kabupaten_id"
                value={form.kabupaten_id || ""}
                onChange={handleChange}
                className="ml-2 border rounded p-1"
              >
                <option value="">Pilih Kabupaten</option>
                {kabupatenList.map((item: any) => (
                  <option key={item.code} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </select>
            </p>
            <p>
              <strong>Kecamatan:</strong>
              <select
                name="kecamatan_id"
                value={form.kecamatan_id || ""}
                onChange={handleChange}
                className="ml-2 border rounded p-1"
              >
                <option value="">Pilih Kecamatan</option>
                {kecamatanList.map((item: any) => (
                  <option key={item.code} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </select>
            </p>
            <p>
              <strong>Desa:</strong>
              <select
                name="desa_id"
                value={form.desa_id || ""}
                onChange={handleChange}
                className="ml-2 border rounded p-1"
              >
                <option value="">Pilih Desa</option>
                {desaList.map((item: any) => (
                  <option key={item.code} value={item.code}>
                    {item.name}
                  </option>
                ))}
              </select>
            </p>
          </>
        ) : (
          <>
            <p>
              <strong>Provinsi:</strong> {user.provinsi_nama || "-"}
            </p>
            <p>
              <strong>Kabupaten:</strong> {user.kabupaten_nama || "-"}
            </p>
            <p>
              <strong>Kecamatan:</strong> {user.kecamatan_nama || "-"}
            </p>
            <p>
              <strong>Desa:</strong> {user.desa_nama || "-"}
            </p>
          </>
        )}
      </div>

      <div className="mt-4">
        {editMode ? (
          <>
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
            >
              Simpan
            </button>
            <button
              onClick={() => {
                setForm(user);
                setEditMode(false);
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Batal
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Edit Profil
          </button>
        )}
      </div>
    </div>
  );
}
