import clsx from "clsx";
import EmptyState from "../components/EmptyState";

export default () => {
  return (
    <div className={clsx("md:pl-80 h-full hidden md:block")}>
      <EmptyState />
    </div>
  );
};
