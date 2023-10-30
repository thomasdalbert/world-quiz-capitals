#!/bin/bash
docker build -t world-capital-quiz-img .
docker run -a stdout -a stderr -p 9111:9111 -v "$(pwd)":/app world-capital-quiz-img:latest
