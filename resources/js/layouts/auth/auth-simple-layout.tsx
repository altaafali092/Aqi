import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import { Leaf } from 'lucide-react';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 p-6 md:p-10 selection:bg-emerald-500 selection:text-white overflow-hidden relative">
            
            {/* Animated Background Elements (Same as Welcome) */}
            <div className="absolute top-0 -left-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob dark:opacity-10 dark:mix-blend-screen pointer-events-none"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 dark:opacity-10 dark:mix-blend-screen pointer-events-none"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 dark:opacity-10 dark:mix-blend-screen pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10 animate-fade-in-up">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-8 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <Link
                                href={home()}
                                className="flex flex-col items-center gap-2 font-medium group"
                            >
                                <div className="bg-emerald-100 dark:bg-emerald-500/20 p-3 rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                                    <Leaf className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-400 dark:to-cyan-400">
                                    EcoMonitor
                                </span>
                            </Link>

                            <div className="space-y-2 text-center mt-2">
                                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{title}</h1>
                                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                                    {description}
                                </p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </div>

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
    );
}
