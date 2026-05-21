import { useRef, useState } from "react";
import { Tooltip } from "react-tooltip";

function Hint({ note }) {
  const textRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleMouseEnter = () => {
    const el = textRef.current;
    if (el && el.scrollWidth > el.clientWidth) {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-tooltip-id="note-tooltip"
      data-tooltip-content={note}
    >
      <Tooltip id="note-tooltip" isOpen={showTooltip} />
      <div
        ref={textRef}
      >
        {note}
      </div>
    </div>
  );
}
export default Hint;
