import { useEffect, useRef, useState } from "react";
import { Rnd } from "react-rnd";

export default function WallPaper() {
  const [position, setPosition] = useState({ x: 250, y: 50 });
  const [loaded, setLoaded] = useState(false);

  const bgRef = useRef(document.body);
  const [bgImage, setBgImage] = useState(
    "https://images.unsplash.com/photo-1738969773091-abcf274f7e0a?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  );

  useEffect(() => {
    if (bgRef.current) {
      bgRef.current.style.backgroundImage = `url(${bgImage})`;
      bgRef.current.style.backgroundSize = "cover";
      bgRef.current.style.transition = "background 0.5s ease";
    }
  }, [bgImage]);

  //function to change bg image
  const changeBackground = () => {
    const images = [
      "https://images.unsplash.com/photo-1738193026567-9444e58ec3f5?q=80&w=3400&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1738969773091-abcf274f7e0a?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1738831920727-73e17adc5b87?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    ];
    const currentIndex = images.indexOf(bgImage);
    const nextIndex = (currentIndex + 1) % images.length;
    const nextImage = images[nextIndex];
    setBgImage(nextImage);
  };

  // Load saved posn on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem("wallPosition");

    if (savedPosition) {
      try {
        setPosition(JSON.parse(savedPosition));
      } catch (e) {
        console.error("Error parsing saved posn");
      }
    }

    setLoaded(true);
  }, []);

  // Save state to localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("wallPosition", JSON.stringify(position));
    }
  }, [position]);
  return (
    <Rnd
      position={position}
      onDragStop={(e, d) => {
        setPosition({ x: d.x, y: d.y });
      }}
      enableResizing={{
        top: false,
        bottom: false,
        bottomRight: false,
        left: false,
        right: false,
        topLeft: false,
        topRight: false,
        bottomLeft: false,
      }}
    >
      <div className="cursor-grabbing">
        <button
          onClick={changeBackground}
          className="text-slate-400 cursor-pointer border border-slate-400 p-2 rounded-md "
        >
          Change Wallpaper
        </button>
      </div>
    </Rnd>
  );
}
