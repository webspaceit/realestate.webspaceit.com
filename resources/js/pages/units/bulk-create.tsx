import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes';
import flatsRoute from '@/routes/flats';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export default function BulkCreate() {
    const [count, setCount] = useState(0);
    const [units, setUnits] = useState<{ unit_number: string; unit_name: string }[]>([]);
    const [processing, setProcessing] = useState(false);

    function handleCountChange(value: number) {
        const clamped = Math.min(Math.max(0, value), 100);
        setCount(clamped);
        setUnits(Array.from({ length: clamped }, (_, i) => units[i] || { unit_number: '', unit_name: '' }));
    }

    function handleUnitChange(index: number, field: 'unit_number' | 'unit_name', value: string) {
        const updated = [...units];
        updated[index] = { ...updated[index], [field]: value };
        setUnits(updated);
    }

    function removeUnit(index: number) {
        const updated = units.filter((_, i) => i !== index);
        setUnits(updated);
        setCount(updated.length);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const payload = units.filter(u => u.unit_number.trim()).map(u => ({ unit_number: u.unit_number.trim(), unit_name: u.unit_name.trim() || null }));
        if (payload.length === 0) {
            toast.error('Enter at least one unit number');
            return;
        }
        setProcessing(true);
        router.post('/flats/bulk', { units: payload }, {
            onSuccess: () => {
                toast.success(`${payload.length} units created`);
                setCount(0);
                setUnits([]);
            },
            onFinish: () => setProcessing(false),
        });
    }

    return (
        <>
            <Head title="Create Units and Numbers" />

            <div className="flex items-center gap-2 mb-6">
                <Link href="/flats">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="size-4" />
                    </Button>
                </Link>
                <Plus className="size-6" />
                <h1 className="text-2xl font-semibold">Create Units and Numbers</h1>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Bulk Unit Creation</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="count">How many units?</Label>
                            <Input
                                id="count"
                                type="number"
                                min={0}
                                max={100}
                                value={count || ''}
                                onChange={(e) => handleCountChange(Number(e.target.value))}
                                placeholder="Enter number of units"
                            />
                        </div>

                        {count > 0 && (
                            <div className="space-y-3">
                                <Label>Units</Label>
                                {units.map((unit, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <div className="flex-1">
                                            <Input
                                                type="text"
                                                value={unit.unit_number}
                                                onChange={(e) => handleUnitChange(i, 'unit_number', e.target.value)}
                                                placeholder={`Unit ${i + 1} number`}
                                                required
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <Input
                                                type="text"
                                                value={unit.unit_name}
                                                onChange={(e) => handleUnitChange(i, 'unit_name', e.target.value)}
                                                placeholder={`Unit ${i + 1} name`}
                                            />
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => removeUnit(i)}
                                        >
                                            <Trash2 className="size-4 text-destructive" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {count > 0 && (
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creating...' : `Create ${units.filter(u => u.unit_number.trim()).length || 0} Units`}
                            </Button>
                        )}
                    </form>
                </CardContent>
            </Card>
        </>
    );
}

BulkCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Flats', href: flatsRoute.index() },
        { title: 'Bulk Create', href: flatsRoute.bulkCreate() },
    ],
};
