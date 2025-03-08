import { useState, useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import image from "../assets/image.png";

export default function Photos() {
  const [size, setSize] = useState({ width: 500, height: 350 });
  const [position, setPosition] = useState({ x: 900, y: 570 });
  const [loaded, setLoaded] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [previousState, setPreviousState] = useState(null);

  // Load saved position and size on mount
  useEffect(() => {
    const savedSize = localStorage.getItem("photoSize");
    const savedPosition = localStorage.getItem("photoPosition");
    const savedFullScreen = localStorage.getItem("photoFullScreen");

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
      localStorage.setItem("photoSize", JSON.stringify(size));
      localStorage.setItem("photoPosition", JSON.stringify(position));
      localStorage.setItem("photoFullScreen", JSON.stringify(isFullScreen));
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
        width: window.innerWidth,
        height: window.innerHeight,
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

  return (
    <Rnd
      size={size}
      position={position}
      onDragStop={(e, d) => {
        if (!isFullScreen) {
          setPosition({ x: d.x, y: d.y });
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
      className={`overflow-hidden rounded-sm cursor-grabbing border-[0.25px] border-slate-500  ${
        isFullScreen ? "z-[9999] fixed" : "z-10"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* title bar */}
        <div className="bg-gray-900 h-8 flex items-center px-4 border-b border-gray-200 rounded-t-lg">
          <div className="flex space-x-2 items-center">
            {/* close button TODO : Add close functionality */}
            <div className="w-3 h-3 rounded-full  bg-red-500 flex items-center justify-center cursor-pointer">
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

          <div className="absolute left-1/2  transform -translate-x-1/2 text-sm text-gray-500 font-light">
            heh.png
          </div>
        </div>

        <div className="flex-1 bg-gray-900 overflow-hidden">
          <img
            className="w-full h-full object-contain"
            src={image}
            draggable={false}
            alt="Photo"
          />
        </div>
      </div>
    </Rnd>
  );
}
