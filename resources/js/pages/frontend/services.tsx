import FrontendLayout from "@/layouts/frontend-layout";
import ServiceMarketplace from "@/components/section/services/service";
import { Paginated, Service, ServiceFilters, ServiceOptions } from "@/types/model";

interface ServicesPageProps {
    services: Paginated<Service>;
    filters: ServiceFilters;
    options: ServiceOptions;
}

export default function Services({ services, filters, options }: ServicesPageProps) {
    return (
        <FrontendLayout activePage="services">
            <ServiceMarketplace services={services} filters={filters} options={options} />
        </FrontendLayout>
    )
}