'use client';

import { useState, useEffect } from 'react';

interface Voter {
  serial_no?: string;
  house_no?: string;
  name?: string;
  relation?: string;
  relation_name?: string;
  gender?: string;
  age?: string;
  epic_no?: string;
  page?: number;
  constituency_number?: string;
  part_number?: string;
}

export default function Home() {
  const [epicQuery, setEpicQuery] = useState('');
  const [houseQuery, setHouseQuery] = useState('');
  const [results, setResults] = useState<Voter[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const limit = 50;
  const [searches, setSearches] = useState(0);

useEffect(() => {
  const load = async () => {
    const res = await fetch("/api/stats");
    const data = await res.json();
    setSearches(data.searches);
  };

  load();

  const interval = setInterval(load, 5000);

  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (epicQuery.trim() === '' && houseQuery.trim() === '') {
        setResults([]);
        setTotal(0);
        setTotalPages(0);
        setPage(1);
        return;
      }

      setPage(1);
      fetchResults(epicQuery, houseQuery, 1);
    }, 300);

    return () => clearTimeout(timer);
  }, [epicQuery, houseQuery]);

  useEffect(() => {
    if (epicQuery.trim() !== '' || houseQuery.trim() !== '') {
      fetchResults(epicQuery, houseQuery, page);
    }
  }, [page]);

  const fetchResults = async (
    epic: string,
    house: string,
    pageNum: number
  ) => {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/search?epic=${encodeURIComponent(epic)}&house=${encodeURIComponent(house)}&page=${pageNum}&limit=${limit}`
      );

      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();

      setResults(data.results || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const isFemale = (gender?: string) => {
    const g = (gender || "").trim().toLowerCase();

    return (
      g === "స్త్రీ" ||
      g === "ఆడ" ||
      g === "female" ||
      g === "f" ||
      g === "ీ"
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50 p-6 md:p-10">
      
        {/* Glass container */}
        <a
          href="https://www.linkedin.com/in/a-kashif-ahmed/"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-6 z-50 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 backdrop-blur px-4 py-2 text-sm font-medium text-gray-700 shadow-md transition-all hover:border-blue-300 hover:text-blue-600 hover:shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M20.447 20.452H16.89v-5.569c0-1.328-.026-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.347V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.604 0 4.268 2.372 4.268 5.456v6.285zM5.337 7.433a2.063 2.063 0 110-4.126 2.063 2.063 0 010 4.126zM7.119 20.452H3.555V9h3.564v11.452z" />
          </svg>

          <span>Developer</span>
        </a>
        <div className="flex gap-3">



          <span className="absolute top-4 left-6 z-50 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 backdrop-blur px-4 py-2 text-sm font-medium text-gray-700 shadow-md transition-all hover:border-blue-300 hover:text-blue-600 hover:shadow-lg">
            Total Searches {searches}
          </span>

        </div>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              2002 Adoni S.I.R Voter Search
            </h1>
            <p className="text-gray-500 mt-2 text-lg">
              Search by voter ID (EPIC) or door number
            </p>
          </div>

          {/* Search Bar - Glass effect */}
          <div className="max-w-5xl mx-auto mb-10">

            <div className="grid md:grid-cols-2 gap-4">

              <input
                type="text"
                placeholder="Search EPIC"
                value={epicQuery}
                onChange={(e) => setEpicQuery(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-cyan-500 outline-none"
              />

              <input
                type="text"
                placeholder=" Search House No"
                value={houseQuery}
                onChange={(e) => setHouseQuery(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />

            </div>

            <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

              {/* Color Legend */}
              <div className="flex flex-wrap items-center gap-4 text-sm">

                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-white border border-gray-300"></span>
                  <span className="text-gray-700">Male</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded bg-pink-100 border border-pink-300"></span>
                  <span className="text-gray-700">Female</span>
                </div>

              </div>

              {/* Result Count */}
              <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 backdrop-blur px-4 py-2 text-sm font-medium text-gray-700 shadow-md transition-all hover:border-blue-300 hover:text-blue-600 hover:shadow-lg">
                {total.toLocaleString()} Found
              </span>

            </div>

          </div>

          {/* Loading state */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="ml-3 text-blue-600 font-medium">Searching...</span>
            </div>
          )}

          {/* Results Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((voter, idx) => {
              const female = isFemale(voter.gender);

              return (
                <div
                  key={idx}
                  className={`
    rounded-2xl
    border
    p-6
    shadow-sm
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-lg

    ${female ? "bg-pink-50 border-pink-200 hover:border-pink-300"
                      : "bg-white border-gray-200 hover:border-blue-300"
                    }
  `}
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xl font-semibold text-gray-800 tracking-tight">
                      {voter.name || ' '}
                    </span>
                    <span className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                      {voter.epic_no || 'No EPIC'}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">H.No: {voter.house_no || 'N/A'}</span>

                    <span className="flex items-center gap-1">Age :{voter.age || 'N/A'}</span>
                  </div>
                  <div className="border-t border-gray-200/50 pt-3 text-xs text-gray-400 flex flex-col gap-1">
                    <span>Constituency: {voter.constituency_number || 'N/A'}</span>
                    <span>Part: {voter.part_number || 'N/A'}</span>
                    <span>Serial No. {voter.serial_no || 'N/A'}</span>
                    <span>Page: {voter.page || 'N/A'}</span>
                  </div>
                </div>
              );
            })}
            {!loading &&
(epicQuery || houseQuery) &&
results.length === 0 && (
              <div className="col-span-full text-center py-16">
                <p className="text-gray-400 text-lg">No voters found. Try a different search.</p>
              </div>
            )}
          </div>

          {/* Pagination - Glass */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-6 mt-12 py-4 px-6 bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30 max-w-md mx-auto">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="px-5 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-700 font-medium shadow-sm hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <span className="text-gray-600 font-medium">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="px-5 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-700 font-medium shadow-sm hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>
    
  );
}