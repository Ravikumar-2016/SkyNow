<h1 align="center">🌤️ SkyNow</h1>
<p align="center">
  <i>Real-time Weather Forecasts & Alerts</i><br>
  <b>Accurate • Reliable • Fast</b>
</p>

<p align="center">
  <a href="https://sky-now-three.vercel.app/">
    <img src="https://img.shields.io/badge/VISIT%20SITE-0078D7?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Visit Site" />
  </a>
  <a href="https://github.com/Ravikumar-2016">
    <img src="https://img.shields.io/badge/GitHub-000000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
</p>

---

## 🌎 Overview
**SkyNow** is a modern weather web application that provides **real-time weather forecasts, hourly updates, and 5-day predictions** using data from **OpenWeather API** and **Weather.com API**.  
It helps users stay informed with **live conditions, temperature trends, and sunrise/sunset timings** in a clean and minimal interface.

---

## ✨ Features
- 🌤️ **Current Weather** – Real-time temperature, humidity, pressure & wind data  
- 📅 **5-Day Forecast** – Extended outlook with accurate daily trends  
- 🕒 **24-Hour Forecast** – Hour-by-hour weather predictions  
- 🌅 **Sunrise & Sunset Timings** – For any city worldwide  
- 🧭 **Location-based Search** – Search instantly by city name  
- 🧩 **Responsive Design** – Works seamlessly across devices  

---

## 🚀 Live Demo
👉 [**Visit SkyNow**](https://sky-now-three.vercel.app/)  
Experience real-time forecasts and alerts directly in your browser.

---

## 🧠 Tech Stack
| Category | Technologies Used |
|-----------|-------------------|
| **Frontend** | Next.js (TypeScript), React, CSS |
| **API** | OpenWeatherMap API, Weather.com API |
| **Styling** | Tailwind CSS |
| **Hosting** | Vercel |
| **Utilities** | Axios, date-fns, dotenv |

---

## 🛠️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Ravikumar-2016/SkyNow.git
cd SkyNow
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Configure API keys

Create a file named **.env.local** in the root directory and add:

```bash
NEXT_PUBLIC_WEATHER_API_KEY=your_openweather_api_key
NEXT_PUBLIC_WEATHERCOM_API_KEY=your_weathercom_api_key
```

> You can get your API keys from [OpenWeatherMap](https://openweathermap.org/api) and [Weather.com Developer Portal](https://weather.com/swagger-docs/ui/sun/v3/sunV3AlertsWeather).

### 4️⃣ Run the development server

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) to view it in your browser.

---

## 📁 Folder Structure

```
SkyNow/
 ┣ public/
 ┣ src/
 ┃ ┣ app/
 ┃ ┃ ┣ api/
 ┃ ┃ ┃ ┗ forecast/
 ┃ ┃ ┃ ┃ ┗ route.ts
 ┃ ┃ ┣ weather/
 ┃ ┃ ┃ ┗ page.tsx
 ┃ ┃ ┣ layout.tsx
 ┃ ┃ ┗ globals.css
 ┃ ┣ components/
 ┃ ┃ ┗ header.tsx
 ┃ ┗ lib/
 ┃ ┃ ┗ utils.ts
 ┣ .env.local
 ┣ package.json
 ┣ README.md
 ┗ tsconfig.json
```

---

## 🧩 Example

**Search by City:**
Type “Delhi”, “London”, or “New York” to view live forecasts.
SkyNow displays:

* Current temperature & conditions
* Feels-like temperature
* Sunrise/Sunset
* Hourly & 5-day forecast

---

## 💡 Future Enhancements

* 🌍 Multi-language support
* 🧠 AI-based forecast insights
* 📱 Progressive Web App (PWA) support
* ⚙️ Dark/Light mode toggle

---

<p align="center">
  <b>Stay Ahead of the Weather — With SkyNow 🌦️</b>
</p>
