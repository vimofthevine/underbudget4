FROM openjdk:8-jre

ENTRYPOINT ["java", "-jar", "/usr/share/underbudget/underbudget.jar"]

ARG JAR_FILE
COPY target/${JAR_FILE} /usr/share/underbudget/underbudget.jar

EXPOSE 9090