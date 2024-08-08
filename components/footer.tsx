import Link from "next/link";
import { buttonVariants } from "./ui/button";
import { HeartIcon, HexagonIcon, TriangleIcon } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full h-16 border-t">
      <div className="container flex flex-wrap items-center justify-center h-full gap-4 py-3 text-sm sm:justify-between sm:gap-0 text-muted-foreground sm:py-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <span className="text-2xl">📦</span>
            <h2 className="font-bold text-md">BikinProject</h2>
          </div>
          <p className="text-center">
            Build by{" "}
            <Link
              className="px-1 underline underline-offset-2"
              href="https://github.com/nuflakbrr"
            >
              nuflakbrr
            </Link>
            . The source code is available on{" "}
            <Link
              className="px-1 underline underline-offset-2"
              href="https://github.com/nuflakbrr/bikinproject"
            >
              GitHub
            </Link>
            .
          </p>
        </div>

        <div className="items-center hidden gap-4 md:flex">
          <FooterButtons />
        </div>
      </div>
    </footer>
  );
}

export function FooterButtons() {
  return (
    <>
      <Link
        href="https://github.com/sponsors/nuflakbrr"
        className={buttonVariants({ variant: "outline", size: "sm" })}
      >
        <HeartIcon className="w-4 h-4 mr-2 text-red-600 fill-current" />
        Sponsor
      </Link>
    </>
  );
}
