"use client";

import { Heading } from "@components/ui/heading";
import { OrderColumn, columns } from "./columns";
import { DataTable } from "@components/ui/data-table";
import { Separator } from "@components/ui/separator";

interface OrderClientProps {
  data: OrderColumn[];
}

const OrderClient = ({ data }: OrderClientProps) => {
  return (
    <>
      <Heading
        title={`Orders ${data.length}`}
        description="Manage orders for your store"
      />
      <Separator />
      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  );
};

export default OrderClient;
