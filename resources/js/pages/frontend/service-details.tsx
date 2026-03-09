import Details, { type ServiceDetailsPayload } from '@/components/section/services/details'
import FrontendLayout from '@/layouts/frontend-layout'
import React from 'react'

interface ServiceDetailsPageProps {
  service: ServiceDetailsPayload
}

export default function ServiceDetails({ service }: ServiceDetailsPageProps) {
  return (
    <FrontendLayout activePage="service-details">
      <Details service={service} />
    </FrontendLayout>
  )
}
