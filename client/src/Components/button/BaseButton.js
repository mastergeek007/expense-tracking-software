export default function BaseButton({ handleClick, children, className = "" }) {
  return (
    <button
      onClick={handleClick}
      className={`bg-primary text-white p-2 rounded-lg ${className}`}
    >
      {children}
    </button>
  );
}
