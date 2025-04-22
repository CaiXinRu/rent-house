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

type District = {
  name: string;
  value: string;
};

type City = {
  name: string;
  districts: District[];
};

type Region = {
  name: string;
  cities: {
    [key: string]: City;
  };
};

// 台灣地區數據結構
const taiwanRegions: Record<string, Region> = {
  north: {
    name: "北部",
    cities: {
      taipei: {
        name: "台北市",
        districts: [
          { value: "da-an", name: "大安區" },
          { value: "xinyi", name: "信義區" },
          { value: "songshan", name: "松山區" },
          { value: "zhongshan", name: "中山區" },
          { value: "datong", name: "大同區" },
          { value: "wanhua", name: "萬華區" },
          { value: "shilin", name: "士林區" },
          { value: "beitou", name: "北投區" },
          { value: "neihu", name: "內湖區" },
          { value: "nangang", name: "南港區" },
          { value: "wenshan", name: "文山區" },
        ],
      },
      newTaipei: {
        name: "新北市",
        districts: [
          { value: "banqiao", name: "板橋區" },
          { value: "xinzhuang", name: "新莊區" },
          { value: "zhonghe", name: "中和區" },
          { value: "yonghe", name: "永和區" },
          { value: "tucheng", name: "土城區" },
          { value: "luzhou", name: "蘆洲區" },
          { value: "xindian", name: "新店區" },
          { value: "tamsui", name: "淡水區" },
          { value: "sanzhong", name: "三重區" },
          { value: "xizhi", name: "汐止區" },
        ],
      },
      keelung: {
        name: "基隆市",
        districts: [
          { value: "ren-ai", name: "仁愛區" },
          { value: "xinyi", name: "信義區" },
          { value: "zhongzheng", name: "中正區" },
          { value: "zhongshan", name: "中山區" },
          { value: "anle", name: "安樂區" },
          { value: "nuannuan", name: "暖暖區" },
          { value: "qidu", name: "七堵區" },
        ],
      },
      taoyuan: {
        name: "桃園市",
        districts: [
          { value: "taoyuan", name: "桃園區" },
          { value: "zhongli", name: "中壢區" },
          { value: "daxi", name: "大溪區" },
          { value: "yangmei", name: "楊梅區" },
          { value: "luzhu", name: "蘆竹區" },
          { value: "guishan", name: "龜山區" },
          { value: "bade", name: "八德區" },
          { value: "longtan", name: "龍潭區" },
          { value: "pingzhen", name: "平鎮區" },
          { value: "dayuan", name: "大園區" },
        ],
      },
      hsinchu: {
        name: "新竹市",
        districts: [
          { value: "east", name: "東區" },
          { value: "north", name: "北區" },
          { value: "xiangshan", name: "香山區" },
        ],
      },
      hsinchuCounty: {
        name: "新竹縣",
        districts: [
          { value: "zhubei", name: "竹北市" },
          { value: "zhudong", name: "竹東鎮" },
          { value: "xinpu", name: "新埔鎮" },
          { value: "guanxi", name: "關西鎮" },
          { value: "hukou", name: "湖口鄉" },
          { value: "xinfeng", name: "新豐鄉" },
        ],
      },
      yilan: {
        name: "宜蘭縣",
        districts: [
          { value: "yilan", name: "宜蘭市" },
          { value: "luodong", name: "羅東鎮" },
          { value: "suao", name: "蘇澳鎮" },
          { value: "toucheng", name: "頭城鎮" },
          { value: "jiaoxi", name: "礁溪鄉" },
          { value: "zhuangwei", name: "壯圍鄉" },
        ],
      },
    },
  },
  central: {
    name: "中部",
    cities: {
      taichung: {
        name: "台中市",
        districts: [
          { value: "central", name: "中區" },
          { value: "east", name: "東區" },
          { value: "south", name: "南區" },
          { value: "west", name: "西區" },
          { value: "north", name: "北區" },
          { value: "xitun", name: "西屯區" },
          { value: "nantun", name: "南屯區" },
          { value: "beitun", name: "北屯區" },
          { value: "fengyuan", name: "豐原區" },
          { value: "dali", name: "大里區" },
          { value: "taiping", name: "太平區" },
        ],
      },
      changhua: {
        name: "彰化縣",
        districts: [
          { value: "changhua", name: "彰化市" },
          { value: "yuanlin", name: "員林市" },
          { value: "hualien", name: "花壇鄉" },
          { value: "xiushui", name: "秀水鄉" },
          { value: "lukang", name: "鹿港鎮" },
          { value: "hsiang", name: "和美鎮" },
        ],
      },
      nantou: {
        name: "南投縣",
        districts: [
          { value: "nantou", name: "南投市" },
          { value: "caotun", name: "草屯鎮" },
          { value: "puli", name: "埔里鎮" },
          { value: "jiji", name: "集集鎮" },
          { value: "shuili", name: "水里鄉" },
          { value: "yuchi", name: "魚池鄉" },
        ],
      },
      yunlin: {
        name: "雲林縣",
        districts: [
          { value: "douliu", name: "斗六市" },
          { value: "huwei", name: "虎尾鎮" },
          { value: "dounan", name: "斗南鎮" },
          { value: "tuku", name: "土庫鎮" },
          { value: "beigang", name: "北港鎮" },
          { value: "linnei", name: "林內鄉" },
        ],
      },
    },
  },
  south: {
    name: "南部",
    cities: {
      tainan: {
        name: "台南市",
        districts: [
          { value: "central", name: "中西區" },
          { value: "east", name: "東區" },
          { value: "south", name: "南區" },
          { value: "north", name: "北區" },
          { value: "anping", name: "安平區" },
          { value: "annan", name: "安南區" },
          { value: "yongkang", name: "永康區" },
          { value: "rende", name: "仁德區" },
          { value: "guiren", name: "歸仁區" },
          { value: "xinhua", name: "新化區" },
        ],
      },
      kaohsiung: {
        name: "高雄市",
        districts: [
          { value: "xinxing", name: "新興區" },
          { value: "qianjin", name: "前金區" },
          { value: "lingya", name: "苓雅區" },
          { value: "yancheng", name: "鹽埕區" },
          { value: "gushan", name: "鼓山區" },
          { value: "qijin", name: "旗津區" },
          { value: "qianzhen", name: "前鎮區" },
          { value: "sanmin", name: "三民區" },
          { value: "nanzi", name: "楠梓區" },
          { value: "xiaogang", name: "小港區" },
          { value: "zuoying", name: "左營區" },
          { value: "renwu", name: "仁武區" },
        ],
      },
      pingtung: {
        name: "屏東縣",
        districts: [
          { value: "pingtung", name: "屏東市" },
          { value: "chaozhou", name: "潮州鎮" },
          { value: "donggang", name: "東港鎮" },
          { value: "hengchun", name: "恆春鎮" },
          { value: "wanluan", name: "萬巒鄉" },
          { value: "neipu", name: "內埔鄉" },
        ],
      },
      chiayi: {
        name: "嘉義市",
        districts: [
          { value: "east", name: "東區" },
          { value: "west", name: "西區" },
        ],
      },
      chiayiCounty: {
        name: "嘉義縣",
        districts: [
          { value: "taibao", name: "太保市" },
          { value: "puzi", name: "朴子市" },
          { value: "budai", name: "布袋鎮" },
          { value: "dalin", name: "大林鎮" },
          { value: "minxiong", name: "民雄鄉" },
          { value: "xikou", name: "溪口鄉" },
        ],
      },
    },
  },
  east: {
    name: "東部",
    cities: {
      hualien: {
        name: "花蓮縣",
        districts: [
          { value: "hualien", name: "花蓮市" },
          { value: "fenglin", name: "鳳林鎮" },
          { value: "yuli", name: "玉里鎮" },
          { value: "xincheng", name: "新城鄉" },
          { value: "ji-an", name: "吉安鄉" },
          { value: "shoufeng", name: "壽豐鄉" },
        ],
      },
      taitung: {
        name: "台東縣",
        districts: [
          { value: "taitung", name: "台東市" },
          { value: "chenggong", name: "成功鎮" },
          { value: "guanshan", name: "關山鎮" },
          { value: "beinan", name: "卑南鄉" },
          { value: "luye", name: "鹿野鄉" },
          { value: "chishang", name: "池上鄉" },
        ],
      },
    },
  },
  islands: {
    name: "離島",
    cities: {
      penghu: {
        name: "澎湖縣",
        districts: [
          { value: "magu", name: "馬公市" },
          { value: "huxi", name: "湖西鄉" },
          { value: "baisha", name: "白沙鄉" },
          { value: "xiyu", name: "西嶼鄉" },
          { value: "wang-an", name: "望安鄉" },
          { value: "qimei", name: "七美鄉" },
        ],
      },
      kinmen: {
        name: "金門縣",
        districts: [
          { value: "jincheng", name: "金城鎮" },
          { value: "jinhu", name: "金湖鎮" },
          { value: "jinsha", name: "金沙鎮" },
          { value: "jinning", name: "金寧鄉" },
          { value: "lieyu", name: "烈嶼鄉" },
          { value: "wujiang", name: "烏坵鄉" },
        ],
      },
      lianjiang: {
        name: "連江縣",
        districts: [
          { value: "nangan", name: "南竿鄉" },
          { value: "beigan", name: "北竿鄉" },
          { value: "juguang", name: "莒光鄉" },
          { value: "dongyin", name: "東引鄉" },
        ],
      },
    },
  },
};

const RegionFilter = () => {
  const [region, setRegion] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [district, setDistrict] = useState<string>("");

  // 當地區改變時，重置城市和區域
  const handleRegionChange = (value: string) => {
    setRegion(value);
    setCity("");
    setDistrict("");
  };

  // 當城市改變時，重置區域
  const handleCityChange = (value: string) => {
    setCity(value);
    setDistrict("");
  };

  // 獲取當前可選的城市列表
  const getAvailableCities = () => {
    if (!region) return [];
    return Object.entries(taiwanRegions[region].cities).map(([key, city]) => ({
      value: key,
      name: city.name,
    }));
  };

  // 獲取當前可選的區域列表
  const getAvailableDistricts = () => {
    if (!region || !city) return [];
    const selectedRegion = taiwanRegions[region];
    const selectedCity = selectedRegion.cities[city];
    return selectedCity?.districts || [];
  };

  return (
    <section className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
      <Select value={region} onValueChange={handleRegionChange}>
        <SelectTrigger>
          <SelectValue placeholder="選擇地區" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(taiwanRegions).map(([value, region]) => (
            <SelectItem key={value} value={value}>
              {region.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={city} onValueChange={handleCityChange} disabled={!region}>
        <SelectTrigger>
          <SelectValue placeholder="選擇縣市" />
        </SelectTrigger>
        <SelectContent>
          {getAvailableCities().map((city) => (
            <SelectItem key={city.value} value={city.value}>
              {city.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={district} onValueChange={setDistrict} disabled={!city}>
        <SelectTrigger>
          <SelectValue placeholder="選擇區域" />
        </SelectTrigger>
        <SelectContent>
          {getAvailableDistricts().map((district) => (
            <SelectItem key={district.value} value={district.value}>
              {district.name}
            </SelectItem>
          ))}
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
