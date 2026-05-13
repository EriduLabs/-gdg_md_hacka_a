import re

file_path = "src/App.jsx"
with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Replace glow styles
content = content.replace("background: #1e293b;", "background: #e2e8f0;")
content = content.replace("background-color: #0f172a;", "background-color: #ffffff;")
content = content.replace("color: #60a5fa;", "color: #1a73e8;")
content = content.replace("color: #cbd5e1;", "color: #3c4043;")
content = content.replace("color: #f8fafc;", "color: #202124;")

new_render = """  return (
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

          {/* Rules Section (Dynamic from Admin) */}
          {activeEvent && activeEvent.rules && (
            <section id="schedule" className="py-20 bg-white border-y border-slate-200">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                  <h2 className="text-3xl font-bold mb-4 text-slate-800">Event Rules & Guidelines</h2>
                  <p className="text-slate-500 max-w-2xl mx-auto">Posted by the Hackathon Admin.</p>
                </div>
                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="prose-custom max-w-none text-slate-700 text-left">
                    <ReactMarkdown>{activeEvent.rules}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </section>
          )}

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
  );"""

content = re.sub(r'  return \(\n    <div className="min-h-screen.*', new_render, content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
