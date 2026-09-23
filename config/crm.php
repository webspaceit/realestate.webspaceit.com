<?php

return [
    /*
    |--------------------------------------------------------------------------
    | CRM Pipeline Stages
    |--------------------------------------------------------------------------
    | Each stage defines a default win-probability (%) and a badge variant
    | (secondary | default | outline | destructive) used across the UI.
    */
    'stages' => [
        'Inquiry' => ['probability' => 10, 'badge' => 'secondary'],
        'Qualification' => ['probability' => 25, 'badge' => 'secondary'],
        'Proposal / BOQ' => ['probability' => 50, 'badge' => 'default'],
        'Negotiation' => ['probability' => 70, 'badge' => 'default'],
        'Awarded' => ['probability' => 100, 'badge' => 'outline'],
        'Lost' => ['probability' => 0, 'badge' => 'destructive'],
        'On Hold' => ['probability' => 20, 'badge' => 'outline'],
    ],

    /*
    |--------------------------------------------------------------------------
    | Lead Sources
    |--------------------------------------------------------------------------
    */
    'sources' => [
        'Web Form',
        'Call',
        'Referral',
        'Walk-in',
        'Site Visit',
        'Social Media',
        'Existing Client',
        'Other',
    ],

    /*
    |--------------------------------------------------------------------------
    | Interaction Types
    |--------------------------------------------------------------------------
    */
    'interaction_types' => [
        'Call',
        'Meeting',
        'Site Visit',
        'Email',
        'WhatsApp',
        'Other',
    ],

    /*
    |--------------------------------------------------------------------------
    | Meeting / Site Visit Statuses
    |--------------------------------------------------------------------------
    */
    'meeting_statuses' => [
        'Scheduled',
        'Completed',
        'Cancelled',
    ],
];