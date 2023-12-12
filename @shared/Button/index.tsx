import React, { FC, ReactNode } from "react";

import s from "./styles.module.css";

import cn from "classnames";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  color?: "primary" | "secondary";
  disabled?: boolean;
  size?: "small" | "medium" | "large";
  variant?: "contained" | "text" | "outlined";
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  className?: string;
  loading?: boolean;
  width?: string;
  styles?: {};
}

const Button: FC<Props> = (props) => {
  const {
    title,
    color = "primary",
    disabled = false,
    size = "medium",
    variant = "contained",
    startIcon,
    endIcon,
    loading = false,
    className,
    width,
    styles,
    ...rest
  } = props;

  const rootClassName = cn(
    s.root,
    {
      [s.primary]: color === "primary",
      [s.secondary]: color === "secondary",
      [s.disabled]: disabled === true,
      [s.small]: size === "small",
      [s.medium]: size === "medium",
      [s.large]: size === "large",
      [s.contained]: variant === "contained",
      [s.text]: variant === "text",
      [s.outlined]: variant === "outlined",
    },
    className
  );

  return (
    <button className={rootClassName} {...rest} style={{ width, ...styles }}>
      {startIcon && !endIcon && startIcon}
      {title}
      {endIcon && !startIcon && endIcon}
    </button>
  );
};

export default Button;