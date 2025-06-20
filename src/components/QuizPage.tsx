// components/QuizPage.tsx
import Layout from "../pages/layout.astro";
import Quiz from "./Quiz";

export default function QuizPage() {
  return (
    <Layout title="Quiz">
      <Quiz />
    </Layout>
  );
}
