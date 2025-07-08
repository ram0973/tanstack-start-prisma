import ThemeToggle from '@/components/ThemeToggle'
import { Button } from '@/components/ui/button'
import { NavMenu } from './NavMenu'
import { NavigationSheet } from './NavigationSheet'
//import { authClient } from "@/lib/auth-client";
import { AvatarDropdown } from './AvatarDropdown'
import { Logo } from './../Logo'
import { Link, useMatch } from '@tanstack/react-router'
import { useSession } from '@/hooks/auth-hooks'

const Navbar = () => {
  const { data: me } = useSession()
  const signInMatch = useMatch({ from: '/(auth)/signin/', shouldThrow: false });
  const signUpMatch = useMatch({ from: '/(auth)/signup/', shouldThrow: false });

  return (
    <div className="bg-muted">
      <nav className="h-16 border-b bg-background">
        <div className="mx-auto flex h-full max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Logo />
            {/* Desktop Menu */}
            <NavMenu className="hidden md:block" />
          </div>
          <div className="flex items-center gap-3">
            {!me && (
              <>
                {!signInMatch && (
                  <Button variant="outline">
                    <Link to="/signin">Sign In</Link>
                  </Button>
                )}
								{!signUpMatch && (
                <Button>
                  <Link to="/signup">Sign Up</Link>
                </Button>
								)}
              </>
            )}
            {/* <ThemeToggle /> */}
						<ThemeToggle />
            <AvatarDropdown />
            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}
export default Navbar
