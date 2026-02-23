<?php

namespace App\Services;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class DataTableService
{
    public function process(Builder $query, Request $request, array $config): array
    {
        $searchable = $config['searchable'] ?? [];
        $filterable = $config['filterable'] ?? [];
        $sortable = $config['sortable'] ?? [];

        // SEARCH
        if ($request->filled('search') && ! empty($searchable)) {
            $this->applySearch($query, $request->search, $searchable);
        }

        // FILTERS
        if ($request->filled('filters') && ! empty($filterable)) {
            $this->applyFilters($query, $request->filters, $filterable);
        }

        // SORTING
        if (
            $request->filled('sort_by') &&
            in_array($request->sort_by, $sortable)
        ) {
            $this->applySorting(
                $query,
                $request->sort_by,
                $request->input('sort_order', 'asc')
            );
        }

        $perPage = (int) $request->input('per_page', 15);
        $page = (int) $request->input('page', 1);

        $data = $query->paginate($perPage)->withQueryString();

        return [
            'data' => $data->items(),
            'pagination' => [
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
                'per_page' => $data->perPage(),
                'total' => $data->total(),
                'from' => $data->firstItem(),
                'to' => $data->lastItem(),
            ],
            'offset' => ($page - 1) * $perPage,
            'filters' => $request->input('filters', []),
            'search' => $request->input('search', ''),
            'sort_by' => $request->input('sort_by', ''),
            'sort_order' => $request->input('sort_order', 'asc'),
        ];
    }

    private function applySearch(Builder $query, string $search, array $columns): void
    {
        $query->where(function ($q) use ($columns, $search) {
            foreach ($columns as $column) {
                $q->orWhere($column, 'like', "%{$search}%");
            }
        });
    }

    private function applyFilters(Builder $query, array $filters, array $allowed): void
    {
        foreach ($filters as $key => $value) {

            if (! in_array($key, $allowed)) {
                continue;
            }
            if ($value === '' || $value === null) {
                continue;
            }

            // Convert boolean string
            if ($value === '0') {
                $value = 0;
            }
            if ($value === '1') {
                $value = 1;
            }

            $query->where($key, $value);
        }
    }

    private function applySorting(Builder $query, string $sortBy, string $sortOrder): void
    {
        $query->orderBy($sortBy, $sortOrder === 'desc' ? 'desc' : 'asc');
    }
}
