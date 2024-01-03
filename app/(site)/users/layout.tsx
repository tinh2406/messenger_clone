import UserList from "./components/UserList";

export default ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <UserList />
      {children}
    </div>
  );
};
