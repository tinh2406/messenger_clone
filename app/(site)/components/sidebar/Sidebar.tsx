import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";

export default ({ children }: { children?: React.ReactNode }) => {

  return (
    <div className="h-full">
      <DesktopSidebar />
      <MobileFooter />
      <main className="lg:pl-20 h-dvh">{children}</main>
    </div>
  );
};
