import HeroRight from "../UI/HeroRight";
import HeroTitle from "../UI/HeroTitle";

const Hero = () => {
  return (
    <div className="custom-container min-h-screen pt-12 md:pt-0 flex flex-col md:flex-row items-center gap-4">
      <HeroTitle />
      <HeroRight />
      <video
        className="absolute top-0 left-0 right-0  w-full h-[1000px] md:h-full object-cover -z-10"
        src="/hero.mp4"
        autoPlay
        loop
        muted
      />
    </div>
  );
};

export default Hero;
