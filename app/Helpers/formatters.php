<?php

if (!function_exists('formatCurrency')) {
    /**
     * Format a number as currency.
     *
     * @param mixed $value The value to format
     * @return string The formatted currency string
     */
    function formatCurrency($value): string
    {
        if ($value === null || $value === '') {
            return 'IQD 0';
        }

        $numValue = is_numeric($value) ? $value : floatval($value);

        if (is_nan($numValue)) {
            return 'IQD 0';
        }

        return 'IQD ' . number_format($numValue, 0, '.', ',');
    }
}