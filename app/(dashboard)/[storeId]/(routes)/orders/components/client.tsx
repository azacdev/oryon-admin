"use client";

import axios from "axios";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";

import { OrderColumn, columns } from "./columns";
import { Heading } from "@components/ui/heading";
import { DataTable } from "@components/ui/data-table";
import { Separator } from "@components/ui/separator";
import { AlertModal } from "@components/modals/alert-modal";
import { Button } from "@components/ui/button";

interface OrderClientProps {
  data: OrderColumn[];
}

const OrderClient = ({ data }: OrderClientProps) => {
  const params = useParams();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    try {
      await axios.delete(`/api/${params.storeId}/orders`);
      router.refresh();
      toast.success("All Orders deleted.");
    } catch (error) {
      toast.error("Make sure you removed all products and categories first");
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  console.log(data.map((item) => typeof(item.quantity)));

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading
          title={`Orders ${data.length}`}
          description="Manage orders for your store"
        />
        <Button
          disabled={loading}
          variant={"destructive"}
          size="icon"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  );
};

export default OrderClient;
