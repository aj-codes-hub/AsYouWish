import React from 'react'
import HeroSection from './sections/heroSection'
import FeaturedCollection from './sections/featuredCollection'
import NewArrivals from './sections/newArrivals'
import BestSellers from './sections/bestSellers'
import SummerCollection from './sections/summerCollection'
import ClientSays from './sections/clientSays'
import Subscribe from './sections/subscribe'


const Home:React.FC = () => {

  return (
    <div>
        <HeroSection />
        <FeaturedCollection />
        <NewArrivals />
        <BestSellers />
        <SummerCollection />
        <ClientSays />
        <Subscribe />
    </div>
  )
}

export default Home

