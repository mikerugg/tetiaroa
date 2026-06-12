import { Anton } from "next/font/google";
import HomeExperience from "./home-experience";

const depthDisplay = Anton({
  variable: "--font-depth",
  subsets: ["latin"],
  weight: "400",
});

export default function Home() {
  return (
    <div className={depthDisplay.variable}>
      <HomeExperience />
    </div>
  );
}
