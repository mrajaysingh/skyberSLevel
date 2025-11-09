"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDashboardTheme } from "./dashboard-theme-provider";
import { 
  Home, 
  Users, 
  Settings, 
  Shield, 
  Database, 
  Server, 
  FileText, 
  BarChart3, 
  Bell, 
  Mail,
  Lock,
  Globe,
  Code,
  Palette,
  Zap,
  ChevronDown,
  ChevronRight,
  LayoutDashboard
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useSecurity } from "@/components/security/page-security";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: MenuItem[];
  target?: string;
  rel?: string;
}

const menuItems: MenuItem[] = [
  {
    id: 'visit-site',
    label: 'Visit Site',
    icon: <Globe className="h-4 w-4" />,
    href: '/',
    target: '_blank',
    rel: 'noopener noreferrer'
  },
  {
    id: 'home',
    label: 'Home',
    icon: <Home className="h-4 w-4" />,
    href: '/auth/dashboards/user/super-admin'
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="h-4 w-4" />,
    children: [
      {
        id: 'overview',
        label: 'Overview',
        icon: <BarChart3 className="h-4 w-4" />,
        href: '/auth/dashboards/user/super-admin'
      },
      {
        id: 'analytics',
        label: 'Analytics',
        icon: <BarChart3 className="h-4 w-4" />,
        href: '/auth/dashboards/user/super-admin/analytics'
      }
    ]
  },
  {
    id: 'users',
    label: 'User Management',
    icon: <Users className="h-4 w-4" />,
    children: [
      {
        id: 'all-users',
        label: 'All Users',
        icon: <Users className="h-4 w-4" />,
        href: '/auth/dashboards/user/super-admin/users'
      },
      {
        id: 'roles',
        label: 'Roles & Permissions',
        icon: <Shield className="h-4 w-4" />,
        href: '/auth/dashboards/user/super-admin/users/roles'
      },
      {
        id: 'activity',
        label: 'User Activity',
        icon: <BarChart3 className="h-4 w-4" />,
        href: '/auth/dashboards/user/super-admin/users/activity'
      }
    ]
  },
  {
    id: 'system',
    label: 'System',
    icon: <Server className="h-4 w-4" />,
    children: [
      {
        id: 'database',
        label: 'Database',
        icon: <Database className="h-4 w-4" />,
        href: '/auth/dashboards/user/super-admin/system/database'
      },
      {
        id: 'redis',
        label: 'Redis Cache',
        icon: <Zap className="h-4 w-4" />,
        href: '/auth/dashboards/user/super-admin/system/redis'
      },
      {
        id: 'servers',
        label: 'Servers',
        icon: <Server className="h-4 w-4" />,
        href: '/auth/dashboards/user/super-admin/system/servers'
          },
          {
            id: 'logs',
            label: 'Logs',
            icon: <FileText className="h-4 w-4" />,
            href: '/auth/dashboards/user/super-admin/system/logs'
          }
    ]
  },
  {
    id: 'security',
    label: 'Security',
    icon: <Lock className="h-4 w-4" />,
    children: [
      {
        id: 'sessions',
        label: 'Sessions',
        icon: <Shield className="h-4 w-4" />,
        href: '/auth/dashboards/user/super-admin/security/sessions'
      },
      {
        id: 'audit-log',
        label: 'Audit Log',
        icon: <FileText className="h-4 w-4" />,
        href: '/auth/dashboards/user/super-admin/security/audit'
      },
      {
        id: 'firewall',
        label: 'Firewall Rules',
        icon: <Lock className="h-4 w-4" />,
        href: '/auth/dashboards/user/super-admin/security/firewall'
      }
    ]
  },
  {
    id: 'content',
    label: 'Content',
    icon: <FileText className="h-4 w-4" />,
    children: [
      {
        id: 'pages',
        label: 'Pages',
        icon: <FileText className="h-4 w-4" />,
        href: '/auth/dashboards/user/super-admin/content/pages'
      },
      {
        id: 'posts',
        label: 'Posts',
        icon: <FileText className="h-4 w-4" />,
        href: '/auth/dashboards/user/super-admin/content/posts'
      },
      {
        id: 'media',
        label: 'Media Library',
        icon: <FileText className="h-4 w-4" />,
        href: '/auth/dashboards/user/super-admin/content/media'
      }
    ]
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: <Bell className="h-4 w-4" />,
    href: '/auth/dashboards/user/super-admin/notifications'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: <Settings className="h-4 w-4" />,
    children: [
      {
        id: 'general',
        label: 'General',
        icon: <Settings className="h-4 w-4" />,
        href: '/auth/dashboards/user/super-admin/settings/general'
      },
      {
        id: 'appearance',
        label: 'Appearance',
        icon: <Palette className="h-4 w-4" />,
        href: '/auth/dashboards/user/super-admin/settings/appearance'
      },
      {
        id: 'integrations',
        label: 'Integrations',
        icon: <Code className="h-4 w-4" />,
        href: '/auth/dashboards/user/super-admin/settings/integrations'
      },
      {
        id: 'email',
        label: 'Email',
        icon: <Mail className="h-4 w-4" />,
        href: '/auth/dashboards/user/super-admin/settings/email'
      }
    ]
  }
];

interface SidebarItemProps {
  item: MenuItem;
  isActive: boolean;
  isExpanded: boolean;
  onToggle: () => void;
  level?: number;
}

const SidebarItem = ({ item, isActive, isExpanded, onToggle, level = 0 }: SidebarItemProps) => {
  const pathname = usePathname();
  const { theme } = useDashboardTheme();
  const hasChildren = item.children && item.children.length > 0;
  const isHome = item.id === 'home';
  const isVisit = item.id === 'visit-site';
  const isDark = theme === 'dark';
  
  // Check if any child is active
  const hasActiveChild = hasChildren && item.children?.some(
    child => child.href && pathname === child.href
  );

  if (hasChildren) {
    return (
      <div>
        <button
          onClick={onToggle}
          className={cn(
            "w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors rounded-lg",
            level > 0 && "pl-8",
            (isHome)
              ? (isDark 
                  ? "text-[#17D492] bg-[#17D492]/15 hover:bg-[#17D492]/25"
                  : "text-emerald-800 bg-emerald-50 hover:bg-emerald-100")
              : (isDark 
                  ? "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  : "text-gray-700 hover:text-gray-900 hover:bg-gray-100")
          )}
        >
          <div className="flex items-center gap-3">
            {item.icon}
            <span>{item.label}</span>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
        {isExpanded && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) => (
              <SidebarItem
                key={child.id}
                item={child}
                isActive={pathname === child.href}
                isExpanded={false}
                onToggle={() => {}}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      href={item.href || '#'}
      target={item.target}
      rel={item.rel}
      className={cn(
        isVisit
          ? "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-lg border"
          : "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg",
        level > 0 && "pl-8",
        isVisit
          ? (isDark
              ? "bg-gray-900/40 text-gray-200 border-transparent hover:bg-black hover:text-white hover:border-white hover:rounded-[20px]"
              : "bg-gray-100 text-gray-800 border-transparent hover:bg-black hover:text-white hover:border-white hover:rounded-[20px]")
          : (isHome || isActive)
          ? (isDark 
              ? "text-[#17D492] bg-[#17D492]/15 hover:bg-[#17D492]/25"
              : "text-emerald-800 bg-emerald-50 hover:bg-emerald-100")
          : (isDark 
              ? "text-gray-300 hover:text-white hover:bg-gray-800/50"
              : "text-gray-700 hover:text-gray-900 hover:bg-gray-100")
      )}
    >
      {item.icon}
      <span>{item.label}</span>
    </Link>
  );
};

export function SuperAdminSidebar() {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const pathname = usePathname();
  const { theme } = useDashboardTheme();
  const isDark = theme === 'dark';
  const { user } = useSecurity();
  const avatarSrc = user?.avatar || "/Default/profileImg/defaultProfile.png";
  const sidebarName = (() => {
    const segments = [user?.firstName, user?.middleName, user?.lastName]
      .map((s) => (s || "").trim())
      .filter(Boolean);
    if (segments.length) return segments.join(" ");
    return user?.name || "SKYBER User";
  })();
  const sidebarRole = (() => {
    const base = user?.role;
    if (!base) return 'Super Admin';
    return base
      .split(/[-\s]+/)
      .map((part) => part ? part.charAt(0).toUpperCase() + part.slice(1) : part)
      .join(' ');
  })();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const profileBtnRef = useRef<HTMLButtonElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const [profileMenuPos, setProfileMenuPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const hoverState = useRef<{ overBtn: boolean; overMenu: boolean; closeTimer: number | null }>({ overBtn: false, overMenu: false, closeTimer: null });

  // Ensure component is mounted before allowing hover menu
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const scheduleCloseIfNotHovering = () => {
    const state = hoverState.current;
    if (state.closeTimer) {
      window.clearTimeout(state.closeTimer);
      state.closeTimer = null;
    }
    state.closeTimer = window.setTimeout(() => {
      const s = hoverState.current;
      if (!s.overBtn && !s.overMenu) {
        setIsProfileOpen(false);
      }
    }, 150); // small delay to allow moving between button and menu
  };

  const updateProfileMenuPosition = () => {
    if (!profileBtnRef.current || typeof window === 'undefined') return;
    
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      if (!profileBtnRef.current) return;
      
      const rect = profileBtnRef.current.getBoundingClientRect();
      const intendedLeft = rect.right + 5; // 5px gap from sidebar
      let top = rect.top - 8;

      const menuEl = profileMenuRef.current;
      const menuHeight = menuEl?.offsetHeight ?? 0;
      const menuWidth = menuEl?.offsetWidth ?? 260;

      const minTop = 12;
      const maxTop = window.innerHeight - menuHeight - 12;
      top = Math.max(minTop, Math.min(top, maxTop));

      const viewportRight = window.innerWidth;
      const left = Math.min(intendedLeft, viewportRight - menuWidth - 5);

      setProfileMenuPos({ top, left });
    });
  };

  useEffect(() => {
    if (!isProfileOpen) return;
    
    // Ensure button ref is ready before positioning
    if (!profileBtnRef.current) {
      // Retry after a short delay if ref isn't ready
      const timer = setTimeout(() => {
        if (profileBtnRef.current) {
          updateProfileMenuPosition();
        }
      }, 50);
      return () => clearTimeout(timer);
    }
    
    // position after mount and next frame to capture size
    updateProfileMenuPosition();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updateProfileMenuPosition();
      });
    });

    const handleClick = (e: MouseEvent) => {
      if (!profileMenuRef.current || !profileBtnRef.current) return;
      if (
        !profileMenuRef.current.contains(e.target as Node) &&
        !profileBtnRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    const handleResize = () => updateProfileMenuPosition();
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize, true);
    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize, true);
    };
  }, [isProfileOpen]);

  // Close menu on route change
  useEffect(() => {
    setIsProfileOpen(false);
  }, [pathname]);

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen w-64 border-r z-30 transition-colors flex flex-col",
      isDark ? "bg-black border-gray-800" : "bg-white border-gray-200"
    )}>
      {/* Sidebar Header - Sticky at top (match main header height) */}
      <div className={cn(
        "px-6 h-16 border-b flex-shrink-0 flex items-center",
        isDark ? "border-gray-800 bg-black" : "border-gray-200 bg-white"
      )}>
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-[#17D492]" />
          <span className={cn(
            "font-bold text-lg",
            isDark ? "text-white" : "text-gray-900"
          )}>SKYBER</span>
        </div>
        <p className={cn(
          "text-xs mt-1",
          isDark ? "text-gray-400" : "text-gray-600"
        )}>Super Admin</p>
      </div>

      {/* Navigation Menu - Scrollable */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto sidebar-scroll">
        {menuItems.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            isActive={pathname === item.href || (item.children?.some(c => pathname === c.href) ?? false)}
            isExpanded={expandedItems.has(item.id)}
            onToggle={() => toggleItem(item.id)}
          />
        ))}
      </nav>

      {/* Sidebar Footer - Sticky at bottom */}
      <div className={cn(
        "px-6 py-4 border-t flex-shrink-0 relative",
        isDark ? "border-gray-800 bg-black" : "border-gray-200 bg-white"
      )}>
        <button
          ref={profileBtnRef}
          onClick={() => {
            setIsProfileOpen((o) => !o);
            if (!isProfileOpen) {
              // Small delay to ensure DOM is ready
              setTimeout(() => updateProfileMenuPosition(), 0);
            }
          }}
          onMouseEnter={() => {
            if (!isMounted || !profileBtnRef.current) return;
            hoverState.current.overBtn = true;
            setIsProfileOpen(true);
            // Use multiple requestAnimationFrame calls to ensure positioning happens after render
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                updateProfileMenuPosition();
              });
            });
          }}
          onMouseLeave={() => {
            hoverState.current.overBtn = false;
            scheduleCloseIfNotHovering();
          }}
          className={cn(
            "w-full flex items-center gap-3 px-2 py-2 mb-3 rounded-lg border transition-colors",
            isDark ? "border-gray-800 hover:bg-gray-900" : "border-gray-200 hover:bg-gray-100"
          )}
        >
          <img
            src={avatarSrc}
            alt="User profile"
            className="h-8 w-8 rounded-full object-cover border border-gray-200"
          />
          <div className="flex flex-col items-start">
            <span className={cn(
              "text-sm font-medium",
              isDark ? "text-white" : "text-gray-900"
            )}>{sidebarName}</span>
            <span className={cn(
              "text-xs",
              isDark ? "text-gray-500" : "text-gray-500"
            )}>{sidebarRole}</span>
          </div>
			<span className={cn("ml-auto", isDark ? "text-gray-500" : "text-gray-400")}> 
				{isProfileOpen ? (
					<ChevronDown className="h-4 w-4" />
				) : (
					<ChevronRight className="h-4 w-4" />
				)}
			</span>
        </button>
        {isProfileOpen && typeof window !== 'undefined' && createPortal(
          <div
            ref={profileMenuRef}
            style={{ top: profileMenuPos.top, left: profileMenuPos.left }}
            className={cn(
              "fixed z-50 min-w-56 rounded-xl border shadow-xl p-3",
              isDark ? "bg-black/95 border-gray-800" : "bg-white border-gray-200"
            )}
            onMouseEnter={() => { hoverState.current.overMenu = true; }}
            onMouseLeave={() => { hoverState.current.overMenu = false; scheduleCloseIfNotHovering(); }}
          >
            <div
              className={cn(
                "flex items-center gap-3 px-1 pb-3 border-b",
                isDark ? "border-gray-800" : "border-gray-200"
              )}
            >
              <img
                src={avatarSrc}
                alt="User profile"
                className="h-9 w-9 rounded-full object-cover border border-gray-200"
              />
              <div className="flex flex-col">
                <span className={cn(
                  "text-sm font-medium",
                  isDark ? "text-white" : "text-gray-900"
                )}>{sidebarName}</span>
                <span className={cn(
                  "text-xs",
                  isDark ? "text-gray-500" : "text-gray-500"
                )}>{sidebarRole}</span>
              </div>
            </div>
            <div className="pt-3 space-y-1">
              <Link
                href="/auth/dashboards/user/super-admin/profile"
                className={cn(
                  "block text-sm px-3 py-2 rounded-md",
                  isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => setIsProfileOpen(false)}
              >
                Edit Profile
              </Link>
              <Link
                href="/auth/dashboards/user/super-admin/edit-site"
                className={cn(
                  "block text-sm px-3 py-2 rounded-md",
                  isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-700 hover:bg-gray-100"
                )}
                onClick={() => setIsProfileOpen(false)}
              >
                Edit site
              </Link>
            </div>
          </div>,
          document.body
        )}
        <div className={cn(
          "text-xs",
          isDark ? "text-gray-500" : "text-gray-400"
        )}>
          <p>Version 1.0.0</p>
			<p className="mt-1">© 2025 SKYBER</p>
        </div>
      </div>
    </aside>
  );
}

