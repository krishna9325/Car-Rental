import AuthForm from "./AuthForm";

const AdminLoginPage = () => {
  return <AuthForm isAdmin={true} defaultMode="login" />;
};

export default AdminLoginPage;
