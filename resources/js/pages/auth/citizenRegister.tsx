import { Form, Head } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { 
    User, 
    Mail, 
    Lock, 
    ShieldCheck, 
    MapPin, 
    ArrowRight, 
    ArrowLeft, 
    CheckCircle2, 
    UserCheck
} from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { citizenRegisterStore } from '@/routes';
import { citizenLoginPage } from '@/actions/App/Http/Controllers/Citizen/AuthController';
import { Ward } from '@/types/Admin/Ward';
import { cn } from '@/lib/utils';

type Props = {
    passwordRules: string;
    wards: Ward[];
};

export default function Register({ passwordRules, wards: rawWards }: Props) {
    const wards = Array.isArray(rawWards) ? rawWards : [];
    
    return (
        <>
            <Head title="Register" />
            <Form
                {...citizenRegisterStore.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <RegisterFormContent
                        processing={processing}
                        errors={errors}
                        passwordRules={passwordRules}
                        wards={wards}
                    />
                )}
            </Form>
        </>
    );
}

function RegisterFormContent({
    processing,
    errors,
    passwordRules,
    wards,
}: {
    processing: boolean;
    errors: Record<string, string>;
    passwordRules: string;
    wards: Ward[];
}) {
    const [step, setStep] = useState(1);
    const [passwordVal, setPasswordVal] = useState('');

    // Determine password requirements validation in real-time
    const requirements = [
        { label: 'At least 8 characters', met: passwordVal.length >= 8 },
        { label: 'Lowercase & uppercase letters', met: /[a-z]/.test(passwordVal) && /[A-Z]/.test(passwordVal) },
        { label: 'At least one number (0-9)', met: /[0-9]/.test(passwordVal) },
        { label: 'At least one special character', met: /[^A-Za-z0-9]/.test(passwordVal) },
    ];
    
    const metCount = requirements.filter(req => req.met).length;

    // Direct redirection logic when server-side validation error occurs
    const hasStep1Errors = !!(errors.name || errors.ward_no);
    const hasStep2Errors = !!(errors.email || errors.password || errors.password_confirmation);

    useEffect(() => {
        if (errors && Object.keys(errors).length > 0) {
            if (hasStep1Errors) {
                setStep(1);
            } else if (hasStep2Errors) {
                setStep(2);
            }
        }
    }, [errors, hasStep1Errors, hasStep2Errors]);

    return (
        <div className="flex flex-col gap-6 w-full animate-fade-in">
            {/* Stepper Progress */}
            <div className="flex flex-col gap-2 w-full">
                <div className="flex items-center justify-between px-6 relative w-full">
                    {/* Background Progress Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 z-0 rounded-full" />
                    
                    {/* Colored Active Progress Line */}
                    <div 
                        className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 -translate-y-1/2 transition-all duration-500 ease-out z-0 rounded-full"
                        style={{ width: step === 1 ? '50%' : '100%' }}
                    />

                    {/* Step 1 Circle */}
                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className={cn(
                            "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 cursor-pointer",
                            step === 1
                                ? 'border-emerald-500 bg-white text-emerald-600 dark:bg-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                                : 'border-emerald-500 bg-emerald-500 text-white'
                        )}
                    >
                        <User className="h-4.5 w-4.5" />
                    </button>

                    {/* Step 2 Circle */}
                    <button
                        type="button"
                        onClick={() => setStep(2)}
                        className={cn(
                            "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 cursor-pointer",
                            step === 2
                                ? 'border-cyan-500 bg-white text-cyan-600 dark:bg-slate-900 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                                : 'border-slate-200 bg-slate-50 text-slate-400 dark:border-slate-800 dark:bg-slate-900'
                        )}
                    >
                        <Lock className="h-4.5 w-4.5" />
                    </button>
                </div>
                
                {/* Step Labels */}
                <div className="flex justify-between text-xs font-semibold px-2 text-slate-500 dark:text-slate-400">
                    <span className={cn("transition-colors duration-300", step === 1 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : '')}>Profile Details</span>
                    <span className={cn("transition-colors duration-300", step === 2 ? 'text-cyan-600 dark:text-cyan-400 font-bold' : '')}>Security Access</span>
                </div>
            </div>

            {/* Steps sliding viewport */}
            <div className="w-full overflow-hidden">
                <div 
                    className="flex w-[200%] transition-transform duration-500 ease-out"
                    style={{ transform: step === 1 ? 'translateX(0%)' : 'translateX(-50%)' }}
                >
                    {/* STEP 1: Profile Information */}
                    <div className="w-1/2 pr-4 pl-0.5 flex flex-col gap-4">
                        <div className="grid gap-2 group">
                            <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-medium">Name</Label>
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Full name"
                                    className="pl-10 pr-4 py-5.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500 transition-all shadow-2xs"
                                />
                            </div>
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2 group">
                            <Label htmlFor="ward_no" className="text-slate-700 dark:text-slate-300 font-medium">Ward Number</Label>
                            <div className="relative">
                                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-emerald-500 transition-colors pointer-events-none" />
                                <select
                                    id="ward_no"
                                    name="ward_no"
                                    tabIndex={2}
                                    defaultValue=""
                                    required
                                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-sm shadow-2xs transition-all outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 text-slate-800 dark:text-slate-200 appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Select your ward</option>
                                    {wards.map((ward) => (
                                        <option key={ward.id} value={ward.number}>
                                            {ward.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                </div>
                            </div>
                            <InputError message={errors.ward_no} />
                        </div>

                        <Button
                            type="button"
                            onClick={() => setStep(2)}
                            className="mt-2 w-full py-5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-medium shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                            tabIndex={3}
                        >
                            Next Step
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* STEP 2: Security Credentials */}
                    <div className="w-1/2 pl-4 pr-0.5 flex flex-col gap-4">
                        <div className="grid gap-2 group">
                            <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">Email address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 group-focus-within:text-cyan-500 transition-colors pointer-events-none" />
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    tabIndex={4}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="email@example.com"
                                    className="pl-10 pr-4 py-5.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-cyan-500/30 focus-visible:border-cyan-500 transition-all shadow-2xs"
                                />
                            </div>
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2 group">
                            <Label htmlFor="password" className="text-slate-700 dark:text-slate-300 font-medium">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-[18px] h-4.5 w-4.5 text-slate-400 group-focus-within:text-cyan-500 transition-colors z-10 pointer-events-none" />
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={5}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Password"
                                    passwordrules={passwordRules}
                                    value={passwordVal}
                                    onChange={(e) => setPasswordVal(e.target.value)}
                                    className="pl-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-cyan-500/30 focus-visible:border-cyan-500 transition-all shadow-2xs"
                                />
                            </div>
                            <InputError message={errors.password} />
                            
                            {/* Live Password Indicator & checklist */}
                            {passwordVal && (
                                <div className="mt-1 space-y-3 p-3 bg-slate-50/50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800/60 rounded-xl">
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                            <span>Password Strength</span>
                                            <span className={cn(
                                                "font-bold transition-colors",
                                                metCount === 0 && "text-slate-400",
                                                metCount === 1 && "text-red-500",
                                                metCount === 2 && "text-amber-500",
                                                metCount === 3 && "text-yellow-500",
                                                metCount === 4 && "text-emerald-500"
                                            )}>
                                                {metCount === 0 && "Too Weak"}
                                                {metCount === 1 && "Weak"}
                                                {metCount === 2 && "Fair"}
                                                {metCount === 3 && "Good"}
                                                {metCount === 4 && "Strong"}
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                                            <div 
                                                className={cn(
                                                    "h-full transition-all duration-300 rounded-full",
                                                    metCount === 1 && "bg-red-500",
                                                    metCount === 2 && "bg-amber-500",
                                                    metCount === 3 && "bg-yellow-500",
                                                    metCount === 4 && "bg-emerald-500"
                                                )}
                                                style={{ width: `${metCount * 25}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Checklist */}
                                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-500 dark:text-slate-400">
                                        {requirements.map((req, idx) => (
                                            <div key={idx} className="flex items-center gap-1.5">
                                                {req.met ? (
                                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                                                ) : (
                                                    <div className="h-3.5 w-3.5 rounded-full border border-slate-300 dark:border-slate-700" />
                                                )}
                                                <span className={cn("transition-colors", req.met ? "text-slate-800 dark:text-slate-200 font-medium" : "")}>
                                                    {req.label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid gap-2 group">
                            <Label htmlFor="password_confirmation" className="text-slate-700 dark:text-slate-300 font-medium">
                                Confirm password
                            </Label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3.5 top-[18px] h-4.5 w-4.5 text-slate-400 group-focus-within:text-cyan-500 transition-colors z-10 pointer-events-none" />
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={6}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirm password"
                                    className="pl-10 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus-visible:ring-cyan-500/30 focus-visible:border-cyan-500 transition-all shadow-2xs"
                                />
                            </div>
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <div className="flex gap-3 mt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setStep(1)}
                                className="w-1/3 py-5 rounded-xl border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                            
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-2/3 py-5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                                tabIndex={7}
                                data-test="register-user-button"
                            >
                                {processing ? <Spinner /> : <UserCheck className="h-4.5 w-4.5" />}
                                Create account
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Link */}
            <div className="text-center text-sm text-slate-500 dark:text-slate-400 mt-2">
                Already have an account?{' '}
                <TextLink 
                    href={citizenLoginPage()} 
                    tabIndex={8}
                    className="font-semibold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                >
                    Log in
                </TextLink>
            </div>
        </div>
    );
}

Register.layout = {
    title: 'Create a citizen account',
    description: 'Enter your details below to monitor local air quality and updates',
};
