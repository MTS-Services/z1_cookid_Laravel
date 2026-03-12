import CategoryGrid from '@/components/section/home/browse-by-category'
import TopRelated from '@/components/section/home/top-related'
import FrontendLayout from '@/layouts/frontend-layout'
import React from 'react'

interface CategoryResource {
    id: number
    name: string
    image: string
}

interface CategoriesPageProps {
    categories: CategoryResource[]
}

export default function Categories({ categories }: CategoriesPageProps) {
    return (
        <FrontendLayout activePage="categories">
            <CategoryGrid categories={categories} />
            <TopRelated />
        </FrontendLayout>
    )
}
