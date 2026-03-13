import CategoryGrid from '@/components/section/home/browse-by-category'
import TopRelated from '@/components/section/home/top-related'
import FrontendLayout from '@/layouts/frontend-layout'
import Pagination from '@/components/ui/pagination'
import { router } from '@inertiajs/react'
import React from 'react'
import type { Paginated } from '@/types/model'

interface CategoryResource {
    id: number
    name: string
    image: string
}

interface TopRelatedService {
    id: number
    image: string
    name: string
    rating: number
    location: string
    service: string
    price: number
}

interface CategoriesPageProps {
    categories: Paginated<CategoryResource>
    services: TopRelatedService[]
}

export default function Categories({ categories, services }: CategoriesPageProps) {
    const currentPage = categories?.meta?.current_page ?? 1
    const totalPages = categories?.meta?.last_page ?? 1

    const onPageChange = (page: number) => {
        if (page < 1 || page > totalPages || page === currentPage) return
        router.get(
            route('frontend.categories'),
            { page },
            { preserveScroll: true },
        )
    }

    return (
        <FrontendLayout activePage="categories">
            <CategoryGrid categories={categories.data} />
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
            />
            <TopRelated services={services} />
        </FrontendLayout>
    )
}
