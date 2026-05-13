import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { BookOpen, ChevronRight, Menu, X, FileText } from 'lucide-react';

export default function Guides() {
  const [categories, setCategories] = useState([]);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://hackathon-backend-oac5tmduna-uc.a.run.app';

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/guides/categories/`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        setCategories(data);
        if (data.length > 0 && data[0].guides && data[0].guides.length > 0) {
          setSelectedGuide(data[0].guides[0]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [API_BASE_URL]);

  const handleSelectGuide = (guide) => {
    setSelectedGuide(guide);
    setSidebarOpen(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 pt-20 pb-6 px-6 bg-slate-50 border-r border-slate-200 
        w-80 overflow-y-auto transform transition-transform duration-300 ease-in-out z-40
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:h-full lg:pt-8
      `}>
        <div className="flex items-center gap-2 mb-8 text-blue-600">
          <BookOpen className="h-6 w-6" />
          <h2 className="text-xl font-bold text-slate-800">Documentation</h2>
        </div>

        {categories.length === 0 ? (
          <p className="text-slate-500 text-sm">No guides available yet.</p>
        ) : (
          <nav className="space-y-6">
            {categories.map(category => (
              <div key={category.id}>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  {category.name}
                </h3>
                <ul className="space-y-1">
                  {category.guides && category.guides.length > 0 ? (
                    category.guides.map(guide => (
                      <li key={guide.id}>
                        <button
                          onClick={() => handleSelectGuide(guide)}
                          className={`
                            w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-left
                            ${selectedGuide?.id === guide.id 
                              ? 'bg-blue-50 text-blue-700 font-medium' 
                              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                          `}
                        >
                          <FileText className={`h-4 w-4 ${selectedGuide?.id === guide.id ? 'text-blue-500' : 'text-slate-400'}`} />
                          <span className="truncate">{guide.title}</span>
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="px-3 py-2 text-sm text-slate-400 italic">No guides</li>
                  )}
                </ul>
              </div>
            ))}
          </nav>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto bg-white pt-24 lg:pt-12 px-6 lg:px-12 pb-24">
        <div className="max-w-3xl mx-auto">
          {selectedGuide ? (
            <article>
              <div className="mb-8">
                <div className="flex items-center text-sm text-slate-500 mb-4">
                  <span>{selectedGuide.category_name}</span>
                  <ChevronRight className="h-4 w-4 mx-2" />
                  <span className="font-medium text-slate-900">{selectedGuide.title}</span>
                </div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
                  {selectedGuide.title}
                </h1>
                <p className="text-slate-500 text-sm">Last updated: {new Date(selectedGuide.updated_at).toLocaleDateString()}</p>
              </div>

              <div className="prose prose-blue max-w-none prose-headings:font-bold prose-a:text-blue-600 hover:prose-a:text-blue-500 prose-img:rounded-xl">
                <ReactMarkdown>{selectedGuide.content}</ReactMarkdown>
              </div>
            </article>
          ) : (
            <div className="text-center mt-20">
              <BookOpen className="h-16 w-16 text-slate-200 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-slate-700 mb-2">Welcome to Guides</h2>
              <p className="text-slate-500">Select a guide from the sidebar to start reading.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
