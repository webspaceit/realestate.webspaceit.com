<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Models\Building;
use App\Models\Client;
use App\Models\Project;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function index()
    {
        $clients = Client::query()
            ->when(request('search'), function ($query, $search) {
                $query->whereAny(['company_name', 'contact_person', 'email', 'phone_mobile', 'nid_no', 'profession'], 'like', "%{$search}%");
            })
            ->with('nominees')
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('clients/index', [
            'clients' => $clients,
            'filters' => request()->only(['search']),
        ]);
    }

    public function create()
    {
        return Inertia::render('clients/create', [
            'users' => User::all(['id', 'name']),
            'buildings' => Building::with(['units' => function ($q) {
                $q->where('status', 'available')->select(['id', 'building_id', 'unit_number']);
            }])->get(['id', 'name']),
            'projects' => Project::all(['id', 'name', 'building_id']),
        ]);
    }

    public function store(StoreClientRequest $request)
    {
        $data = $request->safe()->except(['nominees', 'photo', 'building_id', 'unit_id', 'project_id']);

        if ($request->hasFile('photo')) {
            $data['photo'] = $request->file('photo')->store('clients', 'public');
        }

        $client = Client::create($data);

        if ($request->has('nominees')) {
            $client->nominees()->createMany($request->nominees);
        }

        if ($request->filled('unit_id')) {
            $client->properties()->create([
                'unit_id' => $request->unit_id,
                'project_id' => $request->project_id,
            ]);
        }

        return redirect()->route('flat-owners.index')
            ->with('success', 'Flat Owner created successfully.');
    }

    public function show(Client $client)
    {
        $client->load([
            'properties' => function ($query) {
                $query->with('unit.building', 'project');
            },
            'nominees',
            'interactions' => fn ($q) => $q->with('recordedBy:id,name')->orderBy('interaction_date', 'desc'),
            'meetings'     => fn ($q) => $q->with('organizer:id,name')->orderBy('scheduled_at', 'desc'),
            'bookings'     => fn ($q) => $q->with('unit.building')->orderBy('booking_date', 'desc'),
        ]);

        return Inertia::render('clients/show', [
            'client' => $client,
        ]);
    }

    public function edit(Client $client)
    {
        $client->load('nominees', 'properties');

        return Inertia::render('clients/edit', [
            'client' => $client,
            'users' => User::all(['id', 'name']),
            'buildings' => Building::with(['units' => function ($q) {
                $q->where('status', 'available')->select(['id', 'building_id', 'unit_number']);
            }])->get(['id', 'name']),
            'projects' => Project::all(['id', 'name', 'building_id']),
        ]);
    }

    public function update(UpdateClientRequest $request, Client $client)
    {
        $data = $request->safe()->except(['nominees', 'photo', 'building_id', 'unit_id', 'project_id']);

        if ($request->hasFile('photo')) {
            if ($client->photo) {
                \Illuminate\Support\Facades\Storage::disk('public')->delete($client->photo);
            }
            $data['photo'] = $request->file('photo')->store('clients', 'public');
        }

        $client->update($data);

        if ($request->has('nominees')) {
            $client->nominees()->delete();
            $client->nominees()->createMany($request->nominees);
        }

        if ($request->filled('unit_id')) {
            $client->properties()->updateOrCreate(
                ['client_id' => $client->id],
                ['unit_id' => $request->unit_id, 'project_id' => $request->project_id]
            );
        } else {
            $client->properties()->delete();
        }

        return redirect()->route('flat-owners.index')
            ->with('success', 'Flat Owner updated successfully.');
    }

    public function destroy(Client $client)
    {
        $client->delete();

        return redirect()->route('flat-owners.index')
            ->with('success', 'Flat Owner deleted successfully.');
    }

    public function pdf(Client $client)
    {
        $client->load(['properties.unit.building', 'nominees']);

        $photoDataUri = null;
        if ($client->photo) {
            $photoPath = storage_path('app/public/' . $client->photo);
            if (file_exists($photoPath)) {
                $mime = mime_content_type($photoPath);
                $photoDataUri = 'data:' . $mime . ';base64,' . base64_encode(file_get_contents($photoPath));
            }
        }

        $pdf = Pdf::loadView('pdf.client', compact('client', 'photoDataUri'));

        return $pdf->download("flat-owner-{$client->id}-{$client->contact_person}.pdf");
    }
}
