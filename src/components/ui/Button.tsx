type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
};

export default function Button({
  children,
  onClick,
  disabled = false,
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="
        bg-blue-900
        hover:bg-blue-800
        disabled:bg-gray-400
        disabled:cursor-not-allowed
        text-white
        px-6
        py-3
        rounded-xl
        font-semibold
        transition
        duration-300
        shadow-md
        hover:shadow-lg
        disabled:shadow-none
      "
    >
      {children}
    </button>
  );
}