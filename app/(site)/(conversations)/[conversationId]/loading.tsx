import Body from "./components/Skeleton/Body";
import Header from "./components/Skeleton/Header";

export default () => {
  return (
    <div className="bg-white absolute w-full left-0 h-full pb-0 md:relative md:w-auto md:ml-[22rem] md:pb-14 lg:pb-0">
      <div className="h-full flex flex-col">
        <Header />
        <Body/>
      </div>
    </div>
  );
};
