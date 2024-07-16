import { useEffect, useState } from 'react';
import './App.css';

const getWord = async (length: number) => {
  try {
    const response = await fetch(`https://random-word.ryanrk.com/api/en/word/random/?length=${length}`);
    if (!response.ok) throw new Error("Error getting word!");
    return await response.json();
  } catch (error) {
    console.log(error);
  }
}

export default function App() {
  const [words, setWords] = useState<string[]>([]);
  const [current, setCurrent] = useState<string>("");

  const addWord = async (length: number) => {
    const word = await getWord(length) as string;
    setWords(prev => [ ...prev, word]);
  }

  const typing = async (e: KeyboardEvent) => {
    if (e.key === ' ') {
      await addWord(current.length); // current.length providing wrong value
      setCurrent("");
    } else {
      setCurrent(prev => prev + e.key);
    }
  }
  
  useEffect(() => {
    document.addEventListener("keydown", typing);
    return () => {
      document.removeEventListener("keydown", typing);
    }
  }, []);

  return (
    <main className="flex flex-wrap break-all p-2 text-gray-50">
      <span>{words.join(" ")}&nbsp;</span>
      <span>{current}</span>
    </main>
  );
}