import { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes/admin';
import {
    Wind, Trash2, HeartPulse, Truck, AlertTriangle,
    TrendingUp, TrendingDown, CloudRain, CheckCircle2, Clock, Flame
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Data Generation (Wards 1 to 23) ──────────────────────────────────────────

const aqiTrendData = [
    { label: 'Mon', value: 85,  x: 50,  y: 130 },
    { label: 'Tue', value: 112, x: 150, y: 106 },
    { label: 'Wed', value: 158, x: 250, y: 68  },
    { label: 'Thu', value: 175, x: 350, y: 45  },
    { label: 'Fri', value: 190, x: 450, y: 22  },
    { label: 'Sat', value: 130, x: 550, y: 90  },
    { label: 'Sun', value: 102, x: 650, y: 118 },
];

const wardGarbageData = Array.from({ length: 23 }, (_, i) => {
    const num = i + 1;
    const tons = Math.round(((num * 0.7 + 2.1) % 8.5 + 1.5) * 10) / 10;
    return {
        id: num,
        ward: `Ward ${num}`,
        tons,
        collected: num % 2 !== 0,
    };
});

const wardStatusData = Array.from({ length: 23 }, (_, i) => {
    const num = i + 1;
    const aqi = (num * 11 + 47) % 160 + 55;
    const tons = Math.round(((num * 0.7 + 2.1) % 8.5 + 1.5) * 10) / 10;
    const collected = num % 2 !== 0;
    
    let priority = 'Low';
    if (aqi > 180) priority = 'Critical';
    else if (aqi > 140) priority = 'High';
    else if (aqi > 95) priority = 'Medium';

    return {
        id: num,
        ward: `Ward ${num}`,
        aqi,
        waste: tons,
        collected,
        priority,
    };
});

const maxGarbage = Math.max(...wardGarbageData.map(w => w.tons));

const healthAdvisories = [
    { icon: Flame,       color: 'text-rose-500',   bg: 'bg-rose-50 dark:bg-rose-500/10',   border: 'border-rose-200 dark:border-rose-500/20',   title: 'High PM2.5 Alert',      desc: 'Sensitive groups should stay indoors.',   time: '2 mins ago'  },
    { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-200 dark:border-amber-500/20', title: 'NO₂ Levels Elevated',   desc: 'Avoid outdoor exercise near Ward 4.',      time: '18 mins ago' },
    { icon: Wind,        color: 'text-cyan-500',    bg: 'bg-cyan-50 dark:bg-cyan-500/10',   border: 'border-cyan-200 dark:border-cyan-500/20',   title: 'Poor Ventilation',      desc: 'Low wind speed detected, pollutants may accumulate.', time: '1 hr ago' },
    { icon: CheckCircle2,color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-200 dark:border-emerald-500/20', title: 'Ward 3 AQI Improved', desc: 'AQI dropped to Good range after collection.', time: '3 hrs ago' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getAqiStatus(value: number) {
    if (value <= 50)  return { label: 'Good',                  color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-500/10', dot: '#34d399' };
    if (value <= 100) return { label: 'Moderate',              color: 'text-yellow-500',  bg: 'bg-yellow-100 dark:bg-yellow-500/10',  dot: '#fbbf24' };
    if (value <= 150) return { label: 'Unhealthy (Sensitive)', color: 'text-amber-500',   bg: 'bg-amber-100 dark:bg-amber-500/10',   dot: '#f59e0b' };
    if (value <= 200) return { label: 'Unhealthy',             color: 'text-rose-500',    bg: 'bg-rose-100 dark:bg-rose-500/10',     dot: '#f43f5e' };
    return                   { label: 'Very Unhealthy',        color: 'text-purple-500',  bg: 'bg-purple-100 dark:bg-purple-500/10', dot: '#a855f7' };
}

function getDotColor(v: number) {
    if (v <= 50)  return '#34d399';
    if (v <= 100) return '#fbbf24';
    if (v <= 150) return '#f59e0b';
    if (v <= 200) return '#f43f5e';
    return '#a855f7';
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function KpiCard({ icon: Icon, label, value, unit, badge, trend, trendLabel, color, delay = 0 }: {
    icon: React.ElementType; label: string; value: string | number; unit?: string;
    badge?: string; trend?: 'up' | 'down'; trendLabel?: string;
    color: string; delay?: number;
}) {
    return (
        <div
            className="relative bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden animate-dash-in"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className={`absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10 ${color}`} />
            <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color} bg-opacity-10`}>
                    <Icon className="w-6 h-6" />
                </div>
                {badge && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${color} bg-opacity-10`}>{badge}</span>
                )}
            </div>
            <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl font-extrabold tracking-tight">{value}</span>
                {unit && <span className="text-sm text-slate-400 dark:text-slate-500 mb-1">{unit}</span>}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{label}</p>
            {trendLabel && (
                <div className={cn(
                    "flex items-center gap-1 mt-2 text-xs font-semibold",
                    trend === 'up' ? 'text-rose-500' : 'text-emerald-500'
                )}>
                    {trend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {trendLabel}
                </div>
            )}
        </div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Dashboard() {
    const { auth } = usePage().props as any;
    const user = auth?.user;
    const role = user?.role || 'citizen';
    const wardId = user?.ward_id;

    const isCitizen = role === 'citizen';
    const userWard = wardStatusData.find(w => w.id === Number(wardId));

    // Dynamic starting point for Live AQI based on role
    const baseAqi = (isCitizen && userWard) ? userWard.aqi : 134;
    const [liveAqi, setLiveAqi] = useState(baseAqi);

    useEffect(() => {
        setLiveAqi(baseAqi);
    }, [baseAqi]);

    useEffect(() => {
        const id = setInterval(() => {
            setLiveAqi(prev => Math.max(0, Math.min(500, prev + Math.floor(Math.random() * 7) - 3)));
        }, 3000);
        return () => clearInterval(id);
    }, []);

    const aqiStatus = getAqiStatus(liveAqi);

    // Compute trend coordinates offset dynamically
    const offset = baseAqi - 134;
    const currentTrendData = aqiTrendData.map(p => {
        const adjustedValue = Math.max(10, Math.min(300, p.value + offset));
        const adjustedY = Math.max(10, Math.min(180, 165 - (adjustedValue * 0.75)));
        return {
            ...p,
            value: adjustedValue,
            y: adjustedY
        };
    });

    const linePath = currentTrendData.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
    const areaPath = linePath + ` L ${currentTrendData.at(-1)!.x},165 L ${currentTrendData[0].x},165 Z`;

    // Filter garbage data and status lists
    const displayedGarbageData = (isCitizen && wardId)
        ? wardGarbageData.filter(w => w.id === Number(wardId))
        : wardGarbageData;

    const displayedStatusData = (isCitizen && wardId)
        ? wardStatusData.filter(w => w.id === Number(wardId))
        : wardStatusData;

    // Localized health advisory advisor logic for citizen view
    const getCitizenAdvisories = () => {
        if (!userWard) return [];
        const advisories = [];
        
        if (userWard.aqi > 150) {
            advisories.push({
                icon: Flame,
                color: 'text-rose-500',
                bg: 'bg-rose-50 dark:bg-rose-500/10',
                border: 'border-rose-200 dark:border-rose-500/20',
                title: `Hazardous Air in Ward ${wardId}`,
                desc: 'AQI is critical. Avoid outdoor exercises and close ventilation.',
                time: 'Just now'
            });
        } else if (userWard.aqi > 95) {
            advisories.push({
                icon: AlertTriangle,
                color: 'text-amber-500',
                bg: 'bg-amber-50 dark:bg-amber-500/10',
                border: 'border-amber-200 dark:border-amber-500/20',
                title: `Elevated Pollutants in Ward ${wardId}`,
                desc: 'AQI is moderate. Sensitive individuals should wear masks outdoors.',
                time: '5 mins ago'
            });
        } else {
            advisories.push({
                icon: CheckCircle2,
                color: 'text-emerald-500',
                bg: 'bg-emerald-50 dark:bg-emerald-500/10',
                border: 'border-emerald-200 dark:border-emerald-500/20',
                title: `Clean Air in Ward ${wardId}`,
                desc: 'Air index is green. Excellent conditions for outdoor walks.',
                time: 'Active'
            });
        }

        if (!userWard.collected) {
            advisories.push({
                icon: Wind,
                color: 'text-cyan-500',
                bg: 'bg-cyan-50 dark:bg-cyan-500/10',
                border: 'border-cyan-200 dark:border-cyan-500/20',
                title: 'Disposal collection scheduled',
                desc: `Waste collection route for Ward ${wardId} is active. Ensure bins are accessible.`,
                time: 'Pending Collection'
            });
        } else {
            advisories.push({
                icon: CheckCircle2,
                color: 'text-emerald-500',
                bg: 'bg-emerald-50 dark:bg-emerald-500/10',
                border: 'border-emerald-200 dark:border-emerald-500/20',
                title: 'Disposal clearance completed',
                desc: `Municipal collection crew completed garbage disposal in Ward ${wardId}.`,
                time: 'Cleared Today'
            });
        }
        return advisories;
    };

    const displayedAdvisories = (isCitizen && userWard)
        ? getCitizenAdvisories()
        : healthAdvisories;

    return (
        <>
            <Head title="AQI Dashboard" />

            <div className="p-4 md:p-6 space-y-6">

                {/* ── Header ──────────────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold tracking-tight">
                            {isCitizen && wardId ? `Ward ${wardId} Environmental Monitor` : "Environmental Dashboard"}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            {isCitizen && wardId 
                                ? `Real-time localized air quality & waste tracking for Ward ${wardId}`
                                : "Real-time city AQI & waste management overview"
                            }
                        </p>
                    </div>
                    <div className={cn(
                        "flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-bold border border-current border-opacity-30",
                        aqiStatus.bg,
                        aqiStatus.color
                    )}>
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-current"></span>
                        </span>
                        Live AQI: <span className="tabular-nums">{liveAqi}</span> — {aqiStatus.label}
                    </div>
                </div>

                {/* ── KPI Cards ────────────────────────────────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard
                        icon={CloudRain} 
                        label={isCitizen ? "Ward AQI Index" : "City AQI Index"} 
                        value={liveAqi} 
                        badge={aqiStatus.label}
                        trend={liveAqi > baseAqi ? "up" : "down"}
                        trendLabel={isCitizen ? "Fluctuating live" : "+12 from yesterday"}
                        color="text-cyan-500" 
                        delay={0}
                    />
                    <KpiCard
                        icon={Trash2} 
                        label={isCitizen ? "Ward Waste Generated" : "Waste Collected Today"} 
                        value={isCitizen && userWard ? userWard.waste : "38.4"} 
                        unit="tons"
                        trend={isCitizen ? undefined : "down"}
                        trendLabel={isCitizen ? (userWard?.collected ? "Collection completed" : "Truck scheduled") : "−5% vs yesterday"}
                        color="text-blue-500" 
                        delay={80}
                    />
                    <KpiCard
                        icon={Truck} 
                        label={isCitizen ? "Collection Status" : "Fleet on Route"} 
                        value={isCitizen && userWard ? (userWard.collected ? "Cleared" : "Pending") : "14"} 
                        unit={isCitizen ? "" : "vehicles"}
                        badge={isCitizen ? (userWard?.collected ? "Done" : "Pending") : "Active"}
                        trendLabel={isCitizen ? `Ward ${wardId} municipal routes` : "Active routes today"}
                        color="text-emerald-500" 
                        delay={160}
                    />
                    <KpiCard
                        icon={HeartPulse} 
                        label={isCitizen ? "Ward Health Status" : "Health Alerts Issued"} 
                        value={isCitizen && userWard ? (userWard.aqi > 150 ? "Poor" : userWard.aqi > 95 ? "Fair" : "Good") : "3"} 
                        badge={isCitizen ? undefined : "Today"}
                        trend={isCitizen ? undefined : "up"}
                        trendLabel={isCitizen ? (userWard && userWard.aqi > 95 ? "Limit outdoor activities" : "Air conditions optimal") : "2 new alerts"}
                        color="text-rose-500" 
                        delay={240}
                    />
                </div>

                {/* ── Charts Row ───────────────────────────────────── */}
                <div className="grid lg:grid-cols-2 gap-6">

                    {/* AQI Line Graph */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <Wind className="w-5 h-5 text-cyan-500" />
                                {isCitizen ? `Ward ${wardId} AQI 7-Day Trend` : "AQI 7-Day Trend"}
                            </h2>
                            <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                                {isCitizen ? `Ward ${wardId} Station` : "City Average"}
                            </span>
                        </div>

                        <div className="relative" style={{ height: 200 }}>
                            <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible">
                                <defs>
                                    <linearGradient id="db-line-grad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%"   stopColor="#34d399" />
                                        <stop offset="40%"  stopColor="#f59e0b" />
                                        <stop offset="70%"  stopColor="#f43f5e" />
                                        <stop offset="100%" stopColor="#fbbf24" />
                                    </linearGradient>
                                    <linearGradient id="db-area-grad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%"   stopColor="#f59e0b" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"   />
                                    </linearGradient>
                                </defs>

                                {/* Grid lines */}
                                {[40, 80, 120, 165].map(y => (
                                    <line key={y} x1="30" y1={y} x2="680" y2={y}
                                        stroke="currentColor" strokeOpacity="0.08"
                                        strokeWidth="1" strokeDasharray="4 4" className="text-slate-500" />
                                ))}
                                {/* Y-axis labels */}
                                {[{ y: 40, v: 200 }, { y: 80, v: 150 }, { y: 120, v: 100 }, { y: 165, v: 50 }].map(({ y, v }) => (
                                    <text key={y} x="25" y={y + 4} textAnchor="end"
                                        className="fill-slate-400 dark:fill-slate-600" style={{ fontSize: 11 }}>
                                        {v}
                                    </text>
                                ))}

                                {/* Area fill */}
                                <path d={areaPath} fill="url(#db-area-grad)" />

                                {/* Line */}
                                <path d={linePath} fill="none"
                                    stroke="url(#db-line-grad)"
                                    strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"
                                    className="drop-shadow"
                                />

                                {/* Data points */}
                                {currentTrendData.map((p, i) => (
                                    <g key={i} className="group cursor-pointer">
                                        <circle cx={p.x} cy={p.y} r="18" fill="transparent" />
                                        <circle cx={p.x} cy={p.y} r="5.5"
                                            fill={getDotColor(p.value)} stroke="#fff" strokeWidth="2.5"
                                            style={{ transition: 'r 0.2s', transformOrigin: `${p.x}px ${p.y}px` }}
                                        />
                                        {/* Tooltip */}
                                        <g className="opacity-0 group-hover:opacity-100" style={{ transition: 'opacity 0.2s' }}>
                                            <rect x={p.x - 32} y={p.y - 40} width="64" height="22" rx="5" fill="#0f172a" />
                                            <polygon points={`${p.x-5},${p.y-18} ${p.x+5},${p.y-18} ${p.x},${p.y-12}`} fill="#0f172a" />
                                            <text x={p.x} y={p.y - 25} textAnchor="middle"
                                                className="fill-white" style={{ fontSize: 11, fontWeight: 700 }}>
                                                AQI {p.value}
                                            </text>
                                        </g>
                                        {/* X-label */}
                                        <text x={p.x} y="188" textAnchor="middle"
                                            className="fill-slate-400" style={{ fontSize: 11, fontWeight: 600 }}>
                                            {p.label}
                                        </text>
                                    </g>
                                ))}
                            </svg>
                        </div>
                    </div>

                    {/* Ward-wise Garbage Bar Chart */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <Trash2 className="w-5 h-5 text-blue-500" />
                                {isCitizen ? "Garbage Accumulation Status" : "Ward-wise Garbage Volume"}
                            </h2>
                            <span className="text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">Tons · Today</span>
                        </div>

                        <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                            {displayedGarbageData.map((w, i) => {
                                const pct = (w.tons / maxGarbage) * 100;
                                const isCritical = w.tons > 7;
                                return (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-slate-500 dark:text-slate-400 w-14 shrink-0">{w.ward}</span>
                                        <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-full h-6 overflow-hidden relative group">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden",
                                                    isCritical ? 'bg-gradient-to-r from-rose-400 to-rose-500' : 'bg-gradient-to-r from-blue-400 to-blue-500'
                                                )}
                                                style={{ width: `${pct}%` }}
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                                            </div>
                                            {/* inline label */}
                                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 dark:text-slate-500">
                                                {w.tons}t
                                            </span>
                                        </div>
                                        <span className={cn(
                                            "text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0",
                                            w.collected
                                                ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                : 'text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400'
                                        )}>
                                            {w.collected ? '✓ Done' : '⏳ Pending'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Legend */}
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                <span className="w-3 h-3 rounded-full bg-blue-400 inline-block"></span> Normal
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                <span className="w-3 h-3 rounded-full bg-rose-400 inline-block"></span> Critical (&gt;7t)
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Bottom Row ──────────────────────────────────── */}
                <div className="grid lg:grid-cols-5 gap-6">

                    {/* Health Advisories */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <h2 className="font-bold text-lg flex items-center gap-2 mb-5">
                            <HeartPulse className="w-5 h-5 text-rose-500" />
                            {isCitizen ? "Your Ward Health Advisories" : "Health Advisories"}
                        </h2>
                        <div className="space-y-3">
                            {displayedAdvisories.map((a, i) => (
                                <div key={i} className={cn("flex items-start gap-3 p-3 rounded-xl border", a.bg, a.border)}>
                                    <div className={cn("mt-0.5 shrink-0", a.color)}>
                                        <a.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={cn("text-sm font-bold leading-snug", a.color)}>{a.title}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{a.desc}</p>
                                    </div>
                                    <span className="text-[10px] text-slate-400 shrink-0 mt-0.5 whitespace-nowrap flex items-center gap-1">
                                        <Clock className="w-3 h-3" />{a.time}
                                    </span>
                                </div>
                            ))}
                            {displayedAdvisories.length === 0 && (
                                <p className="text-xs text-slate-400 text-center py-6">No active health advisories for your ward.</p>
                            )}
                        </div>
                    </div>

                    {/* Ward Status Overview Table */}
                    <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <h2 className="font-bold text-lg flex items-center gap-2 mb-5">
                            <Truck className="w-5 h-5 text-emerald-500" />
                            {isCitizen ? "Your Ward Status Details" : "Ward Status Overview"}
                        </h2>
                        <div className="overflow-x-auto max-h-[280px] overflow-y-auto pr-1">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800">
                                        <th className="text-left pb-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Ward</th>
                                        <th className="text-left pb-3 text-xs font-bold text-slate-400 uppercase tracking-wide">AQI</th>
                                        <th className="text-left pb-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Waste (t)</th>
                                        <th className="text-left pb-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Collection</th>
                                        <th className="text-left pb-3 text-xs font-bold text-slate-400 uppercase tracking-wide">Priority</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                                    {displayedStatusData.map((row, i) => {
                                        const s = getAqiStatus(row.aqi);
                                        const priorityStyle: Record<string, string> = {
                                            'Critical': 'text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400',
                                            'High':     'text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400',
                                            'Medium':   'text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400',
                                            'Low':      'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400',
                                        };
                                        return (
                                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="py-3 font-semibold">{row.ward}</td>
                                                <td className="py-3">
                                                    <span className={`font-bold tabular-nums ${s.color}`}>{row.aqi}</span>
                                                </td>
                                                <td className="py-3 font-semibold tabular-nums">{row.waste}</td>
                                                <td className="py-3">
                                                    {row.collected
                                                        ? <span className="text-emerald-500 font-semibold text-xs flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Collected</span>
                                                        : <span className="text-slate-400 dark:text-slate-500 font-semibold text-xs flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Pending</span>
                                                    }
                                                </td>
                                                <td className="py-3">
                                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${priorityStyle[row.priority]}`}>
                                                        {row.priority}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>

            {/* Shared animations */}
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes dashIn {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0);    }
                }
                .animate-dash-in {
                    animation: dashIn 0.6s cubic-bezier(0.16,1,0.3,1) both;
                    opacity: 0;
                }
            ` }} />
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
