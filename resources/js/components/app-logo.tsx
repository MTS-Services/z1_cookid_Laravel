import { cn } from '@/lib/utils';

interface AppLogoProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    className?: string;
}

export default function AppLogo({ className, ...props }: AppLogoProps) {
    return (
        <>
        <img src="/assets/logo.png" alt="Glossed"  className="w-20 h-20"/>
        </>
    );
}