import FrontendLayout from '@/layouts/frontend-layout'
import React from 'react'

export default function Home({ listings }: any) {
  return (
    <FrontendLayout activePage="home">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center">Welcome to Cookid</h1>
        <p className="text-center mt-4">Your culinary journey starts here.</p>
      </div>
    </FrontendLayout>
  )
}
