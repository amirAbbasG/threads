"use client"
import React, {FC} from 'react';

import Image from "next/image";

import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";

import {CommentValidation} from "@/lib/validations/thread";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@components/ui/form";
import {Input} from "@components/ui/input";
import {Button} from "@components/ui/button";
import {addCommentToThread} from "@/lib/actions/threads.actions";
import {userInfo} from "os";
import {usePathname} from "next/navigation";

interface Props {
    threadId: string
    currentUserImg: string
    currentUserId: string
}

const Comment: FC<Props> = ({currentUserId, currentUserImg, threadId}) => {
    const pathname = usePathname()

    const form = useForm<z.infer<typeof CommentValidation>>({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addCommentToThread({
            commentText: values.thread,
            threadId,
            userId: JSON.parse(currentUserId),
            path: pathname
        })
        form.reset();
    };

    return (
        <Form {...form}>
            <form className='comment-form' onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                    control={form.control}
                    name='thread'
                    render={({ field }) => (
                        <FormItem className='flex w-full items-center gap-3'>
                            <FormLabel>
                                <Image
                                    src={currentUserImg}
                                    alt='current_user'
                                    width={48}
                                    height={48}
                                    className='rounded-full object-cover aspect-square'
                                />
                            </FormLabel>
                            <FormControl className='border-none bg-transparent'>
                                <Input
                                    type='text'
                                    {...field}
                                    placeholder='Comment...'
                                    className='no-focus text-light-1 outline-none'
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type='submit' className='comment-form_btn'>
                    Reply
                </Button>
            </form>
        </Form>
    );
};

export default Comment;