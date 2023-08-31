import {ReactNode} from "react";

export type ChildrenProps<P extends any = {}> = P & {
    children: ReactNode | ReactNode[]
}
