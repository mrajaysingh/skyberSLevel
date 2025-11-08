"use client";

import React from "react";
import styles from "./custom-checkbox.module.css";

interface CustomCheckboxProps {
  id: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({
  id,
  checked = false,
  onChange,
  className = "",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className={`${styles.container} ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
        className={styles.checkbox}
      />
      <label htmlFor={id} className={styles.check}>
        <svg width="18px" height="18px" viewBox="0 0 18 18">
          <path d="M1,9 L1,3.5 C1,2 2,1 3.5,1 L14.5,1 C16,1 17,2 17,3.5 L17,14.5 C17,16 16,17 14.5,17 L3.5,17 C2,17 1,16 1,14.5 L1,9 Z" />
          <polyline points="1 9 7 14 15 4" />
        </svg>
      </label>
    </div>
  );
};


