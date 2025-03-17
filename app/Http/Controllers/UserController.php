<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = [
            [
                'key' => '1',
                'name' => 'Alice Johnson',
                'age' => 28,
                'address' => 'New York, USA',
                'tags' => ['developer', 'friendly']
            ],
            [
                'key' => '2',
                'name' => 'Bob Smith',
                'age' => 35,
                'address' => 'London, UK',
                'tags' => ['admin']
            ],
            [
                'key' => '3',
                'name' => 'Charlie Brown',
                'age' => 30,
                'address' => 'Paris, France',
                'tags' => ['cool', 'teacher']
            ],
            [
                'key' => '4',
                'name' => 'David Lee',
                'age' => 40,
                'address' => 'Berlin, Germany',
                'tags' => ['manager']
            ]
        ];

        return Inertia::render('DashboardUsers', [
            'users' => $users,
            'homeUrl' => route('home')
        ]);
    }
}
