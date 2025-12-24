import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { activeSubscribers } from "@/lib/dummy-data";

export function RecentSales() {
  return (
    <div className="space-y-8">
      {activeSubscribers.map((item) => (
        <div key={item.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {item.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.email}</p>
          </div>
          <div className="ml-auto font-medium">{item.amount}</div>
        </div>
      ))}
    </div>
  );
}
