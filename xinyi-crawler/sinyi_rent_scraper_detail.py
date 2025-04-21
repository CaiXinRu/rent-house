import requests
from bs4 import BeautifulSoup
import json
import re
import time

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

headers = {
    "User-Agent": "Mozilla/5.0"
}

def fetch_page(city, price_path, page_num):
    if page_num == 1:
        url = f"https://www.sinyi.com.tw/rent/list/{city}/{price_path}/index.html"
    else:
        url = f"https://www.sinyi.com.tw/rent/list/{city}/{price_path}/{page_num}.html"

    res = requests.get(url, headers=headers)
    res.encoding = 'utf-8'
    return res.text

def fetch_detail(houseno):
    url = f"https://www.sinyi.com.tw/rent/houseno/{houseno}"
    headers = {
        "User-Agent": "Mozilla/5.0"
    }
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, "html.parser")

    # 圖片
    image_tags = soup.select("div.product-display li img")
    images = [img['data-big'] for img in image_tags if img.get('data-big')]

    # 經紀人
    broker_box = soup.select_one("div.contact-broker-box")
    broker_name = broker_box.select_one("span:nth-of-type(2)").text.strip() if broker_box else ""
    broker_phone = broker_box.select_one("h2").text.strip() if broker_box else ""

    # 傢俱設備（打勾的）
    furniture_items = []
    for ul in soup.select("ul.furniture"):
        for li in ul.select("li"):
            if li.select_one("input[checked]"):
                label = li.select_one("label")
                if label:
                    text = ''.join(span.text.strip() for span in label.select("span") if span.text.strip())
                    furniture_items.append(text)

    return {
        "images": images,
        "broker": {
            "name": broker_name,
            "phone": broker_phone
        },
        "furniture": furniture_items
    }

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

        link_tag = item.select_one("a")
        href = link_tag['href'] if link_tag else ""
        houseno = href.split("/")[-1] if "houseno" in href else None
        if not houseno:
            continue

        # 預設基本資訊
        listing = {
            "title": title,
            "image": image,
            "price": price,
            "address": address,
            "layout": layout,
            "floor": floor,
            "size": size,
            "source": "信義房屋"
        }

        # 若能抓到詳細頁，就補充詳細資料
        if houseno:
            try:
                detail_info = fetch_detail(houseno)
                listing.update(detail_info)
                time.sleep(0.8)  # 避免過快被封鎖
            except Exception as e:
                print(f"    ⚠️ 詳細頁抓取失敗：{e}")

        listings.append(listing)

    return listings

def main():
    all_data = {}

    for city in cityIdentifiers:
        print(f"\n📍 正在抓取城市：{city}")
        city_data = {}

        for range_label, range_path in price_ranges.items():
            print(f"  💰 價格區間：{range_label}")
            range_data = []

            for page_num in range(1, 4):  # 最多抓前 3 頁
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

    with open('sinyi_rent_with_detail.json', 'w', encoding='utf-8') as f:
        json.dump(all_data, f, ensure_ascii=False, indent=2)

    print("\n✅ 所有資料抓取完成，已儲存為 sinyi_rent_with_detail.json")

if __name__ == "__main__":
    main()
