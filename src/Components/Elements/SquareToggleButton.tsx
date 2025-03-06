import type React from "react";
import * as Toggle from "@radix-ui/react-toggle";

interface SquareToggleButtonProps {
  isActive: boolean;
  onToggle: (value: boolean) => void;
  label: string;
  icon: string;
}

const SquareToggleButton: React.FC<SquareToggleButtonProps> = ({ isActive, onToggle, label, icon }) => {
  return (
    <div className="toggle-container">
      <Toggle.Root
        pressed={isActive}
        onPressedChange={onToggle}
        className={`square-toggle ${isActive ? "active" : ""}`}
        aria-label={`Toggle filter ${label}`}
      >
        <img src={icon} alt={label} className="toggle-icon" />
      </Toggle.Root>
      <span className="toggle-label">{label}</span>
    </div>
  );
};

export default SquareToggleButton;