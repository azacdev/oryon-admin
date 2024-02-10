"use client";

import { Plus } from "lucide-react";
import { useRouter, useParams } from "next/navigation";

import { Button } from "@components/ui/button";
import { Heading } from "@components/ui/heading";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@components/ui/data-table";
import { ApiList } from "@components/ui/api-list";
import { Separator } from "@components/ui/separator";

interface CategoryClientProps {
  data: CategoryColumn[];
}

const CategoryClient = ({ data }: CategoryClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Categories ${data.length}`}
          description="Manage categories for your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/categories/new`)}
        >
          Add New
        </Button>
      </div>
      <Separator />

      <DataTable columns={columns} data={data} searchKey="name" />

      <Heading title="API" description="API calls for categories" />

      <ApiList entityName="categories" entityIdName="categoryId" />
    </>
  );
};

export default CategoryClient;
