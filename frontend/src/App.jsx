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

const glowStyles = `
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .google-glow-wrapper {
    position: relative; overflow: hidden; border-radius: 1.5rem; padding: 2px; background: #1e293b;
  }
  .google-glow-wrapper::before {
    content: ''; position: absolute; top: -50%; left: -50%; width: 200%; height: 200%;
    background: conic-gradient(from 180deg at 50% 50%, transparent 0deg, #4285F4 60deg, #EA4335 120deg, #FBBC05 180deg, #34A853 240deg, transparent 300deg);
    animation: rotate 4s linear infinite; z-index: 0;
  }
  .google-glow-inner {
    position: relative; background-color: #0f172a; border-radius: 1.4rem; z-index: 1; height: 100%; width: 100%;
  }
  
  .prose-custom h3, .prose-custom h4 { color: #60a5fa; font-weight: bold; margin-top: 1.5rem; margin-bottom: 0.5rem; }
  .prose-custom p, .prose-custom li { color: #cbd5e1; margin-bottom: 0.5rem; line-height: 1.6; }
  .prose-custom ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1rem; }
  .prose-custom strong { color: #f8fafc; }
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
    fetch('http://localhost:8000/api/event/active/')
      .then(res => res.ok ? res.json() : null)
      .then(data => setActiveEvent(data))
      .catch(console.error);

    // Fetch All Events
    fetch('http://localhost:8000/api/events/')
      .then(res => res.ok ? res.json() : [])
      .then(data => setAllEvents(data))
      .catch(console.error);

    // Fetch User
    if (token) {
      fetch('http://localhost:8000/api/auth/me/', {
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
      const res = await fetch(`http://localhost:8000/api/auth/${endpoint}`, {
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
      const res = await fetch('http://localhost:8000/api/register-hackathon/', {
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
      const regRes = await fetch('http://localhost:8000/api/register-hackathon/', {
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
      const response = await fetch('http://localhost:8000/api/submissions/', {
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
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-blue-500/30">
      <style>{glowStyles}</style>

      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setCurrentView('home')}>
              <Zap className="h-6 w-6 text-blue-400" />
              <span className="font-bold text-xl tracking-tight">Hacka-MD</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <button onClick={() => setCurrentView('home')} className={`text-sm font-medium transition-colors ${currentView === 'home' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>Active Sprint</button>
              <button onClick={() => setCurrentView('events')} className={`text-sm font-medium transition-colors ${currentView === 'events' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>All Events</button>
              <button onClick={() => setIsProposalOpen(true)} className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1"><Lightbulb className="h-4 w-4" /> Propose Hackathon</button>
            </div>
            
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-slate-400 flex items-center gap-2">
                  <UserIcon className="h-4 w-4" /> {user.username}
                </span>
                <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors" title="Sign Out">
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => { setAuthMode('login'); setIsAuthOpen(true); }} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-full text-sm font-medium transition-all">
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
                <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span></span>
                  <span>{activeEvent ? "Registrations Open" : "Coming Soon"}</span>
                </div>
                
                {activeEvent ? (
                  <>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                      {activeEvent.title.split(' ').map((word, i) => (
                        i === 1 ? <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">{word} </span> : <span key={i}>{word} </span>
                      ))}
                    </h1>
                  </>
                ) : (
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
                    Hacka-MD Events
                  </h1>
                )}
                
                <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  Join our community-driven hackathons. Leverage vibe coding, generative AI, and Google-native tools to turn your abstract ideas into functional, user-ready products for the public good.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button onClick={initiateRegistration} className="px-6 py-3 bg-white text-slate-900 rounded-full font-bold hover:scale-105 transition-transform flex items-center justify-center gap-2">
                    Register Team <ChevronRight className="h-4 w-4" />
                  </button>
                  <button onClick={() => initiateJoinTeam()} className="px-6 py-3 bg-blue-600 border border-blue-500 text-white rounded-full font-bold hover:bg-blue-500 transition-colors flex items-center justify-center gap-2">
                    Join as Solo
                  </button>
                </div>
              </div>

              <div className="flex-1 w-full max-w-md">
                {activeEvent ? (
                  <div className="google-glow-wrapper shadow-2xl shadow-blue-500/20 transition-transform duration-500 ease-out" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={{ transform: isHovered ? 'translateY(-5px)' : 'translateY(0)' }}>
                    <div className="google-glow-inner p-8 flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 border border-slate-700">
                        <Terminal className="h-8 w-8 text-blue-400" />
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{activeEvent.title}</h3>
                      <p className="text-slate-400 mb-6 text-sm">Prize Pool: {activeEvent.prize_pool}</p>
                      
                      <div className="w-full space-y-4">
                        <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                          <span className="text-slate-400 text-sm flex items-center gap-2"><Calendar className="h-4 w-4"/> Kickoff</span>
                          <span className="font-semibold text-sm">{activeEvent.kickoff_time}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                          <span className="text-slate-400 text-sm flex items-center gap-2"><Code2 className="h-4 w-4"/> Build Phase</span>
                          <span className="font-semibold text-sm">{activeEvent.build_duration}</span>
                        </div>
                        <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
                          <span className="text-slate-400 text-sm flex items-center gap-2"><Trophy className="h-4 w-4"/> Demos</span>
                          <span className="font-semibold text-sm">{activeEvent.demo_time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 flex flex-col items-center text-center bg-slate-800 rounded-2xl border border-slate-700">
                    <Info className="h-12 w-12 text-slate-500 mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-slate-400">No Active Events</h3>
                    <p className="text-slate-500 text-sm">Check back later for upcoming hackathons.</p>
                  </div>
                )}
              </div>
            </div>
          </main>

          {/* Rules Section (Dynamic from Admin) */}
          {activeEvent && activeEvent.rules && (
            <section id="schedule" className="py-20 bg-slate-800/30 border-y border-slate-800">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold mb-4">Event Rules & Guidelines</h2>
                  <p className="text-slate-400 max-w-2xl mx-auto">Posted by the Hackathon Admin.</p>
                </div>
                <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800">
                  <div className="prose-custom max-w-none">
                    <ReactMarkdown>{activeEvent.rules}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Propose a Hackathon CTA Section */}
          <section id="submit" className="py-24 relative overflow-hidden bg-slate-900 border-b border-slate-800">
            <div className="absolute inset-0 bg-blue-900/5"></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-full bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
            
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
              <div className="inline-flex items-center justify-center p-4 bg-slate-800 text-blue-400 rounded-2xl mb-8 border border-slate-700 shadow-lg">
                <Lightbulb className="h-10 w-10" />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Have an Idea for a Hackathon?</h2>
              <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                Submit your proposal for a future Hacka-MD event. The admin team will review your proposal and might turn it into our next sprint!
              </p>
              <button onClick={() => setIsProposalOpen(true)} className="px-10 py-5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 font-bold text-white text-lg shadow-xl shadow-blue-500/25 hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto">
                Propose Hackathon <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </section>
        </>
      )}

      {currentView === 'events' && (
        <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto min-h-screen">
          <div className="mb-10 border-b border-slate-800 pb-6 flex items-center gap-3">
            <List className="h-8 w-8 text-blue-400" />
            <h1 className="text-4xl font-extrabold tracking-tight">All Hackathons</h1>
          </div>
          
          {allEvents.length === 0 ? (
            <div className="text-center p-12 bg-slate-800/50 rounded-2xl border border-slate-700/50">
              <p className="text-slate-400 text-lg">No hackathon events have been scheduled yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allEvents.map((evt) => (
                <div key={evt.id} className="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:border-blue-500/50 transition-colors flex flex-col h-full">
                  <div className="mb-4">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-3 ${evt.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-slate-700 text-slate-300'}`}>
                      {evt.is_active ? 'ACTIVE' : 'PAST EVENT'}
                    </span>
                    <h3 className="text-xl font-bold text-white leading-tight">{evt.title}</h3>
                  </div>
                  
                  <div className="space-y-3 mt-auto pt-6">
                    <div className="flex items-center text-sm text-slate-400">
                      <Trophy className="h-4 w-4 mr-2 text-yellow-500/70" /> {evt.prize_pool}
                    </div>
                    <div className="flex items-center text-sm text-slate-400">
                      <Calendar className="h-4 w-4 mr-2 text-blue-400/70" /> Kickoff: {evt.kickoff_time}
                    </div>
                    <div className="flex items-center text-sm text-slate-400">
                      <Code2 className="h-4 w-4 mr-2 text-indigo-400/70" /> Duration: {evt.build_duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-center">
        <div className="flex items-center justify-center gap-2 text-slate-500 mb-4">
          <Layers className="h-5 w-5" />
          <span className="font-semibold">Powered by Django REST API & React</span>
        </div>
        <p className="text-slate-600 text-sm">© 2026 Hacka-MD. A Community Initiative.</p>
      </footer>

      {/* --- MODALS --- */}
      {isAuthOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl shadow-blue-900/20">
            <button onClick={() => setIsAuthOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"><X className="h-6 w-6" /></button>
            <h2 className="text-2xl font-bold mb-2">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            <p className="text-slate-400 text-sm mb-6">{authMode === 'login' ? "Sign in to access your dashboard." : "Join the hackathon community."}</p>
            {authError && <div className="mb-4 p-3 rounded-lg text-sm bg-red-500/10 text-red-400 border border-red-500/20">{authError}</div>}
            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Username</label>
                <input type="text" required className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none" value={authForm.username} onChange={(e) => setAuthForm({...authForm, username: e.target.value})} />
              </div>
              {authMode === 'register' && (
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input type="email" required className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none" value={authForm.email} onChange={(e) => setAuthForm({...authForm, email: e.target.value})} />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                <input type="password" required className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none" value={authForm.password} onChange={(e) => setAuthForm({...authForm, password: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-3 mt-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-white transition-colors">{authMode === 'login' ? 'Sign In' : 'Sign Up'}</button>
            </form>
            <div className="mt-6 text-center">
              <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Registration Form Modal */}
      {isRegModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl shadow-blue-900/20">
            <button onClick={() => { setIsRegModalOpen(false); setRegForm({...regForm, hasTeam: null}); }} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"><X className="h-6 w-6" /></button>
            <h2 className="text-2xl font-bold mb-2">Join {activeEvent?.title}</h2>
            
            {!regForm.hasTeam ? (
              <div className="space-y-6">
                <p className="text-slate-400 text-sm">To get started, tell us about your team status.</p>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Do you already have a team?</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setRegForm({...regForm, hasTeam: 'yes'})} className="py-3 bg-slate-800 border border-slate-700 hover:border-blue-500 rounded-xl text-white font-medium transition-colors">Yes, I have a team</button>
                    <button onClick={() => setRegForm({...regForm, hasTeam: 'no'})} className="py-3 bg-slate-800 border border-slate-700 hover:border-indigo-500 rounded-xl text-white font-medium transition-colors">No, I'm solo</button>
                  </div>
                </div>
              </div>
            ) : regForm.hasTeam === 'no' ? (
              <div className="mt-4 p-5 bg-indigo-900/20 border border-indigo-500/30 rounded-xl text-indigo-200 text-sm leading-relaxed text-center">
                <Users className="h-8 w-8 mx-auto mb-3 text-indigo-400" />
                <p>Since you are joining as a solo participant, please use the <strong>"Join as Solo"</strong> button on the main page to officially enter the hackathon and be paired up by the Admin.</p>
              </div>
            ) : (
              <form onSubmit={handleRegisterHackathon} className="space-y-4 mt-2">
                <p className="text-slate-400 text-sm mb-4">Great! Tell us a bit about yourself so the admin can verify your team status.</p>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Primary Role</label>
                  <select required className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none" value={regForm.role} onChange={(e) => setRegForm({...regForm, role: e.target.value})}>
                    <option value="" disabled>Select a role...</option>
                    <option value="Developer">Developer</option>
                    <option value="Designer">Designer</option>
                    <option value="Product Manager">Product Manager</option>
                    <option value="Domain Expert">Domain Expert</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Top Skills (comma separated)</label>
                  <input type="text" placeholder="e.g. React, Python, Figma" required className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none" value={regForm.skills} onChange={(e) => setRegForm({...regForm, skills: e.target.value})} />
                </div>
                <button type="submit" className="w-full py-3 mt-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-white transition-colors">Complete Registration</button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Propose Hackathon Modal */}
      {isProposalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto relative shadow-2xl shadow-blue-900/20">
            <button onClick={() => setIsProposalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"><X className="h-6 w-6" /></button>
            <h2 className="text-2xl font-bold mb-2">Propose a Hackathon</h2>
            <p className="text-slate-400 text-sm mb-6">Pitch a complete idea for a future event to the admins.</p>
            {submitMessage && <div className={`mb-4 p-3 rounded-lg text-sm ${submitMessage.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>{submitMessage.text}</div>}
            <form onSubmit={handleProposalSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Proposed Title</label>
                <input type="text" required placeholder="e.g. The Climate AI Sprint" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none" value={proposalData.proposed_title} onChange={(e) => setProposalData({...proposalData, proposed_title: e.target.value})} disabled={isSubmitting} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Problem Statement</label>
                <textarea required rows="4" placeholder="What core problem will participants be trying to solve?" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none resize-none" value={proposalData.problem_statement} onChange={(e) => setProposalData({...proposalData, problem_statement: e.target.value})} disabled={isSubmitting}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Target Audience</label>
                <input type="text" placeholder="e.g. Students, Open Source Devs" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none" value={proposalData.target_audience} onChange={(e) => setProposalData({...proposalData, target_audience: e.target.value})} disabled={isSubmitting} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Suggested Tools / Stack</label>
                <input type="text" placeholder="e.g. GCP, TensorFlow, React" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none" value={proposalData.suggested_tools} onChange={(e) => setProposalData({...proposalData, suggested_tools: e.target.value})} disabled={isSubmitting} />
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full py-3 mt-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-white transition-colors disabled:opacity-50">
                {isSubmitting ? 'Submitting...' : 'Submit Proposal to Admin'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Join Team Informational Modal (Solo Registration) */}
      {isJoinTeamOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 max-w-md w-full relative shadow-2xl shadow-blue-900/20">
            <button onClick={() => setIsJoinTeamOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"><X className="h-6 w-6" /></button>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2"><MessageSquare className="h-6 w-6 text-blue-400" /> Join as Solo</h2>
            <p className="text-slate-300 text-sm mb-4 leading-relaxed">
              By using this feature, you are officially joining the hackathon as a solo participant. The Admin will review your skills and pair you up via the admin panel!
            </p>
            <form onSubmit={handleJoinTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Primary Role</label>
                <select required className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none" value={regForm.role} onChange={(e) => setRegForm({...regForm, role: e.target.value})}>
                  <option value="" disabled>Select your role...</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Product Manager">Product Manager</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Top Skills (comma separated)</label>
                <input type="text" placeholder="e.g. React, Node, UI Design" required className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white outline-none" value={regForm.skills} onChange={(e) => setRegForm({...regForm, skills: e.target.value})} />
              </div>
              <button type="submit" className="w-full py-3 mt-4 rounded-xl bg-blue-600 hover:bg-blue-500 font-semibold text-white transition-colors">Join Hackathon & Request Pairing</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
