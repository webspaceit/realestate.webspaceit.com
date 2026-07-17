<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Flat Owner Details</title>
    <style>
        body { font-family: DejaVu Sans, sans-serif; font-size: 11px; color: #333; }
        h1 { font-size: 18px; text-align: center; margin-bottom: 20px; color: #111; }
        h2 { font-size: 13px; background: #f3f4f6; padding: 6px 10px; margin: 15px 0 8px; border-bottom: 2px solid #d1d5db; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        table.details td { padding: 4px 8px; vertical-align: top; }
        table.details td.label { width: 35%; font-weight: bold; color: #555; }
        table.details td.value { width: 65%; }
        table.bordered { border: 1px solid #d1d5db; }
        table.bordered th, table.bordered td { border: 1px solid #d1d5db; padding: 5px 8px; text-align: left; }
        table.bordered th { background: #e5e7eb; font-size: 10px; }
        .section { margin-bottom: 5px; }
        .header-info { text-align: center; margin-bottom: 20px; }
        .header-info .name { font-size: 16px; font-weight: bold; }
        .header-info .email { font-size: 11px; color: #666; }
        .footer { text-align: center; margin-top: 30px; font-size: 9px; color: #999; border-top: 1px solid #e5e7eb; padding-top: 8px; }
    </style>
</head>
<body>
    <h1>Flat Owner Details</h1>

    <div class="header-info">
        @if($photoDataUri)
            <img src="{{ $photoDataUri }}" alt="Photo" style="width:80px;height:80px;border-radius:50%;object-fit:cover;border:1px solid #d1d5db;margin-bottom:8px;" />
        @endif
        <div class="name">{{ $client->contact_person ?: $client->company_name }}</div>
        <div class="email">{{ $client->email }}</div>
    </div>

    <div class="section">
        <h2>Account & Contact</h2>
        <table class="details">
            <tr><td class="label">Name of Flat Owner</td><td class="value">{{ $client->contact_person ?: '-' }}</td></tr>
            <tr><td class="label">Company Name</td><td class="value">{{ $client->company_name ?: '-' }}</td></tr>
            <tr><td class="label">E-mail</td><td class="value">{{ $client->email }}</td></tr>
            <tr><td class="label">Profession</td><td class="value">{{ $client->profession ?: '-' }}</td></tr>
            <tr><td class="label">Nationality</td><td class="value">{{ $client->nationality ?: '-' }}</td></tr>
            <tr><td class="label">Date of Birth</td><td class="value">{{ $client->date_of_birth ?: '-' }}</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Contact Numbers</h2>
        <table class="details">
            <tr><td class="label">Mobile</td><td class="value">{{ $client->phone_mobile ?: '-' }}</td></tr>
            <tr><td class="label">Whatsapp</td><td class="value">{{ $client->phone_whatsapp ?: '-' }}</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Identification</h2>
        <table class="details">
            <tr><td class="label">NID No.</td><td class="value">{{ $client->nid_no ?: '-' }}</td></tr>
            <tr><td class="label">TIN No.</td><td class="value">{{ $client->tin_no ?: '-' }}</td></tr>
            <tr><td class="label">Passport No.</td><td class="value">{{ $client->passport_no ?: '-' }}</td></tr>
            <tr><td class="label">Driving Licence</td><td class="value">{{ $client->driving_licence ?: '-' }}</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Family Information</h2>
        <table class="details">
            <tr><td class="label">Father's Name</td><td class="value">{{ $client->father_name ?: '-' }}</td></tr>
            <tr><td class="label">Mother's Name</td><td class="value">{{ $client->mother_name ?: '-' }}</td></tr>
            <tr><td class="label">Spouse Name</td><td class="value">{{ $client->spouse_name ?: '-' }}</td></tr>
            <tr><td class="label">Spouse NID No.</td><td class="value">{{ $client->spouse_nid_no ?: '-' }}</td></tr>
        </table>
    </div>

    <div class="section">
        <h2>Addresses</h2>
        <table class="details">
            <tr><td class="label">Present Address</td><td class="value">{{ $client->present_address ?: '-' }}</td></tr>
            <tr><td class="label">Permanent Address</td><td class="value">{{ $client->permanent_address ?: '-' }}</td></tr>
            <tr><td class="label">Professional Address</td><td class="value">{{ $client->professional_address ?: '-' }}</td></tr>
        </table>
    </div>

    @if($client->nominees->count())
    <div class="section">
        <h2>Nominees</h2>
        <table class="bordered">
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Relationship</th>
                    <th>Date of Birth</th>
                    <th>Percentage</th>
                </tr>
            </thead>
            <tbody>
                @foreach($client->nominees as $nominee)
                <tr>
                    <td>{{ $nominee->name }}</td>
                    <td>{{ $nominee->relationship }}</td>
                    <td>{{ $nominee->date_of_birth ?: '-' }}</td>
                    <td>{{ $nominee->percentage ? $nominee->percentage . '%' : '-' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    @if($client->properties->count())
    <div class="section">
        <h2>Properties</h2>
        <table class="bordered">
            <thead>
                <tr>
                    <th>Unit</th>
                    <th>Building</th>
                    <th>Ownership Start</th>
                    <th>Ownership End</th>
                </tr>
            </thead>
            <tbody>
                @foreach($client->properties as $prop)
                <tr>
                    <td>{{ $prop->unit->unit_number ?? '-' }}</td>
                    <td>{{ $prop->unit->building->name ?? '-' }}</td>
                    <td>{{ $prop->ownership_start ?: '-' }}</td>
                    <td>{{ $prop->ownership_end ?: '-' }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <div class="footer">
        Generated on {{ now()->format('d M Y, h:i A') }} — WSIT Real Estate
    </div>
</body>
</html>
