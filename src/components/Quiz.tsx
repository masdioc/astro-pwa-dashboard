import { useEffect, useState } from "react";

type Question = {
  question: string;
  options: string[];
  answer: number;
};

const questions: Question[] = [
  {
    question: "Apa ibu kota Indonesia?",
    options: ["Bandung", "Surabaya", "Jakarta", "Medan"],
    answer: 2,
  },
  {
    question: "Berapakah hasil dari 2 + 2?",
    options: ["3", "4", "5", "6"],
    answer: 1,
  },
];

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);
  const [posted, setPosted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!startTime) setStartTime(new Date());
    const timer = setInterval(() => {
      if (startTime) {
        setElapsedTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  const handleAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);

    const correct = index === questions[current].answer;
    if (correct) setScore((prev) => prev + 1);

    setAnswers((prev) => {
      const updated = [...prev];
      updated[current] = index;
      return updated;
    });
  };

  const handleNext = () => {
    setSelected(null);
    setCurrent((prev) => prev + 1);
  };

  const handleBack = () => {
    const prevIndex = current - 1;
    const prevSelected = answers[prevIndex];

    if (prevSelected !== null && prevSelected === questions[prevIndex].answer) {
      setScore((prev) => prev - 1);
    }

    setCurrent(prevIndex);
    setSelected(null);
  };

  useEffect(() => {
    setSelected(answers[current]);
  }, [current]);

  useEffect(() => {
    if (showResult && !posted) {
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
          console.log("Skor berhasil dikirim:", data);
          setPosted(true);
        });
    }
  }, [showResult, posted, score, elapsedTime]);

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
            setAnswers(Array(questions.length).fill(null));
            setShowResult(false);
            setPosted(false);
            setStartTime(new Date());
            setElapsedTime(0);
          }}
          className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Ulangi Quiz
        </button>
      </div>
    );
  }

  const q = questions[current];

  return (
    <div className="bg-white p-6 rounded shadow-md w-full max-w-md mx-auto mt-10">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="text-sm text-gray-600 mb-1">
          Soal {current + 1} dari {questions.length}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all"
            style={{ width: `${(current / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Timer */}
      <div className="text-sm text-gray-500 mb-4 text-right">
        Waktu: {elapsedTime} detik
      </div>

      <h2 className="text-xl font-semibold mb-4">{q.question}</h2>
      <ul className="space-y-2">
        {q.options.map((opt, idx) => (
          <li
            key={idx}
            className={`p-3 rounded cursor-pointer border transition ${
              selected !== null
                ? idx === q.answer
                  ? "bg-green-200 border-green-600"
                  : idx === selected
                  ? "bg-red-200 border-red-600"
                  : "bg-white border-gray-300"
                : "hover:bg-blue-100 border-gray-300"
            }`}
            onClick={() => handleAnswer(idx)}
          >
            {opt}
          </li>
        ))}
      </ul>

      {/* Navigasi */}
      <div className="mt-6 flex justify-between items-center">
        {current > 0 ? (
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            Kembali
          </button>
        ) : <div />}
        {selected !== null && (
          current + 1 < questions.length ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Berikutnya
            </button>
          ) : (
            <button
              onClick={() => setShowResult(true)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Lihat Hasil
            </button>
          )
        )}
      </div>
    </div>
  );
}
