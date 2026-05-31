import { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { login, register } from '@/routes';
import { dashboard } from '@/routes/admin';
import { Wind, Trash2, HeartPulse, MapPin, ArrowRight, CloudRain, AlertTriangle, Leaf } from 'lucide-react';

export default function Welcome() {
    const { auth } = usePage().props;

    // Live AQI simulation
    const [aqi, setAqi] = useState(142);
    
    useEffect(() => {
        const interval = setInterval(() => {
            // Randomly fluctuate AQI slightly every 3 seconds for realism
            setAqi(prev => {
                const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
                return Math.max(0, Math.min(500, prev + change));
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const getAqiStatus = (value: number) => {
        if (value <= 50) return { label: 'Good', color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-500/10' };
        if (value <= 100) return { label: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-500/10' };
        if (value <= 150) return { label: 'Unhealthy for Sensitive', color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-500/10' };
        if (value <= 200) return { label: 'Unhealthy', color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-500/10' };
        return { label: 'Very Unhealthy', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-500/10' };
    };
    
    const aqiStatus = getAqiStatus(aqi);

    return (
        <>
            <Head title="AQI & Environment Monitoring" />
            
            {/* Main Container */}
            <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 selection:bg-emerald-500 selection:text-white font-sans overflow-hidden relative">
                
                {/* Animated Background Elements */}
                <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob dark:opacity-10 dark:mix-blend-screen pointer-events-none"></div>
                <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 dark:opacity-10 dark:mix-blend-screen pointer-events-none"></div>
                <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 dark:opacity-10 dark:mix-blend-screen pointer-events-none"></div>

                {/* Navbar */}
                <header className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center animate-fade-in-up">
                    <div className="flex items-center gap-2 group">
                        <div className="bg-emerald-100 dark:bg-emerald-500/20 p-2 rounded-xl group-hover:scale-110 transition-transform">
                            <Leaf className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
                            EcoMonitor
                        </span>
                    </div>
                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link
                                href={dashboard()}
                                className="px-5 py-2.5 text-sm font-semibold rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-0.5"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={login()}
                                    className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={register()}
                                    className="px-5 py-2.5 text-sm font-semibold rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="relative z-10 container mx-auto px-6 pt-20 pb-24 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 text-sm font-semibold mb-8 animate-fade-in-up shadow-sm border border-emerald-200 dark:border-emerald-500/20">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                        </span>
                        Live Environmental Intelligence
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                        Monitor <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">Air Quality</span> <br className="hidden md:block"/> & Urban Waste.
                    </h1>
                    
                    <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 animate-fade-in-up leading-relaxed" style={{ animationDelay: '200ms' }}>
                        Track real-time Air Quality Index (AQI), manage ward-wise garbage collection, and understand their direct impacts on human health in one unified platform.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                        <Link href={auth.user ? dashboard() : register()} className="group px-8 py-3.5 rounded-full bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 hover:-translate-y-1">
                            Get Started
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a href="#features" className="px-8 py-3.5 rounded-full border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 font-semibold transition-all flex items-center justify-center gap-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/20">
                            Explore Metrics
                        </a>
                    </div>
                </main>

                {/* Features / Metrics Grid */}
                <section id="features" className="relative z-10 container mx-auto px-6 py-20">
                    <div className="grid md:grid-cols-3 gap-8">
                        
                        {/* Feature 1: AQI */}
                        <div className="group relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-cyan-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-tr-3xl rounded-bl-[100px] pointer-events-none transition-all duration-500 group-hover:bg-cyan-500/20"></div>
                            
                            <div className="w-14 h-14 rounded-2xl bg-cyan-100 dark:bg-cyan-500/10 flex items-center justify-center mb-6 text-cyan-600 dark:text-cyan-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative z-10 shadow-sm border border-cyan-200 dark:border-cyan-500/20">
                                <Wind className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 relative z-10">Air Quality (AQI)</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed relative z-10">
                                Real-time monitoring of PM2.5, PM10, and NO2 levels. Stay informed about the air you breathe with dynamic, color-coded alerts.
                            </p>
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800 relative z-10 group-hover:border-cyan-200 dark:group-hover:border-cyan-500/30 transition-colors">
                                <span className="flex items-center gap-2 text-sm font-semibold">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                                    </span>
                                    Live AQI
                                </span>
                                <div className={`flex items-center gap-2 ${aqiStatus.color} transition-colors duration-500`}>
                                    <CloudRain className="w-4 h-4" />
                                    <span className="font-bold text-lg tabular-nums transition-all duration-300">{aqi}</span>
                                    <span className={`text-xs ${aqiStatus.bg} px-2 py-1 rounded-md font-bold transition-colors duration-500`}>{aqiStatus.label}</span>
                                </div>
                            </div>
                        </div>

                        {/* Feature 2: Ward-wise Waste */}
                        <div className="group relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-tr-3xl rounded-bl-[100px] pointer-events-none transition-all duration-500 group-hover:bg-blue-500/20"></div>
                            
                            <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative z-10 shadow-sm border border-blue-200 dark:border-blue-500/20">
                                <Trash2 className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 relative z-10">Ward-wise Waste</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed relative z-10">
                                Track garbage collection efficiency across municipal wards. Analyze waste accumulation patterns to optimize civic resources.
                            </p>
                            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800 relative z-10 group-hover:border-blue-200 dark:group-hover:border-blue-500/30 transition-colors">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-slate-400" />
                                    <span className="text-sm font-semibold">Ward 4</span>
                                </div>
                                <div className="w-1/2 bg-slate-200 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
                                    <div className="bg-blue-500 h-2.5 rounded-full w-[85%] relative group-hover:animate-pulse">
                                        <div className="absolute right-0 top-0 bottom-0 w-4 bg-white/30 skew-x-12"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Feature 3: Health Impact */}
                        <div className="group relative bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 hover:border-rose-500/50 dark:hover:border-rose-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose-500/10 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-500/10 to-transparent rounded-tr-3xl rounded-bl-[100px] pointer-events-none transition-all duration-500 group-hover:bg-rose-500/20"></div>

                            <div className="w-14 h-14 rounded-2xl bg-rose-100 dark:bg-rose-500/10 flex items-center justify-center mb-6 text-rose-600 dark:text-rose-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 relative z-10 shadow-sm border border-rose-200 dark:border-rose-500/20">
                                <HeartPulse className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold mb-3 relative z-10">Health Impacts</h3>
                            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed relative z-10">
                                Correlate environmental data with human health risks. Get personalized advisories for sensitive groups based on current conditions.
                            </p>
                            <div className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-500/5 text-rose-700 dark:text-rose-400 rounded-xl border border-rose-100 dark:border-rose-900/50 relative z-10 group-hover:border-rose-200 dark:group-hover:border-rose-500/30 transition-colors">
                                <AlertTriangle className="w-5 h-5 shrink-0 animate-pulse text-rose-500" />
                                <span className="text-sm font-semibold">High risk for respiratory sensitivity today.</span>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Charts Section */}
                <section className="relative z-10 container mx-auto px-6 pb-20">
                    <div className="grid lg:grid-cols-2 gap-8">
                        
                        {/* Ward-wise Garbage Chart */}
                        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Trash2 className="w-5 h-5 text-blue-500" />
                                    Ward-wise Garbage (Tons)
                                </h3>
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">This Week</span>
                            </div>
                            
                            <div className="flex items-end justify-between h-48 mt-4 gap-2 sm:gap-4">
                                {[
                                    { label: 'W1', value: 65, color: 'bg-blue-400' },
                                    { label: 'W2', value: 40, color: 'bg-blue-300' },
                                    { label: 'W3', value: 85, color: 'bg-blue-500' },
                                    { label: 'W4', value: 55, color: 'bg-blue-400' },
                                    { label: 'W5', value: 30, color: 'bg-blue-300' },
                                    { label: 'W6', value: 75, color: 'bg-blue-500' }
                                ].map((bar, i) => (
                                    <div key={i} className="group relative flex-1 flex flex-col items-center gap-2 h-full justify-end">
                                        <div className="w-full relative h-full flex flex-col justify-end">
                                            <div 
                                                className={`w-full rounded-t-md transition-all duration-1000 ease-out group-hover:opacity-80 hover:scale-x-105 ${bar.color} relative overflow-hidden`} 
                                                style={{ height: `${bar.value}%` }}
                                            >
                                                <div className="absolute top-0 left-0 right-0 h-1 bg-white/30"></div>
                                            </div>
                                            {/* Tooltip */}
                                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-slate-800 text-white text-xs py-1.5 px-2.5 rounded-lg font-semibold pointer-events-none whitespace-nowrap shadow-xl z-20 translate-y-2 group-hover:translate-y-0">
                                                {bar.value}t
                                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                                            </div>
                                        </div>
                                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{bar.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Air Quality Trends */}
                        <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-3xl p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold flex items-center gap-2">
                                    <Wind className="w-5 h-5 text-cyan-500" />
                                    AQI 7-Day Trend
                                </h3>
                                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">City Avg</span>
                            </div>

                            <div className="flex items-end justify-between h-48 mt-4 gap-2 sm:gap-4 relative w-full">
                                {/* Grid lines */}
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none z-0 pb-6">
                                    <div className="w-full border-t border-slate-200 dark:border-slate-800/50 border-dashed"></div>
                                    <div className="w-full border-t border-slate-200 dark:border-slate-800/50 border-dashed"></div>
                                    <div className="w-full border-t border-slate-200 dark:border-slate-800/50 border-dashed"></div>
                                    <div className="w-full border-t border-slate-200 dark:border-slate-800/50 border-dashed"></div>
                                </div>

                                <div className="absolute inset-0 z-10 h-full w-full">
                                    <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible">
                                        <defs>
                                            <linearGradient id="line-gradient" x1="0" y1="0" x2="1" y2="0">
                                                <stop offset="0%" stopColor="#10b981" />
                                                <stop offset="30%" stopColor="#f59e0b" />
                                                <stop offset="60%" stopColor="#ef4444" />
                                                <stop offset="100%" stopColor="#10b981" />
                                            </linearGradient>
                                            <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
                                                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                                            </linearGradient>
                                        </defs>

                                        {/* Filled Area */}
                                        <path 
                                            d="M 50,115 L 150,88 L 250,58 L 350,35 L 450,20 L 550,80 L 650,105 L 650,175 L 50,175 Z" 
                                            fill="url(#area-gradient)" 
                                            className="animate-fade-in-up" 
                                            style={{ animationDelay: '500ms' }}
                                        />

                                        {/* Line */}
                                        <path 
                                            d="M 50,115 L 150,88 L 250,58 L 350,35 L 450,20 L 550,80 L 650,105" 
                                            fill="none" 
                                            stroke="url(#line-gradient)" 
                                            strokeWidth="4" 
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="drop-shadow-md animate-fade-in-up"
                                            style={{ animationDelay: '600ms' }}
                                        />

                                        {[
                                            { label: 'Mon', value: 85, color: '#34d399', x: 50, y: 115 },
                                            { label: 'Tue', value: 112, color: '#fbbf24', x: 150, y: 88 },
                                            { label: 'Wed', value: 142, color: '#f59e0b', x: 250, y: 58 },
                                            { label: 'Thu', value: 165, color: '#fb7185', x: 350, y: 35 },
                                            { label: 'Fri', value: 180, color: '#f43f5e', x: 450, y: 20 },
                                            { label: 'Sat', value: 120, color: '#fbbf24', x: 550, y: 80 },
                                            { label: 'Sun', value: 95, color: '#34d399', x: 650, y: 105 }
                                        ].map((point, i) => (
                                            <g key={i} className="group cursor-pointer">
                                                {/* Hover capture area */}
                                                <circle cx={point.x} cy={point.y} r="20" fill="transparent" />
                                                
                                                {/* Visible point */}
                                                <circle 
                                                    cx={point.x} 
                                                    cy={point.y} 
                                                    r="6" 
                                                    fill={point.color} 
                                                    stroke="#fff" 
                                                    strokeWidth="2.5" 
                                                    className="group-hover:scale-150 transition-all duration-300 origin-center"
                                                    style={{ transformOrigin: `${point.x}px ${point.y}px` }}
                                                />
                                                
                                                {/* Label */}
                                                <text 
                                                    x={point.x} 
                                                    y="195" 
                                                    textAnchor="middle" 
                                                    className="fill-slate-500 dark:fill-slate-400 text-[14px] font-semibold"
                                                >
                                                    {point.label}
                                                </text>

                                                {/* Tooltip */}
                                                <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                                                    <rect x={point.x - 30} y={point.y - 36} width="60" height="22" rx="4" fill="#1e293b" />
                                                    <polygon points={`${point.x-4},${point.y-14} ${point.x+4},${point.y-14} ${point.x},${point.y-10}`} fill="#1e293b" />
                                                    <text x={point.x} y={point.y - 21} textAnchor="middle" className="fill-white text-[12px] font-bold">
                                                        AQI {point.value}
                                                    </text>
                                                </g>
                                            </g>
                                        ))}
                                    </svg>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>

                {/* Footer */}
                <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800 py-8 text-center text-slate-500 dark:text-slate-400 text-sm mt-10">
                    <p>© {new Date().getFullYear()} EcoMonitor AQI System. All rights reserved.</p>
                </footer>

                {/* Custom Animations */}
                <style dangerouslySetInnerHTML={{__html: `
                    @keyframes blob {
                        0% { transform: translate(0px, 0px) scale(1); }
                        33% { transform: translate(30px, -50px) scale(1.1); }
                        66% { transform: translate(-20px, 20px) scale(0.9); }
                        100% { transform: translate(0px, 0px) scale(1); }
                    }
                    .animate-blob {
                        animation: blob 7s infinite;
                    }
                    .animation-delay-2000 {
                        animation-delay: 2s;
                    }
                    .animation-delay-4000 {
                        animation-delay: 4s;
                    }
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in-up {
                        animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                        opacity: 0;
                    }
                `}} />

            </div>
        </>
    );
}
