import { useEffect, useState } from 'react';
import './App.css';

const getWord = async (length: number) => {
  if (length === 0) return "";
  try {
    const response = await fetch(`https://random-word.ryanrk.com/api/en/word/random/?length=${length}`);
    if (!response.ok) throw new Error("Error getting word!");
    const data = await response.json() as string[];
    return data[0].toLowerCase();
  } catch (error) {
    console.log(error);
    return "";
  }
}

export default function App() {
  const [words, setWords] = useState<string[]>([]);
  const [current, setCurrent] = useState<string>("");
  const ignore = ['Alt', 'Control'];

  const addWord = async (length: number) => {
    const word = await getWord(length);
    setWords(prev => [...prev, word]);
  }

  const typing = async (e: KeyboardEvent) => {
    if (ignore.includes(e.key)) return;

    if (e.key === ' ') {
      e.preventDefault();
      await addWord(current.length);
      setCurrent("");
      return;
    }

    setCurrent(prev => prev + e.key);
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      typing(e);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [current]);

  return (
    <main className="flex flex-wrap break-all p-2">
      <span>{words.join(" ")}&nbsp;</span>
      <span>{current}</span>
    </main>
  );
}
