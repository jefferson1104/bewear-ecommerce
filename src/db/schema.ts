import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const usersRelations = relations(usersTable, ({ many, one }) => ({
  shippinAddressesTable: many(shippinAddressesTable),
  cart: one(cartsTable, {
    fields: [usersTable.id],
    references: [cartsTable.userId],
  }),
  orders: many(ordersTable),
}));

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verificationsTable = pgTable("verifications", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
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
    .references(() => categoriesTable.id, { onDelete: "set null" })
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
    .references(() => productsTable.id, { onDelete: "cascade" })
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
      cartItems: params.many(cartItemsTable),
      orderItems: params.many(orderItemsTable),
    };
  },
);

export const shippinAddressesTable = pgTable("shipping_addresses", {
  id: uuid().primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  recipientName: text("recipient_name").notNull(),
  phone: text().notNull(),
  email: text().notNull(),
  document: text().notNull(),
  street: text().notNull(),
  number: text().notNull(),
  complement: text(),
  neighborhood: text().notNull(),
  city: text().notNull(),
  state: text().notNull(),
  zipCode: text("zip_code").notNull(),
  country: text().notNull().default("United States"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const shippinAddressesRelations = relations(
  shippinAddressesTable,
  ({ one, many }) => ({
    user: one(usersTable, {
      fields: [shippinAddressesTable.userId],
      references: [usersTable.id],
    }),
    cart: one(cartsTable, {
      fields: [shippinAddressesTable.id],
      references: [cartsTable.shippingAddressId],
    }),
    orders: many(ordersTable),
  }),
);

export const cartsTable = pgTable("carts", {
  id: uuid().primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  shippingAddressId: uuid("shipping_address_id").references(
    () => shippinAddressesTable.id,
    { onDelete: "set null" },
  ),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const cartsRelations = relations(cartsTable, ({ many, one }) => ({
  user: one(usersTable, {
    fields: [cartsTable.userId],
    references: [usersTable.id],
  }),
  shippingAddress: one(shippinAddressesTable, {
    fields: [cartsTable.shippingAddressId],
    references: [shippinAddressesTable.id],
  }),
  items: many(cartItemsTable),
}));

export const cartItemsTable = pgTable("cart_items", {
  id: uuid().primaryKey().defaultRandom(),
  cartId: uuid("cart_id")
    .references(() => cartsTable.id, { onDelete: "cascade" })
    .notNull(),
  productVariantId: uuid("product_variant_id")
    .references(() => productVariantsTable.id, { onDelete: "cascade" })
    .notNull(),
  quantity: integer("quantity").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const cartItemsRelations = relations(cartItemsTable, ({ one }) => ({
  cart: one(cartsTable, {
    fields: [cartItemsTable.cartId],
    references: [cartsTable.id],
  }),
  productVariant: one(productVariantsTable, {
    fields: [cartItemsTable.productVariantId],
    references: [productVariantsTable.id],
  }),
}));

export const orderStatus = pgEnum("order_status", [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
]);

export const ordersTable = pgTable("orders", {
  id: uuid().primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  shippingAddressId: uuid("shipping_address_id").references(
    () => shippinAddressesTable.id,
    { onDelete: "set null" },
  ),
  recipientName: text("recipient_name").notNull(),
  phone: text().notNull(),
  email: text().notNull(),
  document: text().notNull(),
  street: text().notNull(),
  number: text().notNull(),
  complement: text(),
  neighborhood: text().notNull(),
  city: text().notNull(),
  state: text().notNull(),
  zipCode: text("zip_code").notNull(),
  country: text().notNull().default("United States"),
  totalPriceInCents: integer("total_price_in_cents").notNull(),
  status: orderStatus().notNull().default("PENDING"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const orderItemsTable = pgTable("order_items", {
  id: uuid().primaryKey().defaultRandom(),
  orderId: uuid("order_id")
    .references(() => ordersTable.id, { onDelete: "cascade" })
    .notNull(),
  productVariantId: uuid("product_variant_id")
    .references(() => productVariantsTable.id, { onDelete: "restrict" })
    .notNull(),
  quantity: integer("quantity").notNull(),
  priceInCents: integer("price_in_cents").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const ordersRelations = relations(ordersTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [ordersTable.userId],
    references: [usersTable.id],
  }),
  shippingAddress: one(shippinAddressesTable, {
    fields: [ordersTable.shippingAddressId],
    references: [shippinAddressesTable.id],
  }),
  items: many(orderItemsTable),
}));

export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderItemsTable.orderId],
    references: [ordersTable.id],
  }),
  productVariant: one(productVariantsTable, {
    fields: [orderItemsTable.productVariantId],
    references: [productVariantsTable.id],
  }),
}));
