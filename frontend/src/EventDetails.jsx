import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Clock, MessageSquare, Trophy, FileText, Send } from 'lucide-react';

export default function EventDetails({ activeEvent, user, token }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [discussions, setDiscussions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (!activeEvent) return;
    
    if (activeTab === 'discussion') {
      fetchDiscussions();
    } else if (activeTab === 'leaderboard') {
      fetchLeaderboard();
    }
  }, [activeTab, activeEvent]);

  const fetchDiscussions = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${activeEvent.id}/discussions/`);
      if (res.ok) {
        const data = await res.json();
        setDiscussions(data);
      }
    } catch (err) {
      console.error("Failed to fetch discussions", err);
    }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${activeEvent.id}/leaderboard/`);
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data);
      }
    } catch (err) {
      console.error("Failed to fetch leaderboard", err);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please sign in to post a message.");
      return;
    }
    if (!newPostContent.trim()) return;

    setIsPosting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/events/${activeEvent.id}/discussions/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ content: newPostContent })
      });
      if (res.ok) {
        setNewPostContent('');
        fetchDiscussions();
      } else {
        alert("Failed to post message.");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setIsPosting(false);
    }
  };

  if (!activeEvent) return null;

  return (
    <section className="py-16 bg-white border-y border-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tabs Navigation */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'overview' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            <Clock className="h-4 w-4" /> Overview
          </button>
          <button
            onClick={() => setActiveTab('discussion')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'discussion' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            <MessageSquare className="h-4 w-4" /> Discussion
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'leaderboard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
          >
            <Trophy className="h-4 w-4" /> Leaderboard
          </button>
          {activeEvent.rules && (
            <button
              onClick={() => setActiveTab('rules')}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${activeTab === 'rules' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
            >
              <FileText className="h-4 w-4" /> Rules
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8 transition-opacity duration-300">
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200">
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Event Description</h3>
                <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {activeEvent.description || "No description provided."}
                </p>
              </div>

              {activeEvent.judging_date && (
                <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Timeline Progress</h3>
                  <div className="flex justify-between text-sm text-slate-500 mb-2">
                    <span>Kickoff: {new Date(activeEvent.created_at).toLocaleDateString()}</span>
                    <span>Judging: {new Date(activeEvent.judging_date).toLocaleDateString()}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-4 mb-2 overflow-hidden">
                    <div 
                      className="bg-blue-600 h-4 rounded-full transition-all duration-1000 ease-out" 
                      style={{ width: `${Math.min(Math.max(activeEvent.timeline_progress || 0, 0), 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-right text-xs font-semibold text-blue-600">
                    {Math.round(Math.min(Math.max(activeEvent.timeline_progress || 0, 0), 100))}% Complete
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Discussion Tab */}
          {activeTab === 'discussion' && (
            <div className="flex flex-col h-[500px] transition-opacity duration-300">
              <div className="flex-1 overflow-y-auto mb-6 space-y-4 pr-2">
                {discussions.length === 0 ? (
                  <div className="text-center text-slate-500 py-10 bg-slate-50 rounded-xl border border-slate-200">
                    <MessageSquare className="h-10 w-10 mx-auto mb-3 text-slate-300" />
                    <p>No discussions yet. Be the first to start!</p>
                  </div>
                ) : (
                  discussions.map(post => (
                    <div key={post.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-slate-800">{post.user?.username || 'Unknown'}</span>
                        <span className="text-xs text-slate-400">{new Date(post.timestamp).toLocaleString()}</span>
                      </div>
                      <p className="text-slate-600 text-sm whitespace-pre-wrap">{post.content}</p>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handlePostSubmit} className="mt-auto relative">
                <textarea
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-16 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 resize-none transition-all"
                  rows="3"
                  placeholder="Share ideas, ask for teammates, or discuss the event..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  disabled={isPosting}
                ></textarea>
                <button 
                  type="submit" 
                  disabled={isPosting || !newPostContent.trim()}
                  className="absolute bottom-3 right-3 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === 'leaderboard' && (
            <div className="transition-opacity duration-300">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-sm font-semibold text-slate-600 uppercase tracking-wider">
                        <th className="p-4 pl-6">Rank</th>
                        <th className="p-4">Participant</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-6 text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {leaderboard.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-slate-500">No participants yet.</td>
                        </tr>
                      ) : (
                        leaderboard.map((reg, index) => (
                          <tr key={reg.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 pl-6">
                              <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full font-bold text-sm ${index === 0 ? 'bg-yellow-100 text-yellow-700' : index === 1 ? 'bg-slate-200 text-slate-700' : index === 2 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'}`}>
                                {index + 1}
                              </span>
                            </td>
                            <td className="p-4 font-medium text-slate-800">{reg.user?.username || `User #${reg.user}`}</td>
                            <td className="p-4 text-sm text-slate-600">{reg.role || 'Participant'}</td>
                            <td className="p-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {reg.progress_status}
                              </span>
                            </td>
                            <td className="p-4 pr-6 text-right font-bold text-slate-800">{reg.score}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Rules Tab */}
          {activeTab === 'rules' && activeEvent.rules && (
            <div className="transition-opacity duration-300">
              <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
                <div className="prose-custom max-w-none text-slate-700 text-left">
                  <ReactMarkdown>{activeEvent.rules}</ReactMarkdown>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
}
