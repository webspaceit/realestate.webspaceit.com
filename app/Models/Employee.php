<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Employee extends Model
{
    public const CERTIFICATE_FIELDS = [
        'certificate_1',
        'certificate_2',
        'certificate_3',
        'certificate_4',
        'certificate_5',
        'certificate_6',
    ];

    protected $fillable = [
        'employee_id',
        'full_name',
        'father_name',
        'mother_name',
        'email',
        'mobile',
        'emergency_mobile',
        'dob',
        'present_address',
        'permanent_address',
        'marital_status',
        'passport_no',
        'blood_group',
        'gender',
        'age',
        'religion',
        'national_id',
        'photo',
        'nationality',
        'status',
        'date_of_joining',
        'position_applied_for',
        'department_id',
        'designation_id',
        'designation_level',
        'employment_type',
        'monthly_salary',
        'functional_superior_name',
        'highest_degree',
        'institution',
        'passing_year',
        'cgpa',
        'certificate_1',
        'certificate_2',
        'certificate_3',
        'certificate_4',
        'certificate_5',
        'certificate_6',
    ];

    protected function casts(): array
    {
        return [
            'dob' => 'date',
            'date_of_joining' => 'date',
            'monthly_salary' => 'decimal:2',
        ];
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function designation(): BelongsTo
    {
        return $this->belongsTo(Designation::class);
    }
}