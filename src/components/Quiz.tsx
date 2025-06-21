import { useEffect, useRef, useState } from "react";

type Question = {
  question: string;
  a: string;
  b: string;
  c: string;
  d: string;
  answer: string; // 'a', 'b', 'c', 'd'
  explanation: string;
};

export default function Quiz() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(string | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [posted, setPosted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
  fetch("http://localhost:3000/api/soals")
    .then((res) => res.json())
    .then((data) => {
      if (Array.isArray(data.soals)) {
        setAllQuestions(data.soals);
      } else {
        console.error("❌ Format JSON tidak sesuai: 'soals' bukan array.");
      }
    })
    .catch((err) => console.error("❌ Gagal memuat soal:", err));
}, []);
  useEffect(() => {
    if (startTime && !showResult) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, showResult]);

  const startQuiz = (count: number) => {
    const shuffled = [...allQuestions].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, count);
    setQuestions(selectedQuestions);
    setAnswers(Array(count).fill(null));
    setSelectedCount(count);
    setStartTime(new Date());
    setCurrent(0);
    setScore(0);
    setSelected(null);
  };

  const handleAnswer = (key: string) => {
    if (selected !== null || !questions.length) return;
    setSelected(key);
    const correct = key === questions[current].answer;
    if (correct) setScore((prev) => prev + 1);
    setAnswers((prev) => {
      const updated = [...prev];
      updated[current] = key;
      return updated;
    });
  };

  const handleNext = () => {
    if (current + 1 < questions.length) {
      setSelected(null);
      setCurrent((prev) => prev + 1);
    }
  };

  const handleSkip = () => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[current] = null;
      return updated;
    });
    handleNext();
  };

  const handleBack = () => {
    if (current > 0) {
      const prevIndex = current - 1;
      const prevSelected = answers[prevIndex];
      if (prevSelected && prevSelected === questions[prevIndex].answer) {
        setScore((prev) => prev - 1);
      }
      setCurrent(prevIndex);
      setSelected(null);
    }
  };

  const handleFinish = () => setShowResult(true);

  const handleJump = (index: number) => {
    if (index < questions.length) {
      setCurrent(index);
      setSelected(answers[index]);
    }
  };

  useEffect(() => {
    setSelected(answers[current]);
  }, [current]);

  useEffect(() => {
    if (showResult && !posted) {
      if (timerRef.current) clearInterval(timerRef.current);
      fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1,
          score,
          total: questions.length,
          duration: elapsedTime,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("Skor terkirim:", data);
          setPosted(true);
        });
    }
  }, [showResult, posted, score, elapsedTime, questions.length]);

  if (!selectedCount) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold mb-4">Pilih Jumlah Soal</h2>
        <div className="flex justify-center gap-4 flex-wrap">
          {[10, 20, 30, 50, 100].map((count) => (
            <button
              key={count}
              onClick={() => startQuiz(count)}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {count} Soal
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="bg-white p-8 rounded shadow-md text-center max-w-md mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4">Hasil Quiz</h2>
        <p className="text-lg mb-2">Skor Anda: {score} dari {questions.length}</p>
        <p className="text-sm text-gray-600">Waktu: {elapsedTime} detik</p>
        <button
          onClick={() => {
            setCurrent(0);
            setSelected(null);
            setScore(0);
            setAnswers([]);
            setShowResult(false);
            setPosted(false);
            setStartTime(null);
            setElapsedTime(0);
            setSelectedCount(null);
          }}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Ulangi
        </button>
      </div>
    );
  }

  // ⛔️ Cegah error jika q belum ada
  if (!questions[current]) {
    return (
      <div className="text-center p-10">
        <p className="text-lg text-gray-500">Sedang menyiapkan soal...</p>
      </div>
    );
  }

  const q = questions[current];
  const optionEntries = [
    ["a", q.a],
    ["b", q.b],
    ["c", q.c],
    ["d", q.d],
  ] as [string, string][];

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 max-w-5xl mx-auto">
      <div className="md:w-1/3 w-full">
        <div className="bg-white rounded-xl shadow p-4">
          <h2 className="text-sm font-semibold mb-4 text-gray-700">Nomor Soal</h2>
          <div className="grid grid-cols-5 gap-x-1 gap-y-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => handleJump(index)}
                className={`w-9 h-9 rounded-full text-xs font-bold ${
                  index === current
                    ? "bg-blue-500 text-white"
                    : answers[index] !== null
                    ? "bg-green-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow-md w-full md:w-4/5">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleFinish}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Selesai
          </button>
        </div>

        <div className="mb-4">
          <div className="text-sm text-gray-600 mb-1">
            Soal {current + 1} dari {questions.length}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all"
              style={{ width: `${((current + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="text-sm text-gray-500 mb-4 text-right">
          Waktu: {elapsedTime} detik
        </div>

        <div className="mb-4">
          <h3 className="text-base font-bold text-gray-700 mb-2">Pertanyaan:</h3>
          <h2 className="text-lg font-medium text-gray-900">{q.question}</h2>
        </div>

        <ul className="space-y-2">
          {optionEntries.map(([key, value]) => (
            <li
              key={key}
              className={`p-3 rounded cursor-pointer border transition flex items-start gap-2 ${
                selected !== null
                  ? key === q.answer
                    ? "bg-green-200 border-green-600"
                    : key === selected
                    ? "bg-red-200 border-red-600"
                    : "bg-white border-gray-300"
                  : "hover:bg-blue-100 border-gray-300"
              }`}
              onClick={() => handleAnswer(key)}
            >
              <span className="font-bold">{key.toUpperCase()}.</span>
              <span>{value}</span>
            </li>
          ))}
        </ul>

        {selected !== null && (
          <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-gray-800 rounded">
            <strong>Pembahasan:</strong> {q.explanation}
          </div>
        )}

        <div className="mt-6 flex justify-between items-center">
          {current > 0 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Kembali
            </button>
          ) : (
            <div />
          )}
          <div className="flex gap-2 flex-wrap justify-end">
            <button
              onClick={handleSkip}
              className="px-4 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500"
            >
              Lewati
            </button>
            {selected !== null && current + 1 < questions.length && (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Berikutnya
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
