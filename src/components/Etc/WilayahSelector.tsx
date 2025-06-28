import React, { useEffect, useState } from "react";
import { API_URL } from "astro:env/client";

interface Item {
  code: string;
  name: string;
}

interface WilayahSelectorProps {
  onChange: (data: {
    province_id: string;
    regence_id: string;
    district_id: string;
    village_id: string;
  }) => void;
}

export default function WilayahSelector({ onChange }: WilayahSelectorProps) {
  const [provinces, setProvinces] = useState<Item[]>([]);
  const [regencies, setRegencies] = useState<Item[]>([]);
  const [districts, setDistricts] = useState<Item[]>([]);
  const [villages, setVillages] = useState<Item[]>([]);

  const [provinceId, setProvinceId] = useState("");
  const [regenceId, setRegenceId] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [villageId, setVillageId] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/api/wilayahs/provinces`)
      .then((res) => res.json())
      .then(setProvinces);
  }, []);

  useEffect(() => {
    if (provinceId) {
      fetch(`${API_URL}/api/wilayahs/provinces/${provinceId}/regencies`)
        .then((res) => res.json())
        .then((data) => {
          setRegencies(data);
          setDistricts([]);
          setVillages([]);
          setRegenceId("");
          setDistrictId("");
          setVillageId("");
        });
    }
  }, [provinceId]);

  useEffect(() => {
    if (regenceId) {
      fetch(`${API_URL}/api/wilayahs/regencies/${regenceId}/districts`)
        .then((res) => res.json())
        .then((data) => {
          setDistricts(data);
          setVillages([]);
          setDistrictId("");
          setVillageId("");
        });
    }
  }, [regenceId]);

  useEffect(() => {
    if (districtId) {
      fetch(`${API_URL}/api/wilayahs/districts/${districtId}/villages`)
        .then((res) => res.json())
        .then((data) => {
          setVillages(data);
          setVillageId("");
        });
    }
  }, [districtId]);

  useEffect(() => {
    onChange({
      province_id: provinceId,
      regence_id: regenceId,
      district_id: districtId,
      village_id: villageId,
    });
  }, [provinceId, regenceId, districtId, villageId]);

  return (
    <div className="space-y-2">
      <select
        className="w-full border p-2 rounded"
        value={provinceId}
        onChange={(e) => setProvinceId(e.target.value)}
      >
        <option value="">-- Pilih Provinsi --</option>
        {provinces.map((p) => (
          <option key={p.code} value={p.code}>
            {p.name}
          </option>
        ))}
      </select>

      <select
        className="w-full border p-2 rounded"
        value={regenceId}
        onChange={(e) => setRegenceId(e.target.value)}
        disabled={!regencies.length}
      >
        <option value="">-- Pilih Kabupaten/Kota --</option>
        {regencies.map((r) => (
          <option key={r.code} value={r.code}>
            {r.name}
          </option>
        ))}
      </select>

      <select
        className="w-full border p-2 rounded"
        value={districtId}
        onChange={(e) => setDistrictId(e.target.value)}
        disabled={!districts.length}
      >
        <option value="">-- Pilih Kecamatan --</option>
        {districts.map((d) => (
          <option key={d.code} value={d.code}>
            {d.name}
          </option>
        ))}
      </select>

      <select
        className="w-full border p-2 rounded"
        value={villageId}
        onChange={(e) => setVillageId(e.target.value)}
        disabled={!villages.length}
      >
        <option value="">-- Pilih Desa/Kelurahan --</option>
        {villages.map((v) => (
          <option key={v.code} value={v.code}>
            {v.name}
          </option>
        ))}
      </select>
    </div>
  );
}
