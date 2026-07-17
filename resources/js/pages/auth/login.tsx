import { Head, Link, router } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasskeyVerify from '@/components/passkey-verify';
import PasswordInput from '@/components/password-input';
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

            <PasskeyVerify />

            <div className="flex min-h-svh bg-gradient-to-br from-slate-900 to-slate-700">
                <div className="flex w-full max-w-[1100px] flex-col overflow-hidden bg-white shadow-2xl md:mx-auto md:my-auto md:flex-row md:rounded-2xl">
                    <div className="flex flex-col items-center p-8 md:w-1/2 md:p-10">
                        <div className="mb-6 flex flex-col items-center gap-3">
                            <h2 className="text-xl font-bold text-gray-800">
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
                                    className="cursor-pointer rounded-full bg-slate-800 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-slate-700"
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
                                    className="h-11 w-full rounded-lg bg-slate-800 text-base font-semibold hover:bg-slate-700"
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
                                    className="text-slate-700 hover:text-slate-800 hover:underline"
                                >
                                    Register
                                </Link>
                                <Link
                                    href={home()}
                                    className="text-slate-700 hover:text-slate-800 hover:underline"
                                >
                                    Home
                                </Link>
                            </div>

                            {canResetPassword && (
                                <div className="text-center">
                                    <Link
                                        href={request()}
                                        className="text-sm text-red-500 hover:text-red-600 hover:underline"
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

                    <div className="hidden items-center justify-center bg-slate-800 p-10 md:flex md:w-1/2">
                        <div className="text-center text-white">
                            <h3 className="mb-4 text-2xl font-bold">
                                WSIT Real Estate
                            </h3>
                            <p className="text-sm text-gray-300">
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
