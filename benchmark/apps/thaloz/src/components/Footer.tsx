import Link from "next/link";
import { footer } from "@/lib/content";
import { Logo } from "./Logo";

function Column({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white/45">{title}</h3>
      <ul className="mt-4 space-y-2.5">
        {items.map((item) => (
          <li key={item}>
            <Link href={item === "Company" ? "/about-us/company" : "#"} className="text-sm text-white/85 hover:text-white">
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#07010f] pb-10 pt-16">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-6 lg:grid-cols-[1.1fr_2fr]">
        <div>
          <Logo />
          <div className="mt-8 space-y-4 text-sm text-white/75">
            <p>
              <span className="block text-white/40">Address</span>
              <a
                href="https://maps.google.com/?q=Benito+Nardone+2310+Montevideo"
                className="hover:text-white"
              >
                Benito Nardone 2310, 11300 Montevideo, Uruguay.
              </a>
            </p>
            <p>
              <span className="block text-white/40">Contact</span>
              <a href="tel:+16282775450" className="block hover:text-white">
                +1 628-277-5450
              </a>
              <a href="mailto:hello@thaloz.com" className="block hover:text-white">
                hello@thaloz.com
              </a>
            </p>
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Column title="Services" items={footer.services} />
          <Column title="Industries" items={footer.industries} />
          <Column title="Success Stories" items={footer.stories} />
          <Column title="Thaloz" items={footer.company} />
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-[1200px] flex-col gap-3 border-t border-white/10 px-6 pt-6 text-sm text-white/45 sm:flex-row sm:justify-between">
        <p>© 2026 Thaloz (Cassiel SAS). All rights reserved.</p>
        <Link href="#" className="hover:text-white">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}
