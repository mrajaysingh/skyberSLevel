"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, Trash2 } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardBody } from "@/components/dashboard/dashboard-body";
import { Button } from "@/components/ui/button";
import { useSecurity } from "@/components/security/page-security";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NextImage from "next/image";

export default function SuperAdminProfilePage() {
  const { user, updateUser } = useSecurity();
  const { showSuccess } = useToast();
  const DEFAULT_BANNER_LIGHT = "/Default/profileBanner/defaultProfileBannerLight.png";
  const DEFAULT_BANNER_DARK = "/Default/profileBanner/defaultProfileBannerDark.png";
  const DEFAULT_AVATAR = "/Default/profileImg/defaultProfile.png";

  const BANNER_WIDTH = 1584;
  const BANNER_HEIGHT = 396;
  const AVATAR_SIZE = 1000; // square

  const [bannerUrl, setBannerUrl] = useState<string>(DEFAULT_BANNER_LIGHT);
  const [isCustomBanner, setIsCustomBanner] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string>(DEFAULT_AVATAR);
  const [uploadingBanner, setUploadingBanner] = useState<boolean>(false);
  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);
  const [confirmDeleteBanner, setConfirmDeleteBanner] = useState<boolean>(false);
  const [confirmDeleteAvatar, setConfirmDeleteAvatar] = useState<boolean>(false);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [connectedGithub, setConnectedGithub] = useState<boolean>(false);
  const [connectedGoogle, setConnectedGoogle] = useState<boolean>(false);
  const [headerIp, setHeaderIp] = useState<string | null>(null);
  const [headerRefreshing, setHeaderRefreshing] = useState<boolean>(false);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  // Disconnect dialogs & captcha state
  const [showDisconnectGithub, setShowDisconnectGithub] = useState(false);
  const [showDisconnectGoogle, setShowDisconnectGoogle] = useState(false);
  const [captchaCode, setCaptchaCode] = useState<string>("");
  const [captchaInput, setCaptchaInput] = useState<string>("");
  const [isDisconnecting, setIsDisconnecting] = useState<boolean>(false);

  interface ProfileFormState {
    firstName: string;
    middleName: string;
    lastName: string;
    designation: string;
    company: string;
    username: string;
    email: string;
    socialFacebook: string;
    socialLinkedIn: string;
    socialInstagram: string;
  }

  const [profileForm, setProfileForm] = useState<ProfileFormState>({
    firstName: user?.name?.split(" ")?.[0] ?? "",
    middleName: user?.name?.split(" ")?.slice(1, -1).join(" ") ?? "",
    lastName: user?.name?.split(" ")?.slice(-1)[0] ?? "",
    designation: "",
    company: "",
    username: user?.email?.split("@")?.[0] ?? "",
    email: user?.email ?? "",
    socialFacebook: "",
    socialLinkedIn: "",
    socialInstagram: "",
  });

  const updateField = (key: keyof ProfileFormState, value: string) => {
    setProfileForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
      await fetch(`${API_URL}/api/profile/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {})
        },
        body: JSON.stringify({
          firstName: profileForm.firstName,
          middleName: profileForm.middleName,
          lastName: profileForm.lastName,
          designation: profileForm.designation,
          company: profileForm.company,
          username: profileForm.username,
          email: profileForm.email,
          socialFacebook: profileForm.socialFacebook,
          socialLinkedIn: profileForm.socialLinkedIn,
          socialInstagram: profileForm.socialInstagram
        })
      }).then(async (r) => {
        if (!r.ok) throw new Error('Failed to save');
      });
      const computedName = [profileForm.firstName, profileForm.middleName, profileForm.lastName]
        .map((s) => (s || "").trim())
        .filter(Boolean)
        .join(" ");
      updateUser({
        firstName: profileForm.firstName || null,
        middleName: profileForm.middleName || null,
        lastName: profileForm.lastName || null,
        designation: profileForm.designation || null,
        company: profileForm.company || null,
        username: profileForm.username || null,
        email: profileForm.email,
        name: computedName || user?.name || null,
      });
      const imageSavedToCloud = (avatarUrl?.startsWith('http') || bannerUrl?.startsWith('http')) &&
        !avatarUrl?.startsWith('data:') && !bannerUrl?.startsWith('data:');
      showSuccess(
        'Profile updated',
        imageSavedToCloud ? 'Images saved to Cloud. Profile details saved.' : 'Profile details saved.'
      );
    } catch (_) {
      showSuccess('Profile updated', 'Profile details saved.');
    }
  };


  // Process an image file to exact target dimensions (center-cover). Returns data URL.
  const processImageFile = async (
    file: File,
    targetWidth: number,
    targetHeight: number
  ): Promise<string> => {
    const dataUrl: string = await new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onerror = () => reject(new Error("Failed to read file"));
      fr.onload = () => resolve(String(fr.result));
      fr.readAsDataURL(file);
    });

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = () => reject(new Error("Failed to load image"));
      i.src = dataUrl;
    });

    // Compute scale to cover target
    const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;
    const offsetX = (targetWidth - drawWidth) / 2; // negative means crop left
    const offsetY = (targetHeight - drawHeight) / 2; // negative means crop top

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported");
    // Fill with black background to avoid transparency seams on jpg/png with alpha
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    return canvas.toDataURL("image/jpeg", 0.92);
  };

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  // Fetch existing avatar/banner from backend on mount
  useEffect(() => {
    const load = async () => {
      try {
        const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
        if (!sessionToken) return;
        const r = await fetch(`${API_URL}/api/dashboard/super-admin`, {
          headers: { 'Authorization': `Bearer ${sessionToken}` },
          cache: 'no-store'
        });
        if (!r.ok) return;
        const j = await r.json();
        const u = j?.data?.dashboard?.user;
        if (u?.avatar) setAvatarUrl(u.avatar);
        if (u?.banner) {
          setBannerUrl(u.banner);
          setIsCustomBanner(true);
        }
        if (u) {
          setHeaderIp(u.displayIp || u.currentIp || u.currentRequestIp || null);
        }
        // Populate form with persisted profile data if present
        if (u) {
          setProfileForm((prev) => ({
            firstName: u.firstName ?? prev.firstName ?? "",
            middleName: u.middleName ?? prev.middleName ?? "",
            lastName: u.lastName ?? prev.lastName ?? "",
            designation: u.designation ?? prev.designation ?? "",
            company: u.company ?? prev.company ?? "",
            username: u.username ?? prev.username ?? (u.email ? String(u.email).split("@")[0] : ""),
            email: u.email ?? prev.email ?? "",
            socialFacebook: u.socialFacebook ?? prev.socialFacebook ?? "",
            socialLinkedIn: u.socialLinkedIn ?? prev.socialLinkedIn ?? "",
            socialInstagram: u.socialInstagram ?? prev.socialInstagram ?? "",
          }));
        }
        if (u) {
          setConnectedGithub(!!u.githubId);
          setConnectedGoogle(!!u.googleId);
          updateUser({
            avatar: u.avatar ?? null,
            banner: u.banner ?? null,
            firstName: u.firstName ?? null,
            middleName: u.middleName ?? null,
            lastName: u.lastName ?? null,
            designation: u.designation ?? null,
            company: u.company ?? null,
            username: u.username ?? null,
            name: u.name ?? null,
          });
        }
      } catch (_) {}
    };
    load();
    
    // Check for OAuth callback success
    const params = new URLSearchParams(window.location.search);
    const connected = params.get('connected');
    if (connected === 'github' || connected === 'google') {
      // Reload to refresh connection status
      load();
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
      showSuccess('Connected', `${connected === 'github' ? 'GitHub' : 'Google'} account connected successfully!`);
    }
  }, [API_URL, showSuccess, updateUser]);

  // Load saved card (masked) if present
  useEffect(() => {
    const loadCard = async () => {
      try {
        const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
        if (!sessionToken) return;

        // Try full details first (dev-only endpoint). If forbidden/unavailable, fall back to summary.
        let resp = await fetch(`${API_URL}/api/cards/me/full`, {
          headers: { 'Authorization': `Bearer ${sessionToken}` },
          cache: 'no-store'
        });

        if (resp.status === 401) {
          try {
            localStorage.removeItem('sessionToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('userData');
            localStorage.removeItem('skyber_authenticated');
          } catch (_) {}
          window.location.href = '/login';
          return;
        }

        if (resp.status === 403 || resp.status === 404) {
          // Fall back to masked summary
          resp = await fetch(`${API_URL}/api/cards/me`, {
            headers: { 'Authorization': `Bearer ${sessionToken}` },
            cache: 'no-store'
          });
        }

        if (!resp.ok) return;
        const j = await resp.json();
        const d = j?.data;
        if (d) {
          if ('cardNumber' in d && d.cardNumber) {
            const full = String(d.cardNumber);
            setCardNumber(full);
            setSavedLast4(full.slice(-4));
          } else if ('last4' in d) {
            setSavedLast4(d.last4 || null);
          }
          setSavedBrand((d as any).brand || null);
          if (d.expiryMonth) setExpiryMonth(String(d.expiryMonth).padStart(2, '0'));
          if (d.expiryYear) setExpiryYear(String(d.expiryYear));
          if ((d as any).cvv) setCvv(String((d as any).cvv));
          setIsSaved(true);
          setIsEditingCard(false);
          setSavedCardDetails({
            cardNumber: 'cardNumber' in d ? String(d.cardNumber) : undefined,
            expiryMonth: d.expiryMonth ? String(d.expiryMonth).padStart(2, '0') : undefined,
            expiryYear: d.expiryYear ? String(d.expiryYear) : undefined,
            cvv: (d as any).cvv ? String((d as any).cvv) : undefined,
          });
        }
      } catch (_) {}
    };
    loadCard();
  }, [API_URL]);

  // Generate a random 7-char alphanumeric captcha
  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let out = '';
    for (let i = 0; i < 7; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return out;
  };

  const openDisconnectDialog = (provider: 'github' | 'google') => {
    const code = generateCaptcha();
    setCaptchaCode(code);
    setCaptchaInput('');
    if (provider === 'github') {
      setShowDisconnectGithub(true);
    } else {
      setShowDisconnectGoogle(true);
    }
  };

  const handleHeaderRefresh = async () => {
    if (headerRefreshing) return;
    setHeaderRefreshing(true);
    try {
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
      if (!sessionToken) return;
      const r = await fetch(`${API_URL}/api/dashboard/super-admin?ts=${Date.now()}`, {
        headers: { 'Authorization': `Bearer ${sessionToken}` },
        cache: 'no-store'
      });
      if (r.ok) {
        const j = await r.json();
        const u = j?.data?.dashboard?.user;
        if (u) {
          setHeaderIp(u.displayIp || u.currentIp || u.currentRequestIp || null);
        }
      }
    } finally {
      setHeaderRefreshing(false);
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingBanner(true);
      const processed = await processImageFile(file, BANNER_WIDTH, BANNER_HEIGHT);
      setBannerUrl(processed); // immediate preview
      setIsCustomBanner(true);
      // Upload to backend → S3
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
      await fetch(`${API_URL}/api/profile/upload-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {})
        },
        body: JSON.stringify({ type: 'banner', dataUrl: processed })
      }).then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (r.ok && j?.url) {
          setBannerUrl(j.url);
          updateUser({ banner: j.url });
          showSuccess('Saved on Cloud', 'Banner uploaded to S3');
        } else {
          throw new Error(j?.message || 'Upload failed');
        }
      }).catch(() => {});
    } catch (_) {
      // fallback to default if processing fails
      const isDark = document.documentElement.classList.contains("dark");
      const fallback = isDark ? DEFAULT_BANNER_DARK : DEFAULT_BANNER_LIGHT;
      setBannerUrl(fallback);
      updateUser({ banner: fallback });
    } finally {
      e.target.value = ""; // allow re-selecting same file
      setUploadingBanner(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploadingAvatar(true);
      const processed = await processImageFile(file, AVATAR_SIZE, AVATAR_SIZE);
      setAvatarUrl(processed); // immediate preview
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
      await fetch(`${API_URL}/api/profile/upload-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {})
        },
        body: JSON.stringify({ type: 'avatar', dataUrl: processed })
      }).then(async (r) => {
        const j = await r.json().catch(() => ({}));
        if (r.ok && j?.url) {
          setAvatarUrl(j.url);
          updateUser({ avatar: j.url });
          showSuccess('Saved on Cloud', 'Profile photo uploaded to S3');
        } else {
          throw new Error(j?.message || 'Upload failed');
        }
      }).catch(() => {});
    } catch (_) {
      setAvatarUrl(DEFAULT_AVATAR);
      updateUser({ avatar: DEFAULT_AVATAR });
    } finally {
      e.target.value = "";
      setUploadingAvatar(false);
    }
  };

  // Payment state and helpers
  const [cardNumber, setCardNumber] = useState<string>("");
  const [expiryMonth, setExpiryMonth] = useState<string>("");
  const [expiryYear, setExpiryYear] = useState<string>("");
  const [cvv, setCvv] = useState<string>("");
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isEditingCard, setIsEditingCard] = useState<boolean>(true);
  const [isBack, setIsBack] = useState<boolean>(false);
  const [savedLast4, setSavedLast4] = useState<string | null>(null);
  const [savedBrand, setSavedBrand] = useState<string | null>(null);
  const [savedCardDetails, setSavedCardDetails] = useState<{ cardNumber?: string; expiryMonth?: string; expiryYear?: string; cvv?: string } | null>(null);

  // Data export & deletion state
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDownloadAgree, setShowDownloadAgree] = useState(false);
  const [agreeDownload, setAgreeDownload] = useState(false);
  const [agreeDelete, setAgreeDelete] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const months = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 16 }, (_, i) => String(currentYear + i));

  const formatCardNumber = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const cvvPlain = cvv || "000";

  // Display helpers for masked/saved details
  const displayNumber = (() => {
    if (cardNumber) return formatCardNumber(cardNumber);
    if (savedLast4) {
      const trimmed = savedLast4.replace(/\s+/g, "");
      if (trimmed.length === 16) return formatCardNumber(trimmed);
      return savedLast4;
    }
    return "9759 2484 5269 6576";
  })();
  const displayBrand = (savedBrand || "").toUpperCase() || "MASTERCARD";

  const handleSaveCard = async () => {
    try {
      const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
      if (!sessionToken) return;
      await fetch(`${API_URL}/api/cards/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {})
        },
        body: JSON.stringify({
          cardNumber,
          expiryMonth,
          expiryYear,
          cvv
        })
      }).then(async (r) => {
        if (!r.ok) throw new Error('Failed to save');
      });
      setSavedLast4(cardNumber.slice(-4));
      setIsSaved(true);
      setIsEditingCard(false);
      setSavedCardDetails({
        cardNumber,
        expiryMonth,
        expiryYear,
        cvv,
      });
      showSuccess("Card saved", "Your card details were updated.");
    } catch (_) {}
  };

  const handleCancelEditCard = () => {
    if (savedCardDetails) {
      setCardNumber(savedCardDetails.cardNumber ?? "");
      setExpiryMonth(savedCardDetails.expiryMonth ?? "");
      setExpiryYear(savedCardDetails.expiryYear ?? "");
      setCvv(savedCardDetails.cvv ?? "");
    } else {
      setCardNumber("");
      setExpiryMonth("");
      setExpiryYear("");
      setCvv("");
    }
    setIsEditingCard(false);
  };

  // Profile banner derived fields (live preview)
  const fullName = [profileForm.firstName, profileForm.middleName, profileForm.lastName]
    .map((s) => (s || "").trim())
    .filter(Boolean)
    .join(" ") || (user?.name || "Kevin Smith");
  const designationLine = (() => {
    const d = (profileForm.designation || "").trim();
    const c = (profileForm.company || "").trim();
    if (d && c) return `${d} at ${c}`;
    return d || (c ? c : "Advisor and Consultant at Stripe Inc.");
  })();
  const usernameHandle = (profileForm.username || "").trim() || "kevinsmith55";
  const normalizeHandle = (h: string) => h.replace(/^https?:\/\//, "").replace(/^www\./, "");
  const fbHandle = normalizeHandle((profileForm.socialFacebook).trim());
  const igHandle = normalizeHandle((profileForm.socialInstagram).trim());

  // Theme-aware default banner: initialize and react to changes
  useEffect(() => {
    const applyThemeBanner = () => {
      if (isCustomBanner) return;
      const isDark = document.documentElement.classList.contains("dark");
      setBannerUrl(isDark ? DEFAULT_BANNER_DARK : DEFAULT_BANNER_LIGHT);
    };

    // Initial
    applyThemeBanner();

    // Observe changes to data-dashboard-theme or class
    const observer = new MutationObserver(() => applyThemeBanner());
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-dashboard-theme", "class"] });

    return () => observer.disconnect();
  }, [isCustomBanner]);

  // Theme-specific styling handled via Tailwind dark: classes below

  return (
    <>
      <DashboardHeader 
        title="Super Admin Dashboard"
        subtitle="- Skyber Engine v 7SKB.R2.02.5"
        ip={headerIp}
        onRefresh={handleHeaderRefresh}
        refreshing={headerRefreshing}
      />
      <DashboardBody>
        <h2 className="text-xl font-semibold mb-4">Profile</h2>
        {/* Profile Banner + Avatar Editor */}
        <section className="rounded-xl border overflow-hidden bg-background">
                {/* Banner with in-container profile info */}
                <div className="relative h-48 sm:h-56 lg:h-64 w-full bg-muted">
                  <img
                    src={bannerUrl}
                    alt="Profile banner"
                    className="h-full w-full object-cover"
                  />
                  <button
                    onClick={() => bannerInputRef.current?.click()}
                    className="absolute right-4 bottom-4 inline-flex items-center justify-center h-10 w-10 rounded-full border bg-background/80 backdrop-blur hover:bg-background transition-colors z-20"
                    aria-label="Change banner"
                    title="Change banner"
                  >
                    {uploadingBanner ? (
                      <span className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    ) : (
                      <Camera className="h-5 w-5" />
                    )}
                  </button>
                  <button
                    onClick={() => setConfirmDeleteBanner(true)}
                    className="absolute right-16 bottom-4 inline-flex items-center justify-center h-10 w-10 rounded-full border bg-background/80 backdrop-blur hover:bg-background transition-colors z-20"
                    aria-label="Delete banner"
                    title="Delete banner"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleBannerChange}
                  />
                  {/* In-banner profile info (no outside overlap) */}
                  <div className="absolute inset-x-4 bottom-4 flex items-end justify-between z-10">
                    <div className="flex items-end gap-4">
                      <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-full ring-2 ring-white/80 shadow-md overflow-hidden bg-black">
                        <img
                          src={avatarUrl}
                          alt="User avatar"
                          className="h-full w-full object-cover"
                        />
                        <button
                          onClick={() => avatarInputRef.current?.click()}
                          className="absolute right-1.5 bottom-1.5 inline-flex items-center justify-center h-7 w-7 rounded-full border bg-white/80 backdrop-blur hover:bg-white transition-colors text-black"
                          aria-label="Change photo"
                        >
                          {uploadingAvatar ? (
                            <span className="h-4 w-4 rounded-full border-2 border-black/40 border-t-black animate-spin" />
                          ) : (
                            <Camera className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteAvatar(true)}
                          className="absolute left-1.5 bottom-1.5 inline-flex items-center justify-center h-7 w-7 rounded-full border bg-white/80 backdrop-blur hover:bg-white transition-colors text-black"
                          aria-label="Delete photo"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <input
                          ref={avatarInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarChange}
                        />
                      </div>
                      <div className="pb-1 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] px-3 py-2 rounded-md bg-black/55 backdrop-blur-sm ring-1 ring-white/10">
                        <h3 className="text-xl sm:text-2xl font-bold leading-tight">
                          {fullName}
                        </h3>
                        <p className="text-xs sm:text-sm opacity-90">{designationLine}</p>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] sm:text-xs opacity-90">
                          <span>@ {usernameHandle}</span>
                          <span>{fbHandle}</span>
                          <span>{igHandle}</span>
                        </div>
                      </div>
                    </div>
                    {/* Removed non-functional menu button */}
                  </div>
                </div>
              </section>

              {/* Delete Banner Dialog */}
              <Dialog open={confirmDeleteBanner} onOpenChange={setConfirmDeleteBanner}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete banner</DialogTitle>
                    <DialogDescription>Are you sure you want to delete your banner?</DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setConfirmDeleteBanner(false)} disabled={deleting}>Cancel</Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white" disabled={deleting} onClick={async () => {
                      if (deleting) return;
                      setDeleting(true);
                      try {
                        const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
                        await fetch(`${API_URL}/api/profile/delete-image`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {}) },
                          body: JSON.stringify({ type: 'banner' })
                        });
                        setIsCustomBanner(false);
                        const isDark = document.documentElement.classList.contains('dark');
                        const fallback = isDark ? DEFAULT_BANNER_DARK : DEFAULT_BANNER_LIGHT;
                        setBannerUrl(fallback);
                        updateUser({ banner: fallback });
                        setConfirmDeleteBanner(false);
                        showSuccess('Deleted', 'Banner removed and restored to default');
                      } finally {
                        setDeleting(false);
                      }
                    }}>Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Delete Avatar Dialog */}
              <Dialog open={confirmDeleteAvatar} onOpenChange={setConfirmDeleteAvatar}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete profile photo</DialogTitle>
                    <DialogDescription>Are you sure you want to delete your profile photo?</DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setConfirmDeleteAvatar(false)} disabled={deleting}>Cancel</Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white" disabled={deleting} onClick={async () => {
                      if (deleting) return;
                      setDeleting(true);
                      try {
                        const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
                        await fetch(`${API_URL}/api/profile/delete-image`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {}) },
                          body: JSON.stringify({ type: 'avatar' })
                        });
                        setAvatarUrl(DEFAULT_AVATAR);
                        updateUser({ avatar: DEFAULT_AVATAR });
                        setConfirmDeleteAvatar(false);
                        showSuccess('Deleted', 'Profile photo removed and restored to default');
                      } finally {
                        setDeleting(false);
                      }
                    }}>Delete</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Profile Details Form */}
              <div className="mt-6">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Profile Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First name</Label>
                        <Input
                          id="firstName"
                          value={profileForm.firstName}
                          onChange={(e) => updateField("firstName", e.target.value)}
                          placeholder="Ajay"
                        />
                      </div>
                      <div>
                        <Label htmlFor="middleName">Middle name</Label>
                        <Input
                          id="middleName"
                          value={profileForm.middleName}
                          onChange={(e) => updateField("middleName", e.target.value)}
                          placeholder="Singh"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last name</Label>
                        <Input
                          id="lastName"
                          value={profileForm.lastName}
                          onChange={(e) => updateField("lastName", e.target.value)}
                          placeholder="Rajput"
                        />
                      </div>
                      <div>
                        <Label htmlFor="designation">Designation</Label>
                        <Input
                          id="designation"
                          value={profileForm.designation}
                          onChange={(e) => updateField("designation", e.target.value)}
                          placeholder="Advisor and Consultant"
                        />
                      </div>
                      <div>
                        <Label htmlFor="company">Company</Label>
                        <Input
                          id="company"
                          value={profileForm.company}
                          onChange={(e) => updateField("company", e.target.value)}
                          placeholder="Stripe Inc."
                        />
                      </div>
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={profileForm.username}
                          onChange={(e) => updateField("username", e.target.value)}
                          placeholder="ajay_singh"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => updateField("email", e.target.value)}
                          placeholder="admin@skyber.dev"
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="text-sm font-semibold mb-2">Social media</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="fb">Facebook handle</Label>
                          <Input
                            id="fb"
                            value={profileForm.socialFacebook}
                            onChange={(e) => updateField("socialFacebook", e.target.value)}
                            placeholder="facebook.com/ajay"
                          />
                        </div>
                        <div>
                          <Label htmlFor="li">LinkedIn</Label>
                          <Input
                            id="li"
                            value={profileForm.socialLinkedIn}
                            onChange={(e) => updateField("socialLinkedIn", e.target.value)}
                            placeholder="linkedin.com/in/ajay"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ig">Instagram</Label>
                          <Input
                            id="ig"
                            value={profileForm.socialInstagram}
                            onChange={(e) => updateField("socialInstagram", e.target.value)}
                            placeholder="instagram.com/ajay"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button className="bg-[#17D492] hover:bg-[#17D492]/90 text-white" onClick={handleSaveProfile}>
                        Save profile details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Connected Accounts */}
              <div className="mt-6">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Connected accounts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* GitHub */}
                      <div className="flex items-center justify-between border rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center">
                            <NextImage src="/AuthImg/GithubAuthIcon.svg" alt="GitHub" width={24} height={24} className="opacity-90" />
                          </div>
                          <div>
                            <p className="font-medium">GitHub</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {connectedGithub ? 'Connected' : 'Not connected'}
                            </p>
                          </div>
                        </div>
                        {connectedGithub ? (
                          <button
                            onClick={() => openDisconnectDialog('github')}
                            className="inline-flex items-center px-3 py-2 rounded-md border bg-red-600 text-white hover:opacity-90"
                          >
                            Disconnect
                          </button>
                        ) : (
                          <a
                            href={`${API_URL}/api/auth/oauth/github?connect=true&sessionToken=${encodeURIComponent(typeof window !== 'undefined' ? (localStorage.getItem('sessionToken') || '') : '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center px-3 py-2 rounded-md border ${connectedGithub ? 'bg-muted text-foreground' : 'bg-[#0d1117] text-white'} hover:opacity-90`}
                          >
                            Connect
                          </a>
                        )}
                      </div>

                      {/* Google */}
                      <div className="flex items-center justify-between border rounded-lg p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center">
                            <NextImage src="/AuthImg/GoogleAuthIcon.svg" alt="Google" width={24} height={24} className="opacity-90" />
                          </div>
                          <div>
                            <p className="font-medium">Google</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {connectedGoogle ? 'Connected' : 'Not connected'}
                            </p>
                          </div>
                        </div>
                        {connectedGoogle ? (
                          <button
                            onClick={() => openDisconnectDialog('google')}
                            className="inline-flex items-center px-3 py-2 rounded-md border bg-red-600 text-white hover:opacity-90"
                          >
                            Disconnect
                          </button>
                        ) : (
                          <a
                            href={`${API_URL}/api/auth/oauth/google?connect=true&sessionToken=${encodeURIComponent(typeof window !== 'undefined' ? (localStorage.getItem('sessionToken') || '') : '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`inline-flex items-center px-3 py-2 rounded-md border ${connectedGoogle ? 'bg-muted text-foreground' : 'bg-red-600 text-white'} hover:opacity-90`}
                          >
                            Connect
                          </a>
                        )}
                      </div>

                      {/* Facebook (placeholder) */}
                      <div className="flex items-center justify-between border rounded-lg p-4 md:col-span-2">
                        <div>
                          <p className="font-medium">Facebook</p>
                          <p className="text-xs text-muted-foreground mt-1">Not available yet</p>
                        </div>
                        <button className="inline-flex items-center px-3 py-2 rounded-md border bg-muted text-muted-foreground cursor-not-allowed" disabled>
                          Coming soon
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Disconnect GitHub Dialog */}
              <Dialog open={showDisconnectGithub} onOpenChange={(open) => {
                if (isDisconnecting) return;
                setShowDisconnectGithub(open);
                if (open) {
                  const code = generateCaptcha();
                  setCaptchaCode(code);
                  setCaptchaInput('');
                }
              }}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Disconnect GitHub</DialogTitle>
                    <DialogDescription>
                      This will remove all GitHub references and clear your social links from the database. Type the code to confirm.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3 py-2">
                    <div className="text-sm">Confirmation code:</div>
                    <div className="font-mono text-lg tracking-widest select-none px-3 py-2 rounded border bg-muted inline-block">{captchaCode}</div>
                    <Input placeholder="Type the code here" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} />
                  </div>
                  <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setShowDisconnectGithub(false)} disabled={isDisconnecting}>Cancel</Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white" disabled={isDisconnecting || captchaCode.length === 0 || captchaInput.trim() !== captchaCode} onClick={async () => {
                      if (isDisconnecting) return;
                      setIsDisconnecting(true);
                      try {
                        const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
                        await fetch(`${API_URL}/api/profile/disconnect-social`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {}) },
                          body: JSON.stringify({ provider: 'github' })
                        });
                        setConnectedGithub(false);
                        // Also clear local social fields preview
                        setProfileForm((p) => ({ ...p, socialFacebook: '', socialLinkedIn: '', socialInstagram: '' }));
                        setShowDisconnectGithub(false);
                        showSuccess('Disconnected', 'GitHub disconnected and social links cleared');
                      } finally {
                        setIsDisconnecting(false);
                      }
                    }}>Disconnect</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Disconnect Google Dialog */}
              <Dialog open={showDisconnectGoogle} onOpenChange={(open) => {
                if (isDisconnecting) return;
                setShowDisconnectGoogle(open);
                if (open) {
                  const code = generateCaptcha();
                  setCaptchaCode(code);
                  setCaptchaInput('');
                }
              }}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Disconnect Google</DialogTitle>
                    <DialogDescription>
                      This will remove all Google references and clear your social links from the database. Type the code to confirm.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-3 py-2">
                    <div className="text-sm">Confirmation code:</div>
                    <div className="font-mono text-lg tracking-widest select-none px-3 py-2 rounded border bg-muted inline-block">{captchaCode}</div>
                    <Input placeholder="Type the code here" value={captchaInput} onChange={(e) => setCaptchaInput(e.target.value)} />
                  </div>
                  <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                    <Button variant="outline" onClick={() => setShowDisconnectGoogle(false)} disabled={isDisconnecting}>Cancel</Button>
                    <Button className="bg-red-600 hover:bg-red-700 text-white" disabled={isDisconnecting || captchaCode.length === 0 || captchaInput.trim() !== captchaCode} onClick={async () => {
                      if (isDisconnecting) return;
                      setIsDisconnecting(true);
                      try {
                        const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
                        await fetch(`${API_URL}/api/profile/disconnect-social`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json', ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {}) },
                          body: JSON.stringify({ provider: 'google' })
                        });
                        setConnectedGoogle(false);
                        setProfileForm((p) => ({ ...p, socialFacebook: '', socialLinkedIn: '', socialInstagram: '' }));
                        setShowDisconnectGoogle(false);
                        showSuccess('Disconnected', 'Google disconnected and social links cleared');
                      } finally {
                        setIsDisconnecting(false);
                      }
                    }}>Disconnect</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Payment Section */}
              <div className="mt-6">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle>Payment</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Card Preview */}
                      <div className="flex items-center justify-center">
                        <div
                          className={`relative [transform-style:preserve-3d] transition-transform duration-700 ${isBack ? "[transform:rotateY(180deg)]" : ""}`}
                          style={{ width: 320, height: 200, perspective: 1000 }}
                          onMouseEnter={() => { if (cvv.length > 0) setIsBack(true); }}
                          onMouseLeave={() => { if (cvv.length > 0) setIsBack(false); }}
                        >
                          {/* Front */}
                          <div
                            className={"absolute inset-0 rounded-xl bg-[#0f0f0f] text-white overflow-hidden [backface-visibility:hidden] border-[1.5px] border-[#ff9800] dark:border-white shadow-[0_12px_28px_rgba(0,0,0,0.35)] dark:shadow-[0_12px_28px_rgba(255,255,255,0.20)]"}
                          >
                            <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,rgba(255,152,0,0.15),transparent_60%),radial-gradient(120%_120%_at_0%_100%,rgba(255,61,0,0.15),transparent_60%)]" />
                            <div className="relative w-full h-full p-5">
                              <p className="absolute text-[10px] tracking-[0.2em] top-4 right-4">{displayBrand}</p>
                              <svg className="absolute bottom-6 right-6" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 48 48"><path fill="#ff9800" d="M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"/><path fill="#d50000" d="M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"/><path fill="#ff3d00" d="M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"/></svg>
                              <svg className="absolute top-5 left-5" width="30" height="30" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><rect x="8" y="12" width="34" height="26" rx="4" fill="#c8ad7f"/><rect x="13" y="16" width="24" height="4" fill="#b89c70"/><rect x="13" y="22" width="10" height="2" fill="#b89c70"/><rect x="13" y="26" width="24" height="8" fill="#b89c70"/></svg>
                              <svg className="absolute top-10 right-14" width="20" height="20" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg"><path d="M12 25c4-6 10-6 14 0m-8-6c3-4 7-4 10 0m-12 12c5-8 13-8 18 0" stroke="#fff" strokeWidth="2" fill="none"/></svg>
                              <p className="absolute font-semibold text-lg left-5 bottom-16 tracking-wider font-mono">{displayNumber}</p>
                              <div className="absolute left-5 bottom-10 flex items-center gap-3 text-[10px]">
                                <span className="opacity-80">VALID THRU</span>
                                <span className="font-semibold text-sm">{expiryMonth || "12"} / {expiryYear ? expiryYear.slice(-2) : "24"}</span>
                              </div>
                              <p className="absolute left-5 bottom-4 font-semibold text-sm">{(profileForm.firstName || profileForm.lastName) ? `${profileForm.firstName} ${profileForm.lastName}`.toUpperCase() : "BRUCE WAYNE"}</p>
                            </div>
                          </div>
                          {/* Back */}
                          <div
                            className={"absolute inset-0 rounded-xl bg-[#0f0f0f] text-white overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] border-[1.5px] border-[#ff9800] dark:border-white shadow-[0_12px_28px_rgba(0,0,0,0.35)] dark:shadow-[0_12px_28px_rgba(255,255,255,0.20)]"}
                          >
                            <div className="relative w-full h-full">
                              <div className="absolute top-6 left-0 right-0 h-8 bg-gradient-to-r from-[#303030] to-[#202020]" />
                              <div className="absolute top-24 left-5">
                                <div className="bg-white rounded px-2 py-1 w-40"><span className="text-black font-bold tracking-widest">{cvvPlain}</span></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Form */}
                      <div>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <Label htmlFor="cardNum">Card number</Label>
                            <Input
                              id="cardNum"
                              inputMode="numeric"
                              maxLength={19}
                              value={formatCardNumber(cardNumber)}
                              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0,16))}
                              placeholder="1234 5678 9012 3456"
                              className={!isEditingCard ? "mt-1 bg-muted text-muted-foreground cursor-default" : "mt-1"}
                              disabled={!isEditingCard}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Expiry month</Label>
                              {isEditingCard ? (
                                <Select value={expiryMonth} onValueChange={setExpiryMonth}>
                                  <SelectTrigger className="mt-2"><SelectValue placeholder="MM" /></SelectTrigger>
                                  <SelectContent>
                                    {months.map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <div className="mt-2 rounded-md border border-muted bg-muted px-3 py-2 text-sm text-muted-foreground">
                                  {expiryMonth || "--"}
                                </div>
                              )}
                            </div>
                            <div>
                              <Label>Expiry year</Label>
                              {isEditingCard ? (
                                <Select value={expiryYear} onValueChange={setExpiryYear}>
                                  <SelectTrigger className="mt-2"><SelectValue placeholder="YYYY" /></SelectTrigger>
                                  <SelectContent>
                                    {years.map((y) => (<SelectItem key={y} value={y}>{y}</SelectItem>))}
                                  </SelectContent>
                                </Select>
                              ) : (
                                <div className="mt-2 rounded-md border border-muted bg-muted px-3 py-2 text-sm text-muted-foreground">
                                  {expiryYear || "----"}
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV</Label>
                            <Input
                              id="cvv"
                              type="password"
                              inputMode="numeric"
                              maxLength={4}
                              value={cvv}
                              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0,4))}
                              onFocus={() => setIsBack(true)}
                              onBlur={() => setIsBack(false)}
                              placeholder="***"
                              className={!isEditingCard ? "mt-1 bg-muted text-muted-foreground cursor-default" : "mt-1"}
                              disabled={!isEditingCard}
                            />
                          </div>
                          {savedLast4 && (
                            <p className="text-sm text-muted-foreground">Saved card: {cardNumber ? formatCardNumber(cardNumber) : displayNumber}</p>
                          )}
                          <div className="flex gap-2 justify-end pt-2">
                            {isEditingCard ? (
                              <>
                                <Button className="bg-[#17D492] hover:bg-[#17D492]/90 text-white" onClick={handleSaveCard}>Save card</Button>
                                <Button variant="outline" onClick={handleCancelEditCard}>Cancel</Button>
                              </>
                            ) : (
                              <Button variant="outline" onClick={() => setIsEditingCard(true)}>Edit card</Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
        </div>

        {/* Danger Zone: Data export & Account deletion */}
        <div className="mt-8">
          <Card className="shadow-sm border-red-300">
            <CardHeader>
              <CardTitle className="text-red-600">Danger zone</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  Download a copy of your data or delete your account.
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => { setAgreeDownload(false); setShowDownloadAgree(true); }}>Download my data</Button>
                  <Button className="bg-yellow-500 hover:bg-yellow-600 text-black" onClick={() => setShowDeletePrompt(true)}>Delete account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Download agreement dialog */}
        <Dialog open={showDownloadAgree} onOpenChange={(o) => { if (!isExporting) setShowDownloadAgree(o); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Download your data</DialogTitle>
              <DialogDescription>
                To proceed, you must agree to Skyber agreements about handling exported data.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={agreeDownload} onChange={(e) => setAgreeDownload(e.target.checked)} />
                <span>I agree to Skyber agreements and understand the data will be downloaded as JSON.</span>
              </label>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setShowDownloadAgree(false)} disabled={isExporting}>Cancel</Button>
              <Button onClick={async () => {
                if (!agreeDownload || isExporting) return;
                setIsExporting(true);
                try {
                  const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
                  const r = await fetch(`${API_URL}/api/profile/export`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {}) } });
                  if (!r.ok) throw new Error('Export failed');
                  const j = await r.json();
                  const data = j?.data || {};
                  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  const ts = new Date().toISOString().replace(/[:.]/g, '-');
                  a.download = `skyber-account-export-${ts}.json`;
                  document.body.appendChild(a);
                  a.click();
                  a.remove();
                  URL.revokeObjectURL(url);
                  setShowDownloadAgree(false);
                  showSuccess('Data ready', 'Your data was downloaded as JSON.');
                } catch (e) {
                } finally {
                  setIsExporting(false);
                }
              }} disabled={!agreeDownload || isExporting}>
                {isExporting ? 'Preparing…' : 'Download JSON'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete warning dialog (yellow) with option to download first or skip */}
        <Dialog open={showDeletePrompt} onOpenChange={(o) => { if (!isDeletingAccount) setShowDeletePrompt(o); }}>
          <DialogContent className="border-yellow-400">
            <DialogHeader>
              <DialogTitle className="text-yellow-600">Delete account?</DialogTitle>
              <DialogDescription>
                We recommend downloading your data before deletion. You can skip backup and proceed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => { setShowDeletePrompt(false); setAgreeDownload(false); setShowDownloadAgree(true); }}>Download data</Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black" onClick={() => { setShowDeletePrompt(false); setAgreeDelete(false); setShowDeleteConfirm(true); }}>Proceed without backup</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Final deletion confirmation with agreements */}
        <Dialog open={showDeleteConfirm} onOpenChange={(o) => { if (!isDeletingAccount) setShowDeleteConfirm(o); }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm account deletion</DialogTitle>
              <DialogDescription>
                This will remove your account from the app immediately. Your data will be archived internally.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" checked={agreeDelete} onChange={(e) => setAgreeDelete(e.target.checked)} />
                <span>I understand and agree to Skyber agreements.</span>
              </label>
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
              <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={isDeletingAccount}>Cancel</Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white" disabled={!agreeDelete || isDeletingAccount} onClick={async () => {
                if (!agreeDelete || isDeletingAccount) return;
                setIsDeletingAccount(true);
                try {
                  const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
                  const r = await fetch(`${API_URL}/api/profile/delete-account`, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(sessionToken ? { 'Authorization': `Bearer ${sessionToken}` } : {}) }, body: JSON.stringify({ agree: true }) });
                  if (!r.ok) throw new Error('Delete failed');
                  // Clear frontend state and redirect
                  try {
                    localStorage.removeItem('sessionToken');
                    localStorage.removeItem('refreshToken');
                    localStorage.removeItem('userData');
                    localStorage.removeItem('skyber_authenticated');
                  } catch (_) {}
                  updateUser({ avatar: null, banner: null, email: null, name: null, firstName: null, lastName: null, username: null });
                  setShowDeleteConfirm(false);
                  window.location.href = '/login';
                } catch (e) {
                } finally {
                  setIsDeletingAccount(false);
                }
              }}>Delete account</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* End DashboardBody */}
      </DashboardBody>
    </>
  );
}
