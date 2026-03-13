<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PerformanceController extends Controller
{
    public function __construct()
    {
        //
    }

    public function index(Request $request): Response
    {
        $vendor = $request->user('vendor');

        $type = $request->string('type')->toString();

        if (! in_array($type, ['all', 'positive', 'negative'], true)) {
            $type = 'all';
        }

        $reviewsQuery = Review::query()
            ->with(['user', 'service'])
            ->whereHas('service', function ($query) use ($vendor) {
                $query->where('vendor_id', $vendor->id);
            });

        $totalReviews = (clone $reviewsQuery)->count();

        $averageRating = $totalReviews > 0
            ? round((float) (clone $reviewsQuery)->avg('rating'), 1)
            : 0.0;

        $distribution = [];

        if ($totalReviews > 0) {
            for ($stars = 1; $stars <= 5; $stars++) {
                $count = (clone $reviewsQuery)
                    ->where('rating', $stars)
                    ->count();

                $distribution[$stars] = $count > 0
                    ? round(($count / $totalReviews) * 100)
                    : 0;
            }
        } else {
            for ($stars = 1; $stars <= 5; $stars++) {
                $distribution[$stars] = 0;
            }
        }

        $filteredReviewsQuery = clone $reviewsQuery;

        if ($type === 'positive') {
            $filteredReviewsQuery->where('rating', '>=', 4);
        } elseif ($type === 'negative') {
            $filteredReviewsQuery->where('rating', '<=', 3);
        }

        $reviewsPerPage = (int) $request->input('reviews_per_page', 10);
        $reviewsPerPage = max(5, min(50, $reviewsPerPage));

        $reviewsPage = (int) $request->input('reviews_page', 1);
        $reviewsPage = max(1, $reviewsPage);

        $reviews = $filteredReviewsQuery
            ->latest()
            ->paginate($reviewsPerPage, ['*'], 'reviews_page', $reviewsPage)
            ->withQueryString()
            ->through(function (Review $review) {
                return [
                    'id' => $review->id,
                    'name' => optional($review->user)->full_name ?? 'Customer',
                    'rating' => (int) $review->rating,
                    'date' => optional($review->created_at)?->format('M d, Y'),
                    'comment' => (string) ($review->comment ?? ''),
                    'sentiment' => (int) $review->rating >= 4 ? 'positive' : 'negative',
                ];
            });

        return Inertia::render('vendor/performance', [
            'filters' => [
                'type' => $type,
            ],
            'stats' => [
                'averageRating' => $averageRating,
                'totalReviews' => $totalReviews,
                'distribution' => [
                    [
                        'stars' => 5,
                        'percent' => $distribution[5],
                    ],
                    [
                        'stars' => 4,
                        'percent' => $distribution[4],
                    ],
                    [
                        'stars' => 3,
                        'percent' => $distribution[3],
                    ],
                    [
                        'stars' => 2,
                        'percent' => $distribution[2],
                    ],
                    [
                        'stars' => 1,
                        'percent' => $distribution[1],
                    ],
                ],
            ],
            'reviews' => [
                'data' => $reviews->items(),
                'currentPage' => $reviews->currentPage(),
                'lastPage' => $reviews->lastPage(),
                'perPage' => $reviewsPerPage,
            ],
        ]);
    }
}
