import Link from "next/link";
import { Building2, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { APP_DESCRIPTION, APP_NAME, NAV_LINKS } from "@/constants";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-600">
                <Building2 className="size-5 text-white" />
              </div>
              <span className="text-xl font-bold">{APP_NAME}</span>
            </Link>
            <p className="text-sm text-muted-foreground">{APP_DESCRIPTION}</p>
            <div className="flex gap-3">
              {[Twitter, Facebook, Instagram, Linkedin].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="flex size-9 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/30"
                >
                  <Icon className="size-4" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Explore</h4>
            <ul className="space-y-2">
              {NAV_LINKS.public.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-emerald-600"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">For Landlords</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/register" className="hover:text-emerald-600">
                  List Your Property
                </Link>
              </li>
              <li>
                <Link href="/landlord" className="hover:text-emerald-600">
                  Landlord Dashboard
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-emerald-600">
                  Pricing & Fees
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/contact" className="hover:text-emerald-600">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-emerald-600">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-emerald-600">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-emerald-600">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-emerald-600">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
