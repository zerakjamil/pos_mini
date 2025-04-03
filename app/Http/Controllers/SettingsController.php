<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;

class SettingsController extends Controller
{
    /**
     * Display the application settings.
     */
    public function index()
    {
        $settings = $this->getSettings();

        return Inertia::render('Settings/Index', [
            'settings' => $settings,
        ]);
    }

    /**
     * Update the application settings.
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'store_name' => ['required', 'string', 'max:255'],
            'store_address' => ['nullable', 'string', 'max:500'],
            'store_phone' => ['nullable', 'string', 'max:20'],
            'store_email' => ['nullable', 'email', 'max:255'],
            'currency' => ['required', 'string', 'max:10'],
            'tax_rate' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'receipt_footer' => ['nullable', 'string', 'max:1000'],
            'low_stock_threshold' => ['nullable', 'integer', 'min:0'],
        ]);

        foreach ($validated as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        // Clear settings cache
        Cache::forget('app_settings');

        return Redirect::route('settings.index')->with('success', 'Settings updated successfully');
    }

    /**
     * Get all application settings.
     */
    private function getSettings()
    {
        // Try to get from cache first
        $settings = Cache::remember('app_settings', 60 * 24, function () {
            $settingsCollection = Setting::all();
            $settings = [];

            foreach ($settingsCollection as $setting) {
                $settings[$setting->key] = $setting->value;
            }

            return $settings;
        });

        // Set default values for missing settings
        $defaults = [
            'store_name' => 'My POS Store',
            'store_address' => '',
            'store_phone' => '',
            'store_email' => '',
            'currency' => 'IQD',
            'tax_rate' => 0,
            'receipt_footer' => 'Thank you for your purchase!',
            'low_stock_threshold' => 5,
        ];

        foreach ($defaults as $key => $value) {
            if (!isset($settings[$key])) {
                $settings[$key] = $value;
            }
        }

        return $settings;
    }
}
