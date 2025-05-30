import { IntroSlider } from '@/components/sections/IntroSlider';
import { AvailableCars } from '@/components/sections/AvailableCars';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UzAuto Motors', 
   icons: {
        icon: [{
            url: 'https://savdo.uzavtosanoat.uz/favicon.ico',
            href: 'https://savdo.uzavtosanoat.uz/favicon.ico'
        }]
    }
};

export default function Home() {
  return (
    <>
      <main>
        <IntroSlider />
        <AvailableCars />
      </main>
    </>
  );
}