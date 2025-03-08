import { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";

export default function Calculator() {
  const [size, setSize] = useState({ width: 300, height: 450 });
  const [position, setPosition] = useState({ x: 150, y: 50 });
  const [loaded, setLoaded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [previousState, setPreviousState] = useState(null);
  const [display, setDisplay] = useState("0");
  const [zIndex, setZIndex] = useState(10); // Default zIndex

  // Load saved position and size on mount
  useEffect(() => {
    const savedSize = localStorage.getItem("calculatorSize");
    const savedPosition = localStorage.getItem("calculatorPosition");
    const savedFullScreen = localStorage.getItem("calculatorFullScreen");

    if (savedSize) {
      try {
        setSize(JSON.parse(savedSize));
      } catch (e) {
        console.error("Error parsing saved size:", e);
      }
    }

    if (savedPosition) {
      try {
        setPosition(JSON.parse(savedPosition));
      } catch (e) {
        console.error("Error parsing saved position:", e);
      }
    }

    if (savedFullScreen) {
      try {
        setIsFullScreen(JSON.parse(savedFullScreen));
      } catch (e) {
        console.error("Error parsing saved fullscreen state:", e);
      }
    }

    setLoaded(true);
  }, []);

  // Save "state" to localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("calculatorSize", JSON.stringify(size));
      localStorage.setItem("calculatorPosition", JSON.stringify(position));
      localStorage.setItem(
        "calculatorFullScreen",
        JSON.stringify(isFullScreen)
      );
    }
  }, [size, position, isFullScreen, loaded]);

  // Toggle fullscreen mode
  const toggleFullScreen = () => {
    if (!isFullScreen) {
      // Save current "state" before going fullscreen
      setPreviousState({
        size: { ...size },
        position: { ...position },
      });

      // Set to fullscreen
      setIsFullScreen(true);
      setPosition({ x: 0, y: 0 });
      setSize({
        width: window.innerWidth * 0.8,
        height: window.innerHeight * 0.8,
      });
    } else {
      // Restore previous state
      setIsFullScreen(false);
      if (previousState) {
        setSize(previousState.size);
        setPosition(previousState.position);
      }
    }
  };

  // Calculator functionality
  const handleButtonClick = (value) => {
    if (value === "=") {
      try {
        setDisplay(eval(display).toString());
      } catch (e) {
        setDisplay("Error");
      }
    } else if (value === "AC") {
      setDisplay("0");
    } else {
      setDisplay(display === "0" ? value : display + value);
    }
  };

  return (
    <Rnd
      size={size}
      position={position}
      onDragStart={(e, d) => {
        setZIndex(9999); // Bring to front when dragging
      }}
      onDragStop={(e, d) => {
        if (!isFullScreen) {
          setPosition({ x: d.x, y: d.y });
          setZIndex(10); // Lower priority after drag
        }
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        if (!isFullScreen) {
          setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
          setPosition(position);
        }
      }}
      enableResizing={
        !isFullScreen && {
          top: false,
          bottom: false,
          bottomRight: true,
          left: false,
          right: false,
          topLeft: true,
          topRight: true,
          bottomLeft: true,
        }
      }
      disableDragging={isFullScreen}
      style={{ zIndex, backgroundColor: "black" }} // Dynamically set zIndex
      className="overflow-hidden rounded-sm cursor-grabbing border-[0.25px] border-slate-500"
    >
      <div className="flex flex-col h-full bg-gray-800">
        {/* title bar */}
        <div className="bg-gray-900 h-8 flex items-center px-4 border-b border-gray-200 rounded-t-lg">
          <div className="flex space-x-2 items-center">
            {/* close button TODO : Add close functionality */}
            <div className="w-3 h-3 rounded-full bg-red-500 flex items-center justify-center cursor-pointer">
              {/* No functionality yet */}
            </div>
            {/* Fullscreen */}
            <div
              className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 cursor-pointer flex items-center justify-center"
              onClick={toggleFullScreen}
            >
              {isFullScreen && (
                <span className="text-green-800 pb-[1] text-xs font-bold">
                  x
                </span>
              )}
            </div>
          </div>

          <div className="absolute left-1/2 transform -translate-x-1/2 text-sm text-gray-500 font-light">
            Calculator
          </div>
        </div>

        <div className="flex-1 bg-gray-800 flex flex-col justify-between">
          {/* Display */}
          <div className="flex items-center justify-end p-4 text-white text-2xl">
            {display}
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-2 px-4 pb-4">
            {["7", "8", "9", "/"].map((btn) => (
              <button
                key={btn}
                className="p-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                onClick={() => handleButtonClick(btn)}
              >
                {btn}
              </button>
            ))}
            {["4", "5", "6", "*"].map((btn) => (
              <button
                key={btn}
                className="p-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                onClick={() => handleButtonClick(btn)}
              >
                {btn}
              </button>
            ))}
            {["1", "2", "3", "-"].map((btn) => (
              <button
                key={btn}
                className="p-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                onClick={() => handleButtonClick(btn)}
              >
                {btn}
              </button>
            ))}
            {["AC", "0", "=", "+"].map((btn) => (
              <button
                key={btn}
                className="p-4 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                onClick={() => handleButtonClick(btn)}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Rnd>
  );
}
