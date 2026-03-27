"use client";

import { useState, useRef } from "react";

export default function Home() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setResultImage(null);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleRemoveBackground = async () => {
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image_file", file);

      const response = await fetch(
        "https://bg-remover.minithing19811026.workers.dev",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove background");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultImage(url);
    } catch (error) {
      console.error(error);
      alert("Failed to remove background");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = "removed-background.png";
    link.click();
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResultImage(null);
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-fuchsia-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-fuchsia-500 rounded-lg flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="13.5" cy="6.5" r="0.5" fill="white" />
                  <circle cx="17.5" cy="10.5" r="0.5" fill="white" />
                  <circle cx="8.5" cy="7.5" r="0.5" fill="white" />
                  <circle cx="6.5" cy="12.5" r="0.5" fill="white" />
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                </svg>
              </div>
              <span className="font-bold text-gray-900 text-lg">
                Image Background Remover
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-500 bg-clip-text text-transparent mb-3">
              Remove Image Background
            </h1>
            <p className="text-gray-600 text-lg">
              Instantly remove backgrounds from images with one click, no signup
              required
            </p>
          </div>

          {/* Upload Area */}
          {!selectedImage ? (
            <div className="border-3 border-dashed border-gray-300 rounded-2xl p-12 text-center hover:border-purple-400 hover:bg-purple-50/50 transition-all cursor-pointer"
                 onClick={() => fileInputRef.current?.click()}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-fuchsia-100 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-600"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" x2="12" y1="3" y2="15" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Upload an image to remove background
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Drag and drop or click to browse
                  </p>
                  <p className="text-sm text-gray-400">
                    Supports JPG, PNG, and WEBP up to 10MB
                  </p>
                </div>
                <button className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                  Choose Image
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Preview */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3 text-center">
                    Original
                  </h3>
                  <img
                    src={selectedImage}
                    alt="Original"
                    className="w-full rounded-lg"
                  />
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3 text-center">
                    Result
                  </h3>
                  {resultImage ? (
                    <img
                      src={resultImage}
                      alt="Result"
                      className="w-full rounded-lg"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      {loading ? (
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
                          <p className="text-gray-500">Processing...</p>
                        </div>
                      ) : (
                        <p className="text-gray-400">Click to process</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-center gap-4">
                {!resultImage ? (
                  <button
                    onClick={handleRemoveBackground}
                    disabled={loading}
                    className="bg-gradient-to-r from-purple-600 to-fuchsia-500 text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {loading ? "Processing..." : "Remove Background"}
                  </button>
                ) : (
                  <button
                    onClick={handleDownload}
                    className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                  >
                    Download
                  </button>
                )}
                <button
                  onClick={handleReset}
                  className="bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  Upload New
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          © 2026 Image Background Remover. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
