import React, { useEffect, useMemo, useState } from 'react';
import api from '../api/axios';
import PerfumeCard from '../components/PerfumeCard';
import { Input, Button, Select, Collapse } from 'antd';

export default function Home() {
  const [perfumes, setPerfumes] = useState([]);
  const [loading, setLoading] = useState(false);

  // search & filters (phản chiếu views/index.ejs)
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [gender, setGender] = useState('');
  const [sort, setSort] = useState('');
  const [brands, setBrands] = useState([]);

  const loadPerfumes = async (params = {}) => {
    setLoading(true);
    try {
      const res = await api.get('/perfumes', { params });
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
      const res = await api.get('/brands');
      const list = (res.data.brands || []).map(b => b.name || b.brandName).filter(Boolean);
      setBrands(list);
    } catch (err) {
      // fallback: suy ra từ danh sách perfumes
      const inferred = Array.from(new Set((perfumes || []).map(p => (p.brand && (p.brand.brandName || p.brand.name)) || p.brand)))
        .filter(Boolean);
      setBrands(inferred);
    }
  };

  useEffect(() => {
    loadPerfumes({});
  }, []);

  useEffect(() => {
    if (perfumes.length) loadBrands();
  }, [perfumes.length]);

  const onApplyFilter = () => {
    loadPerfumes({ search, brand, gender, sort });
  };

  const featured = useMemo(() => perfumes.slice(0, 4), [perfumes]);

  return (
    <div className="space-y-10">
      {/* Hero */}
      <div
        className="h-[320px] rounded-xl flex items-center justify-center text-center px-6"
        style={{
          backgroundImage:
            'url(https://img.freepik.com/premium-photo/perfume-bottle-water-with-red-smoke-backdrop-3d-mockup_1168123-1891.jpg?semt=ais_hybrid&w=740&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="backdrop-blur-[1px] bg-black/30 rounded-lg p-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white">Perfume <span className="text-[#0e0707]">House</span></h1>
          <p className="text-gray-200 mt-2 max-w-2xl">
            Where the most exquisite fragrances converge, honoring your unique style.
          </p>
        </div>
      </div>

      {/* Featured brands */}
      <section className="text-center">
        <h2 className="text-2xl font-semibold text-white mb-6">Featured Brands</h2>
        <div className="flex flex-wrap items-center justify-center gap-8 opacity-90">
          <img className="w-24 hover:scale-105 transition" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsHqPoodzyGI9VGHqBDbc-kQx5M2aMSc1_LQ&s" alt="Dior" />
          <img className="w-24 hover:scale-105 transition" src="https://cdn.shopify.com/s/files/1/0775/7363/files/chanel-iconic-cc-logo_480x480.jpg?v=1627421098" alt="Chanel" />
          <img className="w-24 hover:scale-105 transition" src="https://cdn.logojoy.com/wp-content/uploads/20240306150540/1992-Gucci-logo-600x319.png" alt="Gucci" />
          <img className="w-24 hover:scale-105 transition" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqOSPxMi98o62tSGPkckluvbYfO_XHOLNwuA&s" alt="YSL" />
        </div>
      </section>

      {/* Featured collection */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">Featured Collection</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map(p => <PerfumeCard key={p._id} perfume={p} />)}
        </div>
      </section>

      {/* Search + Filter */}
      <section className="max-w-4xl mx-auto w-full">
        <div className="flex gap-2">
          <Input
            placeholder="Search by perfume name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            size="large"
          />
          <Button type="primary" size="large" onClick={onApplyFilter} loading={loading}>
            Apply
          </Button>
        </div>

        <div className="mt-3">
          <Collapse size="small" items={[{
            key: 'filters',
            label: 'Filters',
            children: (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Select
                  allowClear
                  placeholder="All brands"
                  value={brand || undefined}
                  onChange={v => setBrand(v || '')}
                  options={brands.map(b => ({ value: b, label: b }))}
                />
                <Select
                  allowClear
                  placeholder="Gender"
                  value={gender || undefined}
                  onChange={v => setGender(v || '')}
                  options={[{ value: 'Nam', label: 'Male' }, { value: 'Nữ', label: 'Female' }, { value: 'Unisex', label: 'Unisex' }]}
                />
                <Select
                  allowClear
                  placeholder="Sort by price"
                  value={sort || undefined}
                  onChange={v => setSort(v || '')}
                  options={[{ value: 'asc', label: 'Price ascending' }, { value: 'desc', label: 'Price descending' }]}
                />
              </div>
            )
          }]} />
        </div>
      </section>

      {/* Grid all perfumes */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {perfumes.length === 0 && !loading && (
            <p className="text-center text-gray-300 col-span-full">No perfumes available!</p>
          )}
          {perfumes.map(p => <PerfumeCard key={p._id} perfume={p} />)}
        </div>
      </section>
    </div>
  );
}
