import { Metadata } from 'next'
import ServicePage from './default'

export const metadata: Metadata = {
  title: 'UzAuto Motors | Сервис'
};

export default function Page() {
  return <ServicePage />
}