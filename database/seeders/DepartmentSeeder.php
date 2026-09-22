<?php

namespace Database\Seeders;

use App\Models\Department;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    public function run(): void
    {
        $departments = [
            ['name' => 'Administration', 'code' => 'ADM'],
            ['name' => 'Finance and Accounts', 'code' => 'FIN'],
            ['name' => 'Human Resources (HR)', 'code' => 'HR'],
            ['name' => 'Legal and Corporate Affairs', 'code' => 'LEG'],
            ['name' => 'Commercial & Operation', 'code' => 'COM'],
            ['name' => 'Sales and Marketing', 'code' => 'S&M'],
            ['name' => 'Procurement and Supply Chain', 'code' => 'PSC'],
            ['name' => 'Information Technology (IT)', 'code' => 'IT'],
        ];

        foreach ($departments as $department) {
            Department::updateOrCreate(
                ['name' => $department['name']],
                ['code' => $department['code'], 'status' => 'active'],
            );
        }
    }
}