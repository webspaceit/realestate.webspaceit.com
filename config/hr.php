<?php

// HR module registry. Each module is backed by the polymorphic hr_records table
// and driven by this declarative field config, so adding a module is just an
// entry here (optionally a seeder row).

return [

    'modules' => [

        'leave_applications' => [
            'title' => 'Leave Application',
            'fields' => [
                ['key' => 'employee', 'label' => 'Employee', 'type' => 'employee', 'required' => true],
                ['key' => 'leave_type', 'label' => 'Leave Type', 'type' => 'select', 'required' => true,
                    'options' => ['Sick Leave', 'Casual Leave', 'Earned Leave', 'Maternity Leave', 'Paternity Leave', 'Unpaid Leave', 'Study Leave', 'Emergency Leave']],
                ['key' => 'from_date', 'label' => 'From Date', 'type' => 'date', 'required' => true],
                ['key' => 'to_date', 'label' => 'To Date', 'type' => 'date', 'required' => true],
                ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Pending', 'Approved', 'Rejected', 'Cancelled']],
                ['key' => 'reason', 'label' => 'Reason', 'type' => 'textarea'],
            ],
            'columns' => ['employee', 'leave_type', 'from_date', 'to_date', 'status'],
        ],

        'responsibilities' => [
            'title' => 'Responsibility',
            'fields' => [
                ['key' => 'employee', 'label' => 'Employee', 'type' => 'employee'],
                ['key' => 'title', 'label' => 'Title', 'type' => 'text'],
                ['key' => 'description', 'label' => 'Description', 'type' => 'textarea'],
                ['key' => 'assigned_by', 'label' => 'Assigned By', 'type' => 'text'],
                ['key' => 'date', 'label' => 'Due Date', 'type' => 'date'],
                ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Pending', 'In Progress', 'Completed']],
            ],
            'columns' => ['title', 'employee', 'date', 'status'],
        ],

        'loan_applications' => [
            'title' => 'Loan Application',
            'fields' => [
                ['key' => 'employee', 'label' => 'Employee', 'type' => 'employee', 'required' => true],
                ['key' => 'loan_type', 'label' => 'Loan Type', 'type' => 'select',
                    'options' => ['Home Loan', 'Car Loan', 'Personal Loan', 'Emergency Loan', 'Festival Loan']],
                ['key' => 'amount', 'label' => 'Amount', 'type' => 'number', 'required' => true],
                ['key' => 'installment_months', 'label' => 'Installment Months', 'type' => 'number'],
                ['key' => 'purpose', 'label' => 'Purpose', 'type' => 'textarea'],
                ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Pending', 'Approved', 'Rejected', 'Disbursed', 'Paid']],
            ],
            'columns' => ['employee', 'loan_type', 'amount', 'status'],
        ],

        'attendance_sheets' => [
            'title' => 'Attendance Sheet',
            'fields' => [
                ['key' => 'employee', 'label' => 'Employee', 'type' => 'employee', 'required' => true],
                ['key' => 'date', 'label' => 'Date', 'type' => 'date', 'required' => true],
                ['key' => 'check_in', 'label' => 'Check In', 'type' => 'time'],
                ['key' => 'check_out', 'label' => 'Check Out', 'type' => 'time'],
                ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Present', 'Absent', 'Late', 'Half Day', 'Leave']],
            ],
            'columns' => ['employee', 'date', 'check_in', 'check_out', 'status'],
        ],

        'attendance_reports' => [
            'title' => 'Attendance Report/Summary',
            'fields' => [
                ['key' => 'employee', 'label' => 'Employee', 'type' => 'employee'],
                ['key' => 'month', 'label' => 'Month', 'type' => 'month'],
                ['key' => 'present_days', 'label' => 'Present Days', 'type' => 'number'],
                ['key' => 'absent_days', 'label' => 'Absent Days', 'type' => 'number'],
                ['key' => 'leave_days', 'label' => 'Leave Days', 'type' => 'number'],
                ['key' => 'ot_hours', 'label' => 'OT Hours', 'type' => 'number'],
                ['key' => 'notes', 'label' => 'Notes', 'type' => 'textarea'],
            ],
            'columns' => ['employee', 'month', 'present_days', 'absent_days', 'leave_days'],
        ],

        'e_learnings' => [
            'title' => 'E-Learning',
            'fields' => [
                ['key' => 'title', 'label' => 'Course Title', 'type' => 'text', 'required' => true],
                ['key' => 'category', 'label' => 'Category', 'type' => 'text'],
                ['key' => 'description', 'label' => 'Description', 'type' => 'textarea'],
                ['key' => 'duration_hours', 'label' => 'Duration (hours)', 'type' => 'number'],
                ['key' => 'file', 'label' => 'Attachment', 'type' => 'file'],
                ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft', 'Published']],
            ],
            'columns' => ['title', 'category', 'duration_hours', 'status'],
        ],

        'appraisal_applies' => [
            'title' => 'Appraisal Apply',
            'fields' => [
                ['key' => 'employee', 'label' => 'Employee', 'type' => 'employee'],
                ['key' => 'period', 'label' => 'Review Period', 'type' => 'text'],
                ['key' => 'rating', 'label' => 'Rating', 'type' => 'select',
                    'options' => ['Outstanding', 'Excellent', 'Good', 'Satisfactory', 'Needs Improvement']],
                ['key' => 'strengths', 'label' => 'Strengths', 'type' => 'textarea'],
                ['key' => 'improvements', 'label' => 'Areas of Improvement', 'type' => 'textarea'],
                ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Pending', 'Submitted', 'Approved']],
            ],
            'columns' => ['employee', 'period', 'rating', 'status'],
        ],

        'achievements' => [
            'title' => 'Achievement Entry',
            'fields' => [
                ['key' => 'employee', 'label' => 'Employee', 'type' => 'employee'],
                ['key' => 'title', 'label' => 'Title', 'type' => 'text'],
                ['key' => 'description', 'label' => 'Description', 'type' => 'textarea'],
                ['key' => 'date', 'label' => 'Achievement Date', 'type' => 'date'],
                ['key' => 'file', 'label' => 'Attachment', 'type' => 'file'],
            ],
            'columns' => ['title', 'employee', 'date'],
        ],

        'conveyance_entries' => [
            'title' => 'Conveyance Entry',
            'fields' => [
                ['key' => 'employee', 'label' => 'Employee', 'type' => 'employee'],
                ['key' => 'travel_date', 'label' => 'Travel Date', 'type' => 'date'],
                ['key' => 'from_location', 'label' => 'From', 'type' => 'text'],
                ['key' => 'to_location', 'label' => 'To', 'type' => 'text'],
                ['key' => 'distance_km', 'label' => 'Distance (km)', 'type' => 'number'],
                ['key' => 'amount', 'label' => 'Amount', 'type' => 'number'],
                ['key' => 'purpose', 'label' => 'Purpose', 'type' => 'text'],
            ],
            'columns' => ['employee', 'travel_date', 'distance_km', 'amount'],
        ],

        'pay_slips' => [
            'title' => 'Pay Slip',
            'fields' => [
                ['key' => 'employee', 'label' => 'Employee', 'type' => 'employee'],
                ['key' => 'salary_month', 'label' => 'Salary Month', 'type' => 'month'],
                ['key' => 'basic_salary', 'label' => 'Basic Salary', 'type' => 'number'],
                ['key' => 'house_rent', 'label' => 'House Rent', 'type' => 'number'],
                ['key' => 'medical_allowance', 'label' => 'Medical Allowance', 'type' => 'number'],
                ['key' => 'conveyance_allowance', 'label' => 'Conveyance Allowance', 'type' => 'number'],
                ['key' => 'other_allowance', 'label' => 'Other Allowance', 'type' => 'number'],
                ['key' => 'deduction', 'label' => 'Deduction', 'type' => 'number'],
                ['key' => 'net_salary', 'label' => 'Net Salary', 'type' => 'number'],
                ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Pending', 'Generated', 'Paid']],
            ],
            'columns' => ['employee', 'salary_month', 'basic_salary', 'net_salary', 'status'],
        ],

        'recruit_management' => [
            'title' => 'Recruit Management',
            'fields' => [
                ['key' => 'title', 'label' => 'Job Title', 'type' => 'text', 'required' => true],
                ['key' => 'department', 'label' => 'Department', 'type' => 'department'],
                ['key' => 'designation', 'label' => 'Designation', 'type' => 'designation'],
                ['key' => 'vacancies', 'label' => 'Vacancies', 'type' => 'number'],
                ['key' => 'salary_range', 'label' => 'Salary Range', 'type' => 'text'],
                ['key' => 'date', 'label' => 'Deadline', 'type' => 'date'],
                ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Open', 'In Review', 'Shortlisted', 'Closed']],
            ],
            'columns' => ['title', 'department', 'vacancies', 'date', 'status'],
        ],

        'hr_consultants' => [
            'title' => 'HR Consultant',
            'fields' => [
                ['key' => 'name', 'label' => 'Name', 'type' => 'text'],
                ['key' => 'company', 'label' => 'Company', 'type' => 'text'],
                ['key' => 'phone', 'label' => 'Phone', 'type' => 'text'],
                ['key' => 'specialization', 'label' => 'Specialization', 'type' => 'text'],
                ['key' => 'notes', 'label' => 'Notes', 'type' => 'textarea'],
            ],
            'columns' => ['name', 'company', 'phone', 'specialization'],
        ],

        'asset_manage' => [
            'title' => 'Asset Manage',
            'fields' => [
                ['key' => 'title', 'label' => 'Asset Name', 'type' => 'text', 'required' => true],
                ['key' => 'asset_code', 'label' => 'Asset Code', 'type' => 'text'],
                ['key' => 'category', 'label' => 'Category', 'type' => 'text'],
                ['key' => 'employee', 'label' => 'Assigned To (Employee)', 'type' => 'employee'],
                ['key' => 'purchase_date', 'label' => 'Purchase Date', 'type' => 'date'],
                ['key' => 'condition', 'label' => 'Condition', 'type' => 'select', 'options' => ['New', 'Good', 'Fair', 'Poor', 'Disposed']],
                ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['In Stock', 'Assigned', 'Under Repair', 'Scrapped']],
            ],
            'columns' => ['title', 'asset_code', 'employee', 'condition', 'status'],
        ],

        'hr_info_system' => [
            'title' => 'HR Info System',
            'fields' => [
                ['key' => 'setting_key', 'label' => 'Setting Key', 'type' => 'text', 'required' => true],
                ['key' => 'setting_value', 'label' => 'Setting Value', 'type' => 'text'],
                ['key' => 'description', 'label' => 'Description', 'type' => 'textarea'],
            ],
            'columns' => ['setting_key', 'setting_value'],
        ],

        'payroll_manage' => [
            'title' => 'Payroll Manage',
            'fields' => [
                ['key' => 'employee', 'label' => 'Employee', 'type' => 'employee'],
                ['key' => 'month', 'label' => 'Month', 'type' => 'month'],
                ['key' => 'basic', 'label' => 'Basic', 'type' => 'number'],
                ['key' => 'allowances', 'label' => 'Allowances', 'type' => 'number'],
                ['key' => 'deductions', 'label' => 'Deductions', 'type' => 'number'],
                ['key' => 'amount', 'label' => 'Net Pay', 'type' => 'number'],
                ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Pending', 'Processed', 'Paid']],
            ],
            'columns' => ['employee', 'month', 'amount', 'status'],
        ],

        'attend_leaves' => [
            'title' => 'Attend & Leave',
            'fields' => [
                ['key' => 'employee', 'label' => 'Employee', 'type' => 'employee'],
                ['key' => 'month', 'label' => 'Month', 'type' => 'month'],
                ['key' => 'working_days', 'label' => 'Working Days', 'type' => 'number'],
                ['key' => 'present_days', 'label' => 'Present Days', 'type' => 'number'],
                ['key' => 'absent_days', 'label' => 'Absent Days', 'type' => 'number'],
                ['key' => 'sanctioned_leaves', 'label' => 'Sanctioned Leaves', 'type' => 'number'],
                ['key' => 'notes', 'label' => 'Notes', 'type' => 'textarea'],
            ],
            'columns' => ['employee', 'month', 'present_days', 'absent_days'],
        ],

        'performance_management' => [
            'title' => 'Perform Management',
            'fields' => [
                ['key' => 'employee', 'label' => 'Employee', 'type' => 'employee'],
                ['key' => 'review_type', 'label' => 'Review Type', 'type' => 'select', 'options' => ['Self Review', 'Manager Review', '360 Degree']],
                ['key' => 'period', 'label' => 'Period', 'type' => 'text'],
                ['key' => 'rating', 'label' => 'Rating (1-5)', 'type' => 'number'],
                ['key' => 'comments', 'label' => 'Comments', 'type' => 'textarea'],
                ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft', 'Submitted', 'Reviewed']],
            ],
            'columns' => ['employee', 'review_type', 'period', 'rating', 'status'],
        ],

        'discipline_management' => [
            'title' => 'Discipline Management',
            'fields' => [
                ['key' => 'employee', 'label' => 'Employee', 'type' => 'employee'],
                ['key' => 'incident_type', 'label' => 'Incident Type', 'type' => 'select',
                    'options' => ['Absenteeism', 'Misconduct', 'Performance Issue', 'Policy Violation', 'Other']],
                ['key' => 'description', 'label' => 'Description', 'type' => 'textarea'],
                ['key' => 'action_taken', 'label' => 'Action Taken', 'type' => 'text'],
                ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Open', 'Warning Issued', 'Suspension', 'Resolved', 'Closed']],
            ],
            'columns' => ['employee', 'incident_type', 'action_taken', 'status'],
        ],

        'crm' => [
            'title' => 'Customer Relationship Management',
            'fields' => [
                ['key' => 'customer_name', 'label' => 'Customer Name', 'type' => 'text', 'required' => true],
                ['key' => 'company', 'label' => 'Company', 'type' => 'text'],
                ['key' => 'contact', 'label' => 'Contact', 'type' => 'text'],
                ['key' => 'interest', 'label' => 'Interest / Requirement', 'type' => 'text'],
                ['key' => 'follow_up_date', 'label' => 'Follow-up Date', 'type' => 'date'],
                ['key' => 'notes', 'label' => 'Notes', 'type' => 'textarea'],
                ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['New', 'Contacted', 'Follow-up', 'Negotiation', 'Won', 'Lost']],
            ],
            'columns' => ['customer_name', 'company', 'contact', 'follow_up_date', 'status'],
        ],

        'learning_management' => [
            'title' => 'Learning Management',
            'fields' => [
                ['key' => 'title', 'label' => 'Course Title', 'type' => 'text', 'required' => true],
                ['key' => 'instructor', 'label' => 'Instructor', 'type' => 'text'],
                ['key' => 'category', 'label' => 'Category', 'type' => 'text'],
                ['key' => 'start_date', 'label' => 'Start Date', 'type' => 'date'],
                ['key' => 'end_date', 'label' => 'End Date', 'type' => 'date'],
                ['key' => 'lessons', 'label' => 'Lessons', 'type' => 'number'],
                ['key' => 'file', 'label' => 'Attachment', 'type' => 'file'],
                ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Planned', 'Ongoing', 'Completed']],
            ],
            'columns' => ['title', 'instructor', 'start_date', 'end_date', 'status'],
        ],

        'accounts_finance' => [
            'title' => 'Accounts & Fin',
            'fields' => [
                ['key' => 'transaction_date', 'label' => 'Transaction Date', 'type' => 'date'],
                ['key' => 'type', 'label' => 'Type', 'type' => 'select', 'options' => ['Income', 'Expense']],
                ['key' => 'account', 'label' => 'Account', 'type' => 'text'],
                ['key' => 'amount', 'label' => 'Amount', 'type' => 'number', 'required' => true],
                ['key' => 'description', 'label' => 'Description', 'type' => 'textarea'],
            ],
            'columns' => ['transaction_date', 'type', 'account', 'amount'],
        ],

        'administration' => [
            'title' => 'Administration',
            'fields' => [
                ['key' => 'title', 'label' => 'Title', 'type' => 'text', 'required' => true],
                ['key' => 'category', 'label' => 'Category', 'type' => 'text'],
                ['key' => 'description', 'label' => 'Description', 'type' => 'textarea'],
                ['key' => 'priority', 'label' => 'Priority', 'type' => 'select', 'options' => ['Low', 'Medium', 'High', 'Urgent']],
                ['key' => 'date', 'label' => 'Date', 'type' => 'date'],
                ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Pending', 'In Progress', 'Completed']],
            ],
            'columns' => ['title', 'category', 'priority', 'date', 'status'],
        ],

        'leave_information' => [
            'title' => 'Leave Information',
            'fields' => [
                ['key' => 'leave_type', 'label' => 'Leave Type', 'type' => 'select',
                    'options' => ['Sick Leave', 'Casual Leave', 'Earned Leave', 'Maternity Leave', 'Paternity Leave', 'Unpaid Leave', 'Study Leave', 'Emergency Leave']],
                ['key' => 'description', 'label' => 'Policy / Description', 'type' => 'textarea'],
                ['key' => 'allowed_days', 'label' => 'Allowed Days (per year)', 'type' => 'number'],
                ['key' => 'max_consecutive_days', 'label' => 'Max Consecutive Days', 'type' => 'number'],
                ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Active', 'Inactive']],
            ],
            'columns' => ['leave_type', 'allowed_days', 'max_consecutive_days', 'status'],
        ],

        'holidays' => [
            'title' => 'Holiday',
            'fields' => [
                ['key' => 'title', 'label' => 'Holiday Name', 'type' => 'text', 'required' => true],
                ['key' => 'date', 'label' => 'Date', 'type' => 'date', 'required' => true],
                ['key' => 'type', 'label' => 'Type', 'type' => 'select', 'options' => ['Public', 'Optional', 'Religious', 'Company']],
                ['key' => 'description', 'label' => 'Description', 'type' => 'text'],
            ],
            'columns' => ['title', 'date', 'type'],
        ],

        'shifts' => [
            'title' => 'Shift',
            'fields' => [
                ['key' => 'title', 'label' => 'Shift Name', 'type' => 'text'],
                ['key' => 'start_time', 'label' => 'Start Time', 'type' => 'time'],
                ['key' => 'end_time', 'label' => 'End Time', 'type' => 'time'],
                ['key' => 'working_hours', 'label' => 'Working Hours', 'type' => 'number'],
                ['key' => 'description', 'label' => 'Description', 'type' => 'text'],
            ],
            'columns' => ['title', 'start_time', 'end_time', 'working_hours'],
        ],

        'employee_movements' => [
            'title' => 'Employee Movement',
            'fields' => [
                ['key' => 'employee', 'label' => 'Employee', 'type' => 'employee'],
                ['key' => 'movement_type', 'label' => 'Movement Type', 'type' => 'select',
                    'options' => ['Transfer', 'Promotion', 'Deputation', 'Secondment', 'Resignation']],
                ['key' => 'from_department', 'label' => 'From Department', 'type' => 'department'],
                ['key' => 'to_department', 'label' => 'To Department', 'type' => 'department'],
                ['key' => 'from_designation', 'label' => 'From Designation', 'type' => 'designation'],
                ['key' => 'to_designation', 'label' => 'To Designation', 'type' => 'designation'],
                ['key' => 'effective_date', 'label' => 'Effective Date', 'type' => 'date'],
                ['key' => 'remarks', 'label' => 'Remarks', 'type' => 'textarea'],
                ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Pending', 'Approved', 'Completed']],
            ],
            'columns' => ['employee', 'movement_type', 'effective_date', 'status'],
        ],

        'office_notices' => [
            'title' => 'Office Notice',
            'fields' => [
                ['key' => 'notice_for', 'label' => 'Notice For', 'type' => 'select',
                    'options' => ['All Departments', 'Individual Department']],
                ['key' => 'department', 'label' => 'Department', 'type' => 'department'],
                ['key' => 'title', 'label' => 'Title', 'type' => 'text', 'required' => true],
                ['key' => 'description', 'label' => 'Description', 'type' => 'textarea'],
                ['key' => 'publish_date', 'label' => 'Publish Date', 'type' => 'date'],
                ['key' => 'file', 'label' => 'Attachment', 'type' => 'file'],
                ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Draft', 'Published']],
            ],
            'columns' => ['title', 'notice_for', 'publish_date', 'status'],
        ],

        'promotional_activities' => [
            'title' => 'Promotional Activities',
            'fields' => [
                ['key' => 'title', 'label' => 'Title', 'type' => 'text', 'required' => true],
                ['key' => 'description', 'label' => 'Description', 'type' => 'textarea'],
                ['key' => 'date', 'label' => 'Activity Date', 'type' => 'date'],
                ['key' => 'file', 'label' => 'Image / Attachment', 'type' => 'file'],
                ['key' => 'status', 'label' => 'Status', 'type' => 'select', 'options' => ['Planned', 'Ongoing', 'Completed']],
            ],
            'columns' => ['title', 'date', 'status'],
        ],
    ],

    'countries' => [
        'Bangladesh', 'India', 'Pakistan', 'Nepal', 'Bhutan', 'Sri Lanka', 'Maldives', 'Myanmar',
        'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France', 'Italy',
        'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Switzerland', 'Austria',
        'Belgium', 'Portugal', 'Greece', 'Poland', 'Turkey', 'Saudi Arabia', 'United Arab Emirates',
        'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Japan', 'South Korea', 'China', 'Singapore',
        'Malaysia', 'Indonesia', 'Thailand', 'Vietnam', 'Philippines', 'Egypt', 'South Africa',
        'Nigeria', 'Kenya', 'Brazil', 'Mexico', 'Argentina', 'Russia',
    ],

];