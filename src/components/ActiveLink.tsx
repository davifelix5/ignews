import { LinkProps } from "next/link";
import { ReactElement, cloneElement } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

interface ActiveLinkProps extends LinkProps {
  href: string
  children: ReactElement
  activeClassName: string
}

export function ActiveLink({ children, activeClassName, ...props }: ActiveLinkProps) {

  const { asPath } = useRouter()
  
  const className = asPath === props.href ? activeClassName : ''
  const anchor = cloneElement(children, {
    className,
  })

  return (
    <Link {...props}>
      {anchor}
    </Link>
  )
}