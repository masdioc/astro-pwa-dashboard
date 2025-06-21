import { useEffect, useRef, useState } from "react";

type Question = {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
};

export default function Quiz() {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedCount, setSelectedCount] = useState<number | null>(null);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [posted, setPosted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);


  useEffect(() => {
    fetch("/data/soal_jawaban_inggis_pembahasan.json")
      .then((res) => res.json())
      .then((data: Question[]) => {
        setAllQuestions(data);
      });
  }, []);

  useEffect(() => {
    if (startTime && !showResult) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
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
  };

  const handleAnswer = (index: number) => {
    if (selected !== null || !questions.length) return;
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

  const handleSkip = () => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[current] = null;
      return updated;
    });
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

  const handleFinish = () => {
    setShowResult(true);
  };

  const handleJump = (index: number) => {
    setCurrent(index);
    setSelected(answers[index]);
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
          console.log("Skor berhasil dikirim:", data);
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

  const q = questions[current];

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 max-w-5xl mx-auto">
      {/* Sidebar navigasi soal */} 
<div className="md:w-1/5 w-full grid grid-cols-5 gap-x-1 gap-y-0 p-0">
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



      {/* Area soal utama */}
      <div className="bg-white p-6 rounded shadow-md w-full md:w-4/5">
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

        {selected !== null && (
          <div className="mt-4 p-4 bg-yellow-100 border-l-4 border-yellow-500 text-gray-800 rounded">
            <strong>Pembahasan:</strong> {q.explanation}
          </div>
        )}

        {/* Navigasi bawah */}
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
            <button
              onClick={handleFinish}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Selesai
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
