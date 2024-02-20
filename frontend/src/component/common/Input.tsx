import React from "react";

type InputDefaultProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;
type InputProps = {
  fullWidth?: boolean;
} & InputDefaultProps;

function Input({ fullWidth = false, className, ...inputProps }: InputProps) {
  const fullWidthStyle = fullWidth ? "w-full" : "";
  return (
    <div className={` ${fullWidthStyle}`}>
      <input
        {...inputProps}
        className={`py-4 px-2 text-sm border-b text-white bg-black/70 focus:border-b-primary border-b-kggrey-200 placeholder:text-zinc-400 focus:outline-none ${fullWidthStyle} ${className}`}
      />
    </div>
  );
}

export default Input;
