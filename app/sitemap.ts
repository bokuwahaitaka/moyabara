import type {MetadataRoute} from "next";
const slugs=["school","work","relationships","family","society","daily"];
export default function sitemap():MetadataRoute.Sitemap{const base="https://fuman-hiroba.tswcgwc69z.chatgpt.site";return[{url:base,lastModified:new Date(),changeFrequency:"daily",priority:1},...slugs.map(slug=>({url:`${base}/guchi/${slug}`,lastModified:new Date(),changeFrequency:"daily" as const,priority:.8}))]}
