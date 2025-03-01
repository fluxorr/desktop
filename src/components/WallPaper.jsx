import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";

export default function WallPaper() {
  const [position, setPosition] = useState({ x: 250, y: 50 });
  const [loaded, setLoaded] = useState(false);
  const bgRef = useRef(document.body);

  const images = [
    "https://images.unsplash.com/photo-1738969773091-abcf274f7e0a?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://github.com/fluxorr/desktop/blob/main/src/assets/hands.jpeg?raw=true",
    "https://images.unsplash.com/photo-1738831920727-73e17adc5b87?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const [bgImage, setBgImage] = useState(images[0]);

  useEffect(() => {
    if (bgRef.current) {
      bgRef.current.style.backgroundImage = `url(${bgImage})`;
      bgRef.current.style.backgroundSize = "cover";
      bgRef.current.style.transition = "background 0.5s ease";
    }
  }, [bgImage]);

  // Load saved position on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem("wallPosition");
    if (savedPosition) {
      try {
        setPosition(JSON.parse(savedPosition));
      } catch (e) {
        console.error("Error parsing saved position");
      }
    }
    const savedBg = localStorage.getItem("wallpaper");
    if (savedBg) {
      try {
        setBgImage(JSON.parse(savedBg));
      } catch (e) {
        console.error("Error parsing saved bg");
      }
    }
    setLoaded(true);
  }, []);

  // Save position state to localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("wallPosition", JSON.stringify(position));
      localStorage.setItem("wallpaper", JSON.stringify(bgImage));
    }
  }, [position, loaded, bgImage]);

  return (
    <Rnd
      position={position}
      size={{ height: 200, width: 300 }}
      onDragStop={(e, d) => setPosition({ x: d.x, y: d.y })}
      enableResizing={false}
    >
      <div className="p-4 bg-slate-200 shadow-lg rounded-lg">
        <h3 className="text-slate-600 font-semibold text-center mb-2">
          Wallpapers
        </h3>
        <div className="grid grid-cols-3 gap-2">
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
                  className="w-20 h-12 object-cover"
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
