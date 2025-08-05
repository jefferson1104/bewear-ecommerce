import { relations } from "drizzle-orm";
import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const categoriesTable = pgTable("categories", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const categoriesRelations = relations(categoriesTable, (params) => {
  return {
    products: params.many(productsTable),
  };
});

export const productsTable = pgTable("products", {
  id: uuid().primaryKey().defaultRandom(),
  categoryId: uuid("category_id")
    .references(() => categoriesTable.id)
    .notNull(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  description: text().notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productsRelations = relations(productsTable, (params) => {
  return {
    category: params.one(categoriesTable, {
      fields: [productsTable.categoryId],
      references: [categoriesTable.id],
    }),
    variants: params.many(productVariantsTable),
  };
});

export const productVariantsTable = pgTable("product_variants", {
  id: uuid().primaryKey().defaultRandom(),
  productId: uuid("product_id")
    .references(() => productsTable.id)
    .notNull(),
  name: text().notNull(),
  slug: text().notNull().unique(),
  color: text().notNull(),
  imageUrls: text("image_urls").array().notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  currency: text().notNull().default("USD"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const productVariantsRelations = relations(
  productVariantsTable,
  (params) => {
    return {
      product: params.one(productsTable, {
        fields: [productVariantsTable.productId],
        references: [productsTable.id],
      }),
    };
  },
);
