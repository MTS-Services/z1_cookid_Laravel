import Details from '@/components/section/services/details'
import FrontendLayout from '@/layouts/frontend-layout'
import React from 'react'

export interface ServiceDetailsData {
  id: number
  title: string
  slug: string
  description: string
  duration: string
  location: string
  price: number
  rating: number
  totalReviews: number
  categoryName: string | null
  vehicleTypeName: string | null
  image: string
  images: { id: number; src: string; alt: string }[]
  inclusions: { label: string; items: string[] }[]
  vendor: { name: string; location: string | null }
}

interface ServiceDetailsPageProps {
  service: ServiceDetailsData
}

export default function ServiceDetails({ service }: ServiceDetailsPageProps) {
  return (
    <FrontendLayout activePage="service-details">
      <Details service={service} />
    </FrontendLayout>
  )
}
