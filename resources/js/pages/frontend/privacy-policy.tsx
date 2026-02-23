import FrontendLayout from '@/layouts/frontend-layout'

export default function PrivacyPolicyPage() {
    return (
        <FrontendLayout activePage="privacy-policy">
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
                <div className="prose max-w-none">
                    <p>This is the privacy policy for Cookid. We are committed to protecting your privacy.</p>
                    <h2>Information We Collect</h2>
                    <p>We collect information you provide directly to us, such as when you create an account or contact us.</p>
                    <h2>How We Use Your Information</h2>
                    <p>We use the information to provide, maintain, and improve our services.</p>
                    <h2>Information Sharing</h2>
                    <p>We do not sell, trade, or otherwise transfer your personal information to third parties.</p>
                    <h2>Contact Us</h2>
                    <p>If you have any questions about this Privacy Policy, please contact us.</p>
                </div>
            </div>
        </FrontendLayout>
    )
}
