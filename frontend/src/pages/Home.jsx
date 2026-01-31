import { useAuth } from "../hooks/UseAuth";

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-bold">
        Welcome to FinSight
      </h1>

      {!isAuthenticated ? (
        <p className="text-gray-500">
          Please login to continue
        </p>
      ) : (
        <p className="text-green-600">
          You are logged in as <b>{user.name}</b>
        </p>
      )}
    </div>
  );
};

export default Home;
