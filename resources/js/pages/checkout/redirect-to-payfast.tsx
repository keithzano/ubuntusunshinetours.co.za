import { Head } from '@inertiajs/react';
import { Loader2 } from 'lucide-react';
import { useEffect, useRef } from 'react';

import { PageProps } from '@/types';

interface RedirectPageProps extends PageProps {
    payFastUrl: string;
    paymentData: Record<string, string>;
}

export default function RedirectToPayFast({ payFastUrl, paymentData }: RedirectPageProps) {
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        // Auto-submit the form to PayFast
        if (formRef.current) {
            formRef.current.submit();
        }
    }, []);

    return (
        <>
            <Head title="Redirecting to PayFast..." />

            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
                    <h1 className="mb-2 text-xl font-semibold">Redirecting to PayFast...</h1>
                    <p className="text-muted-foreground">
                        Please wait while we redirect you to the secure payment page.
                    </p>
                </div>
            </div>

            {/* Hidden form that auto-submits to PayFast */}
            <form ref={formRef} action={payFastUrl} method="POST" className="hidden">
                {Object.entries(paymentData).map(([key, value]) => (
                    <input key={key} type="hidden" name={key} value={value} />
                ))}
            </form>
        </>
    );
}
