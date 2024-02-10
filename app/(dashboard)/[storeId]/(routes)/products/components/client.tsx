"use client";

import { useRouter, useParams } from "next/navigation";

import { Button } from "@components/ui/button";
import { Heading } from "@components/ui/heading";
import { ProductColumn, columns } from "./columns";

import { DataTable } from "@components/ui/data-table";
import { ApiList } from "@components/ui/api-list";
import { Separator } from "@components/ui/separator";

interface ProductClientProps {
  data: ProductColumn[];
}

const ProductClient = ({ data }: ProductClientProps) => {
  const router = useRouter();
  const params = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Products ${data.length}`}
          description="Manage products for your store"
        />

        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          Add New
        </Button>
      </div>
      <Separator />

      <DataTable columns={columns} data={data} searchKey="name" />

      <Heading title="API" description="API calls for products" />

      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
};

export default ProductClient;
