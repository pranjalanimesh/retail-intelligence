"use client";
import React, { useRef, useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { Progress } from "../components/ui/progress";
import { FaUpload } from "react-icons/fa";

const AUDIO_TYPES = ["audio/mpeg", "audio/wav", "audio/mp3"];

export default function Home() {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (!AUDIO_TYPES.includes(f.type)) {
      setError("Only .mp3 and .wav files are allowed.");
      setFile(null);
      return;
    }
    setError("");
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(10);
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((p) => (p < 80 ? p + 10 : p));
    }, 150);
    // Actually call the API
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/process-audio", {
        method: "POST",
        body: formData,
      });
      clearInterval(interval);
      setProgress(100);
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Upload failed. Try again.");
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  // Empty state placeholders (grayed out, no data)
  const emptyStaff = [
    { category: "Product Knowledge", rating: 0, rationale: "" },
    { category: "Relationship Building", rating: 0, rationale: "" },
    { category: "Selling Skills", rating: 0, rationale: "" },
  ];
  const emptyInsights = [
    { title: "What they liked", summary: "", detail: "" },
    { title: "What they didn't like", summary: "", detail: "" },
    { title: "What they want more of", summary: "", detail: "" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="w-full bg-white shadow-sm py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-4">
          <div className="text-xl font-bold tracking-tight text-blue-700">Retail Intelligence</div>
          <div className="text-gray-500 text-sm">v1.0</div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center py-8 px-2">
        <div className="w-full max-w-7xl flex flex-col md:flex-row gap-8 md:gap-4 items-start">
          {/* Audio Upload Section */}
          <section className="w-full md:w-1/3 flex flex-col items-center mb-8 md:mb-0">
            <div className="w-full max-w-md">
              <div className="text-lg font-semibold mb-4 text-center">Audio Upload & Analysis</div>
              <div
                className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center bg-white transition-colors duration-200 ${error ? "border-red-400" : "border-gray-300"}`}
                style={{ cursor: "pointer", minHeight: 220 }}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => inputRef.current && inputRef.current.click()}
              >
                <input
                  type="file"
                  accept=".mp3,.wav"
                  ref={inputRef}
                  className="hidden"
                  onChange={handleChange}
                />
                <FaUpload
                  className={`text-3xl mb-4 text-blue-500 transition-transform duration-500 ${uploading ? "animate-spin-slow" : ""}`}
                  style={{ minHeight: 32 }}
                />
                <span className="text-lg font-semibold mb-2">Upload an audio file</span>
                <span className="text-gray-500 mb-4 text-center">Drag & drop or click to select a .mp3 or .wav file</span>
                <div style={{ minHeight: 24, width: "100%" }}>
                  {file && <div className="mb-2 text-blue-600">Selected: {file.name}</div>}
                  {error && <div className="text-red-500 mb-2">{error}</div>}
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUpload();
                  }}
                  disabled={!file || uploading}
                  className="mt-2"
                >
                  {uploading ? "Uploading..." : "Upload"}
                </Button>
                {uploading && (
                  <div className="w-full mt-4">
                    <Progress value={progress} />
                  </div>
                )}
              </div>
              {/* Status Boxes */}
              {result && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 w-full max-w-md">
                  <div className="relative rounded-xl p-6 shadow-md border-2 border-yellow-400 bg-yellow-50 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-center">
                    <div className="font-semibold">{result.audioAnalysis.backgroundMusic.message}</div>
                  </div>
                  <div className="relative rounded-xl p-6 shadow-md border-2 border-blue-400 bg-blue-50 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-center">
                    <div className="font-semibold">{result.audioAnalysis.multipleSpeakers.message}</div>
                  </div>
                  <div className="relative rounded-xl p-6 shadow-md border-2 border-green-400 bg-green-50 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg text-center">
                    <div className="font-semibold">{result.audioAnalysis.audioQuality.message}</div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Staff Performance Evaluation */}
          <section className={`w-full md:w-1/3 flex flex-col items-center mb-8 md:mb-0 ${!result ? 'pointer-events-none opacity-50 grayscale' : ''}`}>
            <div className="w-full max-w-md">
              <div className="text-lg font-semibold mb-4 text-center">Staff Performance Evaluation</div>
              <TooltipProvider delayDuration={300} skipDelayDuration={0}>
                <div className="grid gap-6 mt-4">
                  {(result ? result.staffPerformance : emptyStaff).map((perf, idx) => {
                    // SVG icons for each skill
                    const icons = [
                      (
                        <svg className="w-6 h-6 mr-3 opacity-70" fill="currentColor" viewBox="0 0 20 20" key="icon1">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ),
                      (
                        <svg className="w-6 h-6 mr-3 opacity-70" fill="currentColor" viewBox="0 0 20 20" key="icon2">
                          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                          <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                        </svg>
                      ),
                      (
                        <svg className="w-6 h-6 mr-3 opacity-70" fill="currentColor" viewBox="0 0 20 20" key="icon3">
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                      ),
                    ];
                    // Card/progress colors
                    const cardColors = [
                      'border-yellow-400 bg-yellow-50',
                      'border-blue-400 bg-blue-50',
                      'border-green-400 bg-green-50',
                    ];
                    const progressColors = [
                      'bg-gradient-to-r from-yellow-300 to-yellow-400',
                      'bg-gradient-to-r from-blue-300 to-blue-400',
                      'bg-gradient-to-r from-green-300 to-green-400',
                    ];
                    // Calculate progress bar width
                    const progress = Math.round((perf.rating / 5) * 100);
                    return (
                      <Tooltip key={perf.category}>
                        <TooltipTrigger asChild>
                          <div
                            className={`relative rounded-xl p-6 shadow-md border-2 ${cardColors[idx]} overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer`}
                            style={{ animation: `fadeInUp 0.6s ease-out`, animationDelay: `${0.1 + idx * 0.1}s`, animationFillMode: 'both' }}
                          >
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center text-lg font-semibold text-gray-800">
                                {icons[idx]}
                                {perf.category}
                              </div>
                            </div>
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <span
                                    key={i}
                                    className={`text-2xl mr-1 transition-all ${i < perf.rating ? 'text-yellow-400 drop-shadow' : 'text-gray-300'}`}
                                    style={{ filter: i < perf.rating ? 'drop-shadow(0 2px 4px rgba(255,215,0,0.3))' : undefined }}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <div className="text-base font-semibold text-indigo-500 bg-indigo-100 px-3 py-1 rounded-full">{perf.rating}/5</div>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded mt-2 mb-2 overflow-hidden">
                              <div
                                className={`h-full rounded transition-all duration-700 ${progressColors[idx]}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </TooltipTrigger>
                        {perf.rationale && (
                          <TooltipContent side="bottom" className="max-w-xs text-sm bg-white text-black border border-gray-200 shadow-lg">
                            <div className="font-semibold text-black mb-1 text-sm">Assessment Notes</div>
                            <pre className="text-black text-xs whitespace-pre-wrap">{perf.rationale}</pre>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </div>
              </TooltipProvider>
              {/* Overall Score (only show when result exists) */}
              {result && (
                <div className="text-center mt-10 p-6 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg">
                  <div className="text-xl font-semibold mb-2">Overall Performance</div>
                  <div className="text-4xl font-bold mb-2">
                    {(() => {
                      const staff = result.staffPerformance;
                      const avg = staff.reduce((sum, s) => sum + (s.rating || 0), 0) / staff.length;
                      return avg.toFixed(1) + "/5";
                    })()}
                  </div>
                  <div className="text-base">Above Average Performance - Strong foundation with room for growth</div>
                </div>
              )}
            </div>
          </section>

          {/* Customer Insights */}
          <section className={`w-full md:w-1/3 flex flex-col items-center ${!result ? 'pointer-events-none opacity-50 grayscale' : ''}`}>
            <div className="w-full max-w-md">
              <div className="text-lg font-semibold mb-4 text-center">Customer Insights</div>
              <TooltipProvider delayDuration={300} skipDelayDuration={0}>
                <div className="grid gap-6 mt-4">
                  {(result ? result.customerInsights : emptyInsights).map((insight, idx) => {
                    // SVG icons for each insight
                    const icons = [
                      // Heart/thumbs-up for 'What they liked'
                      (
                        <svg className="w-6 h-6 mr-3 opacity-70 text-pink-400" fill="currentColor" viewBox="0 0 20 20" key="icon1">
                          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
                        </svg>
                      ),
                      // Thumbs-down for 'What they didn\'t like'
                      (
                        <svg className="w-6 h-6 mr-3 opacity-70 text-red-400" fill="currentColor" viewBox="0 0 20 20" key="icon2">
                          <path d="M10.293 15.707a1 1 0 001.414 0l5-5A1 1 0 0016 9H7.414l.293-.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L7.414 11H16a1 1 0 00.707-1.707l-5-5a1 1 0 00-1.414 1.414L13.586 9H4a1 1 0 100 2h9.586l-3.293 3.293a1 1 0 000 1.414z" />
                        </svg>
                      ),
                      // Lightbulb/idea for 'What they want more of'
                      (
                        <svg className="w-6 h-6 mr-3 opacity-70 text-purple-400" fill="currentColor" viewBox="0 0 20 20" key="icon3">
                          <path d="M11 3a1 1 0 10-2 0 7 7 0 00-3.29 13.32c.2.09.29.32.21.52A1.003 1.003 0 007 18h6a1 1 0 00.08-2.16c-.08-.2.01-.43.21-.52A7 7 0 0011 3zm-1 14a1 1 0 102 0h-2zm-2-2a1 1 0 112 0h-2zm6 0a1 1 0 11-2 0h2zm-3-2a5 5 0 115 5h-2a3 3 0 10-6 0H5a5 5 0 015-5z" />
                        </svg>
                      ),
                    ];
                    // Card/progress colors
                    const cardColors = [
                      'border-pink-400 bg-pink-50',
                      'border-cyan-400 bg-cyan-50',
                      'border-purple-400 bg-purple-50',
                    ];
                    const progressColors = [
                      'bg-gradient-to-r from-pink-300 to-pink-400',
                      'bg-gradient-to-r from-cyan-300 to-cyan-400',
                      'bg-gradient-to-r from-purple-300 to-purple-400',
                    ];
                    // Progress: use summary length as a proxy (max 100 chars = 100%)
                    const progress = Math.min(100, Math.round(((insight.summary?.length || 0) / 100) * 100));
                    return (
                      <Tooltip key={insight.title}>
                        <TooltipTrigger asChild>
                          <div
                            className={`relative rounded-xl p-6 shadow-md border-2 ${cardColors[idx]} overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer`}
                            style={{ animation: `fadeInUp 0.6s ease-out`, animationDelay: `${0.1 + idx * 0.1}s`, animationFillMode: 'both' }}
                          >
                            <div className="flex items-center text-lg font-semibold text-gray-800 mb-4">
                              {icons[idx]}
                              {insight.title}
                            </div>
                            <div className="text-gray-700 text-sm min-h-[32px] mb-4">{insight.summary || <span className="opacity-50">—</span>}</div>
                            <div className="w-full h-2 bg-gray-200 rounded mt-2 mb-2 overflow-hidden">
                              <div
                                className={`h-full rounded transition-all duration-700 ${progressColors[idx]}`}
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        </TooltipTrigger>
                        {insight.detail && (
                          <TooltipContent side="bottom" className="max-w-xs text-sm bg-white text-black border border-gray-200 shadow-lg">
                            <div className="font-semibold text-black mb-1 text-sm">Insight Rationale</div>
                            <pre className="text-black text-xs whitespace-pre-wrap">{insight.detail}</pre>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    );
                  })}
                </div>
              </TooltipProvider>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white shadow-inner py-4 px-8 flex items-center justify-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Retail Intelligence. All rights reserved.
      </footer>
    </div>
  );
}
