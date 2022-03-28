FROM gradle:7.4.1 AS BUILDER

WORKDIR /app/

# Copy dependency-related files
COPY build.gradle settings.gradle /app/

# Copy all files
COPY ./ /app/

RUN gradle clean build -x test --no-daemon > /dev/null 2>&1 || true

FROM openjdk:17

COPY --from=BUILDER /app/build/libs/eureka-service-0.0.1-SNAPSHOT.jar .

ENTRYPOINT [ \
    "java", \
    "-jar", \
    "eureka-service-0.0.1-SNAPSHOT.jar" \
]