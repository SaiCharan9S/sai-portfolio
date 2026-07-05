import { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { usePortfolio } from "@/context/PortfolioProvider";
import { openCalModal } from "@/lib/cal";
import { scrollToSection } from "@/lib/utils";

export function SlashCommand() {
  const { portfolio } = usePortfolio();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search pages… (⌘K)" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {portfolio.sections.map((section) => (
            <CommandItem
              key={section.id}
              value={section.label}
              onSelect={() => {
                scrollToSection(section.id);
                setOpen(false);
              }}
            >
              <span>{section.icon}</span>
              <span>{section.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem
            value="15 min call"
            onSelect={() => {
              void openCalModal(portfolio.site.calLinks, "15min");
              setOpen(false);
            }}
          >
            📅 15 min call
          </CommandItem>
          <CommandItem
            value="resume cv"
            onSelect={() => {
              window.open(portfolio.site.cvPath, "_blank");
              setOpen(false);
            }}
          >
            📄 Resume
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
