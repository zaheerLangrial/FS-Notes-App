FROM node

COPY . .

RUN npm i

RUN npm run build

CMD ["npm", "run", "preview", "--", "--host"]