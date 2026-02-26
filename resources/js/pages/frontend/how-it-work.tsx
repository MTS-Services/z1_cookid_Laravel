
import HowItWorks from '@/components/section/home/how-it-works'
import FrontendLayout from '@/layouts/frontend-layout'


export default function HowItWork() {
    return (
        <FrontendLayout activePage="how-it-work">
            <div className="bg-bg-black text-text-white font-poppins p-8 pt-0 pb-70">
                <HowItWorks />
            </div>
        </FrontendLayout>
    )
}
