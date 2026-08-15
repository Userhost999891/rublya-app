# ============================================================
#  Rublya — obraz do wdrożenia
#
#  Node 24, bo od tej wersji SQLite jest w standardzie i aplikacja
#  nie potrzebuje ani jednej paczki z npm. Stąd brak `npm install`
#  i brak warstwy z zależnościami — obraz to praktycznie sam kod.
#
#  Baza leży w /data, a nie w folderze aplikacji. To musi być dysk
#  trwały podpięty przez hosting: katalog obrazu jest kasowany przy
#  każdym wdrożeniu i konta zniknęłyby razem z nim.
# ============================================================

FROM node:24-alpine

WORKDIR /app

# Kopiujemy całość — projekt nie ma etapu budowania ani zależności
COPY . .

# Ścieżka bazy poza kodem aplikacji, na dysku trwałym
ENV RP_DB=/data/rublya.db
ENV PORT=8080
ENV NODE_ENV=production

EXPOSE 8080

# Katalog na bazę musi istnieć, zanim wystartuje serwer — przy pierwszym
# uruchomieniu wolumen bywa pusty
CMD ["sh", "-c", "mkdir -p /data && node server/server.js"]
