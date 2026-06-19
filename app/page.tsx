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
      const res = await fetch('/api/stats');
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

  const fetchResults = async (epic: string, house: string, pageNum: number) => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/search?epic=${encodeURIComponent(epic)}&house=${encodeURIComponent(house)}&page=${pageNum}&limit=${limit}`
      );
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data.results || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } finally {
      setLoading(false);
    }
  };

  const goToPage = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const isFemale = (gender?: string) => {
    const g = (gender || '').trim().toLowerCase();
    return g === 'స్త్రీ' || g === 'ఆడ' || g === 'female' || g === 'f' || g === 'ీ';
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/50">

      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur border-b border-gray-100 shadow-sm">
        <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-600">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
          {searches.toLocaleString()} searches
        </span>

        <a
          href="https://www.linkedin.com/in/a-kashif-ahmed/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20.447 20.452H16.89v-5.569c0-1.328-.026-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.347V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.604 0 4.268 2.372 4.268 5.456v6.285zM5.337 7.433a2.063 2.063 0 110-4.126 2.063 2.063 0 010 4.126zM7.119 20.452H3.555V9h3.564v11.452z" />
          </svg>
          Developer
        </a>
      </div>

      {/* Page content */}
      <div className="pt-20 pb-16 px-6 md:px-10">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10 mt-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-teal-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">
              2002 Adoni S.I.R
            </h1>
            <p className="text-lg font-medium text-gray-400 mt-1 tracking-wide">Voter Search</p>
            <p className="text-sm text-gray-400 mt-1">Search by voter ID (EPIC) or door number</p>
          </div>

          {/* Search inputs */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search EPIC number"
                  value={epicQuery}
                  onChange={(e) => setEpicQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm shadow-sm focus:ring-2 focus:ring-teal-400 focus:border-teal-400 outline-none transition placeholder:text-gray-400"
                />
              </div>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search house number"
                  value={houseQuery}
                  onChange={(e) => setHouseQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm shadow-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none transition placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Legend + count row */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-white border border-gray-300 inline-block"></span>
                  Male
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-pink-100 border border-pink-300 inline-block"></span>
                  Female
                </span>
              </div>
              {total > 0 && (
                <span className="text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
                  {total.toLocaleString()} found
                </span>
              )}
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-12 gap-3">
              <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-teal-600 font-medium">Searching...</span>
            </div>
          )}

          {/* Results grid */}
          {!loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {results.map((voter, idx) => {
                const female = isFemale(voter.gender);
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
                      ${female
                        ? 'bg-pink-50/80 border-pink-200 hover:border-pink-300'
                        : 'bg-white border-gray-200 hover:border-blue-200'
                      }`}
                  >
                    {/* EPIC + name */}
                    <div className="mb-3">
                      <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full tracking-wide
                        ${female
                          ? 'bg-pink-100 text-pink-800'
                          : 'bg-teal-50 text-teal-800'
                        }`}>
                        {voter.epic_no || 'No EPIC'}
                      </span>
                      <p className="text-xs text-gray-400 mt-1.5 truncate leading-snug" title={voter.name}>
                        {voter.name || '—'}
                      </p>
                    </div>

                    {/* House + Age stats */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-gray-50 rounded-lg px-2.5 py-2">
                        <p className="text-[9px] uppercase tracking-wider text-gray-400 font-medium">House</p>
                        <p className="text-sm font-semibold text-gray-700 mt-0.5">{voter.house_no || '—'}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg px-2.5 py-2">
                        <p className="text-[9px] uppercase tracking-wider text-gray-400 font-medium">Age</p>
                        <p className="text-sm font-semibold text-gray-700 mt-0.5">{voter.age || '—'}</p>
                      </div>
                    </div>

                    {/* Meta footer */}
                    <div className="border-t border-gray-100 pt-2.5 grid grid-cols-2 gap-x-2 gap-y-1.5">
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-gray-400">Constituency</p>
                        <p className="text-[11px] text-gray-600 font-medium">{voter.constituency_number || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-gray-400">Part</p>
                        <p className="text-[11px] text-gray-600 font-medium">{voter.part_number || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-gray-400">Serial</p>
                        <p className="text-[11px] text-gray-600 font-medium">{voter.serial_no || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] uppercase tracking-wider text-gray-400">Page</p>
                        <p className="text-[11px] text-gray-600 font-medium">{voter.page || '—'}</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {!loading && (epicQuery || houseQuery) && results.length === 0 && (
                <div className="col-span-full text-center py-20">
                  <p className="text-gray-300 text-4xl mb-3">🔍</p>
                  <p className="text-gray-500 font-medium">No voters found</p>
                  <p className="text-gray-400 text-sm mt-1">Try a different EPIC or house number</p>
                </div>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-12">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm text-gray-600 font-medium shadow-sm hover:border-gray-300 hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>
              <span className="text-sm text-gray-500 font-medium tabular-nums">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm text-gray-600 font-medium shadow-sm hover:border-gray-300 hover:shadow-md transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}