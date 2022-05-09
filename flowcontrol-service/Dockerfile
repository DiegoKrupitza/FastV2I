FROM maven:3.8-eclipse-temurin-17 as BUILDER

WORKDIR /app

COPY pom.xml /app
RUN mvn dependency:resolve

COPY ./ /app
RUN mvn package -DskipTests

FROM openjdk:17

COPY --from=BUILDER /app/target/flowcontrol-service-0.0.1-SNAPSHOT.jar .

EXPOSE 8087

CMD [ "java" ,"-jar", "flowcontrol-service-0.0.1-SNAPSHOT.jar"]
