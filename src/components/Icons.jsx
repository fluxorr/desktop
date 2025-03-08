import { useState, useEffect } from "react";
import { Rnd } from "react-rnd";

const defaultIcons = [
  {
    id: 1,
    name: "GitHub",
    src: "https://cdn-icons-png.flaticon.com/128/5968/5968866.png",
    defaultPos: { x: 20, y: 50 },
    link: "https://github.com/fluxorr/desktop",
  },
  {
    id: 2,
    name: "Photos",
    src: "https://cdn-icons-png.flaticon.com/128/5082/5082720.png",
    defaultPos: { x: 20, y: 50 + 80 },
  },
  {
    id: 3,
    name: "Music",
    src: "https://cdn-icons-png.flaticon.com/128/5082/5082720.png",
    defaultPos: { x: 20, y: 50 + 80 * 2 },
  },
  {
    id: 4,
    name: "Documents",
    src: "https://cdn-icons-png.flaticon.com/128/5082/5082720.png",
    defaultPos: { x: 20, y: 270 },
  },
];

export default function Icons() {
  const [iconPositions, setIconPositions] = useState(() => {
    const storedPositions = localStorage.getItem("iconPositions");
    return storedPositions
      ? JSON.parse(storedPositions)
      : defaultIcons.reduce((acc, icon) => {
          acc[icon.id] = icon.defaultPos;
          return acc;
        }, {});
  });

  useEffect(() => {
    localStorage.setItem("iconPositions", JSON.stringify(iconPositions));
  }, [iconPositions]);

  const updatePosition = (id, x, y) => {
    setIconPositions((prev) => ({ ...prev, [id]: { x, y } }));
  };

  return (
    <div>
      {defaultIcons.map((icon) => (
        <Rnd
          key={icon.id}
          default={{
            x: iconPositions[icon.id].x,
            y: iconPositions[icon.id].y,
            width: 60,
            height: 80,
          }}
          onDragStop={(_, d) => updatePosition(icon.id, d.x, d.y)}
        >
          <div className="flex flex-col items-center">
            {icon.link ? (
              <a
                href={icon.link}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer"
              >
                <img
                  src={icon.src}
                  alt={icon.name}
                  className="h-12 w-12"
                  draggable="false"
                />
              </a>
            ) : (
              <img
                src={icon.src}
                alt={icon.name}
                className="h-12 w-12"
                draggable="false"
              />
            )}
            <span className="text-xs mt-1 text-center text-slate-200">
              {icon.name}
            </span>
          </div>
        </Rnd>
      ))}
    </div>
  );
}
