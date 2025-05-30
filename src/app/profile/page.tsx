import { Metadata } from 'next'
import ProfilePage from './default'

export const metadata: Metadata = {
  title: 'UzAuto Motors'
};

export default function Page() {
  return <ProfilePage />
}