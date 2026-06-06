import { Head, usePage } from '@inertiajs/react';
import {
    Wind, Trash2, HeartPulse, Truck, AlertTriangle, Calendar,
    CheckCircle2, Clock, Flame
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes/admin';

// ─── Interfaces matching Laravel Payload ───────────────────────────────────

interface WardStatusItem {
    id: number;
    ward: string;
    aqi: number;
    waste: number;
    collected: boolean;
    priority: 'Critical' | 'High' | 'Medium' | 'Low';
    updated_at: string;
    kg_per_person_day: number | null;
    health_risk_level: 'Critical' | 'High' | 'Medium' | 'Low';
    health_warning: string;
    nepal_reference_kg_per_person_day: number;
    global_reference_kg_per_person_day: number;
}

interface HistoricalAqiItem {
    label: string;
    value: number;
    x: number;
    y: number;
    date: string;
}

interface KpiMetrics {
    totalWasteToday: number;
    totalWasteThisMonth: number;
}

interface LiveStation {
    id: number;
    ward_id: number;
    ward: string;
    aqi: number;
    pm2_5: number | null;
    pm10: number | null;
    recorded_at: string | null;
}

interface PageProps {
    auth: {
        user: {
            role: string;
            ward_id: number | null;
            ward?: { name: string };
        };
    };
    dbWardStatusData: WardStatusItem[];
    dbHistoricalData: HistoricalAqiItem[];
    trendTitle: string;
    liveStation: LiveStation | null;
    kpiMetrics: KpiMetrics;
}

// ─── Utility Styling Helpers ────────────────────────────────────────────────

function getAqiStatus(value: number) {
    if (value <= 50) {
return { label: 'Good', color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-500/10', dot: '#34d399' };
}

    if (value <= 100) {
return { label: 'Moderate', color: 'text-yellow-500', bg: 'bg-yellow-100 dark:bg-yellow-500/10', dot: '#fbbf24' };
}

    if (value <= 150) {
return { label: 'Unhealthy (Sensitive)', color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-500/10', dot: '#f59e0b' };
}

    if (value <= 200) {
return { label: 'Unhealthy', color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-500/10', dot: '#f43f5e' };
}

    return { label: 'Very Unhealthy', color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-500/10', dot: '#a855f7' };
}

function getDotColor(v: number) {
    if (v <= 50) {
return '#34d399';
}

    if (v <= 100) {
return '#fbbf24';
}

    if (v <= 150) {
return '#f59e0b';
}

    if (v <= 200) {
return '#f43f5e';
}

    return '#a855f7';
}

function KpiCard({ icon: Icon, label, value, unit, badge, trendLabel, color, delay = 0 }: {
    icon: React.ElementType; label: string; value: string | number; unit?: string;
    badge?: string; trendLabel?: string; color: string; delay?: number;
}) {
    return (
        <div
            className="relative bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden animate-dash-in"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className={`absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-10 ${color}`} />
            <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} bg-opacity-10`}>
                    <Icon className="w-5 h-5" />
                </div>
                {badge && (
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${color} bg-opacity-10`}>{badge}</span>
                )}
            </div>
            <div className="flex items-end gap-1 mb-1">
                <span className="text-2xl font-extrabold tracking-tight tabular-nums">{value}</span>
                {unit && <span className="text-xs text-slate-400 dark:text-slate-500 mb-1">{unit}</span>}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
            {trendLabel && (
                <div className="flex items-center gap-1 mt-1.5 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                    <Clock className="w-3 h-3" />
                    {trendLabel}
                </div>
            )}
        </div>
    );
}

// ─── Main Component Implementation ──────────────────────────────────────────

export default function Dashboard() {
    const pageProps = usePage<any>().props as PageProps;
    const { auth } = pageProps;
    const [dbWardStatusData, setDbWardStatusData] = useState<WardStatusItem[]>(pageProps.dbWardStatusData ?? []);
    const [dbHistoricalData, setDbHistoricalData] = useState<HistoricalAqiItem[]>(pageProps.dbHistoricalData ?? []);
    const [trendTitle, setTrendTitle] = useState<string>(pageProps.trendTitle ?? 'AQI Historical Trend');
    const [liveStation, setLiveStation] = useState<LiveStation | null>(pageProps.liveStation ?? null);
    const [kpiMetrics, setKpiMetrics] = useState<KpiMetrics>(pageProps.kpiMetrics ?? { totalWasteToday: 0, totalWasteThisMonth: 0 });

    const user = auth?.user;
    const role = user?.role || 'citizen';
    const wardId = user?.ward_id;
    const isCitizen = role === 'citizen';

    // Locate current citizen ward entry context if applicable
    const userWard = isCitizen && wardId ? dbWardStatusData.find(w => w.id === Number(wardId)) : null;
    const referenceWard = userWard ?? dbWardStatusData[0] ?? null;

    // Live station value comes from the latest telemetry row saved by /api/iot/telemetry.
    const baseAqi = liveStation?.aqi ?? referenceWard?.aqi ?? 0;
    const liveAqi = baseAqi;

    // Fetch dynamic dashboard payload if available
    useEffect(() => {
        const refreshDashboardData = () => {
            fetch('/admin/iot-readings/dashboard-data')
                .then(res => res.ok ? res.json() : Promise.reject('no-data'))
                .then(data => {
                    if (data.dbWardStatusData) {
setDbWardStatusData(data.dbWardStatusData);
}

                    if (data.dbHistoricalData) {
setDbHistoricalData(data.dbHistoricalData);
}

                    if (data.trendTitle) {
setTrendTitle(data.trendTitle);
}

                    if ('liveStation' in data) {
setLiveStation(data.liveStation);
}

                    if (data.kpiMetrics) {
setKpiMetrics(data.kpiMetrics);
}
                })
                .catch(() => {
                    // Keep server-provided props if endpoint missing
                });
        };

        refreshDashboardData();
        const timer = window.setInterval(refreshDashboardData, 5000);

        return () => window.clearInterval(timer);
    }, []);

    const aqiStatus = getAqiStatus(liveAqi);

    // Compute layout normalization constraints across absolute garbage ton metrics
    const maxGarbage = dbWardStatusData.length > 0
        ? Math.max(...dbWardStatusData.map(w => w.waste))
        : 10;

    // SVG Analytical Chart Computations 
    const linePath = dbHistoricalData.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
    const areaPath = dbHistoricalData.length > 0
        ? `${linePath} L ${dbHistoricalData.at(-1)!.x},165 L ${dbHistoricalData[0].x},165 Z`
        : '';
    const riskRank: Record<WardStatusItem['health_risk_level'], number> = {
        Critical: 4,
        High: 3,
        Medium: 2,
        Low: 1,
    };
    const highestWasteRisk = [...dbWardStatusData].sort(
        (a, b) => riskRank[b.health_risk_level] - riskRank[a.health_risk_level],
    )[0];
    const getWasteRiskStyles = (risk: WardStatusItem['health_risk_level']) => {
        if (risk === 'Critical') {
            return { icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'border-rose-100 dark:border-rose-500/20' };
        }

        if (risk === 'High') {
            return { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-500/10', border: 'border-orange-100 dark:border-orange-500/20' };
        }

        if (risk === 'Medium') {
            return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10', border: 'border-amber-100 dark:border-amber-500/20' };
        }

        return { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-100 dark:border-emerald-500/20' };
    };

    // Dynamic contextual local environmental system statements
    const generateContextAlerts = () => {
        if (isCitizen && userWard) {
            const wasteRiskStyles = getWasteRiskStyles(userWard.health_risk_level);

            return [
                {
                    icon: userWard.aqi > 140 ? Flame : CheckCircle2,
                    color: userWard.aqi > 140 ? 'text-rose-500' : 'text-emerald-500',
                    bg: userWard.aqi > 140 ? 'bg-rose-50 dark:bg-rose-500/10' : 'bg-emerald-50 dark:bg-emerald-500/10',
                    border: userWard.aqi > 140 ? 'border-rose-100 dark:border-rose-500/20' : 'border-emerald-100 dark:border-emerald-500/20',
                    title: `Air Quality Index Notice`,
                    desc: userWard.aqi > 140 ? 'Elevated atmospheric dust values. Limit extensive outdoor activity.' : 'Atmospheric conditions match ideal health baselines.',
                    time: 'Live updates'
                },
                {
                    ...wasteRiskStyles,
                    title: `${userWard.ward} Waste Health Risk: ${userWard.health_risk_level}`,
                    desc: userWard.kg_per_person_day
                        ? `${userWard.health_warning} Current rate: ${userWard.kg_per_person_day} kg/person/day; Nepal reference: ${userWard.nepal_reference_kg_per_person_day}.`
                        : userWard.health_warning,
                    time: userWard.updated_at
                }
            ];
        }

        const wasteRiskStyles = highestWasteRisk ? getWasteRiskStyles(highestWasteRisk.health_risk_level) : getWasteRiskStyles('Low');

        return [
            { icon: Flame, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10', border: 'border-rose-100 dark:border-rose-500/20', title: 'High PM2.5 Grid Alert', desc: 'Sustained pollution spikes monitored in central industrial spaces.', time: '2 mins ago' },
            {
                ...wasteRiskStyles,
                title: highestWasteRisk ? `${highestWasteRisk.ward} Waste Health Risk: ${highestWasteRisk.health_risk_level}` : 'Waste Health Risk',
                desc: highestWasteRisk?.kg_per_person_day
                    ? `${highestWasteRisk.health_warning} Current rate: ${highestWasteRisk.kg_per_person_day} kg/person/day; Nepal reference: ${highestWasteRisk.nepal_reference_kg_per_person_day}.`
                    : (highestWasteRisk?.health_warning ?? 'No ward waste health warning available.'),
                time: highestWasteRisk?.updated_at ?? 'Waiting for records'
            },
            { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10', border: 'border-emerald-100 dark:border-emerald-500/20', title: 'System Grid Active', desc: 'All regional smart collection tracking protocols verifying clear.', time: 'Online' }
        ];
    };

    return (
        <>
            <Head title="Environmental & Collection Dashboard" />

            <div className="p-4 md:p-6 space-y-6">

                {/* ── Dashboard Header Block ──────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/60 pb-5">
                    <div>
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                            {isCitizen && wardId ? `Ward ${wardId} Command Hub` : "Municipal Environmental Operations"}
                        </h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                            Unified analytics system tracking daily IoT values and waste logs.
                        </p>
                    </div>

                    <div className={cn(
                        "flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-black border border-current border-opacity-25 shadow-sm transition-all duration-300",
                        aqiStatus.bg,
                        aqiStatus.color
                    )}>
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                        </span>
                        LIVE STATION INDEX: <span className="tabular-nums text-sm font-black">{liveAqi}</span> ({aqiStatus.label})
                    </div>
                </div>

                {/* ── KPI Metric Cards Grid ────────────────────────── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <KpiCard
                        icon={Wind}
                        label={isCitizen ? "Your Local AQI" : "Regional Reference AQI"}
                        value={liveAqi}
                        badge={aqiStatus.label}
                        trendLabel={liveStation?.recorded_at ? `Updated ${new Date(liveStation.recorded_at).toLocaleTimeString()}` : 'Waiting for telemetry'}
                        color="text-cyan-500"
                        delay={0}
                    />
                    <KpiCard
                        icon={Trash2}
                        label="Daily Garbage Logged"
                        value={kpiMetrics?.totalWasteToday ?? 0}
                        unit="tons"
                        trendLabel="Collected today"
                        color="text-blue-500"
                        delay={70}
                    />
                    <KpiCard
                        icon={Calendar}
                        label="Monthly Collection Total"
                        value={kpiMetrics?.totalWasteThisMonth ?? 0}
                        unit="tons"
                        trendLabel="Current billing window"
                        color="text-indigo-500"
                        delay={140}
                    />
                    <KpiCard
                        icon={Truck}
                        label={isCitizen ? "Clearance Tracking" : "Sectors Evaluated"}
                        value={isCitizen && userWard ? (userWard.collected ? "Cleared" : "Pending") : dbWardStatusData.length}
                        badge={isCitizen && userWard ? (userWard.collected ? "Done" : "In-Queue") : "Active"}
                        trendLabel="System confirmation"
                        color="text-emerald-500"
                        delay={210}
                    />
                </div>

                {/* ── Operational Visualizations and Analytics ─────── */}
                <div className="grid lg:grid-cols-2 gap-6">

                    {/* Ward AQI 7-Day Trend Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-base text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <Wind className="w-4 h-4 text-cyan-500" />
                                {trendTitle || "AQI Historical Trend"}
                            </h2>
                            <span className="text-[11px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                                7-Point Rolling Index
                            </span>
                        </div>

                        <div className="relative pt-2" style={{ height: 200 }}>
                            {dbHistoricalData.length > 0 ? (
                                <svg viewBox="0 0 700 200" className="w-full h-full overflow-visible">
                                    <defs>
                                        <linearGradient id="chart-line-grad" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor="#22d3ee" />
                                            <stop offset="50%" stopColor="#f59e0b" />
                                            <stop offset="100%" stopColor="#f43f5e" />
                                        </linearGradient>
                                        <linearGradient id="chart-area-grad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.15" />
                                            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>

                                    {[40, 80, 120, 165].map(y => (
                                        <line key={y} x1="35" y1={y} x2="680" y2={y}
                                            stroke="currentColor" strokeOpacity="0.06"
                                            strokeWidth="1" strokeDasharray="5 5" className="text-slate-400" />
                                    ))}
                                    {[{ y: 40, v: 160 }, { y: 80, v: 110 }, { y: 120, v: 60 }, { y: 165, v: 10 }].map(({ y, v }) => (
                                        <text key={y} x="25" y={y + 4} textAnchor="end"
                                            className="fill-slate-400 dark:fill-slate-600 font-bold tracking-tight" style={{ fontSize: 10 }}>
                                            {v}
                                        </text>
                                    ))}

                                    <path d={areaPath} fill="url(#chart-area-grad)" />
                                    <path d={linePath} fill="none" stroke="url(#chart-line-grad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

                                    {dbHistoricalData.map((p, i) => (
                                        <g key={i} className="group cursor-pointer">
                                            <circle cx={p.x} cy={p.y} r="20" fill="transparent" />
                                            <circle cx={p.x} cy={p.y} r="5" fill={getDotColor(p.value)} stroke="#fff" strokeWidth="2.5" className="shadow-sm" />

                                            <g className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                                <rect x={p.x - 40} y={p.y - 42} width="80" height="26" rx="6" fill="#0f172a" />
                                                <text x={p.x} y={p.y - 25} textAnchor="middle" className="fill-white font-extrabold" style={{ fontSize: 10 }}>
                                                    {p.date}: AQI {p.value}
                                                </text>
                                            </g>

                                            <text x={p.x} y="190" textAnchor="middle" className="fill-slate-400 dark:fill-slate-500 font-bold" style={{ fontSize: 10 }}>
                                                {p.label}
                                            </text>
                                        </g>
                                    ))}
                                </svg>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-slate-400 text-xs">
                                    <AlertTriangle className="w-5 h-5 text-slate-300 mb-1" />
                                    No local telemetry or historical readings logged for this sector configuration.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Garbage Accumulation Status Section */}
                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-base text-slate-800 dark:text-slate-200 flex items-center gap-2">
                                <Trash2 className="w-4 h-4 text-blue-500" />
                                Garbage Accumulation Status
                            </h2>
                            <span className="text-[11px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-md">Log Snapshot</span>
                        </div>

                        <div className="space-y-4 max-h-[195px] overflow-y-auto pr-1">
                            {dbWardStatusData.length > 0 ? (
                                dbWardStatusData.map((w, i) => {
                                    const percentage = maxGarbage > 0 ? (w.waste / maxGarbage) * 100 : 0;
                                    const isOverload = w.waste >= 7.0;

                                    return (
                                        <div key={i} className="space-y-1.5">
                                            <div className="flex items-center justify-between text-xs font-bold">
                                                <span className="text-slate-700 dark:text-slate-300">{w.ward}</span>
                                                <div className="flex items-center gap-2">
                                                    <span className={cn(isOverload ? 'text-rose-500' : 'text-slate-400')}>{w.waste} Tons</span>
                                                    <span className={cn(
                                                        "text-[10px] px-2 py-0.5 rounded-full font-black",
                                                        w.collected ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                            : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                                                    )}>
                                                        {w.collected ? "Cleared" : "Pending"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full rounded-full transition-all duration-500",
                                                        isOverload ? "bg-gradient-to-r from-rose-400 to-rose-500" : "bg-gradient-to-r from-blue-400 to-blue-500"
                                                    )}
                                                    style={{ width: `${Math.max(6, percentage)}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-xs text-slate-400 text-center py-8">No waste registration entries compiled.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── System Status & Advisory Detailed Logs ───────── */}
                <div className="grid lg:grid-cols-5 gap-6">

                    {/* Operational Health Advisories block */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <h2 className="font-bold text-base text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
                            <HeartPulse className="w-4 h-4 text-rose-500" />
                            Environmental Advisory Notices
                        </h2>
                        <div className="space-y-3">
                            {generateContextAlerts().map((alert, i) => (
                                <div key={i} className={cn("flex items-start gap-3 p-3 rounded-xl border transition-all", alert.bg, alert.border)}>
                                    <div className={cn("mt-0.5 shrink-0", alert.color)}>
                                        <alert.icon className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={cn("text-xs font-black tracking-tight", alert.color)}>{alert.title}</p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{alert.desc}</p>
                                    </div>
                                    <span className="text-[9px] text-slate-400 font-semibold shrink-0 uppercase tracking-wider">{alert.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Your Ward Status Details Table View Component */}
                    <div className="lg:col-span-3 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm">
                        <h2 className="font-bold text-base text-slate-800 dark:text-slate-200 flex items-center gap-2 mb-4">
                            <Truck className="w-4 h-4 text-emerald-500" />
                            Your Ward Status Details
                        </h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                                        <th className="pb-2.5">Sector Label</th>
                                        <th className="pb-2.5">AQI Index</th>
                                        <th className="pb-2.5">Logged Vol</th>
                                        <th className="pb-2.5">Status Check</th>
                                        <th className="pb-2.5 text-right">Priority Class</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 font-medium">
                                    {dbWardStatusData.length > 0 ? (
                                        dbWardStatusData.map((row, i) => {
                                            const statusStyles = getAqiStatus(row.aqi);
                                            const priorityClasses: Record<string, string> = {
                                                'Critical': 'text-rose-600 bg-rose-50 dark:bg-rose-500/10',
                                                'High': 'text-orange-600 bg-orange-50 dark:bg-orange-500/10',
                                                'Medium': 'text-amber-600 bg-amber-50 dark:bg-amber-500/10',
                                                'Low': 'text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10',
                                            };

                                            return (
                                                <tr key={i} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors">
                                                    <td className="py-3 font-bold text-slate-700 dark:text-slate-300">{row.ward}</td>
                                                    <td className="py-3">
                                                        <span className={cn("font-extrabold tabular-nums", statusStyles.color)}>
                                                            {row.aqi}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 tabular-nums text-slate-500">{row.waste} t</td>
                                                    <td className="py-3">
                                                        {row.collected ? (
                                                            <span className="text-emerald-500 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Disposed</span>
                                                        ) : (
                                                            <span className="text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" /> Incomplete</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        <span className={cn("text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wide", priorityClasses[row.priority] || priorityClasses['Low'])}>
                                                            {row.priority}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="text-center py-6 text-slate-400">No telemetry matrix entries matching standard scope parameters.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>

            </div>

            {/* Global View Transitions Style Definition */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes dashIn {
                    from { opacity: 0; transform: translateY(12px); }
                    to   { opacity: 1; transform: translateY(0);    }
                }
                .animate-dash-in {
                    animation: dashIn 0.5s cubic-bezier(0.16,1,0.3,1) both;
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
