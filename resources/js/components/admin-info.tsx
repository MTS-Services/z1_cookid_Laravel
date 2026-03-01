import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Admin } from '@/types';

export function AdminInfo({
    admin,
    showEmail = false,
    showRole = false,
}: {
    admin: Admin;
    showEmail?: boolean;
    showRole?: boolean;
}) {
    return (
        <>
            <Avatar className="h-12 w-12 overflow-hidden rounded-full">
                <AvatarImage src={admin.image_url || admin.image || '/user.png'} alt={admin.first_name + ' ' + admin.last_name} />
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-base font-semibold text-text-secondary font-montserrat">{admin.first_name + ' ' + admin.last_name}</span>
                {showEmail && (
                    <span className="truncate text-base text-text-primary">
                        {admin?.email}
                    </span>
                )}
                {showRole && (
                    <span className="text-base text-text-primary font-normal">
                        {'Admin'}
                    </span>
                )}
            </div>
        </>
    );
}
