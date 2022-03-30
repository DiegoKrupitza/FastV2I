FROM maven:3.8-eclipse-temurin-17 as BUILDER

WORKDIR /app

COPY pom.xml /app
RUN mvn dependency:resolve

COPY ./ /app
RUN mvn package -DskipTests

FROM openjdk:17

COPY --from=BUILDER /app/target/gateway-0.0.1-SNAPSHOT.jar .

COPY ./wait-for-it.sh ./wait-for-it.sh
RUN chmod +x ./wait-for-it.sh
EXPOSE 8081

CMD [ "sh", "-c", "./wait-for-it.sh --timeout=0 ${EUREKA_SERVER_ADDRESS}:8761 -- java -jar gateway-0.0.1-SNAPSHOT.jar"]
