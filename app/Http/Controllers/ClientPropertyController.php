<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientPropertyRequest;
use App\Http\Requests\UpdateClientPropertyRequest;
use App\Models\Client;
use App\Models\ClientProperty;
use App\Models\Unit;
use Inertia\Inertia;

class ClientPropertyController extends Controller
{
    public function index()
    {
        $properties = ClientProperty::query()
            ->when(request('client_id'), function ($query, $clientId) {
                $query->where('client_id', $clientId);
            })
            ->with('client', 'unit.building')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('client-properties/index', [
            'properties' => $properties,
            'filters' => request()->only(['client_id']),
        ]);
    }

    public function create()
    {
        return Inertia::render('client-properties/create', [
            'clients' => Client::all(['id', 'contact_person', 'company_name']),
            'units' => Unit::with('building')->get(['id', 'unit_number', 'building_id']),
        ]);
    }

    public function store(StoreClientPropertyRequest $request)
    {
        ClientProperty::create($request->validated());

        return redirect()->route('client-properties.index')
            ->with('success', 'Client property created successfully.');
    }

    public function show(ClientProperty $clientProperty)
    {
        $clientProperty->load('client', 'unit.building');

        return Inertia::render('client-properties/show', [
            'clientProperty' => $clientProperty,
        ]);
    }

    public function edit(ClientProperty $clientProperty)
    {
        return Inertia::render('client-properties/edit', [
            'clientProperty' => $clientProperty,
            'clients' => Client::all(['id', 'contact_person', 'company_name']),
            'units' => Unit::with('building')->get(['id', 'unit_number', 'building_id']),
        ]);
    }

    public function update(UpdateClientPropertyRequest $request, ClientProperty $clientProperty)
    {
        $clientProperty->update($request->validated());

        return redirect()->route('client-properties.index')
            ->with('success', 'Client property updated successfully.');
    }

    public function destroy(ClientProperty $clientProperty)
    {
        $clientProperty->delete();

        return redirect()->route('client-properties.index')
            ->with('success', 'Client property deleted successfully.');
    }
}
