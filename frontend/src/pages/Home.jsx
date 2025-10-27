import React, { useEffect, useMemo, useState } from "react";
import api from "../api/axios";
import PerfumeCard from "../components/PerfumeCard";
import { Input, Button, Select, Collapse, Spin } from "antd";

export default function Home() {
  const [perfumes, setPerfumes] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  // filters
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState("");
  const [gender, setGender] = useState("");
  const [sort, setSort] = useState("");

  const loadPerfumes = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get("/api/perfumes", { params });
      setPerfumes(res.data.perfumes || []);
    } catch (err) {
      console.error(err);
      setPerfumes([]);
    } finally {
      setLoading(false);
    }
  };

  const loadBrands = async () => {
    try {
      const res = await api.get("/api/brands");
      const list = (res.data.brands || [])
        .map((b) => b.name || b.brandName)
        .filter(Boolean);
      setBrands(list);
    } catch {
      const inferred = Array.from(
        new Set(
          (perfumes || []).map(
            (p) => (p.brand && (p.brand.brandName || p.brand.name)) || p.brand
          )
        )
      ).filter(Boolean);
      setBrands(inferred);
    }
  };

  useEffect(() => {
    loadPerfumes();
  }, []);

  useEffect(() => {
    if (perfumes.length) loadBrands();
  }, [perfumes.length]);

  const onApplyFilter = () => {
    loadPerfumes({ search, brand, gender, sort });
  };

  const featured = useMemo(() => perfumes.slice(0, 3), [perfumes]);

  return (
    <div className="bg-gradient-to-b from-[#0c0c0c] to-black min-h-screen text-white font-['Cormorant_Garamond']">
      {/* 🔹 HERO / BANNER */}
      <div
        className="relative h-[450px] flex flex-col items-center justify-center text-center bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://img.freepik.com/premium-photo/perfume-bottle-water-with-red-smoke-backdrop-3d-mockup_1168123-1891.jpg?semt=ais_hybrid&w=740&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 px-4">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-widest">
            Perfume <span className="text-[#c41e3a]">House</span>
          </h1>
          <p className="text-gray-300 mt-3 text-lg max-w-2xl mx-auto">
            Where the most exquisite fragrances converge, honoring your unique
            style.
          </p>
        </div>
      </div>

      {/* 🔹 INTRO */}
      <div className="text-center max-w-3xl mx-auto py-12 px-4 text-gray-300 leading-relaxed">
        <p>
          Welcome to <span className="text-[#c41e3a] font-semibold">Perfume House</span> – the world of the most exquisite fragrances. Here,
          we bring you the finest fragrances from renowned brands like{" "}
          <strong>Chanel, Dior, Gucci, YSL</strong> and more. Find the scent
          that reflects your personality.
        </p>
      </div>

      {/* 🔹 FEATURED BRANDS */}
      <section className="brands text-center py-[60px]">
        <h2 className="mb-[30px] text-[26px] font-semibold tracking-wide">
          Featured Brands
        </h2>
        <div className="brand-logos flex justify-center flex-wrap gap-[50px]">
          {[
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsHqPoodzyGI9VGHqBDbc-kQx5M2aMSc1_LQ&s",
            "https://cdn.shopify.com/s/files/1/0775/7363/files/chanel-iconic-cc-logo_480x480.jpg?v=1627421098",
            "https://cdn.logojoy.com/wp-content/uploads/20240306150540/1992-Gucci-logo-600x319.png",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqOSPxMi98o62tSGPkckluvbYfO_XHOLNwuA&s",
          ].map((src, i) => (
            <img
              key={i}
              src={src}
              alt="brand"
              className="w-[100px] opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-300"
            />
          ))}
        </div>
      </section>


      {/* 🔹 FEATURED COLLECTION */}
      <section className="py-10 text-center">
        <h2 className="text-3xl font-bold mb-8">Featured Collection</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-6">
          {featured.map((p) => (
            <PerfumeCard key={p._id} perfume={p} />
          ))}
        </div>
      </section>

      {/* 🔹 SEARCH & FILTER */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="flex gap-3">
          <Input
            placeholder="Search by perfume name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="large"
            className="bg-[#111] text-white border-[#333]"
          />
          <Button
            type="primary"
            size="large"
            onClick={onApplyFilter}
            loading={loading}
            className="bg-[#c41e3a] hover:bg-[#a0142e] border-none"
          >
            Apply
          </Button>
        </div>

        <Collapse
          className="mt-4 bg-[#151515] border border-[#333] rounded-lg"
          items={[
            {
              key: "filters",
              label: <span className="text-white">Filters</span>,
              children: (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Select
                    allowClear
                    placeholder="All brands"
                    value={brand || undefined}
                    onChange={(v) => setBrand(v || "")}
                    options={brands.map((b) => ({ value: b, label: b }))}
                    className="w-full"
                  />
                  <Select
                    allowClear
                    placeholder="Gender"
                    value={gender || undefined}
                    onChange={(v) => setGender(v || "")}
                    options={[
                      { value: "Nam", label: "Male" },
                      { value: "Nữ", label: "Female" },
                      { value: "Unisex", label: "Unisex" },
                    ]}
                  />
                  <Select
                    allowClear
                    placeholder="Sort by price"
                    value={sort || undefined}
                    onChange={(v) => setSort(v || "")}
                    options={[
                      { value: "asc", label: "Price ascending" },
                      { value: "desc", label: "Price descending" },
                    ]}
                  />
                </div>
              ),
            },
          ]}
        />
      </section>

      {/* 🔹 PERFUME GRID */}
      <section className="pb-20 px-6">
        {loading ? (
          <div className="text-center py-10">
            <Spin size="large" />
          </div>
        ) : perfumes.length === 0 ? (
          <p className="text-center text-gray-400">No perfumes available!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {perfumes.map((p) => (
              <PerfumeCard key={p._id} perfume={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
