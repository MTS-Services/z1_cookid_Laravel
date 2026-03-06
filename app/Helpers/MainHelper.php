<?php

use Carbon\Carbon;

if (! function_exists('dateTimeFormat')) {
    /**
     * Format a datetime string for display.
     *
     * @param  string|null  $compareWith  If provided and same date as $datetime, only time is returned; otherwise full date-time.
     */
    function dateTimeFormat(?string $datetime, ?string $compareWith = null): string
    {
        if (blank($datetime)) {
            return '';
        }

        $date = Carbon::parse($datetime);

        if ($compareWith !== null && ! blank($compareWith)) {
            $compare = Carbon::parse($compareWith);
            if ($date->isSameDay($compare)) {
                return $date->format('H:i');
            }
        }

        return $date->format('d M Y, H:i');
    }
}

if (! function_exists('dateTimeHumanFormat')) {
    /**
     * Format a datetime string in a human-readable way (e.g. "2 hours ago").
     *
     * @param  string|null  $compareWith  Optional reference datetime (e.g. created_at when formatting updated_at).
     */
    function dateTimeHumanFormat(?string $datetime, ?string $compareWith = null): ?string
    {
        if (blank($datetime)) {
            return null;
        }

        $date = Carbon::parse($datetime);

        if ($compareWith !== null && ! blank($compareWith)) {
            $compare = Carbon::parse($compareWith);
            if ($date->isSameDay($compare)) {
                return $date->format('H:i');
            }
        }

        return $date->diffForHumans();
    }
}
