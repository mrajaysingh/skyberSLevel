"use client";

import { useState } from "react";
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

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
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
            isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-100",
            level > 0 && "pl-8",
            isHome 
              ? "text-white bg-[#17D492]/10 hover:bg-[#17D492]/20" 
              : isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-700 hover:text-gray-900"
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
      className={cn(
        "flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors rounded-lg",
        isDark ? "hover:bg-gray-800/50" : "hover:bg-gray-100",
        level > 0 && "pl-8",
        isHome || isActive
          ? "text-white bg-[#17D492]/10 hover:bg-[#17D492]/20"
          : isDark ? "text-gray-400 hover:text-gray-300" : "text-gray-700 hover:text-gray-900"
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
      {/* Sidebar Header - Sticky at top */}
      <div className={cn(
        "px-6 py-4 border-b flex-shrink-0",
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
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
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
        "px-6 py-4 border-t flex-shrink-0",
        isDark ? "border-gray-800 bg-black" : "border-gray-200 bg-white"
      )}>
        <div className={cn(
          "text-xs",
          isDark ? "text-gray-500" : "text-gray-400"
        )}>
          <p>Version 1.0.0</p>
          <p className="mt-1">© {new Date().getFullYear()} SKYBER</p>
        </div>
      </div>
    </aside>
  );
}

