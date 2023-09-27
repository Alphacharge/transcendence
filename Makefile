###			###			SOURCES			###			###
SRC_D	:=	./
SRC_F	:=	docker-compose.yml
SRC		:=	$(SRC_D)$(SRC_F)

ENV		:=	--env-file $(SRC_D).env
DB_D	:=	./data/sql

###			###			COLORS			###			###
RED		=	\033[1;31m
GREEN	=	\033[1;32m
YELL	=	\033[1;33m
BLUE	=	\033[1;34m
WHITE	=	\033[0m

###			###			RULES			###			###
#Build changes or all if nothing is builded and run
all:
	mkdir -p $(DB_D)
	docker-compose -f $(SRC) $(ENV) up --build
	echo "$(GREEN)Build changes and/or new containers.$(WHITE)"

up: all

down: stop

#Check compose yaml file
check:
	echo "$(YELL)Check yaml file for config errors.$(WHITE)"
	docker-compose -f $(SRC) config -q

#Stop all containers
stop:
	echo "$(RED)Stopping all containers.$(WHITE)"
	docker-compose -f $(SRC) down

#force rebuilding
build:
	echo "$(BLUE)Rebuild all containers.$(WHITE)"
	docker-compose -f $(SRC) $(ENV) build
	$(MAKE) all

status:
	docker ps

clean: stop
	docker stop $(docker ps -qa) 2>/dev/null; true;
	docker rm $(docker ps -qa) 2>/dev/null; true;
	docker rmi -f $(docker images -qa) 2>/dev/null; true;
	docker volume rm $(docker volume ls -q) 2>/dev/null; true;
	docker network rm $(docker network ls -q) 2>/dev/null; true;
	echo "$(BLUE)Stopped all containers and clean images.$(WHITE)"

fclean: clean
	rm -rf $(DB_D) && mkdir -p $(DB_D); true;
	echo "$(BLUE)Cleaned sql and wordpress data.$(WHITE)"

sclean: fclean
	docker system prune -a --volumes --force
	echo "$(BLUE)Hardcleaned docker.$(WHITE)"

#stop all containers, force rebuild and start it
re: stop build all
