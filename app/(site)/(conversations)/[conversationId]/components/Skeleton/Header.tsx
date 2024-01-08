import { HiChevronLeft } from "react-icons/hi2";

export default () => {
  return (
    <div
      className="
                  bg-white
                  w-full 
                  flex
                  border-b-[1px]
                  py-3
                  px-4
                  sm:px-4
                  lg:px-6
                  justify-between
                  items-center
                  shadow-sm
                  "
    >
      <div className="flex gap-3 items-center">
        <div
          className="
                  lg:hidden 
                  block 
                  text-sky-500 
                  hover:text-sky-600 
                  transition 
                  cursor-pointer"
        >
          <HiChevronLeft size={32} />
        </div>
        <div
          className="
                relative
                inline-block
                rounded-full
                h-11
                w-11
                mx-auto
                cursor-pointer
                bg-gray-200
            "
        />
        <div className="h-full">
          <div>Messenger user</div>
        </div>
      </div>
    </div>
  );
};
