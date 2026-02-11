import React from "react";
import { useNavigate } from "react-router-dom";

const brandColor = "rgb(16, 108, 80)";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 bg-white min-h-screen">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between">

        {/* Left Content */}
        <div className="md:w-1/2 space-y-6">

          <h1 
            className="text-4xl md:text-5xl font-bold leading-tight"
            style={{ color: brandColor }}
          >
            AI-Powered Skill Gap Assessment
          </h1>

          <p className="text-lg text-gray-600">
            Take adaptive quizzes to identify your skill gaps and 
            get personalized learning paths tailored to your goals.
          </p>

          <button
            onClick={() => navigate("/skillgap")}
            className="px-8 py-3 text-white font-semibold rounded-xl shadow-md transition hover:scale-105"
            style={{ backgroundColor: brandColor }}
          >
            Start Quiz
          </button>

        </div>

        {/* Right Side Illustration */}
        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">

          <div 
            className="w-80 h-80 rounded-3xl flex items-center justify-center text-white text-6xl font-bold shadow-lg"
            style={{ backgroundColor: brandColor }}
          >
            AI
          </div>

        </div>

      </section>

    </div>
  );
};

export default Home;
