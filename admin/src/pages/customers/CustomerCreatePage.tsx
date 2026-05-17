import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import Breadcrumb from "@/components/common/Breadcrumb";
import Button from "@/components/common/Button";
import Card from "@/components/common/Card";
import FormField from "@/components/common/FormField";
import { createCustomer } from "@/lib/api";

interface CustomerForm {
  name: string;
  nationalId: string;
  email: string;
  phone: string;
  password?: string;
  isActive: boolean;
}

const inputStyles =
  "w-full h-10 rounded-lg border border-gray-300 px-3 text-sm outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20";

export default function CustomerCreatePage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState } = useForm<CustomerForm>({
    defaultValues: { isActive: true },
  });

  const onSubmit = handleSubmit(async (data) => {
    const payload: Record<string, unknown> = { ...data };
    const result = (await createCustomer(payload)) as { data?: { id?: string } };
    navigate(result.data?.id ? `/customers/${result.data.id}` : "/customers");
  });

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/" },
          { label: "Customers", href: "/customers" },
          { label: "Create" },
        ]}
      />
      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-bold text-navy">Create Customer</h1>
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
            <FormField label="Temporary Password">
              <input {...register("password")} className={inputStyles} type="password" />
            </FormField>
            <FormField label="Status">
              <label className="flex h-10 items-center gap-2 text-sm text-gray-700">
                <input {...register("isActive")} type="checkbox" className="h-4 w-4 accent-teal" />
                Active customer
              </label>
            </FormField>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate("/customers")}>
              Cancel
            </Button>
            <Button type="submit" isLoading={formState.isSubmitting}>
              Create Customer
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
