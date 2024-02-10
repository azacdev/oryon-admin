"use client";

import { Plus } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

import { Button } from "@components/ui/button";
import { Heading } from "@components/ui/heading";
import { BIllboardColumn, columns } from "./columns";

import { DataTable } from "@components/ui/data-table";
import { ApiList } from "@components/ui/api-list";
import { Separator } from "@components/ui/separator";

interface BillboardClientProps {
  data: BIllboardColumn[];
}

const BillboardClient = ({ data }: BillboardClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Billboards ${data.length}`}
          description="Manage billboards for your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          Add New
        </Button>
      </div>
      <Separator />

      <DataTable columns={columns} data={data} searchKey="label" />

      <Heading title="API" description="API calls for billboards" />

      <ApiList entityName="billboards" entityIdName="BillboardId" />
    </>
  );
};

export default BillboardClient;
