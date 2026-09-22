import { Head, Link, router } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import AppLogoIcon from '@/components/app-logo-icon';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { home } from '@/routes';
import { useState } from 'react';

const roleCredentials: Record<string, { email: string; password: string }> = {
    Admin:   { email: 'admin@realestate.test',  password: 'password' },
    Manager: { email: 'manager@realestate.test', password: 'password' },
    Staff:   { email: 'staff@realestate.test',   password: 'password' },
};

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);
        setLoginErrors({});
        router.post(store.url(), { email, password, remember }, {
            onError: (err) => {
                setLoginErrors(err);
                setSubmitting(false);
            },
            onFinish: () => setSubmitting(false),
        });
    }

    function fillRole(role: string) {
        const creds = roleCredentials[role];
        setEmail(creds.email);
        setPassword(creds.password);
    }

    return (
        <>
            <Head title="Log in" />

            <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-gradient-to-br from-[#007c47] via-[#006e40] to-[#005c35] p-4">
                {/* Soft decorative backdrop echoing the brand */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute -top-40 -right-40 size-[30rem] rounded-full bg-white/5"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute -bottom-52 -left-36 size-[32rem] rounded-full bg-white/5"
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute top-1/2 left-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10"
                />

                <div className="relative z-10 flex w-full max-w-[1100px] flex-col overflow-hidden rounded-3xl bg-white shadow-2xl md:flex-row">
                    <div className="flex flex-col items-center p-8 md:w-1/2 md:p-10">
                        <div className="mb-6 flex flex-col items-center gap-3">
                            <h2 className="text-xl font-bold text-[#007c47]">
                                Real Estate CRM
                            </h2>
                            <p className="text-sm text-gray-500">Sign In</p>
                        </div>

                        <div className="mb-6 flex flex-wrap justify-center gap-2">
                            {Object.keys(roleCredentials).map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => fillRole(role)}
                                    className="cursor-pointer rounded-full bg-[#007c47] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#005c35]"
                                >
                                    {role}
                                </button>
                            ))}
                        </div>

                        <p className="mb-6 text-center text-xs text-gray-400">
                            *Click a role above to auto-fill credentials
                        </p>

                        <form
                            onSubmit={handleSubmit}
                            className="flex w-full flex-col gap-5"
                        >
                            <div className="grid gap-5">
                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        placeholder="Enter Your Email"
                                        className="h-11 rounded-lg border-gray-300 text-black"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(e.target.value)
                                        }
                                    />
                                    <InputError message={loginErrors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label
                                        htmlFor="password"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Password
                                    </Label>
                                    <PasswordInput
                                        id="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        placeholder="Enter Your Password"
                                        className="h-11 rounded-lg border-gray-300 text-black"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                    <InputError message={loginErrors.password} />
                                </div>

                                <div className="flex items-center space-x-3">
                                    <Checkbox
                                        id="remember"
                                        tabIndex={3}
                                        checked={remember}
                                        onCheckedChange={(checked) =>
                                            setRemember(checked === true)
                                        }
                                    />
                                    <Label
                                        htmlFor="remember"
                                        className="text-sm text-gray-600"
                                    >
                                        Remember Me
                                    </Label>
                                </div>

                                <Button
                                    type="submit"
                                    className="h-11 w-full rounded-lg bg-[#007c47] text-base font-semibold text-white hover:bg-[#005c35]"
                                    tabIndex={4}
                                    disabled={submitting}
                                    data-test="login-button"
                                >
                                    {submitting && <Spinner />}
                                    Sign In
                                </Button>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <Link
                                    href={register()}
                                    className="text-[#007c47] hover:text-[#005c35] hover:underline"
                                >
                                    Register
                                </Link>
                                <Link
                                    href={home()}
                                    className="text-[#007c47] hover:text-[#005c35] hover:underline"
                                >
                                    Home
                                </Link>
                            </div>

                            {canResetPassword && (
                                <div className="text-center">
                                    <Link
                                        href={request()}
                                        className="text-sm text-[#007c47] hover:text-[#005c35] hover:underline"
                                        tabIndex={5}
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                            )}
                        </form>

                        {status && (
                            <div className="mt-4 text-center text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}
                    </div>

                    <div className="relative hidden items-center justify-center overflow-hidden bg-gradient-to-br from-[#007c47] to-[#005c35] p-10 md:flex md:w-1/2">
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -top-16 -right-16 size-64 rounded-full bg-white/10"
                        />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -bottom-20 -left-24 size-72 rounded-full bg-white/5"
                        />
                        <div className="relative text-center text-white">
                            <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-white shadow-lg">
                                <AppLogoIcon className="size-9 fill-current text-[#005c35]" />
                            </div>
                            <h3 className="mb-2 text-2xl font-bold">
                                WSIT Real Estate
                            </h3>
                            <p className="text-sm text-white/80">
                                Property Management System
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

Login.layout = function PassThrough({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
};