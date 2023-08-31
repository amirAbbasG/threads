import React from 'react';

import {redirect} from "next/navigation";

import {currentUser} from "@clerk/nextjs";

import {fetchAllUsers, fetchUser} from "@/lib/actions/user.actions";
import UserCard from "@components/cards/UserCard";

const Search = async () => {
    const user = await currentUser();
    if (!user) return null;

    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");

    const result = await fetchAllUsers({
        userId: user.id,
        pageSize: 25,
        pageNumber: 1,
        searchString: ""
    })

    return (
        <section>
            <h1 className='head-text mb-10'>Search</h1>

            {/*<Searchbar routeType='search' />*/}

            <div className='mt-14 flex flex-col gap-9'>
                {result.users.length === 0 ? (
                    <p className='no-result'>No Result</p>
                ) : (
                    <>
                        {result.users.map((person) => (
                            <UserCard
                                key={person.id}
                                id={person.id}
                                name={person.name}
                                username={person.username}
                                imgUrl={person.image}
                                personType='User'
                            />
                        ))}
                    </>
                )}
            </div>

            {/*<Pagination*/}
            {/*    path='search'*/}
            {/*    pageNumber={searchParams?.page ? +searchParams.page : 1}*/}
            {/*    isNext={result.isNext}*/}
            {/*/>*/}
        </section>
    );
};

export default Search;