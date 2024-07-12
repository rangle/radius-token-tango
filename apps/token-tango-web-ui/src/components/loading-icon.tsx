import React from "react";

const SpinningLogo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 ${className}`}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-10 h-10 animate-spin-custom"
      >
        <path
          d="M9 8.99998L21 21"
          stroke="#D44527"
          strokeWidth="2"
          strokeMiterlimit="10"
        />
        <path
          d="M6.44444 21.9043H2C2.01369 16.6042 4.12522 11.525 7.87298 7.77728C11.6207 4.02952 16.6999 1.91798 22 1.9043V6.38579C17.8808 6.38578 13.9298 8.01957 11.0136 10.9288C8.09748 13.838 6.45425 17.7851 6.44444 21.9043Z"
          fill="#262626"
        />
      </svg>
      <style>{`
        @keyframes spin-custom {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-custom {
          animation: spin-custom 1s linear infinite;
          transform-origin: bottom right;
        }
      `}</style>
    </div>
  );
};

export default SpinningLogo;
