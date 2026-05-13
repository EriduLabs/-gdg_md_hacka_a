import React, { useState, useEffect } from 'react';
import { 
  Code2, 
  Terminal, 
  Zap, 
  Calendar, 
  ChevronRight, 
  Trophy, 
  Users, 
  Layers,
  X,
  Lightbulb,
  User as UserIcon,
  LogOut,
  Info,
  MessageSquare,
  List
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useGoogleLogin } from '@react-oauth/google';
import Guides from './Guides';
import EventDetails from './EventDetails';

const glowStyles = `
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .google-glow-wrapper {
    position: relative; overflow: hidden; border-radius: 1.5rem; padding: 2px; background: #e2e8f0;
  }
  .google-glow-wrapper::before {
    content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
    background: conic-gradient(from 180deg at 50% 50%, transparent 0deg, #4285F4 60deg, #EA4335 120deg, #FBBC05 180deg, #34A853 240deg, transparent 300deg);
    animation: rotate 4s linear infinite; z-index: 0;
  }
  .google-glow-inner {
    position: relative; background-color: #ffffff; border-radius: 1.4rem; z-index: 1; height: 100%; width: 100%;
  }
  
  .prose-custom h3, .prose-custom h4 { color: #1a73e8; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.5rem; }
  .prose-custom p, .prose-custom li { color: #3c4043; margin-bottom: 0.5rem; line-height: 1.6; }
  .prose-custom ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
  .prose-custom strong { color: #202124; }
`;

export default function App() {
  const [isHovered, setIsHovered] = useState(false);
  const [currentView, setCurrentView] = useState('home'); // 'home' | 'events'
  
  // App State
  const [activeEvent, setActiveEvent] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  
  // Auth State
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ username: '', password: '', email: '' });
  const [authError, setAuthError] = useState(null);

  // Hackathon Registration State
  const [isRegModalOpen, setIsRegModalOpen] = useState(false);
  const [regForm, setRegForm] = useState({ hasTeam: null, role: '', skills: '' });

  // Proposal Submission State
  const [isProposalOpen, setIsProposalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [proposalData, setProposalData] = useState({ proposed_title: '', problem_statement: '', target_audience: '', suggested_tools: '' });

  // Join Team State
  const [isJoinTeamOpen, setIsJoinTeamOpen] = useState(false);

  useEffect(() => {
    // Fetch Active Event
    fetch(import.meta.env.VITE_API_URL + '/api/event/active/')
      .then(res => res.ok ? res.json() : null)
      .then(data => setActiveEvent(data))
      .catch(console.error);

    // Fetch All Events
    fetch(import.meta.env.VITE_API_URL + '/api/events/')
      .then(res => res.ok ? res.json() : [])
      .then(data => setAllEvents(data))
      .catch(console.error);

    // Fetch User
    if (token) {
      fetch(import.meta.env.VITE_API_URL + '/api/auth/me/', {
        headers: { 'Authorization': `Token ${token}` }
      })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data) setUser(data);
        else handleLogout();
      })
      .catch(() => handleLogout());
    }
  }, [token, currentView]);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    const endpoint = authMode === 'login' ? 'login/' : 'register/';
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(authForm)
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        setIsAuthOpen(false);
        setAuthForm({ username: '', password: '', email: '' });
      } else {
        setAuthError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setAuthError('Network error. Is the server running?');
    }
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await fetch(import.meta.env.VITE_API_URL + '/api/auth/google/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: tokenResponse.access_token })
        });
        const data = await res.json();
        if (res.ok) {
          // dj-rest-auth returns `key` for token by default
          const userToken = data.key || data.token; 
          setToken(userToken);
          localStorage.setItem('token', userToken);
          setIsAuthOpen(false);
          // Optional: trigger a fetch for user data
          if (data.user) setUser(data.user);
        } else {
          setAuthError('Google login failed on backend');
        }
      } catch (e) {
        setAuthError('Network error connecting to backend');
      }
    },
    onError: () => setAuthError('Google Login Failed')
  });

  const initiateRegistration = () => {
    if (!token) {
      setAuthMode('register');
      setIsAuthOpen(true);
      return;
    }
    if (!activeEvent) {
      alert("No active hackathon event found.");
      return;
    }
    setIsRegModalOpen(true);
  };

  const handleRegisterHackathon = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(import.meta.env.VITE_API_URL + '/api/register-hackathon/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ 
          status: 'Looking for Team', 
          event_id: activeEvent.id,
          role: regForm.role,
          skills: regForm.skills
        })
      });
      if (res.ok) {
        alert("Success! You're officially registered for " + activeEvent.title + "!");
        setIsRegModalOpen(false);
      } else {
        alert("You might already be registered for this event.");
      }
    } catch (e) {
      alert("Error connecting to server.");
    }
  };

  const initiateJoinTeam = () => {
    if (!token) {
      setAuthMode('register');
      setIsAuthOpen(true);
      return;
    }
    setIsJoinTeamOpen(true);
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    try {
      // Register them for the hackathon as a solo participant
      const regRes = await fetch(import.meta.env.VITE_API_URL + '/api/register-hackathon/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ 
          status: 'Looking for Team', 
          event_id: activeEvent.id,
          role: regForm.role,
          skills: regForm.skills
        })
      });

      if (!regRes.ok) {
        alert("You might already be registered for this event.");
        return;
      }

      alert("Successfully joined the hackathon as a Solo Participant! The admin will pair you with a team.");
      setIsJoinTeamOpen(false);
    } catch (e) {
      alert("Error sending join request.");
    }
  };

  const handleProposalSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setAuthMode('register');
      setIsAuthOpen(true);
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + '/api/submissions/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(proposalData),
      });

      if (response.ok) {
        setSubmitMessage({ type: 'success', text: "Proposal submitted successfully! The admin will review it." });
        setTimeout(() => {
          setIsProposalOpen(false);
          setProposalData({ proposed_title: '', problem_statement: '', target_audience: '', suggested_tools: '' });
          setSubmitMessage(null);
        }, 3000);
      } else {
        setSubmitMessage({ type: 'error', text: "Failed to submit proposal." });
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: "Cannot reach the server." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100">
      <style>{glowStyles}</style>

      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentView('home')}>
              <Zap className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-xl tracking-tight text-slate-800">Hacka-MD</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button onClick={() => setCurrentView('home')} className={`text-sm font-medium transition-colors ${currentView === 'home' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>Active Sprint</button>
              <button onClick={() => setCurrentView('events')} className={`text-sm font-medium transition-colors ${currentView === 'events' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>All Events</button>
              <button onClick={() => setCurrentView('guides')} className={`text-sm font-medium transition-colors ${currentView === 'guides' ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}>Guides & Docs</button>
              <button onClick={() => setIsProposalOpen(true)} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1"><Lightbulb className="h-4 w-4" /> Propose Hackathon</button>
            </div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <UserIcon className="h-4 w-4" /> {user.username}
                </span>
                <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Sign Out">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }} className="px-4 py-2 bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 rounded-full text-sm font-medium transition-all">
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {currentView === 'home' && (
        <>
          {/* Hero Section */}
          <main id="about" className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-[80vh] flex items-center">
            <div className="flex flex-col lg:flex-row items-center gap-16 w-full">
              
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span></span>
                  <span>{activeEvent ? "Registrations Open" : "Coming Soon"}</span>
                </div>
                
                {activeEvent ? (
                  <>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
                      {activeEvent.title.split(' ').map((word, i) => (
                        i === 1 ? <span key={i} className="text-blue-600">{word} </span> : <span key={i}>{word} </span>
                      ))}
                    </h1>
                  </>
                ) : (
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight text-slate-900">
                    Hacka-MD Events
                  </h1>
                )}
                
                <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Join our community-driven hackathons. Leverage vibe coding, generative AI, and Google-native tools to turn your abstract ideas into functional, user-ready products for the public good.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button onClick={initiateRegistration} className="px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 hover:shadow-md transition-all flex items-center justify-center gap-2">
                    Register Team <ChevronRight className="h-4 w-4" />
                  </button>
                  <button onClick={() => initiateJoinTeam()} className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-full font-bold hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                    Join as Solo
                  </button>
                </div>
              </div>

              <div className="flex-1 w-full max-w-md">
                {activeEvent ? (
                  <div className="google-glow-wrapper shadow-xl shadow-blue-900/5 transition-transform duration-500 ease-out" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={{ transform: isHovered ? 'translateY(-5px)' : 'translateY(0)' }}>
                    <div className="google-glow-inner p-8 flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100">
                        <Terminal className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2 text-slate-800">{activeEvent.title}</h3>
                      <p className="text-slate-500 mb-6 text-sm font-medium">Prize Pool: {activeEvent.prize_pool}</p>
                      
                      <div className="w-full space-y-4 text-slate-700">
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <span className="text-slate-500 text-sm flex items-center gap-2"><Calendar className="h-4 w-4 text-blue-500"/> Kickoff</span>
                          <span className="font-semibold text-sm">{activeEvent.kickoff_time}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <span className="text-slate-500 text-sm flex items-center gap-2"><Code2 className="h-4 w-4 text-green-500"/> Build Phase</span>
                          <span className="font-semibold text-sm">{activeEvent.build_duration}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-100">
                          <span className="text-slate-500 text-sm flex items-center gap-2"><Trophy className="h-4 w-4 text-yellow-500"/> Demos</span>
                          <span className="font-semibold text-sm">{activeEvent.demo_time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 flex flex-col items-center text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <Info className="h-12 w-12 text-blue-400 mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-slate-700">No Active Events</h3>
                    <p className="text-slate-500 text-sm">Check back later for upcoming hackathons.</p>
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Event Details Section */}
          <EventDetails activeEvent={activeEvent} user={user} token={token} />

          {/* Propose a Hackathon CTA Section */}
          <section id="submit" className="py-24 relative overflow-hidden bg-slate-50 border-b border-slate-200">
            <div className="absolute inset-0 bg-blue-50/50"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-blue-200/30 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
              <div className="inline-flex items-center justify-center p-4 bg-white text-blue-600 rounded-2xl mb-8 border border-slate-200 shadow-sm">
                <Lightbulb className="h-10 w-10" />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight text-slate-800">Have an Idea for a Hackathon?</h2>
              <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                Submit your proposal for a future Hacka-MD event. The admin team will review your proposal and might turn it into our next sprint!
              </p>
              <button onClick={() => setIsProposalOpen(true)} className="px-10 py-5 rounded-full bg-white border border-slate-200 text-blue-600 font-bold text-lg shadow-sm hover:shadow-md hover:border-blue-300 transition-all flex items-center justify-center gap-2 mx-auto">
                Propose Hackathon <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </section>
        </>
      )}

      {currentView === 'events' && (
        <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
          <div className="mb-10 border-b border-slate-200 pb-6 flex items-center gap-3">
            <List className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-800">All Hackathons</h1>
          </div>
          
          {allEvents.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-slate-500 text-lg">No hackathon events have been scheduled yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allEvents.map((evt) => (
                <div key={evt.id} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 hover:shadow-md hover:border-blue-300 transition-all flex flex-col h-full">
                  <div className="mb-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-3 ${evt.is_active ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-slate-100 text-slate-600 border border-slate-200'}`}>
                      {evt.is_active ? 'ACTIVE' : 'PAST EVENT'}
                    </span>
                    <h3 className="text-xl font-bold text-slate-800 leading-tight">{evt.title}</h3>
                  </div>
                  
                  <div className="space-y-3 mt-auto pt-6">
                    <div className="flex items-center text-sm text-slate-600">
                      <Trophy className="h-4 w-4 mr-2 text-yellow-500" /> {evt.prize_pool}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Calendar className="h-4 w-4 mr-2 text-blue-500" /> Kickoff: {evt.kickoff_time}
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                      <Code2 className="h-4 w-4 mr-2 text-green-500" /> Duration: {evt.build_duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {currentView === 'guides' && <Guides />}

      {/* Footer */}
      <footer className="py-12 bg-slate-50 border-t border-slate-200 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-500 mb-4">
          <Layers className="h-5 w-5 text-blue-500" />
          <span className="font-semibold text-slate-600">Powered by Django REST API & React</span>
        </div>
        <p className="text-slate-500 text-sm">© 2026 Hacka-MD. A Community Initiative.</p>
      </footer>

      {/* --- MODALS --- */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl">
            <button onClick={() => setIsAuthOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"><X className="h-6 w-6" /></button>
            <h2 className="text-2xl font-bold mb-2 text-slate-800">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-slate-500 text-sm mb-6">{authMode === 'login' ? "Sign in to access your dashboard." : "Join the hackathon community."}</p>
            {authError && <div className="mb-4 p-3 rounded-lg text-sm bg-red-50 text-red-600 border border-red-200">{authError}</div>}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input type="text" required className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" value={authForm.username} onChange={(e) => setAuthForm({...authForm, username: e.target.value})} />
              </div>
              {authMode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" required className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <input type="password" required className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-3 mt-4 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-white shadow-sm transition-colors">{authMode === 'login' ? 'Sign In' : 'Sign Up'}</button>
            </form>
            
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 border-slate-200"></span>
              <span className="text-xs text-center text-slate-500 uppercase">or</span>
              <span className="border-b w-1/5 border-slate-200"></span>
            </div>
            
            <button type="button" onClick={() => loginGoogle()} className="w-full mt-4 py-3 bg-white border border-slate-300 rounded-xl font-medium text-slate-700 hover:bg-slate-50 shadow-sm flex items-center justify-center gap-2 transition-colors">
              <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.20455C17.64 8.56636 17.5827 7.95273 17.4764 7.36364H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5614V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.20455Z" fill="#4285F4"/>
                <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5614C11.2418 14.1014 10.2109 14.4205 9 14.4205C6.65591 14.4205 4.67182 12.8373 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
                <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.59318 3.68182 9C3.68182 8.40682 3.78409 7.83 3.96409 7.29V4.95818H0.957275C0.347727 6.17318 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957275 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
                <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
              </svg>
              Sign in with Google
            </button>

            <div className="mt-6 text-center">
              <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Form Modal */}
      {isRegModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl">
            <button onClick={() => { setIsRegModalOpen(false); setRegForm({...regForm, hasTeam: null}); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"><X className="h-6 w-6" /></button>
            <h2 className="text-2xl font-bold mb-2 text-slate-800">Join {activeEvent?.title}</h2>
            
            {!regForm.hasTeam ? (
              <div className="space-y-6">
                <p className="text-slate-500 text-sm">To get started, tell us about your team status.</p>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-3">Do you already have a team?</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button type="button" onClick={() => setRegForm({...regForm, hasTeam: 'yes'})} className="py-3 bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 rounded-xl text-slate-700 font-medium transition-all shadow-sm">Yes, I have a team</button>
                    <button type="button" onClick={() => setRegForm({...regForm, hasTeam: 'no'})} className="py-3 bg-white border border-slate-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 rounded-xl text-slate-700 font-medium transition-all shadow-sm">No, I'm solo</button>
                  </div>
                </div>
              </div>
            ) : regForm.hasTeam === 'no' ? (
              <div className="mt-4 p-5 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-sm leading-relaxed text-center">
                <Users className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <p>Since you are joining as a solo participant, please use the <strong>"Join as Solo"</strong> button on the main page to officially enter the hackathon and be paired up by the Admin.</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterHackathon} className="space-y-4 mt-2">
                <p className="text-slate-500 text-sm mb-4">Great! Tell us a bit about yourself so the admin can verify your team status.</p>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Primary Role</label>
                  <select required className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" value={regForm.role} onChange={(e) => setRegForm({...regForm, role: e.target.value})}>
                    <option value="" disabled>Select a role...</option>
                    <option value="Developer">Developer</option>
                    <option value="Designer">Designer</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Domain Expert">Domain Expert</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Top Skills (comma separated)</label>
                  <input type="text" placeholder="e.g. React, Python, Figma" required className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" value={regForm.skills} onChange={(e) => setRegForm({...regForm, skills: e.target.value})} />
                </div>
                <button type="submit" className="w-full py-3 mt-4 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-white shadow-sm transition-colors">Complete Registration</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Propose Hackathon Modal */}
      {isProposalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto relative shadow-2xl">
            <button onClick={() => setIsProposalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"><X className="h-6 w-6" /></button>
            <h2 className="text-2xl font-bold mb-2 text-slate-800">Propose a Hackathon</h2>
            <p className="text-slate-500 text-sm mb-6">Pitch a complete idea for a future event to the admins.</p>
            {submitMessage && <div className={`mb-4 p-3 rounded-lg text-sm ${submitMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>{submitMessage.text}</div>}
            <form onSubmit={handleProposalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Proposed Title</label>
                <input type="text" required placeholder="e.g. The Climate AI Sprint" className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" value={proposalData.proposed_title} onChange={(e) => setProposalData({...proposalData, proposed_title: e.target.value})} disabled={isSubmitting} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Problem Statement</label>
                <textarea required rows="4" placeholder="What core problem will participants be trying to solve?" className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none resize-none transition-all" value={proposalData.problem_statement} onChange={(e) => setProposalData({...proposalData, problem_statement: e.target.value})} disabled={isSubmitting}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Target Audience</label>
                <input type="text" placeholder="e.g. Students, Open Source Devs" className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" value={proposalData.target_audience} onChange={(e) => setProposalData({...proposalData, target_audience: e.target.value})} disabled={isSubmitting} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Suggested Tools / Stack</label>
                <input type="text" placeholder="e.g. GCP, TensorFlow, React" className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" value={proposalData.suggested_tools} onChange={(e) => setProposalData({...proposalData, suggested_tools: e.target.value})} disabled={isSubmitting} />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-3 mt-4 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-white shadow-sm transition-colors disabled:opacity-50">
                {isSubmitting ? 'Submitting...' : 'Submit Proposal to Admin'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Join Team Informational Modal (Solo Registration) */}
      {isJoinTeamOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl">
            <button onClick={() => setIsJoinTeamOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"><X className="h-6 w-6" /></button>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2 text-slate-800"><MessageSquare className="h-6 w-6 text-blue-600" /> Join as Solo</h2>
            <p className="text-slate-500 text-sm mb-4 leading-relaxed">
              By using this feature, you are officially joining the hackathon as a solo participant. The Admin will review your skills and pair you up via the admin panel!
            </p>
            <form onSubmit={handleJoinTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Role</label>
                <select required className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" value={regForm.role} onChange={(e) => setRegForm({...regForm, role: e.target.value})}>
                  <option value="" disabled>Select your role...</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Top Skills (comma separated)</label>
                <input type="text" placeholder="e.g. React, Node, UI Design" required className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all" value={regForm.skills} onChange={(e) => setRegForm({...regForm, skills: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-3 mt-4 rounded-xl bg-blue-600 hover:bg-blue-700 font-semibold text-white shadow-sm transition-colors">Join Hackathon & Request Pairing</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}