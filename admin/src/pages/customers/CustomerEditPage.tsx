import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "motion/react";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import FormField from "@/components/common/FormField";
import { fetchCustomer, updateCustomer } from "@/lib/api";

interface CustomerForm {
  name: string;
  nationalId: string;
  email: string;
  phone: string;
  isActive: boolean;
}

const inputStyles =
  "w-full h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20";

export default function CustomerEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState } = useForm<CustomerForm>({
    defaultValues: { isActive: true },
  });

  useEffect(() => {
    if (!id) return;
    void fetchCustomer(id).then((response) => {
      const customer = response.data;
      reset({
        name: customer.name,
        nationalId: customer.nationalId ?? "",
        email: customer.email,
        phone: customer.phone,
        isActive: customer.isActive,
      });
    });
  }, [id, reset]);

  const onSubmit = handleSubmit(async (data) => {
    if (!id) return;
    await updateCustomer(id, { ...data });
    navigate(`/customers/${id}`);
  });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Customers", href: "/customers" },
          { label: "Edit" },
        ]}
      />
      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-bold text-navy">Edit Customer</h1>
      </div>
      <Card>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Name">
              <input {...register("name", { required: true })} className={inputStyles} />
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
            <FormField label="Status">
              <label className="flex h-10 items-center gap-2 text-sm text-gray-700">
                <input {...register("isActive")} type="checkbox" className="h-4 w-4 accent-teal" />
                Active customer
              </label>
            </FormField>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate(`/customers/${id}`)}>
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
