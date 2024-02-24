import { CreditCard, DollarSign, Package } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Heading } from "@components/ui/heading";
import { formatter } from "@lib/utils";
import { Separator } from "@components/ui/separator";
import { getTotalRevenue } from "@actions/get-total-revenue";
import { getSalesCount } from "@actions/get-sales-count";
import { getStockCount } from "@actions/get-stock-count";
import { Overview } from "@components/overview";
import { getGraphRevenue } from "@actions/get-graph-revenue";

interface DashboardProps {
  params: { storeId: string };
}

const DashboardPage = async ({ params }: DashboardProps) => {
  const totalRevenue = await getTotalRevenue(params.storeId);
  const salesCount = await getSalesCount(params.storeId);
  const stockCount = await getStockCount(params.storeId);
  const graphRevenue = await getGraphRevenue(params.storeId);

  return (
    <div className="space-y-4 p-4 lg:p-8 pt-6">
      <Heading title="Dashboard" description="Overview of your store" />
      <Separator />
      <div className="flex flex-wrap gap-4">
        <Card className="w-full sm:flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <span>₦</span>
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">
              {formatter.format(totalRevenue)}
            </div>
          </CardContent>
        </Card>

        <Card className="w-full sm:flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sales</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">+{salesCount}</div>
          </CardContent>
        </Card>

        <Card className="w-full sm:flex-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Product In Stock
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <div className="text-2xl font-bold">{stockCount}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="pl-2">
          <Overview data={graphRevenue} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;
