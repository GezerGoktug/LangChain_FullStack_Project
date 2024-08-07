import { GiArtificialIntelligence } from "react-icons/gi";
import { Link } from "react-router-dom";

const HeroTitle = () => {
  return (
    <div className="flex flex-col gap-6 md:w-1/2     items-start">
      <div className="font-bold text-white flex gap-4 text-5xl">
        <GiArtificialIntelligence className="text-violet-200 " />{" "}
        <span className="">
          <span className="bg-gradient-to-br from-indigo-600 to-purple-900 bg-clip-text text-transparent ">
            AI
          </span>{" "}
          <span className="text-shadow shadow-white">Tools</span>
        </span>
      </div>
      <h1 className="bg-gradient-to-br from-violet-200 to-pink-100 bg-clip-text text-transparent font-bold text-5xl xl:text-6xl">
        Enhance Your Shopping Experience with AI
      </h1>
      <p className="text-lg font-semibold text-white">
        Discover personalized recommendations, real-time order tracking, and
        much more with our intelligent AI chat assistant.
      </p>
      <button className="bg-indigo-700 shadow-lg shadow-indigo-800 py-3 px-5 text-violet-100 rounded-full font-bold text-xl">
        <Link to="/chat">Getting Started</Link>
      </button>
    </div>
  );
};

export default HeroTitle;
