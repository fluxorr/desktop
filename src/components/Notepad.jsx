import { useEffect, useState } from "react";
import { Rnd } from "react-rnd";

export default function Notepad() {
  const [position, setPosition] = useState({ x: 110, y: 520 });
  const [size, setSize] = useState({ width: 500, height: 300 });
  const [text, setText] = useState(
    "Hey this is a desktop as a site project built to learn basic stuff about draggable and resizable components. Still cant get how to get that z-index working lol :( \nStill a lot of things to implement. \nYou can edit this text and it will be saved even if you refresh  "
  );
  const [loaded, setLoaded] = useState(false);
  const [zIndex, setZIndex] = useState(10); // Default z-index

  useEffect(() => {
    const savedText = localStorage.getItem("notepadText");
    const savedPos = localStorage.getItem("notepadPosition");
    const savedSize = localStorage.getItem("notepadSize");

    if (savedText) setText(savedText);
    if (savedPos) {
      try {
        setPosition(JSON.parse(savedPos));
      } catch (e) {
        console.error("Error parsing position");
      }
    }
    if (savedSize) {
      try {
        setSize(JSON.parse(savedSize));
      } catch (e) {
        console.error("Error parsing size");
      }
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("notepadText", text);
      localStorage.setItem("notepadPosition", JSON.stringify(position));
      localStorage.setItem("notepadSize", JSON.stringify(size));
    }
  }, [text, position, size, loaded]);

  return (
    <Rnd
      position={position}
      size={size}
      onMouseDown={() => setZIndex(999)} // Bring to front when active
      onDragStart={() => setZIndex(999)}
      onDragStop={(e, d) => {
        setPosition({ x: d.x, y: d.y });
        setZIndex(10); // Lower priority after dragging
      }}
      onResizeStart={() => setZIndex(999)}
      onResizeStop={(e, direction, ref, delta, pos) => {
        setSize({ width: ref.offsetWidth, height: ref.offsetHeight });
        setPosition(pos);
        setZIndex(10);
      }}
      className="border border-gray-600 rounded-lg shadow-2xl bg-slate-800 text-slate-200"
      style={{ zIndex }}
    >
      {/* Title Bar */}
      <div className="relative flex items-center bg-gray-900 h-8 px-3 rounded-t-lg text-gray-200">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        </div>
        <div className="absolute left-1/2 text-gray-500  transform -translate-x-1/2 font-extralight">
          info.txt
        </div>
      </div>

      {/* Text Editor */}
      <textarea
        className="w-full h-full p-2 text-slate-200 bg-transparent outline-none resize-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck="false"
      />
    </Rnd>
  );
}
