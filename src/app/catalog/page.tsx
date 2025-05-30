import { Metadata } from 'next'
import CatalogPage from './default'

export const metadata: Metadata = {
  title: 'UzAuto Motors'
};

export default function Page() {
  return <CatalogPage />
}