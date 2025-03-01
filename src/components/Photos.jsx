import { useState, useEffect, useCallback, useMemo } from "react";
import { Rnd } from "react-rnd";
import { Resizable } from "re-resizable";

const images = [];

// Debounce function to limit frequency of expensive operations
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export default function Photos() {
  const [size, setSize] = useState({ width: 650, height: 400 });
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [imageSizes, setImageSizes] = useState(() => {
    // Initialize from localStorage or default values
    const savedSizes = localStorage.getItem("imageSizes");
    return savedSizes
      ? JSON.parse(savedSizes)
      : Array(6).fill({ width: "100%", height: 128 });
  });

  // Load saved position and size once on mount
  useEffect(() => {
    const savedPosition = localStorage.getItem("dragPosition");
    const savedSize = localStorage.getItem("dragSize");

    if (savedPosition) setPosition(JSON.parse(savedPosition));
    if (savedSize) setSize(JSON.parse(savedSize));
  }, []);

  // Debounced localStorage save function
  const saveToLocalStorage = useCallback(
    debounce((key, value) => {
      localStorage.setItem(key, JSON.stringify(value));
    }, 300),
    []
  );

  // Optimized handlers
  const handleDragStop = useCallback(
    (e, data) => {
      const newPos = { x: data.x, y: data.y };
      setPosition(newPos);
      saveToLocalStorage("dragPosition", newPos);
    },
    [saveToLocalStorage]
  );

  const handleResizeStop = useCallback(
    (e, direction, ref, delta, position) => {
      const newSize = { width: ref.offsetWidth, height: ref.offsetHeight };
      setSize(newSize);
      setPosition(position);
      saveToLocalStorage("dragSize", newSize);
      saveToLocalStorage("dragPosition", position);
    },
    [saveToLocalStorage]
  );

  const handleImageResize = useCallback(
    (index, newSize) => {
      setImageSizes((prev) => {
        const newSizes = [...prev];
        newSizes[index] = newSize;
        saveToLocalStorage("imageSizes", newSizes);
        return newSizes;
      });
    },
    [saveToLocalStorage]
  );

  // Memoize the list of images to prevent unnecessary re-renders
  const imageList = useMemo(() => {
    return images.slice(0, 6).map((image, index) => (
      <div key={index} className="rounded-lg overflow-hidden">
        <Resizable
          size={imageSizes[index]}
          onResizeStop={(e, direction, ref, d) => {
            handleImageResize(index, {
              width: imageSizes[index].width,
              height: imageSizes[index].height + d.height,
            });
          }}
          enable={{
            bottom: true,
            bottomRight: false,
            bottomLeft: false,
            topLeft: false,
            topRight: false,
            top: false,
            left: false,
            right: false,
          }}
          handleClasses={{
            bottom:
              "h-2 w-full bg-gray-300 hover:bg-blue-500 cursor-ns-resize absolute bottom-0 left-0 opacity-50 hover:opacity-100 transition-opacity",
          }}
        >
          <img
            src={image}
            alt={`Gallery ${index + 1}`}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            draggable="false"
            loading="lazy"
          />
        </Resizable>
      </div>
    ));
  }, [imageSizes, handleImageResize]);

  return (
    <Rnd
      size={size}
      position={position}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      minWidth={400}
      minHeight={250}
      bounds="window"
      className="shadow-2xl"
      resizeHandleClasses={{
        bottom: "h-2 bg-transparent hover:bg-blue-500 hover:opacity-50",
        right: "w-2 bg-transparent hover:bg-blue-500 hover:opacity-50",
        bottomRight:
          "w-4 h-4 bg-transparent hover:bg-blue-500 hover:opacity-50 rounded-br-lg",
      }}
      enableResizing={{
        top: true,
        right: true,
        bottom: true,
        left: true,
        topRight: true,
        bottomRight: true,
        bottomLeft: true,
        topLeft: true,
      }}
    >
      <div className="bg-white/50 backdrop-blur-lg border border-gray-300 rounded-2xl overflow-hidden h-full flex flex-col">
        {/* Toolbar (macOS-style) */}
        <div className="flex items-center justify-between px-4 py-2 bg-white/30 border-b border-gray-200">
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <span className="text-gray-600 font-medium text-sm">Photos</span>
          <div className="w-6"></div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 overflow-auto flex-grow">
          {imageList}
        </div>
      </div>
    </Rnd>
  );
}
