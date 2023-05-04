FROM gradle

WORKDIR /app

COPY ./packages/streaming .

RUN gradle dependencies

RUN gradle build

RUN tar -xvf app/build/distributions/app.tar

CMD app/build/distributions/app/bin/app
