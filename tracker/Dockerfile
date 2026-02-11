# ЭТАП 1: Сборка (используем Maven)
# Мы берем образ с Java и Maven, чтобы собрать наш .jar файл прямо в облаке
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# Копируем файл настроек Maven и скачиваем зависимости
# Это делается отдельно, чтобы ускорить последующие сборки
COPY pom.xml .
RUN mvn dependency:go-offline

# Копируем исходный код проекта
COPY src ./src

# Собираем проект, пропуская тесты (чтобы билд прошел быстрее)
RUN mvn clean package -DskipTests

# ЭТАП 2: Запуск (используем легкий образ только с Java)
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Копируем только готовый скомпилированный файл из первого этапа
COPY --from=build /app/target/*.jar app.jar

# Открываем порт 8080 (стандарт для Spring Boot)
EXPOSE 8080

# Команда, которая запустит твое приложение
ENTRYPOINT ["java", "-jar", "app.jar"]