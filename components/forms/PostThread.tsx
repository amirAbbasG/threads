"use client"

import {usePathname, useRouter} from "next/navigation";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod";
import {useOrganization} from "@clerk/nextjs";

import {ThreadValidation} from "@/lib/validations/thread";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@components/ui/form";
import {Button} from "@components/ui/button";
import {Textarea} from "@components/ui/textarea";
import {createThread} from "@/lib/actions/threads.actions";
import {useState} from "react";

const PostThread = ({userId}: { userId: string }) => {
    const router = useRouter()
    const pathname = usePathname()
    const {organization} = useOrganization()
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: "",
            accountId: userId
        }
    })

    const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
        setIsSubmitting(true)
        try {
            await createThread({
                text: values.thread,
                author: userId,
                communityId: organization ? organization?.id : null,
                path: pathname
            })

            router.push("/")
        }catch (e) {
            console.log(e)
        }finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='mt-10 flex flex-col justify-start gap-10'>
                <FormField
                    control={form.control}
                    name='thread'
                    render={({ field }) => (
                        <FormItem className='flex w-full flex-col gap-3'>
                            <FormLabel className='text-base-semibold text-light-2'>
                                Content
                            </FormLabel>
                            <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                                <Textarea rows={15} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type='submit' className='bg-primary-500' disabled={isSubmitting}>
                    Post Thread
                </Button>
            </form>
        </Form>
    );
};

export default PostThread;