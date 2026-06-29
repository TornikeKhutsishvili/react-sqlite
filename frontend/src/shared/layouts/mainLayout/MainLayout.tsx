import "../../../styles/index.css";
import Header from '../header/Header';
import Footer from '../footer/Footer';
import AuthLayout from '../authLayout/AuthLayout';

const MainLayout = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex">
      <div className="flex-1 flex flex-col">
        {<Header />}

        <main className="flex-1 p-6">
          <AuthLayout />
        </main>

        {<Footer />}
      </div>
    </div>
  );
}

export default MainLayout