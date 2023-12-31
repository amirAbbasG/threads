import {currentUser} from "@clerk/nextjs";

import {redirect} from "next/navigation";

import {AccountProfile} from "@components/forms";
import {fetchUser} from "@/lib/actions/user.actions";

const Onboarding = async () => {
    const user = await currentUser()
    if (!user) return null

    const userInfo = await fetchUser(user.id);
    if (userInfo?.onboarded) redirect("/");

    const userData = {
        id: user?.id || "",
        objectId: userInfo?._id || "",
        username: userInfo ? userInfo?.username : user?.username,
        name: userInfo ? userInfo?.name : user?.firstName ?? "",
        bio: userInfo ? userInfo?.bio : "",
        image: userInfo ? userInfo?.image : user?.imageUrl,
    };


    return (
        <main className="flex flex-col max-w-3xl mx-auto justify-start px-10 py-20">
            <h1 className="head-text">Onboarding</h1>
            <p className="text-base-regular text-light-2 mt-3"> Complete your profile now, to use Threads.</p>

            <section className="p-10 mt-9 bg-dark-2">
                <AccountProfile user={userData} btnTitle="Continue"/>
            </section>
        </main>
    );
};

export default Onboarding;