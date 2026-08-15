# ============================================================
#  Rublya — obraz do wdrożenia
#
#  Dane leżą w zewnętrznym MySQL, więc obraz jest bezstanowy: można go
#  wyrzucić i odtworzyć w dowolnej chwili, nic się nie traci. Stąd brak
#  wolumenów i brak katalogu na bazę.
#
#  Hasła do bazy w obrazie NIE MA. Przychodzi zmienną środowiskową
#  MYSQL_URL, ustawianą w panelu hostingu.
# ============================================================

FROM node:22-alpine

WORKDIR /app

# Zależności osobno od kodu: dopóki package.json się nie zmienia,
# ta warstwa zostaje w pamięci podręcznej i kolejne wdrożenia są szybsze.
COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["node", "server/server.js"]
