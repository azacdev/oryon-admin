"use client";

import { Plus } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

import { Button } from "@components/ui/button";
import { Heading } from "@components/ui/heading";
import { SizeColumn, columns } from "./columns";

import { DataTable } from "@components/ui/data-table";
import { ApiList } from "@components/ui/api-list";
import { Separator } from "@components/ui/separator";

interface SizeClientProps {
  data: SizeColumn[];
}

const SizeClient = ({ data }: SizeClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Sizes ${data.length}`}
          description="Manage sizes for your store"
        />

        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          Add New
        </Button>
      </div>
      <Separator />

      <DataTable columns={columns} data={data} searchKey="name" />

      <Heading title="API" description="API calls for sizes" />

      <ApiList entityName="sizes" entityIdName="sizeId" />
    </>
  );
};

export default SizeClient;
