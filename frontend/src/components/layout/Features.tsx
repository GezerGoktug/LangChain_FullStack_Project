import { ReactElement } from "react";
import { IconType } from "react-icons";
import {
  FaTags,
  FaDollarSign,
  FaBoxOpen,
  FaTruck,
  FaStar,
  FaExchangeAlt,
  FaMapMarkerAlt,
  FaBullhorn,
} from "react-icons/fa";

interface featuresDataType {
  title: string;
  description: string;
  icon: ReactElement<IconType>;
  bg: string;
}

const chatAIFeatures: featuresDataType[] = [
  {
    title: "Discount Recommendations",
    description:
      "Provides personalized discount suggestions based on user browsing history and current promotions.",
    icon: <FaTags className="text-orange-500 text-5xl" />,
    bg: " from-orange-500 to-orange-300",
  },
  {
    title: "Price Comparison",
    description:
      "Compares prices of similar products across different categories to help users make informed purchase decisions.",
    icon: <FaDollarSign className="text-green-600 text-5xl" />,
    bg: " from-green-600 to-green-400",
  },
  {
    title: "Product Availability",
    description:
      "Informs users about the availability of products in stock, including restock dates for out-of-stock items.",
    icon: <FaBoxOpen className="text-lime-600 text-5xl" />,
    bg: " from-lime-600 to-lime-400",
  },
  {
    title: "Order Tracking",
    description:
      "Allows users to track their orders in real-time, providing updates on shipment status and estimated delivery times.",
    icon: <FaTruck className="text-teal-600 text-5xl" />,
    bg: " from-teal-600 to-teal-400",
  },
  {
    title: "Customer Reviews",
    description:
      "Displays customer reviews and ratings for products, helping users understand the quality and popularity of items.",
    icon: <FaStar className="text-pink-600 text-5xl" />,
    bg: " from-pink-600 to-pink-400",
  },
  {
    title: "Related Product Suggestions",
    description:
      "Suggests related products based on the user's current selection, enhancing cross-selling opportunities.",
    icon: <FaExchangeAlt className="text-purple-600 text-5xl" />,
    bg: " from-purple-600 to-purple-400",
  },
  {
    title: "Store Locator",
    description:
      "Helps users find the nearest physical store locations based on their current location.",
    icon: <FaMapMarkerAlt className="text-blue-600 text-5xl" />,
    bg: " from-blue-600 to-blue-400",
  },
  {
    title: "Promotional Notifications",
    description:
      "Sends notifications about ongoing promotions, flash sales, and exclusive offers to keep users engaged.",
    icon: <FaBullhorn className="text-red-600 text-5xl" />,
    bg: " from-red-600 to-red-400",
  },
];

const Features = () => {
  return (
    <div className="bg-gradient-to-b from-[#1B0125] via-[#4d046a] to-[#700c97] -mt-3 pb-12">
      <div className="custom-container">
        <h2
          className=" font-bold text-violet-100 text-4xl sm:text-6xl  mb-24 w-max mx-auto z-[1] py-2 px-12
        relative before:block before:absolute before:-inset-1 before:-skew-y-2 before:-z-10 before:bg-purple-400
        "
        >
          Features
        </h2>
        <div className="grid  min-[530px]:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-12">
          {chatAIFeatures.map((feature, index) => (
            <div
              key={index}
              className={`  flex flex-col items-center text-center gap-2 px-3 py-6 bg-gradient-to-br  ${feature.bg}  shadow-2xl shadow-white/30 hover:scale-105 transition-transform cursor-pointer rounded-xl text-white`}
            >
              {feature.icon}
              <h3 className="font-semibold text-2xl">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
