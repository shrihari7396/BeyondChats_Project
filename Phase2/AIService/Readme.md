````md
# AI Service – Setup & Installation Guide

This document explains **only the setup and installation steps** required to run this Spring Boot–based AI Service locally.

---

## 1. Required Software

Make sure the following software is installed on your system **before running the project**.

### 1. Java (Mandatory)
- **Java Version:** Java 21  
- Verify installation:
```bash
java -version
````

If not installed (Ubuntu):

```bash
sudo apt update
sudo apt install openjdk-21-jdk
```

---

### 2. Maven (Mandatory)

* **Apache Maven 3.9+**
* Verify installation:

```bash
mvn -version
```

If not installed:

```bash
sudo apt install maven
```

---

### 3. Ollama (Mandatory – AI Backend)

This project depends on **Ollama** to run local LLM models.

#### Install Ollama

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Verify:

```bash
ollama --version
```

#### Pull Required Model

The project is configured to use:

```yaml
ollama:
  model: llama3.2:latest
```

Pull the model:

```bash
ollama pull llama3.2:latest
```

Start Ollama server:

```bash
ollama serve
```

Ollama must be running on:

```
http://localhost:11434
```

---

### 4. IDE (Recommended)

Any Java IDE works, recommended:

* IntelliJ IDEA (Community / Ultimate)

---

## 2. Project Configuration

### application.yml

Ensure the following values are correct:

```yaml
server:
  port: 8082
  servlet:
    context-path: /api/v1

ollama:
  base-url: http://localhost:11434
  model: llama3.2:latest
```

---

## 3. Build the Project

From the project root directory:

```bash
mvn clean install
```

---

## 4. Run the Application

### Option 1: Using Maven

```bash
mvn spring-boot:run
```

### Option 2: Using JAR

```bash
java -jar target/AIService-*.jar
```

---

## 5. Verify Application is Running

* Application Port: **8082**
* Context Path: **/api/v1**

Base URL:

```
http://localhost:8082/api/v1
```

AI Endpoint:

```
POST http://localhost:8082/api/v1/ai/genrate
```

---

## 6. Common Checks Before Testing

* ✅ Java 21 installed
* ✅ Maven installed
* ✅ Ollama running
* ✅ Model pulled successfully
* ✅ Port 8082 is free

---

## 7. Stop Services

Stop Spring Boot:

```bash
Ctrl + C
```

Stop Ollama:

```bash
Ctrl + C
```

---

✅ Setup complete. The AI Service is now ready to use.

```
```
