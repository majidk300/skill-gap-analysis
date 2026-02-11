import React from "react";
import image01 from "../assets/img/image01.jpg";
import image02 from "../assets/img/image02.jpg";
import { useNavigate } from "react-router-dom";
import {
  ClipboardDocumentCheckIcon,
  ChartBarSquareIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const brandColor = "rgb(16, 108, 80)";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-24 bg-white min-h-screen overflow-hidden">

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between">

        {/* Left Content */}
        <div className="md:w-1/2 space-y-6">
          <h1
            className="text-4xl md:text-5xl font-bold leading-tight"
            style={{ color: brandColor }}
          >
            Build Strong Foundations. Upgrade Your Skills.
          </h1>

          <p className="text-lg text-gray-600">
            Our platform helps you identify your current skill level through
            quizzes and MCQs, analyze your gaps, and guide you step-by-step
            throughout your learning journey.
          </p>

          <button
            onClick={() => navigate("/skillgap")}
            className="
              px-8 py-3 text-white font-semibold rounded-xl
              transition-all duration-300 ease-out
              hover:scale-105 hover:shadow-xl
              bg-gradient-to-r from-emerald-700 to-emerald-600
              hover:from-emerald-600 hover:to-emerald-500
            "
          >
            Start Skill Assessment
          </button>
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 mt-12 md:mt-0 flex justify-center">
          <img
            src={image01}
            alt="Learning Illustration"
            className="
              w-115
              rounded-2xl
              transition-transform duration-500 ease-out
              hover:-translate-y-2 hover:scale-105
            "
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="text-3xl font-bold text-center mb-12"
            style={{ color: brandColor }}
          >
            How We Help You Learn Better
          </h2>

          <div className="grid md:grid-cols-3 gap-8">

            {/* Card 1 */}
            <div className="
              group bg-white p-6 rounded-2xl text-center
              transition-all duration-300
              hover:-translate-y-2 hover:shadow-xl
              hover:bg-gradient-to-br hover:from-emerald-50 hover:to-white
            ">
              <ClipboardDocumentCheckIcon
                className="
                  w-14 h-14 mx-auto mb-4
                  text-emerald-600
                  transition-transform duration-300
                  group-hover:scale-110
                "
              />
              <h3 className="text-xl font-semibold mb-2">
                Smart Quizzes & MCQs
              </h3>
              <p className="text-gray-600">
                Test yourself with topic-wise quizzes designed to strengthen
                fundamentals.
              </p>
            </div>

            {/* Card 2 */}
            <div className="
              group bg-white p-6 rounded-2xl text-center
              transition-all duration-300
              hover:-translate-y-2 hover:shadow-xl
              hover:bg-gradient-to-br hover:from-emerald-50 hover:to-white
            ">
              <ChartBarSquareIcon
                className="
                  w-14 h-14 mx-auto mb-4
                  text-emerald-600
                  transition-transform duration-300
                  group-hover:scale-110
                "
              />
              <h3 className="text-xl font-semibold mb-2">
                Skill Gap Analysis
              </h3>
              <p className="text-gray-600">
                Identify weak areas clearly and understand where you need
                improvement.
              </p>
            </div>

            {/* Card 3 */}
            <div className="
              group bg-white p-6 rounded-2xl text-center
              transition-all duration-300
              hover:-translate-y-2 hover:shadow-xl
              hover:bg-gradient-to-br hover:from-emerald-50 hover:to-white
            ">
              <ArrowPathIcon
                className="
                  w-14 h-14 mx-auto mb-4
                  text-emerald-600
                  transition-transform duration-300
                  group-hover:scale-110
                "
              />
              <h3 className="text-xl font-semibold mb-2">
                Continuous Learning
              </h3>
              <p className="text-gray-600">
                Learn technologies step-by-step and test yourself anytime during
                your journey.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Learning Journey Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">

          <div className="md:w-1/2">
            <img
              src={image02}
              alt="Growth"
              className="
                w-full
                rounded-2xl
                transition-transform duration-500
                hover:-translate-y-2 hover:scale-105
              "
            />
          </div>

          <div className="md:w-1/2 space-y-5">
            <h2 className="text-3xl font-bold" style={{ color: brandColor }}>
              Test Yourself Anytime
            </h2>
            <p className="text-gray-600 text-lg">
              Whether you are a beginner or upgrading your skills, you can
              attempt quizzes anytime, track progress, and keep improving with
              confidence.
            </p>
            <p className="text-gray-600 text-lg">
              Learning is not one-time — it’s a journey, and we’re here to
              support you at every step.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;