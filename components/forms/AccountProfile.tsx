"use client"
import {ChangeEvent, FC, useState} from "react";
import {usePathname, useRouter} from "next/navigation";

import Image from "next/image";

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import * as z from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel, FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Button} from "@components/ui/button";
import {Textarea} from "@components/ui/textarea";
import {UserValidation} from "@/lib/validations/user";
import {isBase64Image} from "@/lib/utils";
import {useUploadThing} from "@/lib/uploadthings";
import {updateUser} from "@/lib/actions/user.actions";

interface Props {
    user: {
        id: string,
        objectId: string,
        username: string,
        name: string,
        bio: string,
        image: string,
    },
    btnTitle: string
}

const AccountProfile: FC<Props> = ({user, btnTitle}) => {
    const router = useRouter()
    const pathname = usePathname()

    const [files, setFiles] = useState<File[]>([]);
    const {startUpload, isUploading} = useUploadThing("media")

    const form = useForm({
        resolver: zodResolver(UserValidation),
        defaultValues: {
            profile_photo: user?.image ? user.image : "",
            name: user?.name ? user.name : "",
            username: user?.username ? user.username : "",
            bio: user?.bio ? user.bio : "",
        }
    })

    async function onSubmit({profile_photo, ...rest}: z.infer<typeof UserValidation>) {
       try {
           const blob = profile_photo
           const hasImageChanged = isBase64Image(blob)

           if (hasImageChanged) {
               const uploadRes = await startUpload(files)
               if (uploadRes && uploadRes[0]?.fileUrl) {
                   profile_photo = uploadRes[0].fileUrl
               }

               await updateUser({userId: user.id, image: profile_photo, ...rest}, pathname)

               if (pathname === "/profile/edit") {
                   router.back()
               }else {
                   router.push("/")
               }
           }
       }catch (e) {
           console.log(e)
       }
    }

    const changeImage = (event: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        event.preventDefault()

        if (event.target.files && event.target.files.length > 0) {
            setFiles(Array.from(event.target.files))

            const file = event.target.files[0]
            if (!file.type.includes("image")) return

            const fileReader = new FileReader()
            fileReader.onload = async (e) => {
                const imageUrl = e.target?.result as string
                fieldChange(imageUrl)
            }
            fileReader.readAsDataURL(file)
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-10"
            >
                <FormField
                    control={form.control}
                    name="profile_photo"
                    render={({field}) => (
                        <FormItem className="flex items-center gap-4">
                            <FormLabel className='account-form_image-label'>
                                {
                                    field.value ? (
                                        <Image
                                            src={field.value}
                                            alt="profile photo"
                                            width={96}
                                            height={96}
                                            priority
                                            className="rounded-full object-contain aspect-square"
                                        />
                                    ) : (
                                        <Image
                                            src="/assets/profile.svg"
                                            alt="profile photo"
                                            width={24}
                                            height={24}
                                            className="object-contain"
                                        />
                                    )
                                }
                            </FormLabel>
                            <FormControl className="flex-1 text-base-semibold text-gray-200">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    placeholder='Add profile photo'
                                    className='account-form_image-input'
                                    onChange={e => changeImage(e, field.onChange)}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem className="flex flex-col gap-3 w-full">
                            <FormLabel className="text-base-semibold text-light-2">Name</FormLabel>
                            <FormControl>
                                <Input {...field} className="account-form_input"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="username"
                    render={({field}) => (
                        <FormItem className="flex flex-col gap-3 w-full">
                            <FormLabel className="text-base-semibold text-light-2">Username</FormLabel>
                            <FormControl>
                                <Input {...field} className="account-form_input"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="bio"
                    render={({field}) => (
                        <FormItem className="flex flex-col gap-3 w-full">
                            <FormLabel className="text-base-semibold text-light-2">Bio</FormLabel>
                            <FormControl>
                                <Textarea {...field} className="account-form_input"/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isUploading} className="bg-primary-500">Submit</Button>
            </form>
        </Form>
    );
};

export default AccountProfile;