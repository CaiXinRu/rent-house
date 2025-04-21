import requests
from bs4 import BeautifulSoup
import json

cityIdentifiers = [
    "Taipei-city", "NewTaipei-city", "Taoyuan-city", "Hsinchu-city", "HsinchuCounty-city",
    "Keelung-city", "Taichung-city", "Changhua-city", "Miaoli-city", "Nantou-city",
    "Yunlin-city", "Kaohsiung-city", "Tainan-city", "Chiayi-city", "ChiayiCounty-city",
    "Pingtung-city", "Yilan-city", "Hualien-city", "Taitung-city", "Penghu-city", "Kinmen-city"
]

price_ranges = {
    "5000-down": "5000-down-price",
    "5000-10000": "5000-10000-price",
    "10000-20000": "10000-20000-price",
    "20000-30000": "20000-30000-price",
    "30000-40000": "30000-40000-price"
}

def fetch_page(city, price_path, page_num):
    if page_num == 1:
        url = f"https://www.sinyi.com.tw/rent/list/{city}/{price_path}/index.html"
    else:
        url = f"https://www.sinyi.com.tw/rent/list/{city}/{price_path}/{page_num}.html"

    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    res = requests.get(url, headers=headers)
    res.encoding = 'utf-8'
    return res.text

def parse_html(html):
    soup = BeautifulSoup(html, 'lxml')
    listings = []

    for item in soup.select('.search_result_item'):
        title_tag = item.select_one('.item_title')
        title = title_tag.get_text(strip=True) if title_tag else ''

        img_tag = item.select_one('.item_img img')
        image = img_tag['src'] if img_tag and img_tag.has_attr('src') else ''

        price_tag = item.select_one('.price_new .num')
        price = price_tag.get_text(strip=True) + " 元/月" if price_tag else ''

        address_tag = item.select_one('.num-text')
        address = address_tag.get_text(strip=True) if address_tag else ''

        layout_tag = item.select_one('.detail_line2 span:nth-child(4) .num')
        layout = layout_tag.get_text(strip=True) if layout_tag else ''

        floor_tag = item.select_one('.detail_line2 span:nth-child(3)')
        floor = floor_tag.get_text(strip=True) if floor_tag else ''

        size_tag = item.select_one('.detail_line2 span:nth-child(2) .num')
        size = size_tag.get_text(strip=True) + " 坪" if size_tag else ''

        listings.append({
            "title": title,
            "image": image,
            "price": price,
            "address": address,
            "layout": layout,
            "floor": floor,
            "size": size
        })

    return listings

def main():
    all_data = {}

    for city in cityIdentifiers:
        print(f"\n📍 正在抓取城市：{city}")
        city_data = {}

        for range_label, range_path in price_ranges.items():
            print(f"  💰 價格區間：{range_label}")
            range_data = []
            
            for page_num in range(1, 4):  # 最多抓 2 頁
                print(f"    ➤ 第 {page_num} 頁")
                html = fetch_page(city, range_path, page_num)
                page_data = parse_html(html)

                if not page_data:
                    print("    ⚠️ 無資料，停止此價位爬蟲。")
                    break

                range_data.extend(page_data)

                if len(range_data) >= 60:
                    range_data = range_data[:60]
                    break

            if range_data:
                city_data[range_label] = range_data
            else:
                print(f"    ❌ {range_label} 無任何房源。")

        if city_data:
            all_data[city] = city_data

    with open('sinyi_rent_by_price.json', 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)

    print("\n✅ 所有資料抓取完成，已儲存為 sinyi_rent_by_price.json")

if __name__ == "__main__":
    main()
