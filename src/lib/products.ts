export type Shape = "mug" | "bowl" | "vase" | "plate" | "cup" | "teapot" | "planter" | "pot";
export type Category = "Mugs" | "Bowls" | "Vases" | "Plates" | "Home";

export type Glaze = { name: string; color: string; soldOut?: boolean };

export type Product = {
  slug: string;
  name: string;
  shape: Shape;
  category: Category;
  price: number;
  blurb: string;
  details: string[];
  glazes: Glaze[];
};

export const GLAZES = {
  terracotta: { name: "Terracotta", color: "#c0643f" },
  sage: { name: "Sage", color: "#8aa38b" },
  cobalt: { name: "Cobalt", color: "#2f4a7a" },
  oat: { name: "Oat", color: "#d9c7ae" },
  ember: { name: "Ember", color: "#8e3b24" },
  moss: { name: "Moss", color: "#5f6f47" },
} satisfies Record<string, Glaze>;

export const PRODUCTS: Product[] = [
  {
    slug: "ember-mug",
    name: "Ember Mug",
    shape: "mug",
    category: "Mugs",
    price: 2800,
    blurb: "A wide, heavy-bottomed mug for slow mornings. Holds 350 ml.",
    details: ["Stoneware, fired at 1240°C", "Dishwasher safe", "Each one is a little different"],
    glazes: [GLAZES.terracotta, GLAZES.sage, GLAZES.cobalt],
  },
  {
    slug: "dune-bowl",
    name: "Dune Bowl",
    shape: "bowl",
    category: "Bowls",
    price: 3400,
    blurb: "A deep bowl for ramen, soup or a mountain of fruit.",
    details: ["18 cm across", "Food safe glaze", "Microwave safe"],
    glazes: [GLAZES.oat, GLAZES.sage, GLAZES.ember],
  },
  {
    slug: "tide-vase",
    name: "Tide Vase",
    shape: "vase",
    category: "Vases",
    price: 5800,
    blurb: "A tall, narrow-necked vase that makes a single stem look intentional.",
    details: ["28 cm tall", "Watertight inside", "Thrown on the wheel by hand"],
    glazes: [GLAZES.cobalt, GLAZES.oat, { ...GLAZES.terracotta, soldOut: true }],
  },
  {
    slug: "hearth-plates",
    name: "Hearth Plates, set of 2",
    shape: "plate",
    category: "Plates",
    price: 4200,
    blurb: "Everyday dinner plates with a raw clay rim.",
    details: ["26 cm across", "Set of two", "Dishwasher safe"],
    glazes: [GLAZES.oat, GLAZES.moss],
  },
  {
    slug: "pebble-cup",
    name: "Pebble Cup",
    shape: "cup",
    category: "Mugs",
    price: 2200,
    blurb: "A handle-less cup that fits the palm. For espresso, tea or wine.",
    details: ["180 ml", "Stackable", "Dishwasher safe"],
    glazes: [GLAZES.sage, GLAZES.ember, GLAZES.oat],
  },
  {
    slug: "kiln-teapot",
    name: "Kiln Teapot",
    shape: "teapot",
    category: "Home",
    price: 8600,
    blurb: "Our slowest piece to make. Pours clean, every time.",
    details: ["900 ml", "Built-in strainer", "Hand wash only"],
    glazes: [GLAZES.ember, GLAZES.cobalt],
  },
  {
    slug: "moss-planter",
    name: "Moss Planter",
    shape: "planter",
    category: "Home",
    price: 3800,
    blurb: "A planter with a drainage hole and a matching saucer.",
    details: ["15 cm across", "Drainage hole + saucer", "Indoor use"],
    glazes: [GLAZES.moss, GLAZES.oat, GLAZES.terracotta],
  },
  {
    slug: "salt-pinch-pot",
    name: "Salt Pinch Pot",
    shape: "pot",
    category: "Home",
    price: 1600,
    blurb: "A tiny pot for salt, rings, or the things you'd otherwise lose.",
    details: ["8 cm across", "Comes with a lid", "Food safe glaze"],
    glazes: [GLAZES.oat, GLAZES.cobalt, GLAZES.sage],
  },
];

export const CATEGORIES: Category[] = ["Mugs", "Bowls", "Vases", "Plates", "Home"];

export function getProduct(slug: string) {
  return PRODUCTS.find((p) => p.slug === slug);
}
