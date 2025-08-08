import React from "react";

type SectionHeaderProps = {
  title: string;
  subtitle?: string;
  className?: string;
};

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  className = "",
}) => {
  const chars = title.split("");

  return (
    <section
      className={`w-full max-w-7xl mx-auto px-4  text-center pt-16 pb-10 ${className}`}
    >
      <div>
        {/* Animated Shape */}
        <div className="flex justify-center gap-4 items-center mb-4">
          <div className="animate-pulse">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#8b5c26"
                strokeWidth="4"
                fill="none"
                className="animate-[spin_8s_linear_infinite]"
              />
              <circle
                cx="24"
                cy="24"
                r="10"
                fill="#8b5c26"
                className="animate-[ping_3s_ease-in-out_infinite]"
              />
            </svg>
          </div>

          {/* Animated Title */}
          <h2 className="text-3xl uppercase md:text-4xl font-bold text-[#0F172A] dark:text-white flex">
            {chars.map((char, index) => (
              <span
                key={index}
                className="animated-letter"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </h2>
        </div>

        {subtitle && (
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
};

export default SectionHeader;
