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
import { useCommandPalette } from "@/components/notion/CommandPaletteProvider";

/**
 * The ⌘K command palette dialog body. The keyboard listener lives in
 * {@link CommandPaletteProvider}; this component only renders the dialog
 * using the provider's shared `open` state so the same dialog can be opened
 * by the desktop shortcut OR a mobile button.
 */
export function SlashCommand() {
  const { portfolio } = usePortfolio();
  const { open, setOpen } = useCommandPalette();

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
