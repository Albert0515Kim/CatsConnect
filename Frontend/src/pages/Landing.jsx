import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Button from '../components/Button';


function Landing() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center">
        <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 py-12 md:grid-cols-2 md:items-center">
          <div className="order-2 md:order-1">
            <div className="overflow-hidden rounded-3xl shadow-md">
              <img
                src= '/landing.jpg'
                alt="Northwestern campus"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="order-1 space-y-6 md:order-2">
            <h1 className="text-4xl font-bold text-brand-700 md:text-5xl">
              Connect With Cats on Campus
            </h1>
            <p className="text-lg text-slate-600">
              Connect with fellow Wildcats on campus. Discover students, make connections, and build friendships.
            </p>
            <Link to="/signup">
              <Button variant="green" className="px-8 py-3 text-base">
                Get started
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Landing;
