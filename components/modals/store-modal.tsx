"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Modal } from "@components/ui/modal";
import { useStoreModal } from "@hooks/use-store-modal";
import { Form } from "@components/ui/form";

const formSchema = z.object({
  username: z.string().min(2),
});

export const StoreModal = () => {
  const storeModal = useStoreModal();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Todo: Create Schema
  };

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4 itemse">
          <Form {...form}>

          </Form>
        </div>
      </div>
    </Modal>
  );
};
