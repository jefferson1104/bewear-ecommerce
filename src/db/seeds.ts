import crypto from "crypto";

import { db } from ".";
import { categoriesTable, productsTable, productVariantsTable } from "./schema";

const productImages = {
  Backpack: {
    Black: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Acesso%CC%81rios/1/78f9fa3b_c793_472a_b183_e32495033da2.jpg",
    ],
    White: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Acesso%CC%81rios/1/dacd9927_7287_4b14_a94f_b3f18c9c4d15.jpg",
    ],
  },
  "High Sock": {
    White: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Acesso%CC%81rios/2/52c14d96_66fb_4b5e_b8a9_6b6cf21fb448.jpg",
    ],
    Black: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Acesso%CC%81rios/2/b38172d0_067a_4f03_975d_3c1c10cfc5f4.jpg",
    ],
  },
  "Nocta Cap": {
    Black: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Acesso%CC%81rios/3/41f38755_76ea_4630_ba49_59991c345513.jpg",
    ],
    Wine: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Acesso%CC%81rios/3/7a8c684b_9373_41aa_879a_c5ec99885b7a.jpg",
    ],
    Blue: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Acesso%CC%81rios/3/9bb87d7b_b388_42d8_b5ca_7761804d24f7.jpg",
    ],
  },
  "Curved Cap": {
    Blue: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Acesso%CC%81rios/4/6f6b54d9_f06d_47da_b34a_0641a5e34fa4.jpg",
    ],
    Beige: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Acesso%CC%81rios/4/9a1a09d7_4499_4968_9b22_e95200434631.png",
    ],
    Green: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Acesso%CC%81rios/4/ca47bcd5_e418_422d_b85c_45d8245aed03.jpg",
    ],
  },
  "Active Shorts": {
    Black: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Bermuda+%26+Shorts/1/2bd85c0d_d637_49f3_bc35_c6c7c0062b5f.jpg",
    ],
    Blue: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Bermuda+%26+Shorts/1/57208a2b_6dda_4f46_a856_dd1b90d7432d.png",
    ],
    Green: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Bermuda+%26+Shorts/1/91674907_139b_41b1_95fa_3e570d4376f1.jpg",
    ],
  },
  "Core Shorts": {
    Green: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Bermuda+%26+Shorts/2/6120253a_d8b3_453b_a0b5_3ca783ae9510.jpg",
    ],
    Black: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Bermuda+%26+Shorts/2/a5562ec7_e37a_49db_911b_26dd787463ab.jpg",
    ],
    Blue: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Bermuda+%26+Shorts/2/e067a9e3_f9b4_4d81_8129_c90effc1038b.jpg",
    ],
  },
  "Challenger Shorts": {
    Brown: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Bermuda+%26+Shorts/3/78253172_fe17_4add_b597_88c689a2af3f.jpg",
    ],
    Black: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Bermuda+%26+Shorts/3/b8bf902f_de19_4ad9_bea8_87aa4d1f5679.webp",
    ],
    Beige: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Bermuda+%26+Shorts/3/eda6b80f_1fba_4934_a242_0cd93b401677.jpg",
    ],
  },
  "Premier Shorts": {
    Green: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Bermuda+%26+Shorts/4/7a8d5bd9_0de8_4247_9374_aadce84042ea.jpg",
    ],
    Black: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Bermuda+%26+Shorts/4/a277cf75_a377_4557_bb70_ef155651338e.jpg",
    ],
    Blue: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Bermuda+%26+Shorts/4/a7948f93_42ac_4363_92a7_e2b3f7754230.jpg",
    ],
  },
  "Nike Club Pants": {
    Beige: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Calc%CC%A7as/1/1cef0dc4_e296_4809_94b6_66cb3164aa43.jpg",
    ],
    Black: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Calc%CC%A7as/1/611af69f_d7e7_4365_83a8_3aca96922d87.jpg",
    ],
    Wine: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Calc%CC%A7as/1/e4d6bfa8_88b0_484e_8e07_5f5fc5e5cfbb.jpg",
    ],
  },
  "Knit Pants": {
    Black: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Calc%CC%A7as/2/3e90bb34_eb11_4cc0_930a_f1a4dcb5a4a1.png",
    ],
    White: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Calc%CC%A7as/2/d2766b69_177e_4c1d_abfe_93bb92c502f6.png",
    ],
    Blue: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Calc%CC%A7as/2/e5b271dd_1696_4ff0_8cc9_649b45ef2c88.jpg",
    ],
  },
  "Brooklyn Pants": {
    Beige: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Calc%CC%A7as/3/18a2f43f_a0bb_4d7e_a626_27c2f3b58017.jpg",
    ],
    White: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Calc%CC%A7as/3/18a2f43f_a0bb_4d7e_a626_27c2f3b58017.jpg",
    ],
    Black: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Calc%CC%A7as/3/915f96a0_8714_42d7_8d2d_e897d5a9ce7a.jpg",
    ],
  },
  "Jordan Pants": {
    Green: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Calc%CC%A7as/4/1805ffd2_5fb7_454b_b098_2b00902025f3.jpg",
    ],
    Black: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Calc%CC%A7as/4/b97f4616_986e_4f1e_a577_905cb99eb213.jpg",
    ],
    Blue: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Calc%CC%A7as/4/d626872b_35b1_4a96_b58a_ea5f7d6ceab7.jpg",
    ],
  },
  "ACG T-Shirt": {
    Beige: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Camisetas/1/4f57e719_e120_4525_83d5_16955e27061b.png",
    ],
    Black: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Camisetas/1/a8a08dfb_a495_4c1b_9873_aa504cfe2fd7.webp",
    ],
    White: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Camisetas/1/a8c7b41f_69f0_4894_994f_de01533d1161.jpg",
    ],
  },
  "Run T-Shirt": {
    Black: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Camisetas/2/67db843e_691c_44a6_87b6_f5e01a1bcafe.webp",
    ],
    Blue: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Camisetas/2/83ab03e1_6383_450b_b203_3509a00fdaf7.jpg",
    ],
  },
  "Active T-Shirt": {
    White: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Camisetas/3/c222d1e5_7cd7_4794_b644_57f47c9d344c.jpg",
    ],
    Black: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Camisetas/3/d4c0657c_c2c2_4356_a509_61cd9ecc4148.webp",
    ],
  },
  "Nature T-Shirt": {
    Black: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Camisetas/4/caa3015c_61b3_4315_86b1_cc62ab1d2fee.jpg",
    ],
    Blue: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Camisetas/4/d0e40dd5_2060_450e_a423_6e894bc0573f.webp",
    ],
  },
  Windbreaker: {
    Black: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Jaquetas+%26+Moletons/1/4e134ee9_ce18_4b32_a4ad_aa55026a38f9.jpg",
    ],
    White: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Jaquetas+%26+Moletons/1/74ab7c8c_7c54_4c49_8084_24a87fe0fc85.jpg",
    ],
  },
  "Windrunner Jacket": {
    Blue: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Jaquetas+%26+Moletons/2/79afe358_deb0_4309_8301_02a6e6aa6108.jpg",
    ],
    Beige: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Jaquetas+%26+Moletons/2/bc06d5b0_be4b_4c74_8c6e_8645ea7168bb.jpg",
    ],
  },
  "Style Jacket": {
    Brown: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Jaquetas+%26+Moletons/3/06222020_01b8_4232_92f4_dc0c92bb25da.webp",
    ],
    Gray: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Jaquetas+%26+Moletons/3/97de604a_deef_4594_a5a6_f51c18c71216.jpg",
    ],
  },
  "Nike Club Jacket": {
    Blue: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Jaquetas+%26+Moletons/4/134c9642_f032_4c6e_84a8_68de99e3dcb7.jpg",
    ],
    Yellow: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Jaquetas+%26+Moletons/4/d8d78682_c480_40b0_97a1_93ab201b3287.jpg",
    ],
  },
  "Nike Vomero Sneakers": {
    Black: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Te%CC%82nis/1/85dc96b6_1cef_43ec_8cef_40e3938ac7cf.jpg",
    ],
    White: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Te%CC%82nis/1/a4b97d0e_0065_4818_90f2_b0778ac48c6b.jpg",
    ],
    Blue: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Te%CC%82nis/1/ac052fe0_60ce_4ce9_8b3c_fd5fb72eaf3b.jpg",
    ],
  },
  "Nike Panda Sneakers": {
    Green: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Te%CC%82nis/2/2156e314_9889_4bdc_962d_7350f66cdf7f.jpg",
    ],
    Blue: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Te%CC%82nis/2/2b938204_3950_4295_b61c_d4311045fed0.jpg",
    ],
    Black: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Te%CC%82nis/2/6ad78a9f_14a9_4590_8e7c_9392d0523678.jpg",
    ],
  },
  "Nike Air Force Sneakers": {
    Black: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Te%CC%82nis/3/5daa00d9_afae_4125_a95c_fc71923b81c3.jpg",
    ],
    White: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Te%CC%82nis/3/e6da41fa_1be4_4ce5_b89c_22be4f1f02d4.jpg",
    ],
  },
  "Nike Dunk Low Sneakers": {
    White: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Te%CC%82nis/4/4bc9c840_d8af_411a_9b72_a3f51f6dd3da.jpg",
    ],
    Black: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Te%CC%82nis/4/72f07a5b_4fb8_4182_98b7_1f91ad71ed5c.jpg",
    ],
    Blue: [
      "https://fsc-projects-static.s3.us-east-1.amazonaws.com/BEWEAR/products/Te%CC%82nis/4/bb4e381c_84ae_4ced_814f_8553afc6eacf.jpg",
    ],
  },
};

const categories = [
  {
    name: "Accessories",
    description: "Backpacks, caps, socks and other accessories",
  },
  {
    name: "Shorts",
    description: "Shorts and bermudas for every occasion",
  },
  {
    name: "Pants",
    description: "Casual and sports pants",
  },
  {
    name: "T-Shirts",
    description: "Casual and sports t-shirts",
  },
  {
    name: "Jackets & Hoodies",
    description: "Jackets, windbreakers and hoodies",
  },
  {
    name: "Sneakers",
    description: "Casual and sports sneakers",
  },
];

const products = [
  // Accessories
  {
    name: "Backpack",
    description:
      "Durable and comfortable backpack, ideal for daily use and travel.",
    categoryName: "Accessories",
    variants: [
      { color: "Black", price: 12999 },
      { color: "White", price: 12999 },
    ],
  },
  {
    name: "High Sock",
    description: "High cotton sock, comfortable and durable.",
    categoryName: "Accessories",
    variants: [
      { color: "White", price: 1999 },
      { color: "Black", price: 1999 },
    ],
  },
  {
    name: "Nocta Cap",
    description: "Nocta cap with modern design and comfortable fit.",
    categoryName: "Accessories",
    variants: [
      { color: "Black", price: 8999 },
      { color: "Wine", price: 8999 },
      { color: "Blue", price: 8999 },
    ],
  },
  {
    name: "Curved Cap",
    description: "Cap with curved brim, classic and versatile style.",
    categoryName: "Accessories",
    variants: [
      { color: "Blue", price: 7999 },
      { color: "Beige", price: 7999 },
      { color: "Green", price: 7999 },
    ],
  },

  // Shorts
  {
    name: "Active Shorts",
    description:
      "Sports shorts for physical activities, with sweat-absorbing fabric.",
    categoryName: "Shorts",
    variants: [
      { color: "Black", price: 6999 },
      { color: "Blue", price: 6999 },
      { color: "Green", price: 6999 },
    ],
  },
  {
    name: "Core Shorts",
    description: "Comfortable casual shorts, perfect for everyday wear.",
    categoryName: "Shorts",
    variants: [
      { color: "Green", price: 5999 },
      { color: "Black", price: 5999 },
      { color: "Blue", price: 5999 },
    ],
  },
  {
    name: "Challenger Shorts",
    description:
      "Shorts with modern and comfortable design, ideal for various occasions.",
    categoryName: "Shorts",
    variants: [
      { color: "Brown", price: 7499 },
      { color: "Black", price: 7499 },
      { color: "Beige", price: 7499 },
    ],
  },
  {
    name: "Premier Shorts",
    description: "Premium shorts with superior quality and unique design.",
    categoryName: "Shorts",
    variants: [
      { color: "Green", price: 8999 },
      { color: "Black", price: 8999 },
      { color: "Blue", price: 8999 },
    ],
  },

  // Pants
  {
    name: "Nike Club Pants",
    description:
      "Nike Club sports pants, comfortable and versatile for training and casual use.",
    categoryName: "Pants",
    variants: [
      { color: "Beige", price: 15999 },
      { color: "Black", price: 15999 },
      { color: "Wine", price: 15999 },
    ],
  },
  {
    name: "Knit Pants",
    description: "Soft and comfortable knit pants, ideal for relaxing.",
    categoryName: "Pants",
    variants: [
      { color: "Black", price: 12999 },
      { color: "White", price: 12999 },
      { color: "Blue", price: 12999 },
    ],
  },
  {
    name: "Brooklyn Pants",
    description:
      "Pants with urban and modern design, perfect for street style.",
    categoryName: "Pants",
    variants: [
      { color: "Beige", price: 13999 },
      { color: "White", price: 13999 },
      { color: "Black", price: 13999 },
    ],
  },
  {
    name: "Jordan Pants",
    description: "Jordan pants with premium quality and iconic brand design.",
    categoryName: "Pants",
    variants: [
      { color: "Green", price: 18999 },
      { color: "Black", price: 18999 },
      { color: "Blue", price: 18999 },
    ],
  },

  // T-Shirts
  {
    name: "ACG T-Shirt",
    description: "ACG t-shirt with technical design and high-quality material.",
    categoryName: "T-Shirts",
    variants: [
      { color: "Beige", price: 6999 },
      { color: "Black", price: 6999 },
      { color: "White", price: 6999 },
    ],
  },
  {
    name: "Run T-Shirt",
    description: "Running t-shirt with breathable fabric and superior comfort.",
    categoryName: "T-Shirts",
    variants: [
      { color: "Black", price: 5999 },
      { color: "Blue", price: 5999 },
    ],
  },
  {
    name: "Active T-Shirt",
    description:
      "Sports t-shirt for physical activities with Dri-FIT technology.",
    categoryName: "T-Shirts",
    variants: [
      { color: "White", price: 5499 },
      { color: "Black", price: 5499 },
    ],
  },
  {
    name: "Nature T-Shirt",
    description: "T-shirt with nature-inspired print, comfortable and stylish.",
    categoryName: "T-Shirts",
    variants: [
      { color: "Black", price: 6499 },
      { color: "Blue", price: 6499 },
    ],
  },

  // Jackets & Hoodies
  {
    name: "Windbreaker",
    description:
      "Lightweight and durable windbreaker jacket, ideal for outdoor activities.",
    categoryName: "Jackets & Hoodies",
    variants: [
      { color: "Black", price: 19999 },
      { color: "White", price: 19999 },
    ],
  },
  {
    name: "Windrunner Jacket",
    description: "Windrunner jacket with classic design and wind protection.",
    categoryName: "Jackets & Hoodies",
    variants: [
      { color: "Blue", price: 22999 },
      { color: "Beige", price: 22999 },
    ],
  },
  {
    name: "Style Jacket",
    description:
      "Jacket with urban and modern style, perfect for casual looks.",
    categoryName: "Jackets & Hoodies",
    variants: [
      { color: "Brown", price: 17999 },
      { color: "Gray", price: 17999 },
    ],
  },
  {
    name: "Nike Club Jacket",
    description: "Nike Club jacket with premium quality and timeless design.",
    categoryName: "Jackets & Hoodies",
    variants: [
      { color: "Blue", price: 25999 },
      { color: "Yellow", price: 25999 },
    ],
  },

  // Sneakers
  {
    name: "Nike Vomero Sneakers",
    description:
      "Nike Vomero sneakers with superior cushioning technology for running.",
    categoryName: "Sneakers",
    variants: [
      { color: "Black", price: 79999 },
      { color: "White", price: 79999 },
      { color: "Blue", price: 79999 },
    ],
  },
  {
    name: "Nike Panda Sneakers",
    description:
      "Nike sneakers with iconic Panda design, comfortable and stylish.",
    categoryName: "Sneakers",
    variants: [
      { color: "Green", price: 69999 },
      { color: "Blue", price: 69999 },
      { color: "Black", price: 69999 },
    ],
  },
  {
    name: "Nike Air Force Sneakers",
    description:
      "Nike Air Force 1 sneakers, a timeless classic with iconic design.",
    categoryName: "Sneakers",
    variants: [
      { color: "Black", price: 89999 },
      { color: "White", price: 89999 },
    ],
  },
  {
    name: "Nike Dunk Low Sneakers",
    description: "Nike Dunk Low sneakers with retro design and modern comfort.",
    categoryName: "Sneakers",
    variants: [
      { color: "White", price: 75999 },
      { color: "Black", price: 75999 },
      { color: "Blue", price: 75999 },
    ],
  },
];

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .trim();
}

async function main() {
  console.log("🌱 Iniciando o seeding do banco de dados...");

  try {
    // Limpar dados existentes
    console.log("🧹 Limpando dados existentes...");
    await db.delete(productVariantsTable);
    await db.delete(productsTable);
    await db.delete(categoriesTable);
    console.log("✅ Dados limpos com sucesso!");

    // Inserir categorias primeiro
    const categoryMap = new Map<string, string>();

    console.log("📂 Criando categorias...");
    for (const categoryData of categories) {
      const categoryId = crypto.randomUUID();
      const categorySlug = generateSlug(categoryData.name);

      console.log(`  📁 Criando categoria: ${categoryData.name}`);

      await db.insert(categoriesTable).values({
        id: categoryId,
        name: categoryData.name,
        slug: categorySlug,
      });

      categoryMap.set(categoryData.name, categoryId);
    }

    // Inserir produtos
    for (const productData of products) {
      const productId = crypto.randomUUID();
      const productSlug = generateSlug(productData.name);
      const categoryId = categoryMap.get(productData.categoryName);

      if (!categoryId) {
        throw new Error(
          `Categoria "${productData.categoryName}" não encontrada`,
        );
      }

      console.log(`📦 Criando produto: ${productData.name}`);

      await db.insert(productsTable).values({
        id: productId,
        name: productData.name,
        slug: productSlug,
        description: productData.description,
        categoryId: categoryId,
      });

      // Inserir variantes do produto
      for (const variantData of productData.variants) {
        const variantId = crypto.randomUUID();
        const productKey = productData.name as keyof typeof productImages;
        const variantImages =
          productImages[productKey]?.[
            variantData.color as keyof (typeof productImages)[typeof productKey]
          ] || [];

        console.log(`  🎨 Criando variante: ${variantData.color}`);

        await db.insert(productVariantsTable).values({
          id: variantId,
          name: variantData.color,
          productId: productId,
          color: variantData.color,
          imageUrls: variantImages,
          priceInCents: variantData.price,
          slug: generateSlug(`${productData.name}-${variantData.color}`),
        });
      }
    }

    console.log("✅ Seeding concluído com sucesso!");
    console.log(
      `📊 Foram criadas ${categories.length} categorias, ${
        products.length
      } produtos com ${products.reduce(
        (acc, p) => acc + p.variants.length,
        0,
      )} variantes.`,
    );
  } catch (error) {
    console.error("❌ Erro durante o seeding:", error);
    throw error;
  }
}

main().catch(console.error);
