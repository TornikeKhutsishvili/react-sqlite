import { Link } from "react-router-dom"

const ErrorPage = () => {
  return (
    <main className="flex items-center justify-center min-h-[60vh] px-3 py-5">
      <div className="text-center">
        <p className="text-blue-600 font-semibold">404</p>
        <h1 className="mt-4 text-5xl font-semibold text-gray-900">გვერდი არ მოიძებნა</h1>
        <p className="mt-3 text-lg text-gray-500">სამწუხაროდ, ვერ ვიპოვეთ გვერდი, რომელსაც ეძებდით.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition">
            მთავარ გვერდზე დაბრუნება
          </Link>
        </div>
      </div>
    </main>
  )
}

export default ErrorPage
