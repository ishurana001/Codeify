import React, { useState } from 'react'
import "./App.css"
import Navbar from './components/Navbar'
import Editor from '@monaco-editor/react';
import Select from 'react-select';
import Markdown from 'react-markdown'
import RingLoader from "react-spinners/RingLoader";
import axios from 'axios'; 

const App = () => {
  const options = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'cpp', label: 'C++' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'swift', label: 'Swift' },
    { value: 'kotlin', label: 'Kotlin' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'rust', label: 'Rust' },
    { value: 'dart', label: 'Dart' },
    { value: 'scala', label: 'Scala' },
    { value: 'perl', label: 'Perl' },
    { value: 'haskell', label: 'Haskell' },
    { value: 'elixir', label: 'Elixir' },
    { value: 'r', label: 'R' },
    { value: 'matlab', label: 'MATLAB' },
    { value: 'bash', label: 'Bash' }
  ];

  const [selectedOption, setSelectedOption] = useState(options[0]);

  const customStyles = {
    control: (provided) => ({ ...provided, backgroundColor: '#18181b', borderColor: '#3f3f46', color: '#fff', width: "100%" }),
    menu: (provided) => ({ ...provided, backgroundColor: '#18181b', color: '#fff', width: "100%" }),
    singleValue: (provided) => ({ ...provided, color: '#fff', width: "100%" }),
    option: (provided, state) => ({ ...provided, backgroundColor: state.isFocused ? '#27272a' : '#18181b', color: '#fff', cursor: 'pointer' }),
    input: (provided) => ({ ...provided, color: '#fff', width: "100%" }),
    placeholder: (provided) => ({ ...provided, color: '#a1a1aa', width: "100%" }),
  };

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  async function reviewCode() {
    setResponse("");
    setLoading(true);

    const apiOptions = {
      method: 'POST',
      url: `https://${import.meta.env.VITE_RAPIDAPI_HOST}/gpt4`, 
      headers: {
        'Content-Type': 'application/json',
        'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY,
        'x-rapidapi-host': import.meta.env.VITE_RAPIDAPI_HOST
      },
      data: {
        messages: [
          {
            role: 'user',
            content: `You are an expert-level software developer. Review this ${selectedOption.value} code for quality and bugs. Code: ${code}`
          }
        ]
      }
    };

    try {
      const res = await axios.request(apiOptions);
      setResponse(res.data.result || "No response received.");
    } catch (error) {
      setResponse("Error: Could not connect to API.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="main flex justify-between" style={{ height: "calc(100vh - 90px)" }}>
        <div className="left h-[87.5%] w-[50%]">
          <div className="tabs !mt-5 !px-5 !mb-3 w-full flex items-center gap-[10px]">
            <Select value={selectedOption} onChange={(e) => setSelectedOption(e)} options={options} styles={customStyles} />
            <button className="btnNormal bg-zinc-900 min-w-[120px] transition-all hover:bg-zinc-800">Fix Code</button>
            <button onClick={() => code === "" ? alert("Please enter code first") : reviewCode()} className="btnNormal bg-zinc-900 min-w-[120px] transition-all hover:bg-zinc-800">Review</button>
          </div>
          <Editor height="100%" theme='vs-dark' language={selectedOption.value} value={code} onChange={(e) => setCode(e)} />
        </div>

        <div className="right overflow-scroll !p-[20px] bg-zinc-900 w-[50%] h-[101%] border-l border-[#27272a]">
            <div className="topTab border-b-[1px] border-[#27272a] flex items-center justify-between h-[60px] mb-4">
              <p className='text-white font-bold text-[18px] tracking-tight'>Response Analysis</p>
            </div>
            
            {loading && (
               <div className="flex flex-col justify-center items-center h-64 gap-4">
                  <RingLoader color='#9333ea'/>
                  <p className="text-white text-xs tracking-[3px] animate-pulse">ANALYZING CODE...</p>
               </div>
            )}
            
            <div className="markdown-container prose prose-invert">
              <Markdown>{response}</Markdown>
            </div>
        </div>
      </div>
    </>
  )
}

export default App