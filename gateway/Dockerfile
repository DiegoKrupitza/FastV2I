FROM maven:3.8-eclipse-temurin-17 as BUILDER

WORKDIR /app

COPY pom.xml /app
RUN mvn dependency:resolve

COPY ./ /app
RUN mvn package -DskipTests

FROM openjdk:17

COPY --from=BUILDER /app/target/gateway-0.0.1-SNAPSHOT.jar .

EXPOSE 8081

ENTRYPOINT ["java","-jar","gateway-0.0.1-SNAPSHOT.jar"]
