import { Button } from "./ui/button";
import { User, LayoutDashboard, Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function FloatingNav() {
    const router = useRouter();

    const navItems = [
        { id: 'profile', icon: User, label: 'Profile', route: '/dashboard/profile' },
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', route: '/dashboard' },
        { id: 'settings', icon: Settings, label: 'Settings', route: '/dashboard/settings' },
    ];
	return (
		<div className="fixed right-6 top-1/2 -translate-y-1/2 z-50">
			<div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-2 shadow-lg">
				<div className="flex flex-col gap-2">
					{navItems.map((item) => {
						const Icon = item.icon;

						return (
							<Button
								key={item.id}
								variant="ghost"
								size="lg"
								onClick={() => router.push(item.route)}
								className="w-14 h-14 rounded-xl transition-all duration-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
								title={item.label}
							>
								<Icon className="h-6 w-6" />
							</Button>
						);
					})}
				</div>
			</div>
		</div>
	);
}
