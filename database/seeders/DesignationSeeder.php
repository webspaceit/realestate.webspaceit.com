<?php

namespace Database\Seeders;

use App\Models\Designation;
use Illuminate\Database\Seeder;

class DesignationSeeder extends Seeder
{
    public function run(): void
    {
        $designations = [
            'CEO',
            'Managing Director',
            'Executive Director',
            'Director',
            'Senior Manager',
            'Manager',
            'Assistant Manager',
            'Supervisor',
            'Senior Officer',
            'Officer',
            'Junior Officer',
            'Executive Officer',
            'Team Leader',
            'Operational Manager',
            'Coordinator',
            'Administrative Officer',
            'System Analyst',
            'Executive IT',
            'IT Officer',
            'Graphics Designer',
            'Office Assistant',
            'Security Guard',
        ];

        foreach ($designations as $name) {
            Designation::updateOrCreate(
                ['name' => $name],
                ['status' => 'active'],
            );
        }
    }
}