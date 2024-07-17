import requests
import time

api_key = '4e9fa7b13fea248f88d90d7085e696031bd3ea8de9ed44c784bb1bb39ad9e2b9'
urls = [
    "pizzahutonline.hn",
    "token.rubiconproject.com",
    # Agrega hasta 16000 URLs
]

url = 'https://www.virustotal.com/vtapi/v2/url/scan'
headers = {
    "x-apikey": api_key
}

def analyze_urls(urls, batch_size=4, sleep_time=15):
    results = []
    for i in range(0, len(urls), batch_size):
        batch = urls[i:i + batch_size]
        for u in batch:
            params = {'apikey': api_key, 'url': u}
            response = requests.post(url, headers=headers, params=params)
            if response.status_code == 200:
                results.append(response.json())
            else:
                print(f"Error analyzing {u}: {response.status_code}")
        time.sleep(sleep_time)
    return results

results = analyze_urls(urls)

with open("resultados.json", "w") as f:
    import json
    json.dump(results, f)