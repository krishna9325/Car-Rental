import AuthForm from "./AuthForm";

const AdminSignupPage = () => {
  return <AuthForm isAdmin={true} defaultMode="signup" />;
};

export default AdminSignupPage;