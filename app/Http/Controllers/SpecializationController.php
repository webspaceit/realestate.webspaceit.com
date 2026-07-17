<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSpecializationRequest;
use App\Http\Requests\UpdateSpecializationRequest;
use App\Models\Specialization;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SpecializationController extends Controller
{
    public function index(Request $request)
    {
        $specializations = Specialization::query()
            ->when($request->search, fn ($q, $search) => $q->where('name', 'like', "%{$search}%"))
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('specializations/index', [
            'specializations' => $specializations,
            'filters' => $request->only('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('specializations/create');
    }

    public function store(StoreSpecializationRequest $request)
    {
        Specialization::create($request->validated());

        return redirect()->route('specializations.index');
    }

    public function show(Specialization $specialization)
    {
        return Inertia::render('specializations/show', compact('specialization'));
    }

    public function edit(Specialization $specialization)
    {
        return Inertia::render('specializations/edit', compact('specialization'));
    }

    public function update(UpdateSpecializationRequest $request, Specialization $specialization)
    {
        $specialization->update($request->validated());

        return redirect()->route('specializations.index');
    }

    public function destroy(Specialization $specialization)
    {
        $specialization->delete();

        return redirect()->route('specializations.index');
    }
}
