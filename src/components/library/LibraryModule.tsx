import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  BookMarked, 
  CheckCircle2, 
  AlertTriangle, 
  RotateCcw, 
  Plus, 
  Clock, 
  Sparkles,
  X
} from 'lucide-react';
import { Book, BorrowRecord, Student, User } from '../../types/campus';
import { apiClient } from '../../services/apiClient';

interface LibraryModuleProps {
  currentUser: User;
  currentStudent: Student;
}

export function LibraryModule({ currentUser, currentStudent }: LibraryModuleProps) {
  const [books, setBooks] = useState<Book[]>([]);
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBookForIssue, setSelectedBookForIssue] = useState<Book | null>(null);

  useEffect(() => {
    loadLibrary();
  }, []);

  const loadLibrary = async () => {
    try {
      const res = await apiClient.getLibrary();
      setBooks(res.books);
      setBorrows(res.borrows);
    } catch (err) {
      console.error(err);
    }
  };

  const handleIssueBook = async (book: Book) => {
    try {
      await apiClient.issueBook(book.id, currentStudent.studentId, currentStudent.name);
      loadLibrary();
      alert(`"${book.title}" successfully checked out! Due in 21 days.`);
    } catch (err: any) {
      alert(err.message || 'Issue failed');
    }
  };

  const handleReturnBook = async (borrowId: string) => {
    try {
      await apiClient.returnBook(borrowId);
      loadLibrary();
      alert('Book checked back in successfully.');
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ['All', 'Computer Science', 'Artificial Intelligence', 'Distributed Systems', 'Software Engineering', 'Theoretical CS'];

  const filteredBooks = books.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) || 
      b.author.toLowerCase().includes(search.toLowerCase()) || 
      b.isbn.includes(search);
    const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-medium">
            <span>Alexandria Commons</span>
            <span aria-hidden="true">·</span>
            <span>Digital Library & Research Stacks</span>
            <span aria-hidden="true">·</span>
            <span>Circulation Ledger</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white mt-1">Digital Library Management</h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Search physical and digital volumes, check out technical references, and track overdue loan schedules.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by title, author, or ISBN..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Active Loans Strip (if any) */}
      {borrows.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <BookMarked className="w-4 h-4" />
            Current University Borrowing Records ({borrows.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {borrows.map(b => (
              <div 
                key={b.id} 
                className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-white truncate max-w-xs">{b.bookTitle}</div>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Borrower: {b.studentName} · Due: {b.dueDate}
                  </div>
                  {b.fineAmount > 0 && (
                    <span className="text-[10px] text-rose-400 font-bold block mt-1 font-mono">
                      Overdue Fine: ${b.fineAmount.toFixed(2)} USD
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    b.status === 'borrowed' 
                      ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' 
                      : 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                  }`}>
                    {b.status}
                  </span>

                  {(currentUser.role === 'librarian' || currentUser.role === 'admin' || b.studentId === currentStudent.studentId) && (
                    <button
                      onClick={() => handleReturnBook(b.id)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium"
                    >
                      Return
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Book Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBooks.map(book => (
          <div
            key={book.id}
            className="bg-slate-900/60 border border-slate-800 hover:border-purple-500/50 rounded-2xl p-6 space-y-4 transition-all shadow-md flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-purple-400">{book.category}</span>
                <span className="text-[11px] text-slate-500 font-mono">{book.shelfLocation}</span>
              </div>

              <h4 className="text-sm font-bold text-white">{book.title}</h4>
              <p className="text-xs text-slate-400">By {book.author}</p>
              <div className="text-[11px] text-slate-500 font-mono">ISBN: {book.isbn}</div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300">
                Copies: <strong className={book.availableCopies > 0 ? 'text-emerald-400' : 'text-rose-400'}>
                  {book.availableCopies}
                </strong> / {book.totalCopies} Available
              </span>

              <button
                onClick={() => handleIssueBook(book)}
                disabled={book.availableCopies <= 0}
                className="px-3 py-1.5 text-xs font-semibold bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white rounded-lg shadow-sm transition-colors"
              >
                {book.availableCopies > 0 ? 'Check Out' : 'Waitlist'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
