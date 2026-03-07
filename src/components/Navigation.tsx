import { Navbar, NavbarDivider, NavbarItem, NavbarSection, NavbarSpacer } from './catalyst/navbar'
import { Link } from './catalyst/link'
import { Dropdown, DropdownButton, DropdownItem, DropdownMenu } from './catalyst/dropdown'
import { ChevronDownIcon } from '@heroicons/react/16/solid'
import clsx from 'clsx'
import { useTranslations } from './utils/i18n'

const Logo = ({ className }: { className?: string }) => (
    <div className={clsx(className, "bg-indigo-600 rounded-lg flex items-center justify-center")}>
        <span className="text-white font-bold">C</span>
    </div>
)

export function Navigation({ lang = 'en' }: { lang?: string }) {
    const t = useTranslations(lang);

    return (
        <Navbar>
            <Link href={`/captainschair/${lang}/`} aria-label="Home">
                <Logo className="size-10 sm:size-8" />
            </Link>
            <NavbarDivider />
            <NavbarSection>
                <NavbarItem href={`/captainschair/${lang}/`}>{t.home}</NavbarItem>
            </NavbarSection>
            <NavbarSpacer />
            <NavbarSection>
                <Dropdown>
                    <DropdownButton as={NavbarItem}>
                        {lang.toUpperCase()}
                        <ChevronDownIcon />
                    </DropdownButton>
                    <DropdownMenu>
                        <DropdownItem href="/captainschair/en/">
                            EN - English
                        </DropdownItem>
                        <DropdownItem href="/captainschair/de/">
                            DE - Deutsch
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarSection>
        </Navbar>
    )
}