import { Metadata } from 'next'
import DealersPage from './default'

export const metadata: Metadata = {
  title: 'UzAuto Motors'
};
export default function Page() {
  return <DealersPage />
}