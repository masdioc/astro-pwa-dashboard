import React, { useEffect, useState } from "react";
import AudioPlayer from "./AudioPlayer";

const AudioWrapper = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("../data/list_surah_audio_juza30.json")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Gagal load JSON", err));
  }, []);

  return (
    <div>
      {data.length > 0 ? (
        <AudioPlayer audioList={data} />
      ) : (
        <p className="text-center mt-10">Memuat data audio...</p>
      )}
    </div>
  );
};

export default AudioWrapper;
