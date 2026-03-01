// components/OrderDetailsCard.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface OrderDetailsProps {
  orderId?: string;
  customerName?: string;
  serviceProvider?: string;
  serviceDate?: string;
  completionTime?: string;
  serviceAmount?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  transactionId?: string;
  orderStatus?: "Completed" | "Cancelled" | "Pending" | string;
}

export default function ReviewCard({
  orderId = "ORD-105114075922",
  customerName = "Guy Hawkins",
  serviceProvider = "Elite Auto Spa",
  serviceDate = "October 6, 2025",
  completionTime = "2:45 PM",
  serviceAmount = "$120",
  paymentStatus = "Paid",
  paymentMethod = "Credit Card",
  transactionId = "TXN-78459321",
  orderStatus = "Cancelled",
}: OrderDetailsProps) {
  const statusColor = orderStatus === "Cancelled" 
    ? "bg-red-950 text-red-400 border-red-800/50" 
    : orderStatus === "Completed" 
    ? "bg-green-950 text-green-400 border-green-800/50" 
    : "bg-amber-950 text-amber-400 border-amber-800/50";

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-b from-gray-950 to-black border-gray-800 text-gray-100 shadow-2xl overflow-hidden">
      <CardHeader className="bg-gray-900/80 border-b border-gray-800 pb-4">
        <CardTitle className="text-xl font-semibold text-white">Order Details</CardTitle>
        <p className="text-sm text-gray-400 mt-1">
          Order ID: <span className="font-mono text-blue-400">#{orderId}</span>
        </p>
      </CardHeader>

      <CardContent className="p-0 pt-6">
        {/* Order Summary */}
        <div className="px-6 pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-200 border-b border-gray-800 pb-2">
            Order Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Customer:</span>
                <span className="font-medium">{customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Service Provider:</span>
                <span className="font-medium text-blue-400">{serviceProvider}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Service Date:</span>
                <span>{serviceDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Completion Time:</span>
                <span>{completionTime}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Service Amount:</span>
                <span className="font-bold text-green-400">{serviceAmount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Status:</span>
                <Badge variant="outline" className="bg-green-950 text-green-400 border-green-700/50">
                  {paymentStatus}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Payment Method:</span>
                <span>{paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Transaction ID:</span>
                <span className="font-mono text-gray-300">{transactionId}</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-800" />

        {/* Service Details */}
        <div className="px-6 py-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-200 border-b border-gray-800 pb-2">
            Service Details
          </h3>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-medium text-blue-400 mb-1">
                Full Interior & Exterior Detailing
              </p>
              <p className="text-gray-300">
                Complete exterior hand wash, interior deep cleaning, tire shine, and surface polishing.
              </p>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Duration:</span>
              <span>2.5 Hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Location:</span>
              <span>Customer Address (On-site Service)</span>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-800" />

        {/* Payment Information */}
        <div className="px-6 py-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-200 border-b border-gray-800 pb-2">
            Payment Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-400 block mb-1">Payment Method</span>
              <span className="font-medium">{paymentMethod}</span>
            </div>
            <div>
              <span className="text-gray-400 block mb-1">Payment Date</span>
              <span>{serviceDate}</span>
            </div>
            <div>
              <span className="text-gray-400 block mb-1">Amount Paid</span>
              <span className="font-bold text-green-400">{serviceAmount}</span>
            </div>
          </div>
        </div>

        <Separator className="bg-gray-800" />

        {/* Order Status */}
        <div className="px-6 py-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-200 border-b border-gray-800 pb-2">
            Order Status
          </h3>
          <div className={cn(
            "inline-flex items-center px-4 py-2 rounded-lg border text-base font-medium",
            statusColor
          )}>
            Order Status: {orderStatus}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}