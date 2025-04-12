// // app/rental-list/page.tsx

// import { Card, CardContent } from "@/components/ui/card";
// import { useTranslations } from "next-intl";

// const rentalData = [
//   {
//     id: 1,
//     title: "台中市東區 · 雅房出租",
//     price: "NT$6,500/月",
//     address: "台中市東區自由路三段",
//     description: "近火車站，生活機能便利，附家具。",
//   },
//   {
//     id: 2,
//     title: "台中市東區 · 雅房出租",
//     price: "NT$6,500/月",
//     address: "台中市東區自由路三段",
//     description: "近火車站，生活機能便利，附家具。",
//   },
//   {
//     id: 3,
//     title: "台中市東區 · 雅房出租",
//     price: "NT$6,500/月",
//     address: "台中市東區自由路三段",
//     description: "近火車站，生活機能便利，附家具。",
//   },
//   // ...更多資料
// ];

// const RentalListPage = () => {
//   const t = useTranslations();

//   return (
//     <>
//       <h1 className="text-2xl font-bold">{t("rental-list")}</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//         {rentalData.map((rental) => (
//           <Card key={rental.id}>
//             <CardContent className="p-4 space-y-2">
//               <h2 className="text-lg font-semibold">{rental.title}</h2>
//               <p className="text-neutral-600">{rental.address}</p>
//               <p className="text-neutral-900 font-medium">{rental.price}</p>
//               <p className="text-sm text-neutral-500">{rental.description}</p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </>
//   );
// };

// export default RentalListPage;
"use client";

import LocaleSwitcher from "@/components/global/LocalSwitcher";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AvatarIcon, ImageIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
  return (
    <header className="w-full flex justify-between items-center px-6 py-4 shadow-md bg-white sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <Image
          src="https://picsum.photos/50/50"
          alt="Logo"
          width={48}
          height={48}
        />
        <Link href="/">
          <Button className="flex items-center space-x-2 bg-neutral-700">
            <ImageIcon className="w-4 h-4" />
            <span className="font-medium">地圖搜索</span>
          </Button>
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <LocaleSwitcher />
        <Button className="bg-neutral-700">
          <AvatarIcon className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};

const RegionFilter = () => {
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");

  return (
    <section className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <Select value={region} onValueChange={setRegion}>
        <SelectTrigger>
          <SelectValue placeholder="選擇地區" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="north">北部</SelectItem>
          <SelectItem value="south">南部</SelectItem>
          <SelectItem value="east">東部</SelectItem>
          <SelectItem value="west">西部</SelectItem>
        </SelectContent>
      </Select>

      <Select value={city} onValueChange={setCity}>
        <SelectTrigger>
          <SelectValue placeholder="選擇縣市" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="taipei">台北市</SelectItem>
          <SelectItem value="kaohsiung">高雄市</SelectItem>
          <SelectItem value="taichung">台中市</SelectItem>
          {/* 可依需求增加選項 */}
        </SelectContent>
      </Select>

      <Select value={district} onValueChange={setDistrict}>
        <SelectTrigger>
          <SelectValue placeholder="選擇區域" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="xinyi">信義區</SelectItem>
          <SelectItem value="da-an">大安區</SelectItem>
          {/* 可依需求增加選項 */}
        </SelectContent>
      </Select>
    </section>
  );
};

const RentalCard = ({ title }: { title: string }) => (
  <div className="rounded-xl border p-4 shadow-sm hover:shadow-md transition bg-white">
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-sm text-neutral-600">這裡可以放租屋簡介或價格等資訊</p>
  </div>
);

const RentalList = () => {
  return (
    <main className="min-h-screen bg-neutral-50">
      <Header />
      <RegionFilter />

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-6 pb-10">
        {[...Array(20)].map((_, idx) => (
          <RentalCard key={idx} title={`租屋 ${idx + 1}`} />
        ))}
      </section>

      <div className="flex justify-center py-6">
        <Button variant="outline">載入更多</Button>
      </div>
    </main>
  );
};

export default RentalList;
