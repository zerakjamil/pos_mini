<?php

namespace Database\Seeders;

use App\Models\CardType;
use Illuminate\Database\Seeder;

class CardTypeSeeder extends Seeder
{
    public function run(): void
    {
        $cardTypes = [
            [
                'name' => 'Internet 10GB',
                'description' => '10GB internet card'
            ],
            [
                'name' => 'Internet 25GB',
                'description' => '25GB internet card'
            ],
            [
                'name' => 'Mobile Credit 5000',
                'description' => '5,000 credit mobile card'
            ],
            [
                'name' => 'Mobile Credit 10000',
                'description' => '10,000 credit mobile card'
            ],
            [
                'name' => 'Mobile Credit 25000',
                'description' => '25,000 credit mobile card'
            ],
        ];

        foreach ($cardTypes as $cardType) {
            CardType::create($cardType);
        }
    }
}
