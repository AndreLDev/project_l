import { ReactElement, cloneElement } from "react";
import { useRouter } from "next/router";
import Link, { LinkProps } from "next/link";
import React from "react";

interface ActiveLinkProps extends LinkProps {
    children: ReactElement;
    activeClassName: string; // Corrigi o nome da propriedade para "activeClassName"
}

export function ActiveLink({ children, activeClassName, ...rest }: ActiveLinkProps) {
    const { asPath } = useRouter();
    const className = asPath === rest.href ? activeClassName : '';

    return (
        <Link {...rest}>
            {cloneElement(children, { 
                className 
            })}
        </Link>
    );
}