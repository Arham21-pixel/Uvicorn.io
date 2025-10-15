import { NextResponse } from "next/server"
import type { Product } from "@/lib/types"

const PRODUCTS: Product[] = [
  {
    id: "p-001",
    name: "Smartphone X (128GB)",
    description: '6.5" AMOLED, 5G, dual camera system.',
    price: 2499900,
    image: "/images/products/p-001.jpg",
  },
  {
    id: "p-002",
    name: "Laptop Pro 14",
    description: '14" IPS, 16GB RAM, 512GB SSD, backlit keyboard.',
    price: 8999900,
    image: "/images/products/p-002.jpg",
  },
  {
    id: "p-003",
    name: "Noise-Cancelling Headphones",
    description: "Over-ear ANC with 30h battery life.",
    price: 1599900,
    image: "/images/products/p-003.jpg",
  },
  {
    id: "p-004",
    name: '4K LED TV 55"',
    description: "Ultra HD with HDR10+ and smart apps.",
    price: 4499999,
    image: "/images/products/p-004.jpg",
  },
  {
    id: "p-005",
    name: "Wireless Earbuds",
    description: "Bluetooth 5.3, ENC mic, IPX5.",
    price: 499900,
    image: "/images/products/p-005.jpg",
  },
  {
    id: "p-006",
    name: "Gaming Mouse",
    description: "12K DPI sensor, RGB, 6 programmable buttons.",
    price: 299900,
    image: "/images/products/p-006.jpg",
  },
  {
    id: "p-007",
    name: "Mechanical Keyboard",
    description: "Hot-swappable, tactile switches, PBT keycaps.",
    price: 599900,
    image: "/images/products/p-007.jpg",
  },
  {
    id: "p-008",
    name: "Portable SSD 1TB",
    description: "USB-C 10Gbps, shock resistant, compact.",
    price: 999900,
    image: "/images/products/p-008.jpg",
  },
  {
    id: "p-009",
    name: "Smartwatch S2",
    description: "AMOLED, GPS, heart rate and SpO2 tracking.",
    price: 1399900,
    image: "/images/products/p-009.jpg",
  },
  {
    id: "p-010",
    name: "Bluetooth Speaker",
    description: "20W output, deep bass, 12h battery, IPX7.",
    price: 3499900,
    image: "/images/products/p-010.jpg",
  },
  {
    id: "p-011",
    name: "USB-C GaN Charger 65W",
    description: "Dual-port PPS fast charging.",
    price: 249900,
    image: "/images/products/p-011.jpg",
  },
  {
    id: "p-012",
    name: "Wi‑Fi 6 Router",
    description: "Gigabit ports, MU-MIMO, OFDMA.",
    price: 429900,
    image: "/images/products/p-012.jpg",
  },
  {
    id: "p-013",
    name: "Action Camera 4K",
    description: "Stabilization, waterproof case included.",
    price: 1999900,
    image: "/images/products/p-013.jpg",
  },
  {
    id: "p-014",
    name: '27" 144Hz Monitor',
    description: "QHD IPS, 1ms MPRT, HDR10.",
    price: 2299900,
    image: "/images/products/p-014.jpg",
  },
  {
    id: "p-015",
    name: "Smart Home Hub",
    description: "Controls lights, locks, and sensors.",
    price: 899900,
    image: "/images/products/p-015.jpg",
  },
  {
    id: "p-016",
    name: "Dash Cam 2K",
    description: "Night vision, loop recording, GPS.",
    price: 749900,
    image: "/images/products/p-016.jpg",
  },
  {
    id: "p-017",
    name: "VR Headset",
    description: "Standalone with high-res displays.",
    price: 3499999,
    image: "/images/products/p-017.jpg",
  },
  {
    id: "p-018",
    name: "Portable Projector",
    description: "1080p LED, built-in speakers.",
    price: 1599900,
    image: "/images/products/p-018.jpg",
  },
]

export async function GET() {
  return NextResponse.json(PRODUCTS)
}
