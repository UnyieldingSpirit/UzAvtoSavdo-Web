import { Metadata } from 'next'
import CarDetails from './default'

export const metadata: Metadata = {
  title: 'UzAuto Motors'
};

export default function Page() {
  return <CarDetails />
}