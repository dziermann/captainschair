import { Navbar, NavbarDivider, NavbarItem, NavbarSection } from './navbar'
import { Link } from './catalyst/link'
import clsx from 'clsx'

const Logo = ({ className }: { className?: string }) => (
    <div className={clsx(className, "bg-indigo-600 rounded-lg flex items-center justify-center")}>
        <span className="text-white font-bold">C</span>
    </div>
)

export function Navigation() {
    return (
        <Navbar>
            <Link href="/captainschair/" aria-label="Home">
                <Logo className="size-10 sm:size-8" />
            </Link>
            <NavbarDivider />
            <NavbarSection>
                <NavbarItem href="/captainschair/">Home</NavbarItem>
            </NavbarSection>
        </Navbar>
    )
}