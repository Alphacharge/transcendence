###			###			SOURCES			###			###
SRC_D	:=	./
SRC_F	:=	docker-compose.yml
SRC		:=	$(SRC_D)$(SRC_F)

ENV		:=	--env-file $(SRC_D).env

###			###			RULES			###			###
#Build changes or all if nothing is builded and run
all:
	docker-compose -f $(SRC) $(ENV) up --build

up: all

down: stop

#Check compose yaml file
check:
	docker-compose -f $(SRC) config -q

#Stop all containers
stop:
	-docker-compose -f $(SRC) down

#force rebuilding
build:
	docker-compose -f $(SRC) $(ENV) build
	$(MAKE) all

status:
	docker ps

clean: stop
	-docker stop $$(docker ps -qa)
	-docker rm $$(docker ps -qa)
	-docker rmi -f $$(docker images -qa)
	-docker volume rm $$(docker volume ls -q)
	-docker network rm $$(docker network ls -q)

fclean: clean
	rm -rf $(DB_D); true;

sclean: fclean
	docker system prune -a --volumes --force

#stop all containers, force rebuild and start it
re: stop build all
