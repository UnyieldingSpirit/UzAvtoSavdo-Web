// src/app/test-drive/page.tsx
import { Metadata } from 'next'
import TestDriveFormPage from './default'

export const metadata: Metadata = {
  title: 'UzAuto Motors - Запись на тест-драйв'
};

export default function Page() {
  return <TestDriveFormPage />
}