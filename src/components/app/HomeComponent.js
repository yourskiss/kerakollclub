import { Suspense } from 'react'
import LoginComponent from './LoginComponent'

export default function HomeComponent() {
  return (
    <>
      <p>test</p>
      <Suspense fallback={<p>...Loading</p>}>
          <LoginComponent />
        </Suspense>
    </>
  )
}
