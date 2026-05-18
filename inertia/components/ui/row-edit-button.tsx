import { Edit2 } from "lucide-react"
import { Button } from "./button"
import { Link } from "@inertiajs/react";


export function RowEditButton({
    href,
}: {
    href: string;

}) {
    return (
        <Button variant="ghost" size="icon-sm" asChild>
            <Link href={href} >
                <Edit2 className="h-4 w-4" />
            </Link>
        </Button>
    )
}