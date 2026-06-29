import { NavLink } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t mt-10">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">

        {/* LEFT */}
        <p className="text-gray-600 text-sm text-center md:text-left">
          © {currentYear}{" "}
          <span className="font-semibold text-blue-600">Frontend & Backend</span>. All rights reserved.
        </p>

        {/* RIGHT */}
        <div className="flex gap-4 text-sm">
          <NavLink to="/" className="text-gray-600 hover:text-blue-600 transition">
            Home
          </NavLink>
          <NavLink to="/users" className="text-gray-600 hover:text-blue-600 transition">
            Users
          </NavLink>
          <NavLink to="/exams" className="text-gray-600 hover:text-blue-600 transition">
            Exams
          </NavLink>
          <NavLink to="/documents" className="text-gray-600 hover:text-blue-600 transition">
            Documents
          </NavLink>
        </div>

      </div>
    </footer>
  )
}

export default Footer