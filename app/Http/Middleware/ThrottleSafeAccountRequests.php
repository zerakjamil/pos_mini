<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Cache\RateLimiter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter as Limiter;
use Symfony\Component\HttpFoundation\Response;

class ThrottleSafeAccountRequests
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $key = 'safe-account-' . ($request->user() ? $request->user()->id : $request->ip());
        
        if (Limiter::tooManyAttempts($key, 30)) {
            return response()->json([
                'message' => 'Too many requests. Please try again later.',
            ], 429);
        }
        
        Limiter::hit($key, 60);
        
        return $next($request);
    }
}