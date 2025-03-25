"use client";

import { useState, FormEvent } from "react";
import Head from "next/head";

interface BarcodeInfo {
  imageData: string;
  filename: string;
  formattedIsbn: string;
}

export default function Home() {
  const [isbnData, setIsbnData] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [barcodeInfo, setBarcodeInfo] = useState<BarcodeInfo | null>(null);

  // Helper function to clean ISBN input
  const cleanIsbnInput = (input: string): string => {
    return input.replace(/[^\d-]/g, "");
  };

  // Function to validate ISBN format
  const isValidIsbn = (isbn: string): boolean => {
    const cleanIsbn = isbn.replace(/[-\s]/g, "");
    return /^978\d{10}$/.test(cleanIsbn);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setBarcodeInfo(null);

    try {
      const cleanIsbn = isbnData.replace(/[-\s]/g, "");

      // Validate input
      if (!isValidIsbn(isbnData)) {
        throw new Error(
          "Please enter a valid ISBN-13 that starts with 978 and contains 13 digits total"
        );
      }

      const response = await fetch(`/api/generate-barcode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isbnData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error generating barcode");
      }

      setBarcodeInfo(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // Function to handle direct download of barcode
  const handleDownload = () => {
    if (barcodeInfo) {
      const link = document.createElement("a");
      link.href = barcodeInfo.imageData;
      link.download = barcodeInfo.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Head>
        <title>Gerador de Código de Barras ISBN</title>
        <meta
          name="description"
          content="Gere e baixe códigos de barras ISBN"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-900">
                Gerador de Código de Barras ISBN
              </h1>
              <p className="mt-2 text-gray-600">
                Gere e baixe códigos de barras ISBN de alta qualidade (300 DPI)
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div>
                <label
                  htmlFor="isbnData"
                  className="block text-sm font-medium text-gray-700"
                >
                  Digite o ISBN-13 (deve começar com 978)
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="isbnData"
                    id="isbnData"
                    value={isbnData}
                    onChange={(e) =>
                      setIsbnData(cleanIsbnInput(e.target.value))
                    }
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-900 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                    placeholder="Exemplo: 978-3-16-148410-0"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Formato: 978-xx-xxxxx-xx-x (hífens são opcionais)
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {loading ? "Gerando..." : "Gerar Código de Barras ISBN"}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-4 text-red-600 text-center">
                <p>{error}</p>
              </div>
            )}

            {barcodeInfo && (
              <div className="mt-6 space-y-4">
                <div className="text-center">
                  <h2 className="text-lg font-medium text-gray-900">
                    Código de Barras ISBN Gerado!
                  </h2>
                  <p className="text-sm text-gray-600">
                    Código de barras em alta resolução (300 DPI) adequado para
                    impressão
                  </p>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-full overflow-auto max-h-60 border border-gray-200 rounded bg-white p-2">
                    <img
                      src={barcodeInfo.imageData}
                      alt={`Código de Barras ISBN: ${barcodeInfo.formattedIsbn}`}
                      className="max-w-full h-auto object-contain"
                    />
                  </div>
                  <p className="mt-2 text-gray-600 text-sm">
                    {barcodeInfo.formattedIsbn}
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleDownload}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Baixar Código de Barras em Alta Resolução
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
