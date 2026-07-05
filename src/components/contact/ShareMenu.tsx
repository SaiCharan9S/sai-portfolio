import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import QRCode from "qrcode";
import { usePortfolio } from "@/context/PortfolioProvider";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Link2,
  Share2,
  Check,
  QrCode,
  Linkedin,
  Twitter,
  MessageCircle,
  Facebook,
  ChevronUp,
  Mail,
  Code2,
  Newspaper,
  Send,
} from "lucide-react";

type ShareLink = {
  key: string;
  label: string;
  href: string;
  icon: ReactNode;
  external?: boolean;
};

type ShareAction = {
  key: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
};

const ICON_BOX = "flex h-7 w-7 shrink-0 items-center justify-center rounded-md";

export function ShareMenu() {
  const { portfolio } = usePortfolio();
  const { profile } = portfolio;
  const [open, setOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [supportsNative, setSupportsNative] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Compute the share URL at runtime — works for both dev and the deployed Vercel URL.
  const shareUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  }, []);

  const shareText = useMemo(
    () => `${profile.name} — ${profile.title}`,
    [profile.name, profile.title],
  );

  // Detect Web Share API support (mobile primarily, but some desktop browsers too).
  useEffect(() => {
    setSupportsNative(
      typeof navigator !== "undefined" && typeof navigator.share === "function",
    );
  }, []);

  // Generate QR code data URL when the QR dialog opens.
  useEffect(() => {
    if (!qrOpen || !shareUrl) return;
    let cancelled = false;
    QRCode.toDataURL(shareUrl, {
      margin: 1,
      width: 320,
      color: { dark: "#0f172a", light: "#ffffff" },
    })
      .then((url) => {
        if (!cancelled) setQrDataUrl(url);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null);
      });
    return () => {
      cancelled = true;
    };
  }, [qrOpen, shareUrl]);

  // Outside-click + Escape dismissal for the menu popover.
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Cleanup the "Copied!" timer on unmount.
  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );

  const handleCopy = async () => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Fallback for older browsers / non-secure contexts.
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
      } catch {
        // Give up silently — the user can still manually select the link.
      }
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (copyTimer.current) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1600);
  };

  const handleNativeShare = async () => {
    if (typeof navigator === "undefined" || !navigator.share) return;
    try {
      await navigator.share({
        title: profile.name,
        text: shareText,
        url: shareUrl,
      });
      setOpen(false);
    } catch {
      // User-cancelled share — do nothing.
    }
  };

  const buildShareUrl = (base: string, params: Record<string, string>) => {
    const u = new URL(base);
    Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v));
    return u.toString();
  };

  const quickActions: ShareAction[] = [
    {
      key: "copy",
      label: copied ? "Copied!" : "Copy link",
      icon: copied ? (
        <Check
          className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400"
          aria-hidden
        />
      ) : (
        <Link2 className="h-3.5 w-3.5" aria-hidden />
      ),
      onClick: handleCopy,
    },
    ...(supportsNative
      ? [
          {
            key: "native",
            label: "Share…",
            icon: <Share2 className="h-3.5 w-3.5" aria-hidden />,
            onClick: handleNativeShare,
          },
        ]
      : []),
    {
      key: "qr",
      label: "QR code",
      icon: <QrCode className="h-3.5 w-3.5" aria-hidden />,
      onClick: () => {
        setOpen(false);
        setQrOpen(true);
      },
    },
  ];

  const socialLinks: ShareLink[] = [
    {
      key: "linkedin",
      label: "LinkedIn",
      icon: <Linkedin className="h-3.5 w-3.5 text-[#0A66C2]" aria-hidden />,
      href: buildShareUrl("https://www.linkedin.com/sharing/share-offsite/", {
        url: shareUrl,
      }),
    },
    {
      key: "x",
      label: "X (Twitter)",
      icon: <Twitter className="h-3.5 w-3.5 text-foreground" aria-hidden />,
      href: buildShareUrl("https://twitter.com/intent/tweet", {
        text: shareText,
        url: shareUrl,
      }),
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      icon: (
        <MessageCircle className="h-3.5 w-3.5 text-[#25D366]" aria-hidden />
      ),
      href: buildShareUrl("https://wa.me/", {
        text: `${shareText} ${shareUrl}`,
      }),
    },
    {
      key: "facebook",
      label: "Facebook",
      icon: <Facebook className="h-3.5 w-3.5 text-[#1877F2]" aria-hidden />,
      href: buildShareUrl("https://www.facebook.com/sharer/sharer.php", {
        u: shareUrl,
      }),
    },
    {
      key: "reddit",
      label: "Reddit",
      icon: <ChevronUp className="h-3.5 w-3.5 text-[#FF4500]" aria-hidden />,
      href: buildShareUrl("https://www.reddit.com/submit", {
        title: shareText,
        url: shareUrl,
      }),
    },
    {
      key: "telegram",
      label: "Telegram",
      icon: <Send className="h-3.5 w-3.5 text-[#229ED9]" aria-hidden />,
      href: buildShareUrl("https://t.me/share/url", {
        url: shareUrl,
        text: shareText,
      }),
    },
  ];

  const moreLinks: ShareLink[] = [
    {
      key: "email",
      label: "Email",
      icon: <Mail className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />,
      href: buildShareUrl("mailto:", {
        subject: profile.name,
        body: `${shareText}\n\n${shareUrl}`,
      }),
    },
    {
      key: "hn",
      label: "Hacker News",
      icon: <Newspaper className="h-3.5 w-3.5 text-[#FF6600]" aria-hidden />,
      href: buildShareUrl("https://news.ycombinator.com/submitlink", {
        u: shareUrl,
        t: shareText,
      }),
    },
    {
      key: "devto",
      label: "dev.to",
      icon: <Code2 className="h-3.5 w-3.5 text-foreground" aria-hidden />,
      href: buildShareUrl("https://dev.to/new", {
        url: shareUrl,
        title: shareText,
      }),
    },
  ];

  return (
    <div ref={rootRef} className="relative">
      <Button
        type="button"
        variant="notion"
        size="iconTouch"
        className="shrink-0 shadow-sm"
        aria-label="Share"
        aria-haspopup="menu"
        aria-expanded={open}
        data-cursor-hint="Share this portfolio"
        onClick={() => setOpen((v) => !v)}
      >
        <Share2 className="h-4 w-4" />
      </Button>

      <div
        role="menu"
        aria-label="Share"
        className={cn(
          "absolute left-0 top-[calc(100%+0.5rem)] z-50 w-64 rounded-lg border border-border bg-background p-1.5 shadow-lg",
          "origin-top-left transition-all duration-150",
          open
            ? "pointer-events-auto scale-100 opacity-100"
            : "pointer-events-none scale-95 opacity-0",
        )}
      >
        <ShareSection title="Quick actions">
          {quickActions.map((action) => (
            <button
              key={action.key}
              type="button"
              role="menuitem"
              onClick={action.onClick}
              data-cursor-hint={action.label}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                "hover:bg-notion-hover",
                copied &&
                  action.key === "copy" &&
                  "text-emerald-700 dark:text-emerald-300",
              )}
            >
              <span className={ICON_BOX}>{action.icon}</span>
              <span className="truncate">{action.label}</span>
            </button>
          ))}
        </ShareSection>

        <ShareSection title="Share to apps">
          <div className="grid grid-cols-3 gap-1">
            {socialLinks.map((link) => (
              <a
                key={link.key}
                role="menuitem"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                data-cursor-hint={`Share on ${link.label}`}
                className="flex flex-col items-center gap-1 rounded-md px-1.5 py-2 text-[11px] text-foreground transition-colors hover:bg-notion-hover"
              >
                <span className={ICON_BOX}>{link.icon}</span>
                <span className="truncate">{link.label}</span>
              </a>
            ))}
          </div>
        </ShareSection>

        <ShareSection title="More" last>
          {moreLinks.map((link) => (
            <a
              key={link.key}
              role="menuitem"
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              data-cursor-hint={`Share via ${link.label}`}
              className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-foreground transition-colors hover:bg-notion-hover"
            >
              <span className={ICON_BOX}>{link.icon}</span>
              <span className="truncate">{link.label}</span>
            </a>
          ))}
        </ShareSection>
      </div>

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent
          className="sm:max-w-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <DialogTitle className="text-base">Scan to open</DialogTitle>
          <div className="flex flex-col items-center gap-3 py-2">
            <div className="flex h-56 w-56 items-center justify-center rounded-lg border border-border bg-white p-2">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR code linking to ${shareUrl}`}
                  className="h-full w-full"
                />
              ) : (
                <QrCode
                  className="h-10 w-10 animate-pulse text-muted-foreground"
                  aria-hidden
                />
              )}
            </div>
            <p className="max-w-full truncate text-center text-xs text-muted-foreground">
              {shareUrl}
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopy}
              data-cursor-hint="Copy link from QR dialog"
            >
              {copied ? (
                <>
                  <Check
                    className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400"
                    aria-hidden
                  />
                  Copied
                </>
              ) : (
                <>
                  <Link2 className="h-3.5 w-3.5" aria-hidden />
                  Copy link
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ShareSection({
  title,
  children,
  last = false,
}: {
  title: string;
  children: ReactNode;
  last?: boolean;
}) {
  return (
    <div className={cn("px-1 pb-1.5", !last && "mb-1 border-b border-border")}>
      <p className="px-1 pb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}
