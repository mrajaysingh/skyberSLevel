module.exports = [
"[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
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
    const [bannerUrl, setBannerUrl] = useState(DEFAULT_BANNER_LIGHT);
    const [isCustomBanner, setIsCustomBanner] = useState(false);
    const [avatarUrl, setAvatarUrl] = useState(DEFAULT_AVATAR);
    const [uploadingBanner, setUploadingBanner] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [confirmDeleteBanner, setConfirmDeleteBanner] = useState(false);
    const [confirmDeleteAvatar, setConfirmDeleteAvatar] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [connectedGithub, setConnectedGithub] = useState(false);
    const [connectedGoogle, setConnectedGoogle] = useState(false);
    const [headerIp, setHeaderIp] = useState(null);
    const [headerRefreshing, setHeaderRefreshing] = useState(false);
    const bannerInputRef = useRef(null);
    const avatarInputRef = useRef(null);
    // Disconnect dialogs & captcha state
    const [showDisconnectGithub, setShowDisconnectGithub] = useState(false);
    const [showDisconnectGoogle, setShowDisconnectGoogle] = useState(false);
    const [captchaCode, setCaptchaCode] = useState("");
    const [captchaInput, setCaptchaInput] = useState("");
    const [isDisconnecting, setIsDisconnecting] = useState(false);
    const [profileForm, setProfileForm] = useState({
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
        googleAnalyticsId: "G-DL87JFLJF2"
    });
    const updateField = (key, value)=>{
        setProfileForm((prev)=>({
                ...prev,
                [key]: value
            }));
    };
    const handleSaveProfile = async ()=>{
        try {
            const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
            await fetch(`${API_URL}/api/profile/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...sessionToken ? {
                        'Authorization': `Bearer ${sessionToken}`
                    } : {}
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
            }).then(async (r)=>{
                if (!r.ok) throw new Error('Failed to save');
            });
            const computedName = [
                profileForm.firstName,
                profileForm.middleName,
                profileForm.lastName
            ].map((s)=>(s || "").trim()).filter(Boolean).join(" ");
            updateUser({
                firstName: profileForm.firstName || null,
                middleName: profileForm.middleName || null,
                lastName: profileForm.lastName || null,
                designation: profileForm.designation || null,
                company: profileForm.company || null,
                username: profileForm.username || null,
                email: profileForm.email,
                name: computedName || user?.name || null
            });
            const imageSavedToCloud = (avatarUrl?.startsWith('http') || bannerUrl?.startsWith('http')) && !avatarUrl?.startsWith('data:') && !bannerUrl?.startsWith('data:');
            showSuccess('Profile updated', imageSavedToCloud ? 'Images saved to Cloud. Profile details saved.' : 'Profile details saved.');
        } catch (_) {
            showSuccess('Profile updated', 'Profile details saved.');
        }
    };
    // Process an image file to exact target dimensions (center-cover). Returns data URL.
    const processImageFile = async (file, targetWidth, targetHeight)=>{
        const dataUrl = await new Promise((resolve, reject)=>{
            const fr = new FileReader();
            fr.onerror = ()=>reject(new Error("Failed to read file"));
            fr.onload = ()=>resolve(String(fr.result));
            fr.readAsDataURL(file);
        });
        const img = await new Promise((resolve, reject)=>{
            const i = new Image();
            i.onload = ()=>resolve(i);
            i.onerror = ()=>reject(new Error("Failed to load image"));
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
    useEffect(()=>{
        const load = async ()=>{
            try {
                const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
                if (!sessionToken) return;
                const r = await fetch(`${API_URL}/api/dashboard/super-admin`, {
                    headers: {
                        'Authorization': `Bearer ${sessionToken}`
                    },
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
                    setProfileForm((prev)=>({
                            firstName: u.firstName ?? prev.firstName ?? "",
                            middleName: u.middleName ?? prev.middleName ?? "",
                            lastName: u.lastName ?? prev.lastName ?? "",
                            designation: u.designation ?? prev.designation ?? "",
                            company: u.company ?? prev.company ?? "",
                            username: u.username ?? prev.username ?? (u.email ? String(u.email).split("@")[0] : ""),
                            email: u.email ?? prev.email ?? "",
                            socialFacebook: u.socialFacebook ?? prev.socialFacebook ?? "",
                            socialLinkedIn: u.socialLinkedIn ?? prev.socialLinkedIn ?? "",
                            socialInstagram: u.socialInstagram ?? prev.socialInstagram ?? ""
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
                        name: u.name ?? null
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
    }, [
        API_URL,
        showSuccess,
        updateUser
    ]);
    // Load saved card (masked) if present
    useEffect(()=>{
        const loadCard = async ()=>{
            try {
                const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
                if (!sessionToken) return;
                // Try full details first (dev-only endpoint). If forbidden/unavailable, fall back to summary.
                let resp = await fetch(`${API_URL}/api/cards/me/full`, {
                    headers: {
                        'Authorization': `Bearer ${sessionToken}`
                    },
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
                        headers: {
                            'Authorization': `Bearer ${sessionToken}`
                        },
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
                    setSavedBrand(d.brand || null);
                    if (d.expiryMonth) setExpiryMonth(String(d.expiryMonth).padStart(2, '0'));
                    if (d.expiryYear) setExpiryYear(String(d.expiryYear));
                    if (d.cvv) setCvv(String(d.cvv));
                    setIsSaved(true);
                    setIsEditingCard(false);
                    setSavedCardDetails({
                        cardNumber: 'cardNumber' in d ? String(d.cardNumber) : undefined,
                        expiryMonth: d.expiryMonth ? String(d.expiryMonth).padStart(2, '0') : undefined,
                        expiryYear: d.expiryYear ? String(d.expiryYear) : undefined,
                        cvv: d.cvv ? String(d.cvv) : undefined
                    });
                }
            } catch (_) {}
        };
        loadCard();
    }, [
        API_URL
    ]);
    // Generate a random 7-char alphanumeric captcha
    const generateCaptcha = ()=>{
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
        let out = '';
        for(let i = 0; i < 7; i++)out += chars[Math.floor(Math.random() * chars.length)];
        return out;
    };
    const openDisconnectDialog = (provider)=>{
        const code = generateCaptcha();
        setCaptchaCode(code);
        setCaptchaInput('');
        if (provider === 'github') {
            setShowDisconnectGithub(true);
        } else {
            setShowDisconnectGoogle(true);
        }
    };
    const handleHeaderRefresh = async ()=>{
        if (headerRefreshing) return;
        setHeaderRefreshing(true);
        try {
            const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
            if (!sessionToken) return;
            const r = await fetch(`${API_URL}/api/dashboard/super-admin?ts=${Date.now()}`, {
                headers: {
                    'Authorization': `Bearer ${sessionToken}`
                },
                cache: 'no-store'
            });
            if (r.ok) {
                const j = await r.json();
                const u = j?.data?.dashboard?.user;
                if (u) {
                    setHeaderIp(u.displayIp || u.currentIp || u.currentRequestIp || null);
                }
            }
        } finally{
            setHeaderRefreshing(false);
        }
    };
    const handleBannerChange = async (e)=>{
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
                    ...sessionToken ? {
                        'Authorization': `Bearer ${sessionToken}`
                    } : {}
                },
                body: JSON.stringify({
                    type: 'banner',
                    dataUrl: processed
                })
            }).then(async (r)=>{
                const j = await r.json().catch(()=>({}));
                if (r.ok && j?.url) {
                    setBannerUrl(j.url);
                    updateUser({
                        banner: j.url
                    });
                    showSuccess('Saved on Cloud', 'Banner uploaded to S3');
                } else {
                    throw new Error(j?.message || 'Upload failed');
                }
            }).catch(()=>{});
        } catch (_) {
            // fallback to default if processing fails
            const isDark = document.documentElement.classList.contains("dark");
            const fallback = isDark ? DEFAULT_BANNER_DARK : DEFAULT_BANNER_LIGHT;
            setBannerUrl(fallback);
            updateUser({
                banner: fallback
            });
        } finally{
            e.target.value = ""; // allow re-selecting same file
            setUploadingBanner(false);
        }
    };
    const handleAvatarChange = async (e)=>{
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
                    ...sessionToken ? {
                        'Authorization': `Bearer ${sessionToken}`
                    } : {}
                },
                body: JSON.stringify({
                    type: 'avatar',
                    dataUrl: processed
                })
            }).then(async (r)=>{
                const j = await r.json().catch(()=>({}));
                if (r.ok && j?.url) {
                    setAvatarUrl(j.url);
                    updateUser({
                        avatar: j.url
                    });
                    showSuccess('Saved on Cloud', 'Profile photo uploaded to S3');
                } else {
                    throw new Error(j?.message || 'Upload failed');
                }
            }).catch(()=>{});
        } catch (_) {
            setAvatarUrl(DEFAULT_AVATAR);
            updateUser({
                avatar: DEFAULT_AVATAR
            });
        } finally{
            e.target.value = "";
            setUploadingAvatar(false);
        }
    };
    // Payment state and helpers
    const [cardNumber, setCardNumber] = useState("");
    const [expiryMonth, setExpiryMonth] = useState("");
    const [expiryYear, setExpiryYear] = useState("");
    const [cvv, setCvv] = useState("");
    const [isSaved, setIsSaved] = useState(false);
    const [isEditingCard, setIsEditingCard] = useState(true);
    const [isBack, setIsBack] = useState(false);
    const [savedLast4, setSavedLast4] = useState(null);
    const [savedBrand, setSavedBrand] = useState(null);
    const [savedCardDetails, setSavedCardDetails] = useState(null);
    // Data export & deletion state
    const [showDeletePrompt, setShowDeletePrompt] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showDownloadAgree, setShowDownloadAgree] = useState(false);
    const [agreeDownload, setAgreeDownload] = useState(false);
    const [agreeDelete, setAgreeDelete] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isDeletingAccount, setIsDeletingAccount] = useState(false);
    const months = Array.from({
        length: 12
    }, (_, i)=>String(i + 1).padStart(2, "0"));
    const currentYear = new Date().getFullYear();
    const years = Array.from({
        length: 16
    }, (_, i)=>String(currentYear + i));
    const formatCardNumber = (v)=>v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
    const cvvPlain = cvv || "000";
    // Display helpers for masked/saved details
    const displayNumber = (()=>{
        if (cardNumber) return formatCardNumber(cardNumber);
        if (savedLast4) {
            const trimmed = savedLast4.replace(/\s+/g, "");
            if (trimmed.length === 16) return formatCardNumber(trimmed);
            return savedLast4;
        }
        return "9759 2484 5269 6576";
    })();
    const displayBrand = (savedBrand || "").toUpperCase() || "MASTERCARD";
    const handleSaveCard = async ()=>{
        try {
            const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
            if (!sessionToken) return;
            await fetch(`${API_URL}/api/cards/save`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...sessionToken ? {
                        'Authorization': `Bearer ${sessionToken}`
                    } : {}
                },
                body: JSON.stringify({
                    cardNumber,
                    expiryMonth,
                    expiryYear,
                    cvv
                })
            }).then(async (r)=>{
                if (!r.ok) throw new Error('Failed to save');
            });
            setSavedLast4(cardNumber.slice(-4));
            setIsSaved(true);
            setIsEditingCard(false);
            setSavedCardDetails({
                cardNumber,
                expiryMonth,
                expiryYear,
                cvv
            });
            showSuccess("Card saved", "Your card details were updated.");
        } catch (_) {}
    };
    const handleCancelEditCard = ()=>{
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
    const fullName = [
        profileForm.firstName,
        profileForm.middleName,
        profileForm.lastName
    ].map((s)=>(s || "").trim()).filter(Boolean).join(" ") || user?.name || "Kevin Smith";
    const designationLine = (()=>{
        const d = (profileForm.designation || "").trim();
        const c = (profileForm.company || "").trim();
        if (d && c) return `${d} at ${c}`;
        return d || (c ? c : "Advisor and Consultant at Stripe Inc.");
    })();
    const usernameHandle = (profileForm.username || "").trim() || "kevinsmith55";
    const normalizeHandle = (h)=>h.replace(/^https?:\/\//, "").replace(/^www\./, "");
    const fbHandle = normalizeHandle(profileForm.socialFacebook.trim());
    const igHandle = normalizeHandle(profileForm.socialInstagram.trim());
    // Theme-aware default banner: initialize and react to changes
    useEffect(()=>{
        const applyThemeBanner = ()=>{
            if (isCustomBanner) return;
            const isDark = document.documentElement.classList.contains("dark");
            setBannerUrl(isDark ? DEFAULT_BANNER_DARK : DEFAULT_BANNER_LIGHT);
        };
        // Initial
        applyThemeBanner();
        // Observe changes to data-dashboard-theme or class
        const observer = new MutationObserver(()=>applyThemeBanner());
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: [
                "data-dashboard-theme",
                "class"
            ]
        });
        return ()=>observer.disconnect();
    }, [
        isCustomBanner
    ]);
    // Theme-specific styling handled via Tailwind dark: classes below
    return /*#__PURE__*/ _jsxDEV(_Fragment, {
        children: [
            /*#__PURE__*/ _jsxDEV(DashboardHeader, {
                title: "Super Admin Dashboard",
                subtitle: "- Skyber Engine v 7SKB.R2.02.5",
                ip: headerIp,
                onRefresh: handleHeaderRefresh,
                refreshing: headerRefreshing
            }, void 0, false, {
                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                lineNumber: 542,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV(DashboardBody, {
                children: [
                    /*#__PURE__*/ _jsxDEV("h2", {
                        className: "text-xl font-semibold mb-4",
                        children: "Profile"
                    }, void 0, false, {
                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                        lineNumber: 550,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV("section", {
                        className: "rounded-xl border overflow-hidden bg-background",
                        children: /*#__PURE__*/ _jsxDEV("div", {
                            className: "relative h-48 sm:h-56 lg:h-64 w-full bg-muted",
                            children: [
                                /*#__PURE__*/ _jsxDEV("img", {
                                    src: bannerUrl,
                                    alt: "Profile banner",
                                    className: "h-full w-full object-cover"
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 555,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ _jsxDEV("button", {
                                    onClick: ()=>bannerInputRef.current?.click(),
                                    className: "absolute right-4 bottom-4 inline-flex items-center justify-center h-10 w-10 rounded-full border bg-background/80 backdrop-blur hover:bg-background transition-colors z-20",
                                    "aria-label": "Change banner",
                                    title: "Change banner",
                                    children: uploadingBanner ? /*#__PURE__*/ _jsxDEV("span", {
                                        className: "h-5 w-5 rounded-full border-2 border-white/40 border-t-white animate-spin"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                        lineNumber: 567,
                                        columnNumber: 23
                                    }, this) : /*#__PURE__*/ _jsxDEV(Camera, {
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                        lineNumber: 569,
                                        columnNumber: 23
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 560,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ _jsxDEV("button", {
                                    onClick: ()=>setConfirmDeleteBanner(true),
                                    className: "absolute right-16 bottom-4 inline-flex items-center justify-center h-10 w-10 rounded-full border bg-background/80 backdrop-blur hover:bg-background transition-colors z-20",
                                    "aria-label": "Delete banner",
                                    title: "Delete banner",
                                    children: /*#__PURE__*/ _jsxDEV(Trash2, {
                                        className: "h-5 w-5"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                        lineNumber: 578,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 572,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ _jsxDEV("input", {
                                    ref: bannerInputRef,
                                    type: "file",
                                    accept: "image/*",
                                    className: "hidden",
                                    onChange: handleBannerChange
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 580,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ _jsxDEV("div", {
                                    className: "absolute inset-x-4 bottom-4 flex items-end justify-between z-10",
                                    children: /*#__PURE__*/ _jsxDEV("div", {
                                        className: "flex items-end gap-4",
                                        children: [
                                            /*#__PURE__*/ _jsxDEV("div", {
                                                className: "relative h-20 w-20 sm:h-24 sm:w-24 rounded-full ring-2 ring-white/80 shadow-md overflow-hidden bg-black",
                                                children: [
                                                    /*#__PURE__*/ _jsxDEV("img", {
                                                        src: avatarUrl,
                                                        alt: "User avatar",
                                                        className: "h-full w-full object-cover"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                        lineNumber: 591,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ _jsxDEV("button", {
                                                        onClick: ()=>avatarInputRef.current?.click(),
                                                        className: "absolute right-1.5 bottom-1.5 inline-flex items-center justify-center h-7 w-7 rounded-full border bg-white/80 backdrop-blur hover:bg-white transition-colors text-black",
                                                        "aria-label": "Change photo",
                                                        children: uploadingAvatar ? /*#__PURE__*/ _jsxDEV("span", {
                                                            className: "h-4 w-4 rounded-full border-2 border-black/40 border-t-black animate-spin"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 602,
                                                            columnNumber: 29
                                                        }, this) : /*#__PURE__*/ _jsxDEV(Camera, {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 604,
                                                            columnNumber: 29
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                        lineNumber: 596,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ _jsxDEV("button", {
                                                        onClick: ()=>setConfirmDeleteAvatar(true),
                                                        className: "absolute left-1.5 bottom-1.5 inline-flex items-center justify-center h-7 w-7 rounded-full border bg-white/80 backdrop-blur hover:bg-white transition-colors text-black",
                                                        "aria-label": "Delete photo",
                                                        children: /*#__PURE__*/ _jsxDEV(Trash2, {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 612,
                                                            columnNumber: 27
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                        lineNumber: 607,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ _jsxDEV("input", {
                                                        ref: avatarInputRef,
                                                        type: "file",
                                                        accept: "image/*",
                                                        className: "hidden",
                                                        onChange: handleAvatarChange
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                        lineNumber: 614,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                lineNumber: 590,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ _jsxDEV("div", {
                                                className: "pb-1 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.6)] px-3 py-2 rounded-md bg-black/55 backdrop-blur-sm ring-1 ring-white/10",
                                                children: [
                                                    /*#__PURE__*/ _jsxDEV("h3", {
                                                        className: "text-xl sm:text-2xl font-bold leading-tight",
                                                        children: fullName
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                        lineNumber: 623,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ _jsxDEV("p", {
                                                        className: "text-xs sm:text-sm opacity-90",
                                                        children: designationLine
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                        lineNumber: 626,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ _jsxDEV("div", {
                                                        className: "mt-1 flex flex-wrap items-center gap-2 text-[10px] sm:text-xs opacity-90",
                                                        children: [
                                                            /*#__PURE__*/ _jsxDEV("span", {
                                                                children: [
                                                                    "@ ",
                                                                    usernameHandle
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                lineNumber: 628,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ _jsxDEV("span", {
                                                                children: fbHandle
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                lineNumber: 629,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ _jsxDEV("span", {
                                                                children: igHandle
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                lineNumber: 630,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                        lineNumber: 627,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                lineNumber: 622,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                        lineNumber: 589,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 588,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                            lineNumber: 554,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                        lineNumber: 552,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV(Dialog, {
                        open: confirmDeleteBanner,
                        onOpenChange: setConfirmDeleteBanner,
                        children: /*#__PURE__*/ _jsxDEV(DialogContent, {
                            children: [
                                /*#__PURE__*/ _jsxDEV(DialogHeader, {
                                    children: [
                                        /*#__PURE__*/ _jsxDEV(DialogTitle, {
                                            children: "Delete banner"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 643,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV(DialogDescription, {
                                            children: "Are you sure you want to delete your banner?"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 644,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 642,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ _jsxDEV(DialogFooter, {
                                    className: "flex-col sm:flex-row gap-2 sm:gap-0",
                                    children: [
                                        /*#__PURE__*/ _jsxDEV(Button, {
                                            variant: "outline",
                                            onClick: ()=>setConfirmDeleteBanner(false),
                                            disabled: deleting,
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 647,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV(Button, {
                                            className: "bg-red-600 hover:bg-red-700 text-white",
                                            disabled: deleting,
                                            onClick: async ()=>{
                                                if (deleting) return;
                                                setDeleting(true);
                                                try {
                                                    const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
                                                    await fetch(`${API_URL}/api/profile/delete-image`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            ...sessionToken ? {
                                                                'Authorization': `Bearer ${sessionToken}`
                                                            } : {}
                                                        },
                                                        body: JSON.stringify({
                                                            type: 'banner'
                                                        })
                                                    });
                                                    setIsCustomBanner(false);
                                                    const isDark = document.documentElement.classList.contains('dark');
                                                    const fallback = isDark ? DEFAULT_BANNER_DARK : DEFAULT_BANNER_LIGHT;
                                                    setBannerUrl(fallback);
                                                    updateUser({
                                                        banner: fallback
                                                    });
                                                    setConfirmDeleteBanner(false);
                                                    showSuccess('Deleted', 'Banner removed and restored to default');
                                                } finally{
                                                    setDeleting(false);
                                                }
                                            },
                                            children: "Delete"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 648,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 646,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                            lineNumber: 641,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                        lineNumber: 640,
                        columnNumber: 15
                    }, this),
                    /*#__PURE__*/ _jsxDEV(Dialog, {
                        open: confirmDeleteAvatar,
                        onOpenChange: setConfirmDeleteAvatar,
                        children: /*#__PURE__*/ _jsxDEV(DialogContent, {
                            children: [
                                /*#__PURE__*/ _jsxDEV(DialogHeader, {
                                    children: [
                                        /*#__PURE__*/ _jsxDEV(DialogTitle, {
                                            children: "Delete profile photo"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 677,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV(DialogDescription, {
                                            children: "Are you sure you want to delete your profile photo?"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 678,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 676,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ _jsxDEV(DialogFooter, {
                                    className: "flex-col sm:flex-row gap-2 sm:gap-0",
                                    children: [
                                        /*#__PURE__*/ _jsxDEV(Button, {
                                            variant: "outline",
                                            onClick: ()=>setConfirmDeleteAvatar(false),
                                            disabled: deleting,
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 681,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV(Button, {
                                            className: "bg-red-600 hover:bg-red-700 text-white",
                                            disabled: deleting,
                                            onClick: async ()=>{
                                                if (deleting) return;
                                                setDeleting(true);
                                                try {
                                                    const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
                                                    await fetch(`${API_URL}/api/profile/delete-image`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            ...sessionToken ? {
                                                                'Authorization': `Bearer ${sessionToken}`
                                                            } : {}
                                                        },
                                                        body: JSON.stringify({
                                                            type: 'avatar'
                                                        })
                                                    });
                                                    setAvatarUrl(DEFAULT_AVATAR);
                                                    updateUser({
                                                        avatar: DEFAULT_AVATAR
                                                    });
                                                    setConfirmDeleteAvatar(false);
                                                    showSuccess('Deleted', 'Profile photo removed and restored to default');
                                                } finally{
                                                    setDeleting(false);
                                                }
                                            },
                                            children: "Delete"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 682,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 680,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                            lineNumber: 675,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                        lineNumber: 674,
                        columnNumber: 15
                    }, this),
                    /*#__PURE__*/ _jsxDEV("div", {
                        className: "mt-6",
                        children: /*#__PURE__*/ _jsxDEV(Card, {
                            className: "shadow-sm",
                            children: [
                                /*#__PURE__*/ _jsxDEV(CardHeader, {
                                    children: /*#__PURE__*/ _jsxDEV(CardTitle, {
                                        children: "Profile Details"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                        lineNumber: 708,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 707,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ _jsxDEV(CardContent, {
                                    children: [
                                        /*#__PURE__*/ _jsxDEV("div", {
                                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                            children: [
                                                /*#__PURE__*/ _jsxDEV("div", {
                                                    children: [
                                                        /*#__PURE__*/ _jsxDEV(Label, {
                                                            htmlFor: "firstName",
                                                            children: "First name"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 713,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ _jsxDEV(Input, {
                                                            id: "firstName",
                                                            value: profileForm.firstName,
                                                            onChange: (e)=>updateField("firstName", e.target.value),
                                                            placeholder: "Ajay"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 714,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                    lineNumber: 712,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ _jsxDEV("div", {
                                                    children: [
                                                        /*#__PURE__*/ _jsxDEV(Label, {
                                                            htmlFor: "middleName",
                                                            children: "Middle name"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 722,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ _jsxDEV(Input, {
                                                            id: "middleName",
                                                            value: profileForm.middleName,
                                                            onChange: (e)=>updateField("middleName", e.target.value),
                                                            placeholder: "Singh"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 723,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                    lineNumber: 721,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ _jsxDEV("div", {
                                                    children: [
                                                        /*#__PURE__*/ _jsxDEV(Label, {
                                                            htmlFor: "lastName",
                                                            children: "Last name"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 731,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ _jsxDEV(Input, {
                                                            id: "lastName",
                                                            value: profileForm.lastName,
                                                            onChange: (e)=>updateField("lastName", e.target.value),
                                                            placeholder: "Rajput"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 732,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                    lineNumber: 730,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ _jsxDEV("div", {
                                                    children: [
                                                        /*#__PURE__*/ _jsxDEV(Label, {
                                                            htmlFor: "designation",
                                                            children: "Designation"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 740,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ _jsxDEV(Input, {
                                                            id: "designation",
                                                            value: profileForm.designation,
                                                            onChange: (e)=>updateField("designation", e.target.value),
                                                            placeholder: "Advisor and Consultant"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 741,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                    lineNumber: 739,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ _jsxDEV("div", {
                                                    children: [
                                                        /*#__PURE__*/ _jsxDEV(Label, {
                                                            htmlFor: "company",
                                                            children: "Company"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 749,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ _jsxDEV(Input, {
                                                            id: "company",
                                                            value: profileForm.company,
                                                            onChange: (e)=>updateField("company", e.target.value),
                                                            placeholder: "Stripe Inc."
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 750,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                    lineNumber: 748,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ _jsxDEV("div", {
                                                    children: [
                                                        /*#__PURE__*/ _jsxDEV(Label, {
                                                            htmlFor: "username",
                                                            children: "Username"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 758,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ _jsxDEV(Input, {
                                                            id: "username",
                                                            value: profileForm.username,
                                                            onChange: (e)=>updateField("username", e.target.value),
                                                            placeholder: "ajay_singh"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 759,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                    lineNumber: 757,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ _jsxDEV("div", {
                                                    className: "md:col-span-2",
                                                    children: [
                                                        /*#__PURE__*/ _jsxDEV(Label, {
                                                            htmlFor: "email",
                                                            children: "Email"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 767,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ _jsxDEV(Input, {
                                                            id: "email",
                                                            type: "email",
                                                            value: profileForm.email,
                                                            onChange: (e)=>updateField("email", e.target.value),
                                                            placeholder: "admin@skyber.dev"
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 768,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                    lineNumber: 766,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 711,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV("div", {
                                            className: "mt-6",
                                            children: [
                                                /*#__PURE__*/ _jsxDEV("h3", {
                                                    className: "text-sm font-semibold mb-2",
                                                    children: "Social media"
                                                }, void 0, false, {
                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                    lineNumber: 779,
                                                    columnNumber: 23
                                                }, this),
                                                /*#__PURE__*/ _jsxDEV("div", {
                                                    className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ _jsxDEV("div", {
                                                            children: [
                                                                /*#__PURE__*/ _jsxDEV(Label, {
                                                                    htmlFor: "fb",
                                                                    children: "Facebook handle"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                    lineNumber: 782,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ _jsxDEV(Input, {
                                                                    id: "fb",
                                                                    value: profileForm.socialFacebook,
                                                                    onChange: (e)=>updateField("socialFacebook", e.target.value),
                                                                    placeholder: "facebook.com/ajay"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                    lineNumber: 783,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 781,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ _jsxDEV("div", {
                                                            children: [
                                                                /*#__PURE__*/ _jsxDEV(Label, {
                                                                    htmlFor: "li",
                                                                    children: "LinkedIn"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                    lineNumber: 791,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ _jsxDEV(Input, {
                                                                    id: "li",
                                                                    value: profileForm.socialLinkedIn,
                                                                    onChange: (e)=>updateField("socialLinkedIn", e.target.value),
                                                                    placeholder: "linkedin.com/in/ajay"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                    lineNumber: 792,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 790,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ _jsxDEV("div", {
                                                            children: [
                                                                /*#__PURE__*/ _jsxDEV(Label, {
                                                                    htmlFor: "ig",
                                                                    children: "Instagram"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                    lineNumber: 800,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ _jsxDEV(Input, {
                                                                    id: "ig",
                                                                    value: profileForm.socialInstagram,
                                                                    onChange: (e)=>updateField("socialInstagram", e.target.value),
                                                                    placeholder: "instagram.com/ajay"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                    lineNumber: 801,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 799,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                    lineNumber: 780,
                                                    columnNumber: 23
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 778,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV("div", {
                                            className: "mt-6 flex justify-end",
                                            children: /*#__PURE__*/ _jsxDEV(Button, {
                                                className: "bg-[#17D492] hover:bg-[#17D492]/90 text-white",
                                                onClick: handleSaveProfile,
                                                children: "Save profile details"
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                lineNumber: 812,
                                                columnNumber: 23
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 811,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 710,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                            lineNumber: 706,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                        lineNumber: 705,
                        columnNumber: 15
                    }, this),
                    /*#__PURE__*/ _jsxDEV("div", {
                        className: "mt-6",
                        children: /*#__PURE__*/ _jsxDEV(Card, {
                            className: "shadow-sm",
                            children: [
                                /*#__PURE__*/ _jsxDEV(CardHeader, {
                                    children: /*#__PURE__*/ _jsxDEV(CardTitle, {
                                        children: "Connected accounts"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                        lineNumber: 824,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 823,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ _jsxDEV(CardContent, {
                                    children: /*#__PURE__*/ _jsxDEV("div", {
                                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                        children: [
                                            /*#__PURE__*/ _jsxDEV("div", {
                                                className: "flex items-center justify-between border rounded-lg p-4",
                                                children: [
                                                    /*#__PURE__*/ _jsxDEV("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            /*#__PURE__*/ _jsxDEV("div", {
                                                                className: "relative w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center",
                                                                children: /*#__PURE__*/ _jsxDEV(NextImage, {
                                                                    src: "/AuthImg/GithubAuthIcon.svg",
                                                                    alt: "GitHub",
                                                                    width: 24,
                                                                    height: 24,
                                                                    className: "opacity-90"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                    lineNumber: 832,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                lineNumber: 831,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ _jsxDEV("div", {
                                                                children: [
                                                                    /*#__PURE__*/ _jsxDEV("p", {
                                                                        className: "font-medium",
                                                                        children: "GitHub"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                        lineNumber: 835,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ _jsxDEV("p", {
                                                                        className: "text-xs text-muted-foreground mt-1",
                                                                        children: connectedGithub ? 'Connected' : 'Not connected'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                        lineNumber: 836,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                lineNumber: 834,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                        lineNumber: 830,
                                                        columnNumber: 25
                                                    }, this),
                                                    connectedGithub ? /*#__PURE__*/ _jsxDEV("button", {
                                                        onClick: ()=>openDisconnectDialog('github'),
                                                        className: "inline-flex items-center px-3 py-2 rounded-md border bg-red-600 text-white hover:opacity-90",
                                                        children: "Disconnect"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                        lineNumber: 842,
                                                        columnNumber: 27
                                                    }, this) : /*#__PURE__*/ _jsxDEV("a", {
                                                        href: `${API_URL}/api/auth/oauth/github?connect=true&sessionToken=${encodeURIComponent(typeof window !== 'undefined' ? localStorage.getItem('sessionToken') || '' : '')}`,
                                                        target: "_blank",
                                                        rel: "noopener noreferrer",
                                                        className: `inline-flex items-center px-3 py-2 rounded-md border ${connectedGithub ? 'bg-muted text-foreground' : 'bg-[#0d1117] text-white'} hover:opacity-90`,
                                                        children: "Connect"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                        lineNumber: 849,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                lineNumber: 829,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ _jsxDEV("div", {
                                                className: "flex items-center justify-between border rounded-lg p-4",
                                                children: [
                                                    /*#__PURE__*/ _jsxDEV("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            /*#__PURE__*/ _jsxDEV("div", {
                                                                className: "relative w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center",
                                                                children: /*#__PURE__*/ _jsxDEV(NextImage, {
                                                                    src: "/AuthImg/GoogleAuthIcon.svg",
                                                                    alt: "Google",
                                                                    width: 24,
                                                                    height: 24,
                                                                    className: "opacity-90"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                    lineNumber: 864,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                lineNumber: 863,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ _jsxDEV("div", {
                                                                children: [
                                                                    /*#__PURE__*/ _jsxDEV("p", {
                                                                        className: "font-medium",
                                                                        children: "Google"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                        lineNumber: 867,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    /*#__PURE__*/ _jsxDEV("p", {
                                                                        className: "text-xs text-muted-foreground mt-1",
                                                                        children: connectedGoogle ? 'Connected' : 'Not connected'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                        lineNumber: 868,
                                                                        columnNumber: 29
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                lineNumber: 866,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                        lineNumber: 862,
                                                        columnNumber: 25
                                                    }, this),
                                                    connectedGoogle ? /*#__PURE__*/ _jsxDEV("button", {
                                                        onClick: ()=>openDisconnectDialog('google'),
                                                        className: "inline-flex items-center px-3 py-2 rounded-md border bg-red-600 text-white hover:opacity-90",
                                                        children: "Disconnect"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                        lineNumber: 874,
                                                        columnNumber: 27
                                                    }, this) : /*#__PURE__*/ _jsxDEV("a", {
                                                        href: `${API_URL}/api/auth/oauth/google?connect=true&sessionToken=${encodeURIComponent(typeof window !== 'undefined' ? localStorage.getItem('sessionToken') || '' : '')}`,
                                                        target: "_blank",
                                                        rel: "noopener noreferrer",
                                                        className: `inline-flex items-center px-3 py-2 rounded-md border ${connectedGoogle ? 'bg-muted text-foreground' : 'bg-red-600 text-white'} hover:opacity-90`,
                                                        children: "Connect"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                        lineNumber: 881,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                lineNumber: 861,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ _jsxDEV("div", {
                                                className: "flex items-center justify-between border rounded-lg p-4 md:col-span-2",
                                                children: [
                                                    /*#__PURE__*/ _jsxDEV("div", {
                                                        children: [
                                                            /*#__PURE__*/ _jsxDEV("p", {
                                                                className: "font-medium",
                                                                children: "Facebook"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                lineNumber: 895,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ _jsxDEV("p", {
                                                                className: "text-xs text-muted-foreground mt-1",
                                                                children: "Not available yet"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                lineNumber: 896,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                        lineNumber: 894,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ _jsxDEV("button", {
                                                        className: "inline-flex items-center px-3 py-2 rounded-md border bg-muted text-muted-foreground cursor-not-allowed",
                                                        disabled: true,
                                                        children: "Coming soon"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                        lineNumber: 898,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                lineNumber: 893,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                        lineNumber: 827,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 826,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                            lineNumber: 822,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                        lineNumber: 821,
                        columnNumber: 15
                    }, this),
                    /*#__PURE__*/ _jsxDEV(Dialog, {
                        open: showDisconnectGithub,
                        onOpenChange: (open)=>{
                            if (isDisconnecting) return;
                            setShowDisconnectGithub(open);
                            if (open) {
                                const code = generateCaptcha();
                                setCaptchaCode(code);
                                setCaptchaInput('');
                            }
                        },
                        children: /*#__PURE__*/ _jsxDEV(DialogContent, {
                            children: [
                                /*#__PURE__*/ _jsxDEV(DialogHeader, {
                                    children: [
                                        /*#__PURE__*/ _jsxDEV(DialogTitle, {
                                            children: "Disconnect GitHub"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 919,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV(DialogDescription, {
                                            children: "This will remove all GitHub references and clear your social links from the database. Type the code to confirm."
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 920,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 918,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ _jsxDEV("div", {
                                    className: "grid gap-3 py-2",
                                    children: [
                                        /*#__PURE__*/ _jsxDEV("div", {
                                            className: "text-sm",
                                            children: "Confirmation code:"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 925,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV("div", {
                                            className: "font-mono text-lg tracking-widest select-none px-3 py-2 rounded border bg-muted inline-block",
                                            children: captchaCode
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 926,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV(Input, {
                                            placeholder: "Type the code here",
                                            value: captchaInput,
                                            onChange: (e)=>setCaptchaInput(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 927,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 924,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ _jsxDEV(DialogFooter, {
                                    className: "flex-col sm:flex-row gap-2 sm:gap-0",
                                    children: [
                                        /*#__PURE__*/ _jsxDEV(Button, {
                                            variant: "outline",
                                            onClick: ()=>setShowDisconnectGithub(false),
                                            disabled: isDisconnecting,
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 930,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV(Button, {
                                            className: "bg-red-600 hover:bg-red-700 text-white",
                                            disabled: isDisconnecting || captchaCode.length === 0 || captchaInput.trim() !== captchaCode,
                                            onClick: async ()=>{
                                                if (isDisconnecting) return;
                                                setIsDisconnecting(true);
                                                try {
                                                    const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
                                                    await fetch(`${API_URL}/api/profile/disconnect-social`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            ...sessionToken ? {
                                                                'Authorization': `Bearer ${sessionToken}`
                                                            } : {}
                                                        },
                                                        body: JSON.stringify({
                                                            provider: 'github'
                                                        })
                                                    });
                                                    setConnectedGithub(false);
                                                    // Also clear local social fields preview
                                                    setProfileForm((p)=>({
                                                            ...p,
                                                            socialFacebook: '',
                                                            socialLinkedIn: '',
                                                            socialInstagram: ''
                                                        }));
                                                    setShowDisconnectGithub(false);
                                                    showSuccess('Disconnected', 'GitHub disconnected and social links cleared');
                                                } finally{
                                                    setIsDisconnecting(false);
                                                }
                                            },
                                            children: "Disconnect"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 931,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 929,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                            lineNumber: 917,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                        lineNumber: 908,
                        columnNumber: 15
                    }, this),
                    /*#__PURE__*/ _jsxDEV(Dialog, {
                        open: showDisconnectGoogle,
                        onOpenChange: (open)=>{
                            if (isDisconnecting) return;
                            setShowDisconnectGoogle(open);
                            if (open) {
                                const code = generateCaptcha();
                                setCaptchaCode(code);
                                setCaptchaInput('');
                            }
                        },
                        children: /*#__PURE__*/ _jsxDEV(DialogContent, {
                            children: [
                                /*#__PURE__*/ _jsxDEV(DialogHeader, {
                                    children: [
                                        /*#__PURE__*/ _jsxDEV(DialogTitle, {
                                            children: "Disconnect Google"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 966,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV(DialogDescription, {
                                            children: "This will remove all Google references and clear your social links from the database. Type the code to confirm."
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 967,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 965,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ _jsxDEV("div", {
                                    className: "grid gap-3 py-2",
                                    children: [
                                        /*#__PURE__*/ _jsxDEV("div", {
                                            className: "text-sm",
                                            children: "Confirmation code:"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 972,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV("div", {
                                            className: "font-mono text-lg tracking-widest select-none px-3 py-2 rounded border bg-muted inline-block",
                                            children: captchaCode
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 973,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV(Input, {
                                            placeholder: "Type the code here",
                                            value: captchaInput,
                                            onChange: (e)=>setCaptchaInput(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 974,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 971,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ _jsxDEV(DialogFooter, {
                                    className: "flex-col sm:flex-row gap-2 sm:gap-0",
                                    children: [
                                        /*#__PURE__*/ _jsxDEV(Button, {
                                            variant: "outline",
                                            onClick: ()=>setShowDisconnectGoogle(false),
                                            disabled: isDisconnecting,
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 977,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV(Button, {
                                            className: "bg-red-600 hover:bg-red-700 text-white",
                                            disabled: isDisconnecting || captchaCode.length === 0 || captchaInput.trim() !== captchaCode,
                                            onClick: async ()=>{
                                                if (isDisconnecting) return;
                                                setIsDisconnecting(true);
                                                try {
                                                    const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
                                                    await fetch(`${API_URL}/api/profile/disconnect-social`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            ...sessionToken ? {
                                                                'Authorization': `Bearer ${sessionToken}`
                                                            } : {}
                                                        },
                                                        body: JSON.stringify({
                                                            provider: 'google'
                                                        })
                                                    });
                                                    setConnectedGoogle(false);
                                                    setProfileForm((p)=>({
                                                            ...p,
                                                            socialFacebook: '',
                                                            socialLinkedIn: '',
                                                            socialInstagram: ''
                                                        }));
                                                    setShowDisconnectGoogle(false);
                                                    showSuccess('Disconnected', 'Google disconnected and social links cleared');
                                                } finally{
                                                    setIsDisconnecting(false);
                                                }
                                            },
                                            children: "Disconnect"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 978,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 976,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                            lineNumber: 964,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                        lineNumber: 955,
                        columnNumber: 15
                    }, this),
                    /*#__PURE__*/ _jsxDEV("div", {
                        className: "mt-6",
                        children: /*#__PURE__*/ _jsxDEV(Card, {
                            className: "shadow-sm",
                            children: [
                                /*#__PURE__*/ _jsxDEV(CardHeader, {
                                    children: /*#__PURE__*/ _jsxDEV(CardTitle, {
                                        children: "Payment"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                        lineNumber: 1004,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 1003,
                                    columnNumber: 19
                                }, this),
                                /*#__PURE__*/ _jsxDEV(CardContent, {
                                    children: /*#__PURE__*/ _jsxDEV("div", {
                                        className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                                        children: [
                                            /*#__PURE__*/ _jsxDEV("div", {
                                                className: "flex items-center justify-center",
                                                children: /*#__PURE__*/ _jsxDEV("div", {
                                                    className: `relative [transform-style:preserve-3d] transition-transform duration-700 ${isBack ? "[transform:rotateY(180deg)]" : ""}`,
                                                    style: {
                                                        width: 320,
                                                        height: 200,
                                                        perspective: 1000
                                                    },
                                                    onMouseEnter: ()=>{
                                                        if (cvv.length > 0) setIsBack(true);
                                                    },
                                                    onMouseLeave: ()=>{
                                                        if (cvv.length > 0) setIsBack(false);
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ _jsxDEV("div", {
                                                            className: "absolute inset-0 rounded-xl bg-[#0f0f0f] text-white overflow-hidden [backface-visibility:hidden] border-[1.5px] border-[#ff9800] dark:border-white shadow-[0_12px_28px_rgba(0,0,0,0.35)] dark:shadow-[0_12px_28px_rgba(255,255,255,0.20)]",
                                                            children: [
                                                                /*#__PURE__*/ _jsxDEV("div", {
                                                                    className: "absolute inset-0 bg-[radial-gradient(120%_120%_at_100%_0%,rgba(255,152,0,0.15),transparent_60%),radial-gradient(120%_120%_at_0%_100%,rgba(255,61,0,0.15),transparent_60%)]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                    lineNumber: 1020,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ _jsxDEV("div", {
                                                                    className: "relative w-full h-full p-5",
                                                                    children: [
                                                                        /*#__PURE__*/ _jsxDEV("p", {
                                                                            className: "absolute text-[10px] tracking-[0.2em] top-4 right-4",
                                                                            children: displayBrand
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                            lineNumber: 1022,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ _jsxDEV("svg", {
                                                                            className: "absolute bottom-6 right-6",
                                                                            xmlns: "http://www.w3.org/2000/svg",
                                                                            width: "36",
                                                                            height: "36",
                                                                            viewBox: "0 0 48 48",
                                                                            children: [
                                                                                /*#__PURE__*/ _jsxDEV("path", {
                                                                                    fill: "#ff9800",
                                                                                    d: "M32 10A14 14 0 1 0 32 38A14 14 0 1 0 32 10Z"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                                    lineNumber: 1023,
                                                                                    columnNumber: 152
                                                                                }, this),
                                                                                /*#__PURE__*/ _jsxDEV("path", {
                                                                                    fill: "#d50000",
                                                                                    d: "M16 10A14 14 0 1 0 16 38A14 14 0 1 0 16 10Z"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                                    lineNumber: 1023,
                                                                                    columnNumber: 222
                                                                                }, this),
                                                                                /*#__PURE__*/ _jsxDEV("path", {
                                                                                    fill: "#ff3d00",
                                                                                    d: "M18,24c0,4.755,2.376,8.95,6,11.48c3.624-2.53,6-6.725,6-11.48s-2.376-8.95-6-11.48 C20.376,15.05,18,19.245,18,24z"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                                    lineNumber: 1023,
                                                                                    columnNumber: 292
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                            lineNumber: 1023,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ _jsxDEV("svg", {
                                                                            className: "absolute top-5 left-5",
                                                                            width: "30",
                                                                            height: "30",
                                                                            viewBox: "0 0 50 50",
                                                                            xmlns: "http://www.w3.org/2000/svg",
                                                                            children: [
                                                                                /*#__PURE__*/ _jsxDEV("rect", {
                                                                                    x: "8",
                                                                                    y: "12",
                                                                                    width: "34",
                                                                                    height: "26",
                                                                                    rx: "4",
                                                                                    fill: "#c8ad7f"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                                    lineNumber: 1024,
                                                                                    columnNumber: 148
                                                                                }, this),
                                                                                /*#__PURE__*/ _jsxDEV("rect", {
                                                                                    x: "13",
                                                                                    y: "16",
                                                                                    width: "24",
                                                                                    height: "4",
                                                                                    fill: "#b89c70"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                                    lineNumber: 1024,
                                                                                    columnNumber: 213
                                                                                }, this),
                                                                                /*#__PURE__*/ _jsxDEV("rect", {
                                                                                    x: "13",
                                                                                    y: "22",
                                                                                    width: "10",
                                                                                    height: "2",
                                                                                    fill: "#b89c70"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                                    lineNumber: 1024,
                                                                                    columnNumber: 271
                                                                                }, this),
                                                                                /*#__PURE__*/ _jsxDEV("rect", {
                                                                                    x: "13",
                                                                                    y: "26",
                                                                                    width: "24",
                                                                                    height: "8",
                                                                                    fill: "#b89c70"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                                    lineNumber: 1024,
                                                                                    columnNumber: 329
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                            lineNumber: 1024,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ _jsxDEV("svg", {
                                                                            className: "absolute top-10 right-14",
                                                                            width: "20",
                                                                            height: "20",
                                                                            viewBox: "0 0 50 50",
                                                                            xmlns: "http://www.w3.org/2000/svg",
                                                                            children: /*#__PURE__*/ _jsxDEV("path", {
                                                                                d: "M12 25c4-6 10-6 14 0m-8-6c3-4 7-4 10 0m-12 12c5-8 13-8 18 0",
                                                                                stroke: "#fff",
                                                                                strokeWidth: "2",
                                                                                fill: "none"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                                lineNumber: 1025,
                                                                                columnNumber: 151
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                            lineNumber: 1025,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ _jsxDEV("p", {
                                                                            className: "absolute font-semibold text-lg left-5 bottom-16 tracking-wider font-mono",
                                                                            children: displayNumber
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                            lineNumber: 1026,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ _jsxDEV("div", {
                                                                            className: "absolute left-5 bottom-10 flex items-center gap-3 text-[10px]",
                                                                            children: [
                                                                                /*#__PURE__*/ _jsxDEV("span", {
                                                                                    className: "opacity-80",
                                                                                    children: "VALID THRU"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                                    lineNumber: 1028,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ _jsxDEV("span", {
                                                                                    className: "font-semibold text-sm",
                                                                                    children: [
                                                                                        expiryMonth || "12",
                                                                                        " / ",
                                                                                        expiryYear ? expiryYear.slice(-2) : "24"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                                    lineNumber: 1029,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                            lineNumber: 1027,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        /*#__PURE__*/ _jsxDEV("p", {
                                                                            className: "absolute left-5 bottom-4 font-semibold text-sm",
                                                                            children: profileForm.firstName || profileForm.lastName ? `${profileForm.firstName} ${profileForm.lastName}`.toUpperCase() : "BRUCE WAYNE"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                            lineNumber: 1031,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                    lineNumber: 1021,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 1017,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ _jsxDEV("div", {
                                                            className: "absolute inset-0 rounded-xl bg-[#0f0f0f] text-white overflow-hidden [backface-visibility:hidden] [transform:rotateY(180deg)] border-[1.5px] border-[#ff9800] dark:border-white shadow-[0_12px_28px_rgba(0,0,0,0.35)] dark:shadow-[0_12px_28px_rgba(255,255,255,0.20)]",
                                                            children: /*#__PURE__*/ _jsxDEV("div", {
                                                                className: "relative w-full h-full",
                                                                children: [
                                                                    /*#__PURE__*/ _jsxDEV("div", {
                                                                        className: "absolute top-6 left-0 right-0 h-8 bg-gradient-to-r from-[#303030] to-[#202020]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                        lineNumber: 1039,
                                                                        columnNumber: 31
                                                                    }, this),
                                                                    /*#__PURE__*/ _jsxDEV("div", {
                                                                        className: "absolute top-24 left-5",
                                                                        children: /*#__PURE__*/ _jsxDEV("div", {
                                                                            className: "bg-white rounded px-2 py-1 w-40",
                                                                            children: /*#__PURE__*/ _jsxDEV("span", {
                                                                                className: "text-black font-bold tracking-widest",
                                                                                children: cvvPlain
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                                lineNumber: 1041,
                                                                                columnNumber: 82
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                            lineNumber: 1041,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                        lineNumber: 1040,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                lineNumber: 1038,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 1035,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                    lineNumber: 1010,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                lineNumber: 1009,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ _jsxDEV("div", {
                                                children: /*#__PURE__*/ _jsxDEV("div", {
                                                    className: "grid grid-cols-1 gap-4",
                                                    children: [
                                                        /*#__PURE__*/ _jsxDEV("div", {
                                                            children: [
                                                                /*#__PURE__*/ _jsxDEV(Label, {
                                                                    htmlFor: "cardNum",
                                                                    children: "Card number"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                    lineNumber: 1052,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ _jsxDEV(Input, {
                                                                    id: "cardNum",
                                                                    inputMode: "numeric",
                                                                    maxLength: 19,
                                                                    value: formatCardNumber(cardNumber),
                                                                    onChange: (e)=>setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16)),
                                                                    placeholder: "1234 5678 9012 3456",
                                                                    className: !isEditingCard ? "mt-1 bg-muted text-muted-foreground cursor-default" : "mt-1",
                                                                    disabled: !isEditingCard
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                    lineNumber: 1053,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 1051,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ _jsxDEV("div", {
                                                            className: "grid grid-cols-2 gap-4",
                                                            children: [
                                                                /*#__PURE__*/ _jsxDEV("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ _jsxDEV(Label, {
                                                                            children: "Expiry month"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                            lineNumber: 1066,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        isEditingCard ? /*#__PURE__*/ _jsxDEV(Select, {
                                                                            value: expiryMonth,
                                                                            onValueChange: setExpiryMonth,
                                                                            children: [
                                                                                /*#__PURE__*/ _jsxDEV(SelectTrigger, {
                                                                                    className: "mt-2",
                                                                                    children: /*#__PURE__*/ _jsxDEV(SelectValue, {
                                                                                        placeholder: "MM"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                                        lineNumber: 1069,
                                                                                        columnNumber: 67
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                                    lineNumber: 1069,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                /*#__PURE__*/ _jsxDEV(SelectContent, {
                                                                                    children: months.map((m)=>/*#__PURE__*/ _jsxDEV(SelectItem, {
                                                                                            value: m,
                                                                                            children: m
                                                                                        }, m, false, {
                                                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                                            lineNumber: 1071,
                                                                                            columnNumber: 57
                                                                                        }, this))
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                                    lineNumber: 1070,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                            lineNumber: 1068,
                                                                            columnNumber: 33
                                                                        }, this) : /*#__PURE__*/ _jsxDEV("div", {
                                                                            className: "mt-2 rounded-md border border-muted bg-muted px-3 py-2 text-sm text-muted-foreground",
                                                                            children: expiryMonth || "--"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                            lineNumber: 1075,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                    lineNumber: 1065,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ _jsxDEV("div", {
                                                                    children: [
                                                                        /*#__PURE__*/ _jsxDEV(Label, {
                                                                            children: "Expiry year"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                            lineNumber: 1081,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        isEditingCard ? /*#__PURE__*/ _jsxDEV(Select, {
                                                                            value: expiryYear,
                                                                            onValueChange: setExpiryYear,
                                                                            children: [
                                                                                /*#__PURE__*/ _jsxDEV(SelectTrigger, {
                                                                                    className: "mt-2",
                                                                                    children: /*#__PURE__*/ _jsxDEV(SelectValue, {
                                                                                        placeholder: "YYYY"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                                        lineNumber: 1084,
                                                                                        columnNumber: 67
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                                    lineNumber: 1084,
                                                                                    columnNumber: 35
                                                                                }, this),
                                                                                /*#__PURE__*/ _jsxDEV(SelectContent, {
                                                                                    children: years.map((y)=>/*#__PURE__*/ _jsxDEV(SelectItem, {
                                                                                            value: y,
                                                                                            children: y
                                                                                        }, y, false, {
                                                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                                            lineNumber: 1086,
                                                                                            columnNumber: 56
                                                                                        }, this))
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                                    lineNumber: 1085,
                                                                                    columnNumber: 35
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                            lineNumber: 1083,
                                                                            columnNumber: 33
                                                                        }, this) : /*#__PURE__*/ _jsxDEV("div", {
                                                                            className: "mt-2 rounded-md border border-muted bg-muted px-3 py-2 text-sm text-muted-foreground",
                                                                            children: expiryYear || "----"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                            lineNumber: 1090,
                                                                            columnNumber: 33
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                    lineNumber: 1080,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 1064,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ _jsxDEV("div", {
                                                            children: [
                                                                /*#__PURE__*/ _jsxDEV(Label, {
                                                                    htmlFor: "cvv",
                                                                    children: "CVV"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                    lineNumber: 1097,
                                                                    columnNumber: 29
                                                                }, this),
                                                                /*#__PURE__*/ _jsxDEV(Input, {
                                                                    id: "cvv",
                                                                    type: "password",
                                                                    inputMode: "numeric",
                                                                    maxLength: 4,
                                                                    value: cvv,
                                                                    onChange: (e)=>setCvv(e.target.value.replace(/\D/g, "").slice(0, 4)),
                                                                    onFocus: ()=>setIsBack(true),
                                                                    onBlur: ()=>setIsBack(false),
                                                                    placeholder: "***",
                                                                    className: !isEditingCard ? "mt-1 bg-muted text-muted-foreground cursor-default" : "mt-1",
                                                                    disabled: !isEditingCard
                                                                }, void 0, false, {
                                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                    lineNumber: 1098,
                                                                    columnNumber: 29
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 1096,
                                                            columnNumber: 27
                                                        }, this),
                                                        savedLast4 && /*#__PURE__*/ _jsxDEV("p", {
                                                            className: "text-sm text-muted-foreground",
                                                            children: [
                                                                "Saved card: ",
                                                                cardNumber ? formatCardNumber(cardNumber) : displayNumber
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 1113,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ _jsxDEV("div", {
                                                            className: "flex gap-2 justify-end pt-2",
                                                            children: isEditingCard ? /*#__PURE__*/ _jsxDEV(_Fragment, {
                                                                children: [
                                                                    /*#__PURE__*/ _jsxDEV(Button, {
                                                                        className: "bg-[#17D492] hover:bg-[#17D492]/90 text-white",
                                                                        onClick: handleSaveCard,
                                                                        children: "Save card"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                        lineNumber: 1118,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ _jsxDEV(Button, {
                                                                        variant: "outline",
                                                                        onClick: handleCancelEditCard,
                                                                        children: "Cancel"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                        lineNumber: 1119,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, void 0, true) : /*#__PURE__*/ _jsxDEV(Button, {
                                                                variant: "outline",
                                                                onClick: ()=>setIsEditingCard(true),
                                                                children: "Edit card"
                                                            }, void 0, false, {
                                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                                lineNumber: 1122,
                                                                columnNumber: 31
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                            lineNumber: 1115,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                    lineNumber: 1050,
                                                    columnNumber: 25
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                lineNumber: 1049,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                        lineNumber: 1007,
                                        columnNumber: 21
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 1006,
                                    columnNumber: 19
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                            lineNumber: 1002,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                        lineNumber: 1001,
                        columnNumber: 15
                    }, this),
                    /*#__PURE__*/ _jsxDEV("div", {
                        className: "mt-8",
                        children: /*#__PURE__*/ _jsxDEV(Card, {
                            className: "shadow-sm border-red-300",
                            children: [
                                /*#__PURE__*/ _jsxDEV(CardHeader, {
                                    children: /*#__PURE__*/ _jsxDEV(CardTitle, {
                                        className: "text-red-600",
                                        children: "Danger zone"
                                    }, void 0, false, {
                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                        lineNumber: 1136,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 1135,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ _jsxDEV(CardContent, {
                                    children: /*#__PURE__*/ _jsxDEV("div", {
                                        className: "flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between",
                                        children: [
                                            /*#__PURE__*/ _jsxDEV("div", {
                                                className: "text-sm text-muted-foreground",
                                                children: "Download a copy of your data or delete your account."
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                lineNumber: 1140,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ _jsxDEV("div", {
                                                className: "flex gap-2",
                                                children: [
                                                    /*#__PURE__*/ _jsxDEV(Button, {
                                                        variant: "outline",
                                                        onClick: ()=>{
                                                            setAgreeDownload(false);
                                                            setShowDownloadAgree(true);
                                                        },
                                                        children: "Download my data"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                        lineNumber: 1144,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ _jsxDEV(Button, {
                                                        className: "bg-yellow-500 hover:bg-yellow-600 text-black",
                                                        onClick: ()=>setShowDeletePrompt(true),
                                                        children: "Delete account"
                                                    }, void 0, false, {
                                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                        lineNumber: 1145,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                lineNumber: 1143,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                        lineNumber: 1139,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 1138,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                            lineNumber: 1134,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                        lineNumber: 1133,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV(Dialog, {
                        open: showDownloadAgree,
                        onOpenChange: (o)=>{
                            if (!isExporting) setShowDownloadAgree(o);
                        },
                        children: /*#__PURE__*/ _jsxDEV(DialogContent, {
                            children: [
                                /*#__PURE__*/ _jsxDEV(DialogHeader, {
                                    children: [
                                        /*#__PURE__*/ _jsxDEV(DialogTitle, {
                                            children: "Download your data"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 1156,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV(DialogDescription, {
                                            children: "To proceed, you must agree to Skyber agreements about handling exported data."
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 1157,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 1155,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ _jsxDEV("div", {
                                    className: "space-y-3 text-sm",
                                    children: /*#__PURE__*/ _jsxDEV("label", {
                                        className: "inline-flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ _jsxDEV("input", {
                                                type: "checkbox",
                                                checked: agreeDownload,
                                                onChange: (e)=>setAgreeDownload(e.target.checked)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                lineNumber: 1163,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ _jsxDEV("span", {
                                                children: "I agree to Skyber agreements and understand the data will be downloaded as JSON."
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                lineNumber: 1164,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                        lineNumber: 1162,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 1161,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ _jsxDEV(DialogFooter, {
                                    className: "flex-col sm:flex-row gap-2 sm:gap-0",
                                    children: [
                                        /*#__PURE__*/ _jsxDEV(Button, {
                                            variant: "outline",
                                            onClick: ()=>setShowDownloadAgree(false),
                                            disabled: isExporting,
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 1168,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV(Button, {
                                            onClick: async ()=>{
                                                if (!agreeDownload || isExporting) return;
                                                setIsExporting(true);
                                                try {
                                                    const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
                                                    const r = await fetch(`${API_URL}/api/profile/export`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            ...sessionToken ? {
                                                                'Authorization': `Bearer ${sessionToken}`
                                                            } : {}
                                                        }
                                                    });
                                                    if (!r.ok) throw new Error('Export failed');
                                                    const j = await r.json();
                                                    const data = j?.data || {};
                                                    const blob = new Blob([
                                                        JSON.stringify(data, null, 2)
                                                    ], {
                                                        type: 'application/json'
                                                    });
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
                                                } catch (e) {} finally{
                                                    setIsExporting(false);
                                                }
                                            },
                                            disabled: !agreeDownload || isExporting,
                                            children: isExporting ? 'Preparing…' : 'Download JSON'
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 1169,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 1167,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                            lineNumber: 1154,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                        lineNumber: 1153,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV(Dialog, {
                        open: showDeletePrompt,
                        onOpenChange: (o)=>{
                            if (!isDeletingAccount) setShowDeletePrompt(o);
                        },
                        children: /*#__PURE__*/ _jsxDEV(DialogContent, {
                            className: "border-yellow-400",
                            children: [
                                /*#__PURE__*/ _jsxDEV(DialogHeader, {
                                    children: [
                                        /*#__PURE__*/ _jsxDEV(DialogTitle, {
                                            className: "text-yellow-600",
                                            children: "Delete account?"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 1205,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV(DialogDescription, {
                                            children: "We recommend downloading your data before deletion. You can skip backup and proceed."
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 1206,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 1204,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ _jsxDEV(DialogFooter, {
                                    className: "flex-col sm:flex-row gap-2 sm:gap-0",
                                    children: [
                                        /*#__PURE__*/ _jsxDEV(Button, {
                                            variant: "outline",
                                            onClick: ()=>{
                                                setShowDeletePrompt(false);
                                                setAgreeDownload(false);
                                                setShowDownloadAgree(true);
                                            },
                                            children: "Download data"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 1211,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV(Button, {
                                            className: "bg-yellow-500 hover:bg-yellow-600 text-black",
                                            onClick: ()=>{
                                                setShowDeletePrompt(false);
                                                setAgreeDelete(false);
                                                setShowDeleteConfirm(true);
                                            },
                                            children: "Proceed without backup"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 1212,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 1210,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                            lineNumber: 1203,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                        lineNumber: 1202,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ _jsxDEV(Dialog, {
                        open: showDeleteConfirm,
                        onOpenChange: (o)=>{
                            if (!isDeletingAccount) setShowDeleteConfirm(o);
                        },
                        children: /*#__PURE__*/ _jsxDEV(DialogContent, {
                            children: [
                                /*#__PURE__*/ _jsxDEV(DialogHeader, {
                                    children: [
                                        /*#__PURE__*/ _jsxDEV(DialogTitle, {
                                            children: "Confirm account deletion"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 1221,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV(DialogDescription, {
                                            children: "This will remove your account from the app immediately. Your data will be archived internally."
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 1222,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 1220,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ _jsxDEV("div", {
                                    className: "space-y-3 text-sm",
                                    children: /*#__PURE__*/ _jsxDEV("label", {
                                        className: "inline-flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ _jsxDEV("input", {
                                                type: "checkbox",
                                                checked: agreeDelete,
                                                onChange: (e)=>setAgreeDelete(e.target.checked)
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                lineNumber: 1228,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ _jsxDEV("span", {
                                                children: "I understand and agree to Skyber agreements."
                                            }, void 0, false, {
                                                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                                lineNumber: 1229,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                        lineNumber: 1227,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 1226,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ _jsxDEV(DialogFooter, {
                                    className: "flex-col sm:flex-row gap-2 sm:gap-0",
                                    children: [
                                        /*#__PURE__*/ _jsxDEV(Button, {
                                            variant: "outline",
                                            onClick: ()=>setShowDeleteConfirm(false),
                                            disabled: isDeletingAccount,
                                            children: "Cancel"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 1233,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ _jsxDEV(Button, {
                                            className: "bg-red-600 hover:bg-red-700 text-white",
                                            disabled: !agreeDelete || isDeletingAccount,
                                            onClick: async ()=>{
                                                if (!agreeDelete || isDeletingAccount) return;
                                                setIsDeletingAccount(true);
                                                try {
                                                    const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('sessionToken') : null;
                                                    const r = await fetch(`${API_URL}/api/profile/delete-account`, {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'application/json',
                                                            ...sessionToken ? {
                                                                'Authorization': `Bearer ${sessionToken}`
                                                            } : {}
                                                        },
                                                        body: JSON.stringify({
                                                            agree: true
                                                        })
                                                    });
                                                    if (!r.ok) throw new Error('Delete failed');
                                                    // Clear frontend state and redirect
                                                    try {
                                                        localStorage.removeItem('sessionToken');
                                                        localStorage.removeItem('refreshToken');
                                                        localStorage.removeItem('userData');
                                                        localStorage.removeItem('skyber_authenticated');
                                                    } catch (_) {}
                                                    updateUser({
                                                        avatar: null,
                                                        banner: null,
                                                        email: "",
                                                        name: null,
                                                        firstName: null,
                                                        lastName: null,
                                                        username: null
                                                    });
                                                    setShowDeleteConfirm(false);
                                                    window.location.href = '/login';
                                                } catch (e) {} finally{
                                                    setIsDeletingAccount(false);
                                                }
                                            },
                                            children: "Delete account"
                                        }, void 0, false, {
                                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                            lineNumber: 1234,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                                    lineNumber: 1232,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                            lineNumber: 1219,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                        lineNumber: 1218,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/Desktop/backup/skyber-full/frontend/app/auth/dashboards/user/super-admin/profile/page.tsx",
                lineNumber: 549,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
];

//# sourceMappingURL=49bab_frontend_app_auth_dashboards_user_super-admin_profile_page_tsx_b4d9a1ab._.js.map