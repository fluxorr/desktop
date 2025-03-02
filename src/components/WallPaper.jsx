import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";

export default function WallPaper() {
  const [position, setPosition] = useState({ x: 250, y: 50 });
  const [size, setSize] = useState({ width: 724, height: 420 });
  const [isMaximized, setIsMaximized] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const bgRef = useRef(document.body);

  const images = [
    "https://images.unsplash.com/photo-1738969773091-abcf274f7e0a?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://github.com/fluxorr/desktop/blob/main/src/assets/hands.jpeg?raw=true",
    "https://images.unsplash.com/photo-1738831920727-73e17adc5b87?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1739372425262-1642d83a10c5?q=80&w=3131&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const [bgImage, setBgImage] = useState(images[0]);

  useEffect(() => {
    if (bgRef.current) {
      bgRef.current.style.backgroundImage = `url(${bgImage})`;
      bgRef.current.style.backgroundSize = "cover";
      bgRef.current.style.transition = "background 0.5s ease";
    }
  }, [bgImage]);

  useEffect(() => {
    const savedPosition = localStorage.getItem("wallPosition");
    const savedSize = localStorage.getItem("wallSize");
    const savedBg = localStorage.getItem("wallpaper");

    if (savedPosition) {
      try {
        setPosition(JSON.parse(savedPosition));
      } catch (e) {
        console.error("Error parsing saved position");
      }
    }
    if (savedSize) {
      try {
        setSize(JSON.parse(savedSize));
      } catch (e) {
        console.error("Error parsing saved size");
      }
    }
    if (savedBg) {
      try {
        setBgImage(JSON.parse(savedBg));
      } catch (e) {
        console.error("Error parsing saved bg");
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("wallPosition", JSON.stringify(position));
      localStorage.setItem("wallSize", JSON.stringify(size));
      localStorage.setItem("wallpaper", JSON.stringify(bgImage));
    }
  }, [position, size, loaded, bgImage]);

  const handleMaximize = () => {
    if (isMaximized) {
      setSize({ width: 724, height: 420 });
      setPosition({ x: 250, y: 50 });
    } else {
      setSize({
        width: window.innerWidth * 0.8,
        height: window.innerHeight * 0.8,
      });
      setPosition({ x: window.innerWidth * 0.1, y: window.innerHeight * 0.1 });
    }
    setIsMaximized(!isMaximized);
  };

  return (
    <Rnd
      position={position}
      size={size}
      onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
      onResizeStop={(e, direction, ref, delta, pos) => {
        setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
        setPosition(pos);
      }}
      enableResizing={{
        top: false,
        bottom: true,
        bottomRight: true,
        left: false,
        right: true,
        topLeft: false,
        topRight: false,
        bottomLeft: true,
      }}
      className="border border-gray-600 rounded-lg shadow-2xl bg-black/50 backdrop-blur-md"
    >
      {/* title bar */}
      <div className="relative flex items-center bg-gray-200 h-8 px-3 rounded-t-lg">
        {/*  Buttons Left Side */}
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div
            className="w-3 h-3 bg-green-500 rounded-full cursor-pointer"
            onClick={handleMaximize}
          ></div>
        </div>

        {/* title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 font-light text-gray-500">
          Wallpapers
        </div>
      </div>

      {/* Wallpaper selection content */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          {images.map((img, index) => (
            <label key={index} className="cursor-pointer">
              <input
                type="radio"
                name="wallpaper"
                value={img}
                checked={bgImage === img}
                onChange={() => setBgImage(img)}
                className="hidden"
              />
              <div
                className={`border-2 ${
                  bgImage === img ? "border-blue-500" : "border-transparent"
                } rounded-lg overflow-hidden`}
              >
                <img
                  src={img}
                  alt={`Wallpaper ${index + 1}`}
                  className="w-full h-40 object-cover border-[0.5px] border-slate-700 rounded-lg"
                  draggable="false"
                />
              </div>
            </label>
          ))}
        </div>
      </div>
    </Rnd>
  );
}
