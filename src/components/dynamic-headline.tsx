"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { cn } from '@/lib/utils';

const Typer = ({ text, onComplete }: { text: string, onComplete: () => void }) => {
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const typingSpeed = 100;
  const deletingSpeed = 50;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isDeleting) {
      if (displayText.length < text.length) {
        timer = setTimeout(() => {
          setDisplayText(text.substring(0, displayText.length + 1));
        }, typingSpeed);
      } else {
        // Wait for a bit before starting to delete
        timer = setTimeout(() => setIsDeleting(true), 1500);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(text.substring(0, displayText.length - 1));
        }, deletingSpeed);
      } else {
        setIsDeleting(false);
        onComplete();
      }
    }
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, text, onComplete]);

  return <span>{displayText}</span>;
}


export const DynamicHeadline = () => {
    const phrases = useMemo(() => ["VerifyAI", "Fake News Detector", "Deepfake Detector"], []);
    const [phraseIndex, setPhraseIndex] = useState(0);
    const [key, setKey] = useState(0);

    const handleCycle = () => {
        setPhraseIndex(prevIndex => (prevIndex + 1) % phrases.length);
        setKey(prevKey => prevKey + 1); // Reset the Typer component
    };
    
    return (
        <h1
        className={cn(
            "text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline w-fit cyberspace-reveal",
        )}
        >
            <Typer key={key} text={phrases[phraseIndex]} onComplete={handleCycle} />
        </h1>
    );
};
