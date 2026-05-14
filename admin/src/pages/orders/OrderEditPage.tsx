import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import FormField from "@/components/common/FormField";
import { fetchOrder, updateOrder } from "@/lib/api";

interface ManualOrderForm {
  customerName: string;
  nationalId: string;
  email: string;
  phone: string;
  governorate: string;
  city: string;
  addressLine1: string;
  shippingMethodId?: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  notes?: string;
}

const inputStyles =
  "w-full h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20";

export default function OrderEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState } = useForm<ManualOrderForm>();

  useEffect(() => {
    if (!id) return;
    void fetchOrder(id).then((response) => {
      const order = response.data;
      reset({
        customerName: order.customer?.name ?? "",
        nationalId: order.customer?.nationalId ?? "",
        email: order.customer?.email ?? "",
        phone: order.customer?.phone ?? "",
        governorate: order.shippingAddress.governorate,
        city: order.shippingAddress.city,
        addressLine1: order.shippingAddress.addressLine1,
        shippingMethodId: "",
        trackingNumber: order.trackingNumber ?? "",
        trackingCarrier: order.trackingCarrier ?? "",
        notes: order.notes?.join("\n") ?? "",
      });
    });
  }, [id, reset]);

  const onSubmit = handleSubmit(async (data) => {
    if (!id) return;
    await updateOrder(id, {
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
      trackingNumber: data.trackingNumber || undefined,
      trackingCarrier: data.trackingCarrier || undefined,
      notes: data.notes,
    });
    navigate(`/orders/${id}`);
  });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Orders", href: "/orders" },
          { label: "Edit" },
        ]}
      />

      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-bold text-navy">Edit Order</h1>
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
                <input {...register("nationalId")} className={inputStyles} maxLength={14} />
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

          <section>
            <h2 className="mb-4 text-lg font-semibold text-navy">Tracking</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Tracking Number">
                <input {...register("trackingNumber")} className={inputStyles} />
              </FormField>
              <FormField label="Carrier">
                <input {...register("trackingCarrier")} className={inputStyles} />
              </FormField>
            </div>
          </section>

          <FormField label="Internal Notes">
            <textarea {...register("notes")} className={`${inputStyles} h-24 py-2`} />
          </FormField>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(`/orders/${id}`)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={formState.isSubmitting}>
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
