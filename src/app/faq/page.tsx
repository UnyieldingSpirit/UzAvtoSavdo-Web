import { Metadata } from 'next'
import FAQPage from './default'

export const metadata: Metadata = {
  title: 'UzAuto Motors - Вопросы и ответы'
};

export default function Page() {
  return <FAQPage />
}