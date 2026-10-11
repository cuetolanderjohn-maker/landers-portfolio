import React, { useState, useEffect } from 'react';
import './TextType.css';

/**
 * TextType component from React Bits
 * Provides a typewriter effect with configurable speeds, pause duration, deletion loop, and cursor.
 */
export default function TextType({
  text = ["Lander John D. Cueto"],
  typingSpeed = 75,
  pauseDuration = 2000,
  deletingSpeed = 35,
  loop = true,
  showCursor = true,
  cursorCharacter = "|",
  className = ""
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    if (!text || text.length === 0) return;

    const currentString = text[textIndex % text.length];

    if (!isDeleting) {
      if (charIndex < currentString.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentString.substring(0, charIndex + 1));
          setCharIndex(prev => prev + 1);
        }, typingSpeed);
        return () => clearTimeout(timeout);
      } else {
        if (loop || textIndex < text.length - 1) {
          const timeout = setTimeout(() => {
            setIsDeleting(true);
          }, pauseDuration);
          return () => clearTimeout(timeout);
        }
      }
    } else {
      if (charIndex > 0) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentString.substring(0, charIndex - 1));
          setCharIndex(prev => prev - 1);
        }, deletingSpeed);
        return () => clearTimeout(timeout);
      } else {
        setIsDeleting(false);
        setTextIndex(prev => (prev + 1) % text.length);
      }
    }
  }, [charIndex, isDeleting, textIndex, text, typingSpeed, deletingSpeed, pauseDuration, loop]);

  return (
    <span className={`text-type ${className}`.trim()}>
      <span className="text-type__content">{displayedText}</span>
      {showCursor && (
        <span className="text-type__cursor" aria-hidden="true">
          {cursorCharacter}
        </span>
      )}
    </span>
  );
}

export function Hero() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <div className="flex flex-col items-center justify-center max-w-2xl w-full">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
          <TextType
            text={["Lander John D. Cueto"]}
            typingSpeed={75}
            pauseDuration={2000}
            deletingSpeed={35}
            loop={true}
            showCursor={true}
            cursorCharacter="|"
          />
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted-foreground font-normal">
          A junior web developer and game developer etc.
        </p>
        <p className="mt-1 text-sm text-muted-foreground font-normal">
          Pasig City, Philippines
        </p>
      </div>
    </section>
  );
}
