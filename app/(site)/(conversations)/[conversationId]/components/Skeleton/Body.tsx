import CircleLoading from "@/app/components/CircleLoading";
import Form from "../Client/Form";

export default () => {
  return (
    <>
      <div className="flex-1 overflow-y-auto">
        <CircleLoading />
      </div>
      <Form />
    </>
  );
};
