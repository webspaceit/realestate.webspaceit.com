<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Interaction;
use App\Models\Lead;
use App\Models\Meeting;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class CrmSeeder extends Seeder
{
    public function run(): void
    {
        $userId = User::first()?->id ?? 1;

        // ── Pipeline stages & config ─────────────────────────────────────
        $stages  = array_keys(config('crm.stages'));
        $sources = config('crm.sources');
        $interactionTypes = config('crm.interaction_types');
        $meetingStatuses  = config('crm.meeting_statuses');

        $contacts = [
            ['Karim Ahmed',    'Karim Properties Ltd',     'karim@karimprops.com',   '01711-100001'],
            ['Rina Begum',     'Rina Real Estate',         'rina@rinahomes.com',     '01711-100002'],
            ['Farhan Hossain', 'Hossain Developers',       'farhan@hossaindev.com',  '01711-100003'],
            ['Shahin Alam',    'Skyline Group',            'shahin@skyline.com.bd',  '01711-100004'],
            ['Nasrin Sultana', 'Green Valley Homes',       'nasrin@greenvalley.bd',  '01711-100005'],
            ['Rubel Islam',    'Rubel Constructions',      'rubel@rubelcon.com',     '01711-100006'],
            ['Mitu Khanam',    'Mitu Associates',          'mitu@mituassoc.com',     '01711-100007'],
            ['Tanvir Rahman',  'Rahman & Sons',            'tanvir@rahmanson.com',   '01711-100008'],
            ['Puja Das',       'Das Properties',           'puja@dasprops.com',      '01711-100009'],
            ['Jahir Uddin',    null,                        'jahir@gmail.com',        '01711-100010'],
            ['Salma Khatun',   'Salma Builders',           'salma@salmabuilders.com','01711-100011'],
            ['Nayeem Hasan',   'Nayeem Holdings',          'nayeem@nayeemhold.com',  '01711-100012'],
        ];

        // ── Spread leads across the last 12 months ───────────────────────
        foreach ($contacts as $i => [$name, $company, $email, $phone]) {
            $monthsAgo  = $i % 12;
            $createdAt  = Carbon::now()->subMonths($monthsAgo)->subDays(rand(0, 25));
            $stageIndex = $i % count($stages);
            $stage      = $stages[$stageIndex];
            $prob       = config('crm.stages')[$stage]['probability'];
            $value      = rand(20, 250) * 100000; // ৳20L – ৳250L

            $lead = Lead::create([
                'contact_person'  => $name,
                'company_name'    => $company,
                'email'           => $email,
                'phone'           => $phone,
                'source'          => $sources[$i % count($sources)],
                'stage'           => $stage,
                'probability'     => $prob,
                'value'           => $value,
                'assigned_to_id'  => $userId,
                'follow_up_date'  => Carbon::now()->addDays(rand(1, 30))->toDateString(),
                'notes'           => "Initial enquiry about residential project. Budget around ৳" . number_format($value) . ".",
                'created_at'      => $createdAt,
                'updated_at'      => $createdAt,
            ]);

            // 2–4 interactions per lead spread over the past months
            $interactionCount = rand(2, 4);
            for ($j = 0; $j < $interactionCount; $j++) {
                Interaction::create([
                    'lead_id'          => $lead->id,
                    'client_id'        => null,
                    'type'             => $interactionTypes[($i + $j) % count($interactionTypes)],
                    'subject'          => $this->interactionSubject($j),
                    'notes'            => "Follow-up " . ($j + 1) . " with {$name}. Discussed project details and pricing.",
                    'interaction_date' => $createdAt->copy()->addDays($j * rand(3, 10))->toDateString(),
                    'recorded_by_id'   => $userId,
                ]);
            }

            // 1–2 meetings per lead
            $meetingCount = rand(1, 2);
            for ($k = 0; $k < $meetingCount; $k++) {
                Meeting::create([
                    'lead_id'      => $lead->id,
                    'client_id'    => null,
                    'title'        => $this->meetingTitle($k),
                    'location'     => $this->meetingLocation($k),
                    'scheduled_at' => $createdAt->copy()->addDays($k * rand(5, 15) + 2),
                    'status'       => $meetingStatuses[$k % count($meetingStatuses)],
                    'notes'        => "Meeting with {$name} to discuss flat options.",
                    'outcome'      => $k === 0 ? "Client showed strong interest. Requested detailed proposal." : null,
                    'organizer_id' => $userId,
                ]);
            }
        }

        // ── A few client-linked interactions (for client history section) ─
        $clients = Client::take(5)->get();
        foreach ($clients as $idx => $client) {
            for ($j = 0; $j < rand(2, 3); $j++) {
                Interaction::create([
                    'lead_id'          => null,
                    'client_id'        => $client->id,
                    'type'             => $interactionTypes[($idx + $j) % count($interactionTypes)],
                    'subject'          => "Post-purchase follow-up " . ($j + 1),
                    'notes'            => "Checked in with client about documentation and handover timeline.",
                    'interaction_date' => Carbon::now()->subDays(rand(1, 60))->toDateString(),
                    'recorded_by_id'   => $userId,
                ]);
            }
        }

        $this->command->info('CRM seed complete — ' . Lead::count() . ' leads, ' . Interaction::count() . ' interactions, ' . Meeting::count() . ' meetings.');
    }

    private function interactionSubject(int $index): string
    {
        $subjects = [
            'Initial enquiry call',
            'Project brochure sent',
            'Site visit follow-up',
            'Pricing discussion',
            'Payment plan shared',
            'Booking interest confirmed',
            'WhatsApp follow-up',
        ];
        return $subjects[$index % count($subjects)];
    }

    private function meetingTitle(int $index): string
    {
        $titles = [
            'Initial Site Visit',
            'Proposal Presentation',
            'Negotiation Meeting',
            'Documentation Review',
        ];
        return $titles[$index % count($titles)];
    }

    private function meetingLocation(int $index): string
    {
        $locations = [
            'Office — Gulshan 2',
            'Project Site',
            'Client Office',
            'Video Call',
        ];
        return $locations[$index % count($locations)];
    }
}
