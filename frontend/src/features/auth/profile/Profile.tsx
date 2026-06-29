import { useSelector } from "react-redux";
import { authUserSelector } from "../../../store/auth/auth.slice";

const Profile = () => {
  const user = useSelector(authUserSelector);

  if (!user) return <div>No user found</div>;

  return (
    <div className="p-5">
      <h1>Profile</h1>

      <p>Name: {user.firstname} {user.lastname}</p>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default Profile