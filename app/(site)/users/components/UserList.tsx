import UserBox from "./UserBox"
import getUsers from "@/app/actions/getUsers";


export default async() => {
  const users = await getUsers();

    return (
        <aside
            className="
            bg-white
            fixed
            inset-y-0
            pb-14
            lg:ml-20
            lg:pb-0
            lg:block
            lg:w-80
            overflow-y-auto
            border-r
            border-gray-200
            block
            w-full
            left-0"
        >
            <div className="px-5">
                <div className="flex-col">
                    <div className="
                    text-2xl 
                    font-bold
                    text-neutral-800 
                    py-4">
                        People
                    </div>
                </div>
                {users.map((user => (
                    <UserBox
                        key={user.id}
                        data={user}
                    />
                )))}
            </div>
        </aside>
    )
}