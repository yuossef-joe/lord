import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import FormField from "@/components/common/FormField";
import { createOrder } from "@/lib/api";

interface ManualOrderForm {
  customerName: string;
  nationalId: string;
  email: string;
  phone: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  governorate: string;
  city: string;
  addressLine1: string;
  shippingMethodId?: string;
  notes?: string;
}

const inputStyles =
  "w-full h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20";

export default function OrderCreatePage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm<ManualOrderForm>({
    defaultValues: { quantity: 1, unitPrice: 0 },
  });

  const onSubmit = handleSubmit(async (data) => {
    const quantity = Number(data.quantity);
    const unitPrice = Number(data.unitPrice);
    const subtotal = quantity * unitPrice;
    const payload = {
      guestName: data.customerName,
      guestEmail: data.email,
      guestPhone: data.phone,
      guestNationalId: data.nationalId,
      customerSnapshot: {
        name: data.customerName,
        email: data.email,
        phone: data.phone,
        nationalId: data.nationalId,
      },
      shippingAddress: {
        recipientName: data.customerName,
        phone: data.phone,
        governorate: data.governorate,
        city: data.city,
        addressLine1: data.addressLine1,
      },
      shippingMethodId: data.shippingMethodId || undefined,
      subtotal,
      shippingFee: 0,
      discountAmount: 0,
      total: subtotal,
      notes: data.notes,
      items: {
        create: [
          {
            productName: data.productName,
            quantity,
            unitPrice,
            lineTotal: subtotal,
          },
        ],
      },
    };

    const result = (await createOrder(payload)) as { data?: { id?: string } };
    navigate(result.data?.id ? `/orders/${result.data.id}` : "/orders");
  });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Orders", href: "/orders" },
          { label: "Create" },
        ]}
      />

      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-bold text-navy">Create Order</h1>
      </div>

      <Card>
        <form onSubmit={onSubmit} className="space-y-6">
          <section>
            <h2 className="mb-4 text-lg font-semibold text-navy">
              Customer Information
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Customer Name">
                <input {...register("customerName", { required: true })} className={inputStyles} />
              </FormField>
              <FormField label="National ID">
                <input
                  {...register("nationalId", { required: true, minLength: 14, maxLength: 14 })}
                  className={inputStyles}
                  maxLength={14}
                />
              </FormField>
              <FormField label="Email">
                <input {...register("email", { required: true })} className={inputStyles} type="email" />
              </FormField>
              <FormField label="Phone">
                <input {...register("phone", { required: true })} className={inputStyles} />
              </FormField>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-navy">Items</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <FormField label="Product">
                <input {...register("productName", { required: true })} className={inputStyles} />
              </FormField>
              <FormField label="Quantity">
                <input {...register("quantity", { valueAsNumber: true, min: 1 })} className={inputStyles} type="number" />
              </FormField>
              <FormField label="Unit Price">
                <input {...register("unitPrice", { valueAsNumber: true, min: 0 })} className={inputStyles} type="number" />
              </FormField>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold text-navy">Shipping</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Governorate">
                <input {...register("governorate", { required: true })} className={inputStyles} />
              </FormField>
              <FormField label="City">
                <input {...register("city", { required: true })} className={inputStyles} />
              </FormField>
              <FormField label="Address" className="md:col-span-2">
                <input {...register("addressLine1", { required: true })} className={inputStyles} />
              </FormField>
              <FormField label="Shipping Method ID">
                <input {...register("shippingMethodId")} className={inputStyles} />
              </FormField>
            </div>
          </section>

          <FormField label="Internal Notes">
            <textarea {...register("notes")} className={`${inputStyles} h-24 py-2`} />
          </FormField>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate("/orders")}>
              Cancel
            </Button>
            <Button type="submit" isLoading={formState.isSubmitting}>
              Create Order
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
