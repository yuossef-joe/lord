import { PrismaClient, UserRole } from "@prisma/client";
import { hashPassword } from "../src/utils/hash.js";
import { slugify } from "../src/utils/slug.js";

const prisma = new PrismaClient();

async function main() {
  const carrier = await prisma.brands.upsert({
    where: { slug: "carrier" },
    update: {},
    create: { name: "Carrier", slug: "carrier", isActive: true },
  });
  const midea = await prisma.brands.upsert({
    where: { slug: "midea" },
    update: {},
    create: { name: "Midea", slug: "midea", isActive: true },
  });

  const split = await prisma.productCategories.upsert({
    where: { slug: "split" },
    update: {},
    create: { name: "Split Unit", slug: "split", sortOrder: 1 },
  });

  const products = [
    { brandId: carrier.id, name: "Carrier 42QHF024", modelNumber: "42QHF024", horsepower: 3, capacity: 24000, price: 45000 },
    { brandId: midea.id, name: "Midea Mission 18", modelNumber: "MSM18", horsepower: 2.25, capacity: 18000, price: 32000 },
  ];

  for (const product of products) {
    await prisma.products.upsert({
      where: { slug: slugify(product.name) },
      update: {},
      create: {
        ...product,
        slug: slugify(product.name),
        categoryId: split.id,
        type: "Split",
        capacityUnit: "BTU",
        stockQuantity: 10,
        isFeatured: true,
      },
    });
  }

  await prisma.serviceTypes.upsert({
    where: { slug: "installation" },
    update: {},
    create: { name: "Installation", slug: "installation" },
  });

  await prisma.shippingZones.upsert({
    where: { id: "default-zone" },
    update: {},
    create: {
      id: "default-zone",
      name: "Greater Cairo",
      governorates: ["Cairo", "Giza", "Qalyubia"],
      fee: 150,
      freeShippingThreshold: 50000,
      estimatedDaysMin: 2,
      estimatedDaysMax: 5,
    },
  });

  await prisma.shippingMethods.upsert({
    where: { code: "delivery" },
    update: {},
    create: {
      name: "Home Delivery",
      code: "delivery",
      description: "Delivered to your address",
      estimatedLabel: "2-5 business days",
      isRecommended: true,
    },
  });

  await prisma.cmsUsers.upsert({
    where: { email: "admin@lord.local" },
    update: {},
    create: {
      name: "Lord Admin",
      email: "admin@lord.local",
      passwordHash: await hashPassword("Admin12345"),
      role: UserRole.CMS_ADMIN,
    },
  });

  await prisma.siteSettings.upsert({
    where: { key: "contact_phone" },
    update: {},
    create: { key: "contact_phone", group: "contact", value: "+201000000000" },
  });
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
