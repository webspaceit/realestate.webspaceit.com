<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContractorRequest;
use App\Http\Requests\UpdateContractorRequest;
use App\Models\Contractor;
use App\Models\Specialization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ContractorController extends Controller
{
    public function index(Request $request)
    {
        $contractors = Contractor::query()
            ->when($request->search, fn ($q, $search) => $q->whereAny(['company_name', 'contact_person', 'email', 'phone', 'license_number'], 'like', "%{$search}%"))
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('contractors/index', [
            'contractors' => $contractors,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    public function create()
    {
        return Inertia::render('contractors/create', [
            'specializations' => Specialization::orderBy('name')->pluck('name'),
        ]);
    }

    public function store(StoreContractorRequest $request)
    {
        $data = $request->safe()->except(['nid', 'bio_data', 'deed_of_agreement', 'passport_photo']);

        foreach (['nid', 'bio_data', 'deed_of_agreement', 'passport_photo'] as $field) {
            if ($request->hasFile($field)) {
                $data[$field] = $request->file($field)->store('contractors', 'public');
            }
        }

        Contractor::create($data);

        return redirect()->route('contractors.index');
    }

    public function show(Contractor $contractor)
    {
        return Inertia::render('contractors/show', compact('contractor'));
    }

    public function edit(Contractor $contractor)
    {
        return Inertia::render('contractors/edit', [
            'contractor' => $contractor,
            'specializations' => Specialization::orderBy('name')->pluck('name'),
        ]);
    }

    public function update(UpdateContractorRequest $request, Contractor $contractor)
    {
        $data = $request->safe()->except(['nid', 'bio_data', 'deed_of_agreement', 'passport_photo']);

        foreach (['nid', 'bio_data', 'deed_of_agreement', 'passport_photo'] as $field) {
            if ($request->hasFile($field)) {
                if ($contractor->$field) {
                    Storage::disk('public')->delete($contractor->$field);
                }
                $data[$field] = $request->file($field)->store('contractors', 'public');
            }
        }

        $contractor->update($data);

        return redirect()->route('contractors.index');
    }

    public function destroy(Contractor $contractor)
    {
        foreach (['nid', 'bio_data', 'deed_of_agreement', 'passport_photo'] as $field) {
            if ($contractor->$field) {
                Storage::disk('public')->delete($contractor->$field);
            }
        }

        $contractor->delete();

        return redirect()->route('contractors.index');
    }
}
