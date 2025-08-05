import { Button } from '@mac/web-ui/button'
import { Separator } from '@mac/web-ui/separator'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@mac/web-ui/sheet'
import { Menu } from 'lucide-react'

import { useAppStore } from '@/stores/app-store'

import { HeaderActions } from './header-actions'
import { MainNavigationMobile } from './main-navigation'

export function MobileMenu() {
  const mobileMenuIsOpen = useAppStore((state) => state.mobileMenuIsOpen)
  const toggleMobileMenu = useAppStore((state) => state.toggleMobileMenu)

  return (
    <Sheet onOpenChange={toggleMobileMenu} open={mobileMenuIsOpen}>
      <SheetTrigger asChild>
        <Button aria-label="Open mobile menu" className="md:hidden" size="icon" variant="ghost">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80 p-0" side="right">
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation Menu</SheetTitle>
          <SheetDescription>
            Access navigation links, theme settings, and user account options.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col h-full">
          <div className="flex-1 px-4 py-10">
            <MainNavigationMobile />
          </div>
          <Separator className="my-4" />
          <HeaderActions />
          <Separator className="my-4" />
        </div>
      </SheetContent>
    </Sheet>
  )
}
