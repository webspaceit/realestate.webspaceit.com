<?php

namespace Database\Seeders;

use App\Models\Budget;
use App\Models\Building;
use App\Models\Client;
use App\Models\ClientProperty;
use App\Models\Contractor;
use App\Models\ContractorAssignment;
use App\Models\Document;
use App\Models\Expense;
use App\Models\Inventory;
use App\Models\InventoryMovement;
use App\Models\Material;
use App\Models\MaterialPurchase;
use App\Models\Nominee;
use App\Models\Project;
use App\Models\ProjectMilestone;
use App\Models\ProjectPhase;
use App\Models\ProjectTask;
use App\Models\Supplier;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Database\Seeder;

class RealEstateSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@realestate.test',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Manager User',
            'email' => 'manager@realestate.test',
            'role' => 'manager',
        ]);

        User::factory()->create([
            'name' => 'Staff User',
            'email' => 'staff@realestate.test',
            'role' => 'staff',
        ]);

        $building1 = Building::create([
            'name' => 'Skyline Towers',
            'code' => 'ST-001',
            'address' => '123 Main Street, Downtown',
            'total_floors' => 20,
            'total_units' => 80,
            'status' => 'under_construction',
            'description' => 'A premium residential tower with modern amenities.',
        ]);

        $building2 = Building::create([
            'name' => 'Green Valley Residency',
            'code' => 'GVR-001',
            'address' => '456 Park Avenue, Suburb',
            'total_floors' => 12,
            'total_units' => 48,
            'status' => 'completed',
            'description' => 'Eco-friendly residential complex with garden views.',
        ]);

        $building3 = Building::create([
            'name' => 'Ocean View Plaza',
            'code' => 'OVP-001',
            'address' => '789 Beach Road, Coastal Area',
            'total_floors' => 15,
            'total_units' => 60,
            'status' => 'planned',
            'description' => 'Luxury beachfront apartments with panoramic ocean views.',
        ]);

        foreach ([$building1, $building2, $building3] as $building) {
            for ($floor = 1; $floor <= $building->total_floors && $floor <= 5; $floor++) {
                for ($num = 1; $num <= 4; $num++) {
                    Unit::create([
                        'building_id' => $building->id,
                        'unit_number' => sprintf('%d%02d', $floor, $num),
                        'floor' => $floor,
                        'bedrooms' => rand(1, 3),
                        'bathrooms' => rand(1, 2),
                        'area_sqft' => rand(600, 2000),
                        'price' => rand(50000, 500000),
                        'status' => $building->status === 'completed' ? 'available' : 'under_construction',
                        'description' => "Beautiful unit on floor $floor with ".rand(1, 3).' bedrooms.',
                    ]);
                }
            }
        }

        $project1 = Project::create([
            'building_id' => $building1->id,
            'name' => 'Skyline Towers Construction',
            'description' => 'Full construction of the Skyline Towers residential building.',
            'start_date' => '2024-01-15',
            'end_date' => '2025-12-30',
            'budget' => 15000000.00,
            'status' => 'in_progress',
        ]);

        $project2 = Project::create([
            'building_id' => $building2->id,
            'name' => 'Green Valley Finishing Works',
            'description' => 'Interior finishing and landscaping for Green Valley Residency.',
            'start_date' => '2024-03-01',
            'end_date' => '2024-11-30',
            'budget' => 5000000.00,
            'status' => 'completed',
        ]);

        $project3 = Project::create([
            'building_id' => $building3->id,
            'name' => 'Ocean View Foundation Work',
            'description' => 'Foundation and structural work for Ocean View Plaza.',
            'start_date' => '2025-06-01',
            'end_date' => '2026-03-31',
            'budget' => 8000000.00,
            'status' => 'planning',
        ]);

        // Associate buildings with projects
        $building1->update(['project_id' => $project1->id]);
        $building2->update(['project_id' => $project2->id]);
        $building3->update(['project_id' => $project3->id]);

        $phasesData = [
            [$project1, 'Foundation', '2024-01-15', '2024-04-30', 'completed', 1],
            [$project1, 'Structural Framing', '2024-05-01', '2024-09-30', 'completed', 2],
            [$project1, 'MEP Installation', '2024-10-01', '2025-04-30', 'in_progress', 3],
            [$project1, 'Interior Finishing', '2025-01-01', '2025-09-30', 'pending', 4],
            [$project1, 'Exterior & Landscaping', '2025-05-01', '2025-12-30', 'pending', 5],
            [$project2, 'Interior Design', '2024-03-01', '2024-06-30', 'completed', 1],
            [$project2, 'Flooring & Painting', '2024-07-01', '2024-09-30', 'completed', 2],
            [$project2, 'Landscaping', '2024-10-01', '2024-11-30', 'completed', 3],
            [$project3, 'Site Preparation', '2025-06-01', '2025-07-31', 'pending', 1],
            [$project3, 'Excavation', '2025-08-01', '2025-10-31', 'pending', 2],
        ];

        foreach ($phasesData as [$project, $name, $start, $end, $status, $order]) {
            ProjectPhase::create([
                'project_id' => $project->id,
                'name' => $name,
                'description' => "$name phase for {$project->name}.",
                'start_date' => $start,
                'end_date' => $end,
                'status' => $status,
                'order' => $order,
            ]);
        }

        $phases = ProjectPhase::all();
        $users = User::all();

        foreach ($phases->where('status', 'in_progress') as $phase) {
            for ($i = 1; $i <= 3; $i++) {
                ProjectTask::create([
                    'phase_id' => $phase->id,
                    'name' => "Task $i for {$phase->name}",
                    'description' => "Description for task $i in phase {$phase->name}.",
                    'assigned_to' => $users->random()->id,
                    'start_date' => $phase->start_date,
                    'end_date' => $phase->end_date,
                    'status' => $i === 1 ? 'done' : 'in_progress',
                    'priority' => ['low', 'medium', 'high', 'urgent'][rand(0, 3)],
                ]);
            }
        }

        $projects = [$project1, $project2, $project3];
        foreach ($projects as $projectData) {
            for ($i = 1; $i <= 2; $i++) {
                ProjectMilestone::create([
                    'project_id' => $projectData->id,
                    'name' => "Milestone $i for {$projectData->name}",
                    'description' => "Key milestone $i for project completion.",
                    'due_date' => $projectData->end_date,
                    'status' => $projectData->status === 'completed' ? 'achieved' : 'pending',
                ]);
            }
        }

        $contractor1 = Contractor::create([
            'company_name' => 'BuildRight Construction Co.',
            'contact_person' => 'John Smith',
            'email' => 'john@buildright.test',
            'phone' => '+1-555-0101',
            'address' => '100 Industry Road, Industrial Zone',
            'specialization' => 'General Contracting',
            'license_number' => 'LIC-2024-001',
            'status' => 'active',
        ]);

        $contractor2 = Contractor::create([
            'company_name' => 'Elite MEP Solutions',
            'contact_person' => 'Sarah Johnson',
            'email' => 'sarah@elitemep.test',
            'phone' => '+1-555-0102',
            'address' => '200 Tech Park, Business District',
            'specialization' => 'MEP Installation',
            'license_number' => 'LIC-2024-002',
            'status' => 'active',
        ]);

        $contractor3 = Contractor::create([
            'company_name' => 'GreenScape Landscaping',
            'contact_person' => 'Mike Wilson',
            'email' => 'mike@greenscape.test',
            'phone' => '+1-555-0103',
            'address' => '300 Garden Lane, Suburb',
            'specialization' => 'Landscaping',
            'license_number' => 'LIC-2024-003',
            'status' => 'active',
        ]);

        ContractorAssignment::create([
            'contractor_id' => $contractor1->id,
            'project_id' => $project1->id,
            'task_id' => null,
            'contract_amount' => 5000000.00,
            'start_date' => '2024-01-15',
            'end_date' => '2025-06-30',
            'status' => 'active',
        ]);

        ContractorAssignment::create([
            'contractor_id' => $contractor2->id,
            'project_id' => $project1->id,
            'task_id' => null,
            'contract_amount' => 2000000.00,
            'start_date' => '2024-10-01',
            'end_date' => '2025-04-30',
            'status' => 'active',
        ]);

        ContractorAssignment::create([
            'contractor_id' => $contractor3->id,
            'project_id' => $project2->id,
            'task_id' => null,
            'contract_amount' => 500000.00,
            'start_date' => '2024-10-01',
            'end_date' => '2024-11-30',
            'status' => 'completed',
        ]);

        $supplier1 = Supplier::create([
            'company_name' => 'SteelMart Inc.',
            'contact_person' => 'Robert Brown',
            'email' => 'robert@steelmart.test',
            'phone' => '+1-555-0201',
            'address' => '500 Metal Street, Industrial Area',
        ]);

        $supplier2 = Supplier::create([
            'company_name' => 'CementPro Supplies',
            'contact_person' => 'Lisa Davis',
            'email' => 'lisa@cementpro.test',
            'phone' => '+1-555-0202',
            'address' => '600 Concrete Road, Quarry District',
        ]);

        $supplier3 = Supplier::create([
            'company_name' => 'Luxury Finishes Ltd.',
            'contact_person' => 'James Wilson',
            'email' => 'james@luxuryfinishes.test',
            'phone' => '+1-555-0203',
            'address' => '700 Design Avenue, Creative Zone',
        ]);

        $material1 = Material::create([
            'name' => 'Steel Rebar 16mm',
            'sku' => 'SRB-16MM',
            'description' => 'High-strength steel reinforcement bars.',
            'unit' => 'ton',
            'unit_price' => 850.00,
            'category' => 'Structural',
        ]);

        $material2 = Material::create([
            'name' => 'Portland Cement 50kg',
            'sku' => 'PC-50KG',
            'description' => 'Premium quality Portland cement bags.',
            'unit' => 'bag',
            'unit_price' => 12.50,
            'category' => 'Structural',
        ]);

        $material3 = Material::create([
            'name' => 'Ceramic Floor Tiles 60x60',
            'sku' => 'CFT-6060',
            'description' => 'High-gloss ceramic floor tiles.',
            'unit' => 'sqm',
            'unit_price' => 25.00,
            'category' => 'Finishing',
        ]);

        $material4 = Material::create([
            'name' => 'PVC Pipes 4 inch',
            'sku' => 'PVC-4IN',
            'description' => 'Schedule 40 PVC pipes for plumbing.',
            'unit' => 'meter',
            'unit_price' => 8.00,
            'category' => 'Plumbing',
        ]);

        $material5 = Material::create([
            'name' => 'Electrical Wire 2.5mm',
            'sku' => 'EW-2.5MM',
            'description' => 'Copper electrical wiring cable.',
            'unit' => 'meter',
            'unit_price' => 3.50,
            'category' => 'Electrical',
        ]);

        $inventory1 = Inventory::create([
            'material_id' => $material1->id,
            'quantity' => 50,
            'minimum_quantity' => 10,
            'location' => 'Warehouse A',
        ]);

        $inventory2 = Inventory::create([
            'material_id' => $material2->id,
            'quantity' => 200,
            'minimum_quantity' => 50,
            'location' => 'Warehouse A',
        ]);

        $inventory3 = Inventory::create([
            'material_id' => $material3->id,
            'quantity' => 500,
            'minimum_quantity' => 100,
            'location' => 'Warehouse B',
        ]);

        $inventory4 = Inventory::create([
            'material_id' => $material4->id,
            'quantity' => 5,
            'minimum_quantity' => 50,
            'location' => 'Warehouse C',
        ]);

        $inventory5 = Inventory::create([
            'material_id' => $material5->id,
            'quantity' => 300,
            'minimum_quantity' => 100,
            'location' => 'Warehouse C',
        ]);

        InventoryMovement::create([
            'inventory_id' => $inventory1->id,
            'quantity_change' => 50,
            'type' => 'in',
            'notes' => 'Initial stock purchase',
        ]);

        InventoryMovement::create([
            'inventory_id' => $inventory2->id,
            'quantity_change' => 200,
            'type' => 'in',
            'notes' => 'Initial stock purchase',
        ]);

        InventoryMovement::create([
            'inventory_id' => $inventory1->id,
            'quantity_change' => -10,
            'type' => 'out',
            'notes' => 'Issued to Skyline Towers construction',
        ]);

        $purchasesData = [
            [$material1, $supplier1, 50, 850.00, '2024-01-20', 'received'],
            [$material2, $supplier2, 200, 12.50, '2024-01-20', 'received'],
            [$material3, $supplier3, 500, 25.00, '2024-03-15', 'received'],
            [$material4, $supplier1, 200, 8.00, '2024-04-10', 'approved'],
            [$material5, $supplier2, 500, 3.50, '2024-04-10', 'approved'],
        ];

        foreach ($purchasesData as [$material, $supplier, $qty, $price, $date, $status]) {
            MaterialPurchase::create([
                'material_id' => $material->id,
                'supplier_id' => $supplier->id,
                'quantity' => $qty,
                'unit_price' => $price,
                'total_price' => $qty * $price,
                'purchase_date' => $date,
                'status' => $status,
            ]);
        }

        $budgetCategories = ['Foundation', 'Structure', 'MEP', 'Finishing', 'Landscaping', 'Permits', 'Labor'];
        foreach ([$project1, $project2, $project3] as $project) {
            foreach ($budgetCategories as $category) {
                $amount = rand(200000, 2000000);
                Budget::create([
                    'project_id' => $project->id,
                    'phase_id' => $project->phases->first()?->id,
                    'category' => $category,
                    'amount' => $amount,
                    'spent' => $project->status === 'completed' ? $amount : rand(0, (int) ($amount * 0.7)),
                ]);
            }
        }

        $expenseCategories = ['Foundation', 'Structure', 'MEP', 'Finishing', 'Landscaping', 'Permits', 'Labor'];
        foreach ([$project1, $project2] as $project) {
            for ($i = 1; $i <= 5; $i++) {
                Expense::create([
                    'project_id' => $project->id,
                    'phase_id' => $project->phases->first()?->id,
                    'category' => $expenseCategories[array_rand($expenseCategories)],
                    'amount' => rand(5000, 100000),
                    'description' => "Expense item $i for {$project->name}.",
                    'expense_date' => now()->subDays(rand(1, 365)),
                    'paid_to' => ['ABC Supplier', 'XYZ Services', 'LMN Contractors'][rand(0, 2)],
                ]);
            }
        }

        $client1 = Client::create([
            'user_id' => null,
            'company_name' => 'Smith Family Trust',
            'contact_person' => 'John Smith',
            'designation' => 'Managing Trustee',
            'email' => 'john.smith@email.test',
            'phone' => '+1-555-0301',
            'phone_mobile' => '+1-555-0401',
            'phone_whatsapp' => '+1-555-0401',
            'date_of_birth' => '1978-04-15',
            'nid_no' => 'NID-789012345',
            'tin_no' => 'TIN-456789012',
            'passport_no' => 'AB1234567',
            'driving_licence' => 'DL-87654321',
            'profession' => 'Businessman',
            'nationality' => 'American',
            'father_name' => 'Robert Smith',
            'mother_name' => 'Martha Smith',
            'spouse_name' => 'Jane Smith',
            'spouse_nid_no' => 'NID-345678901',
            'present_address' => '10 Oak Avenue, Residential Area',
            'permanent_address' => '25 Pine Road, Countryside',
            'professional_address' => '200 Commerce Street, Downtown',
        ]);

        Nominee::create([
            'client_id' => $client1->id,
            'name' => 'Jane Smith',
            'relationship' => 'Spouse',
            'date_of_birth' => '1980-03-10',
            'percentage' => 100,
        ]);

        $client2 = Client::create([
            'user_id' => null,
            'company_name' => null,
            'contact_person' => 'Emily Davis',
            'designation' => 'Home Buyer',
            'email' => 'emily.davis@email.test',
            'phone' => '+1-555-0302',
            'phone_mobile' => '+1-555-0402',
            'phone_whatsapp' => '+1-555-0402',
            'date_of_birth' => '1990-11-22',
            'nid_no' => 'NID-567890123',
            'tin_no' => 'TIN-123456789',
            'passport_no' => null,
            'driving_licence' => null,
            'profession' => 'Software Engineer',
            'nationality' => 'American',
            'father_name' => 'Michael Davis',
            'mother_name' => 'Sarah Davis',
            'spouse_name' => null,
            'spouse_nid_no' => null,
            'present_address' => '20 Maple Street, Downtown',
            'permanent_address' => '20 Maple Street, Downtown',
            'professional_address' => '500 Tech Park, Innovation Hub',
        ]);

        Nominee::create([
            'client_id' => $client2->id,
            'name' => 'Michael Davis',
            'relationship' => 'Father',
            'date_of_birth' => '1960-07-05',
            'percentage' => 100,
        ]);

        $units = Unit::where('status', 'available')->take(2)->get();
        if ($units->count() >= 2) {
            ClientProperty::create([
                'client_id' => $client1->id,
                'unit_id' => $units[0]->id,
                'ownership_start' => '2024-06-01',
            ]);
            ClientProperty::create([
                'client_id' => $client2->id,
                'unit_id' => $units[1]->id,
                'ownership_start' => '2024-07-15',
            ]);
        }

        Document::create([
            'project_id' => $project1->id,
            'building_id' => $building1->id,
            'name' => 'Skyline Towers Blueprint',
            'file_path' => '/documents/blueprints/st-blueprint-v2.pdf',
            'type' => 'application/pdf',
            'category' => 'Blueprint',
            'uploaded_by' => $admin->id,
        ]);

        Document::create([
            'project_id' => $project2->id,
            'building_id' => $building2->id,
            'name' => 'Green Valley Permit',
            'file_path' => '/documents/permits/gv-permit.pdf',
            'type' => 'application/pdf',
            'category' => 'Permit',
            'uploaded_by' => $admin->id,
        ]);

        Document::create([
            'project_id' => $project1->id,
            'building_id' => $building1->id,
            'name' => 'Structural Analysis Report',
            'file_path' => '/documents/reports/structural-analysis.pdf',
            'type' => 'application/pdf',
            'category' => 'Report',
            'uploaded_by' => $admin->id,
        ]);

        $this->command->info('Real estate database seeded successfully!');
        $this->command->info('Admin login: admin@realestate.test / password');
    }
}
