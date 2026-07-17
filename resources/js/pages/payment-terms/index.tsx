import { Head, router, usePage } from '@inertiajs/react'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { index, update } from '@/routes/payment-terms'

interface PaymentTerm {
    id?: number
    date_of_opening: string | null
    date_of_handover: string | null
    total_agreed_price: number | null
    down_payment_percentage: number | null
}

interface PageProps {
    paymentTerm: PaymentTerm
}

export default function PaymentTerms() {
    const { paymentTerm } = usePage<PageProps>().props

    const [dateOfOpening, setDateOfOpening] = useState(paymentTerm.date_of_opening || '')
    const [dateOfHandover, setDateOfHandover] = useState(paymentTerm.date_of_handover || '')
    const [totalAgreedPrice, setTotalAgreedPrice] = useState(paymentTerm.total_agreed_price?.toString() || '')
    const [downPaymentPct, setDownPaymentPct] = useState(paymentTerm.down_payment_percentage?.toString() || '')
    const [processing, setProcessing] = useState(false)

    const start = dateOfOpening ? new Date(dateOfOpening + 'T00:00:00') : null
    const end = dateOfHandover ? new Date(dateOfHandover + 'T00:00:00') : null
    const duration = start && end && end >= start ? (() => {
        let years = end.getFullYear() - start.getFullYear()
        let months = end.getMonth() - start.getMonth()
        let days = end.getDate() - start.getDate()
        if (days < 0) {
            const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0)
            days += prevMonth.getDate()
            months--
        }
        if (months < 0) {
            months += 12
            years--
        }
        return { years, months, days }
    })() : null

    const total = Number(totalAgreedPrice) || 0
    const pct = Number(downPaymentPct) || 0
    const downPaymentAmount = total * (pct / 100)
    const remainingAmount = total - downPaymentAmount
    const totalMonths = duration ? duration.years * 12 + duration.months + (duration.days > 0 ? 1 : 0) : 0
    const monthlyPayment = totalMonths > 0 ? remainingAmount / totalMonths : 0

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setProcessing(true)
        router.put(
            update(),
            {
                date_of_opening: dateOfOpening || null,
                date_of_handover: dateOfHandover || null,
                total_agreed_price: totalAgreedPrice ? Number(totalAgreedPrice) : null,
                down_payment_percentage: downPaymentPct ? Number(downPaymentPct) : null,
            },
            {
                preserveState: true,
                preserveScroll: true,
                onSuccess: () => toast.success('Payment Terms updated successfully'),
                onFinish: () => setProcessing(false),
            },
        )
    }

    return (
        <>
            <Head title="Payment Terms" />

            <div className="mb-6">
                <h1 className="text-2xl font-bold">Payment Terms</h1>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="max-w-lg space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Payment Terms Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <Label htmlFor="date_of_opening">Date of Opening</Label>
                                <Input
                                    id="date_of_opening"
                                    type="date"
                                    value={dateOfOpening}
                                    onChange={(e) => setDateOfOpening(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="date_of_handover">Date of Handover</Label>
                                <Input
                                    id="date_of_handover"
                                    type="date"
                                    value={dateOfHandover}
                                    onChange={(e) => setDateOfHandover(e.target.value)}
                                />
                            </div>
                            {duration && (
                                <div className="rounded-lg bg-muted p-3 text-sm">
                                    Total Days: <strong>{duration.years} years, {duration.months} months, {duration.days} days</strong>
                                </div>
                            )}
                            <div className="space-y-1">
                                <Label htmlFor="total_agreed_price">Total Agreed Price (৳)</Label>
                                <Input
                                    id="total_agreed_price"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={totalAgreedPrice}
                                    onChange={(e) => setTotalAgreedPrice(e.target.value)}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="down_payment_pct">Down Payment (%)</Label>
                                <Input
                                    id="down_payment_pct"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    max="100"
                                    value={downPaymentPct}
                                    onChange={(e) => setDownPaymentPct(e.target.value)}
                                />
                            </div>
                            {total > 0 && (
                                <div className="space-y-2 rounded-lg bg-muted p-3 text-sm">
                                    <div className="flex justify-between">
                                        <span>Down Payment ({pct}%)</span>
                                        <strong>৳{downPaymentAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                    </div>
                                    <div className="flex justify-between border-t pt-2">
                                        <span>Remaining Amount</span>
                                        <strong>৳{remainingAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                    </div>
                                </div>
                            )}
                            {total > 0 && totalMonths > 0 && remainingAmount > 0 && (
                                <div className="rounded-lg border p-3 text-sm space-y-2">
                                    <div className="font-medium mb-1">Payment Schedule</div>
                                    <div className="flex justify-between">
                                        <span>Duration</span>
                                        <strong>{totalMonths} months</strong>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Monthly Installment</span>
                                        <strong>৳{monthlyPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-end pt-2">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Payment Terms'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </>
    )
}

PaymentTerms.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Payment Terms', href: '/payment-terms' },
    ],
}
