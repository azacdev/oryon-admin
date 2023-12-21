"use client";

import { Plus } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

import { Button } from "@components/ui/button";
import { Heading } from "@components/ui/heading";
import { ColorColumn, columns } from "./columns";

import { DataTable } from "@components/ui/data-table";
import { ApiList } from "@components/ui/api-list";
import { Separator } from "@components/ui/separator";

interface ColorClientProps {
  data: ColorColumn[];
}

const ColorClient = ({ data }: ColorClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Colors ${data.length}`}
          description="Manage colors for your store"
        />

        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          {" "}
          <Plus className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>
      <Separator />

      <DataTable columns={columns} data={data} searchKey="name" />

      <Heading title="API" description="API calls for colors" />

      <ApiList entityName="colors" entityIdName="colorId" />
    </>
  );
};

export default ColorClient;
