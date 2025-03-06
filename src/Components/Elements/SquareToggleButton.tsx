import React from "react";
import * as Toggle from "@radix-ui/react-toggle";
import { CheckIcon } from "@radix-ui/react-icons";

interface SquareToggleButtonProps {
  isActive: boolean;
  onToggle: (value: boolean) => void;
  label: string;
}

const SquareToggleButton: React.FC<SquareToggleButtonProps> = ({ isActive, onToggle, label }) => {
  return (
    <div className="toggle-container">
      <Toggle.Root
        pressed={isActive}
        onPressedChange={onToggle}
        className={`square-toggle ${isActive ? "active" : ""}`}
        aria-label={`Toggle filter ${label}`}
      >
        {isActive && <CheckIcon className="check-icon" />}
      </Toggle.Root>
      <span className="toggle-label">{label}</span>
    </div>
  );
};

export default SquareToggleButton;