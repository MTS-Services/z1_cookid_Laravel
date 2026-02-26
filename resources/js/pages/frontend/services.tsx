import FrontendLayout from "@/layouts/frontend-layout";
import ServiceMarketplace from "@/components/section/services/service";

export default function Services(){
    return (
        <FrontendLayout activePage="services">
           <ServiceMarketplace/>
        </FrontendLayout>
    )
}