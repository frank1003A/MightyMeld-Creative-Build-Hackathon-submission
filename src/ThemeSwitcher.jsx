import { MdOutlineDarkMode } from "react-icons/md";
import { FiSun } from "react-icons/fi";
import useDarkSide from "./hooks/useDarkSide";

const ThemeSwitcher = () => {
 const [colorTheme, setTheme] = useDarkSide();

  return (
    <div className="z-100 right-5 top-5 p-[3px] transition flex gap-3 w-fit align-center rounded-full bg-indigo-50 z-10 ml-auto">
      <button
        className={`${
          colorTheme === "light"  || colorTheme === undefined ? "bg-indigo-500 text-white" : "bg-transparent"
        } flex align-center justify-center w-[30px] px-[7.5px] py-[6.563px] rounded-full
        transition-colors ease-in-out duration-[0.5s]
        hover:bg-indigo-500hover:text-white dark:text-white
        `}
        onClick={() => setTheme("light")}
      >
        <FiSun />
      </button>
      <button
        className={`${
          colorTheme === "dark" ? "bg-indigo-500  text-white" : "bg-transparent"
        } flex align-center justify-center w-[30px] px-[7.5px] py-[6.563px] rounded-full
        transition-colors ease-in-out duration-[0.5s] hover:bg-indigo-500 hover:text-white  dark:text-white      `}
        onClick={() => setTheme("dark")}
      >
        <MdOutlineDarkMode />
      </button>
    </div>
  );
};

export default ThemeSwitcher;
