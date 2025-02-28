import { useRef, useState, useEffect } from "react";
import Draggable from "react-draggable";
import image from "../assets/image.png";

export default function Photos() {
  const nodeRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // load the posn from local storage when component mounts
  useEffect(() => {
    const savedPosition = localStorage.getItem("dragPosition");
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }
  }, []);

  // update the posn in local storage when we stop dragging
  const handleStop = (e, data) => {
    const newPos = { x: data.x, y: data.y };
    setPosition(newPos);
    localStorage.setItem("dragPosition", JSON.stringify(newPos));
  };

  return (
    <div>
      <Draggable nodeRef={nodeRef} position={position} onStop={handleStop}>
        <div className="cursor-grabbing max-h-18 max-w-18 " ref={nodeRef}>
          <div>
            <img src={image} alt="Draggable" draggable="false" />
          </div>
        </div>
      </Draggable>
    </div>
  );
}
