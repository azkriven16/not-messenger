import { IconBrandMessenger } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";

export default function Logo() {
    return (
        <Link href="/" className="flex items-center gap-2">
            <IconBrandMessenger className="size-12" />
            <span>Not Messenger</span>
        </Link>
    );
}
