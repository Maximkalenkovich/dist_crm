# Bitrix24 CRM Demo (Vue 3)

Пет-проект для собеседования: кастомные CRM-интерфейсы под Bitrix24.

## Важно

- Локально (`npm run dev`) = mock-данные  
- Внутри твоего Bitrix24 (через локальное приложение + ngrok/хостинг) = **живые сделки CRM** через `BX24`

Полная инструкция встройки: [`BITRIX_SETUP.md`](./BITRIX_SETUP.md)

## Что показать на собесе

1. **CRM сделки** — список и карточка сделки  
2. **Проверка адреса** + история обращений + синк с биллингом  
3. **Портал монтажника** — статусы, фотоотчёт, мобильная вёрстка  
4. **Карта покрытия** — зоны и проверка адреса  
5. **Архитектура**: `api/` (слой как REST) → `stores/` (Pinia) → `views/` (lazy routes)

## Стек

Vue 3 (`<script setup>`), TypeScript, Pinia, Vue Router, Vite, Tailwind CSS, Docker

## Запуск

```bash
cd bitrix-crm-demo
npm install
npm run dev
```

Сборка:

```bash
npm run build
npm run preview
```

Docker:

```bash
docker build -t bitrix-crm-demo .
docker run --rm -p 8080:80 bitrix-crm-demo
```

## Как говорить на собесе

> Это демо архитектуры, которую я использовал вокруг Bitrix24: SPA-виджеты на Vue, Pinia-стор, отдельный API-слой. Сейчас данные mock, на проде слой `crmApi.ts` ходит в Bitrix REST (`crm.deal.*`, вебхук). Карта — demo-адаптер; в бою подключался Yandex Maps API.

## Что можно добавить дальше

- Реальный вебхук Bitrix24 вместо mock  
- `BX24` placement для встраивания в карточку сделки  
- GitHub Actions: build + deploy preview
