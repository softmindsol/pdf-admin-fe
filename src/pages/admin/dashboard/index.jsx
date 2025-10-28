import { MdConstruction } from "react-icons/md";

export default function Dashboard() {
  return (
    <>
      <div className="space-y-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-light to-orange-dark bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-orange-dark/70 mt-2">
            Welcome back! We're preparing something amazing for you.
          </p>
        </div>

        <div className="flex items-center justify-center text-center h-[60vh] bg-gradient-to-br from-white to-orange-50 rounded-xl shadow-lg border border-orange-200/50 p-6 backdrop-blur-sm">
          <div>
            <MdConstruction className="mx-auto w-16 h-16 text-orange-400 mb-6 animate-pulse" />
            <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-light to-orange-dark bg-clip-text text-transparent">
              Coming Soon!
            </h2>
            <p className="text-orange-dark/70 mt-4 max-w-md mx-auto">
              Our new and improved dashboard is under construction. We're
              working hard to bring you exciting features and analytics. Please
              check back later!
            </p>
          </div>
        </div>
      </div>
    </>
  );
}