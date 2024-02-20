import React, { FC, ReactNode } from "react";

type DefaultButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

type ButtonProps = {
  children: ReactNode;
  fullWidth?: boolean;
  variant?: "primary" | "secondary";
} & DefaultButtonProps;

const Button: FC<ButtonProps> = ({
  fullWidth = false,
  children,
  className,
  variant = "primary",
  ...buttonProps
}) => {
  const fullWidthStyle = fullWidth ? "w-full" : "";
  const getVariant = () => {
    switch (variant) {
      case "primary": {
        return "text-white bg-primary hover:bg-active active:bg-brand-500 rounded-full hover:text-zinc-900 hover:border-none";
      }
      case "secondary": {
        return "text-white bg-bidlo_grey-500 hover:bg-bidlo_grey-400 active:bg-bidlo_grey-500";
      }
      default: {
        return "text-white bg-brand-500 hover:bg-brand-400 active:bg-brand-500";
      }
    }
  };

  return (
    <button
      {...buttonProps}
      className={`py-3 px-4 md:px-8 select-none focus:outline-none text-sm font-medium z-50 ${fullWidthStyle}  disabled:bg-zinc-600 ${getVariant()} ${className} transition-colors ease-in-out duration-500`}
    >
      {children}
    </button>
  );
};

export default Button;
