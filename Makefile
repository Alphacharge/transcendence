###			###			SOURCES			###			###
SRC_D	:=	./
SRC_F	:=	docker-compose.yml
SRC		:=	$(SRC_D)$(SRC_F)

ENV		:=	--env-file $(SRC_D).env

###			###			RULES			###			###
#Build changes or all if nothing is builded and run
all: certs
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

certs:
	if [ ! -e ./backend/backend.cert ] || [ ! -e ./backend/backend.key ] || [ ! -e ./frontend/frontend.cert ] || [ ! -e ./frontend/frontend.key ]; then \
		openssl req -newkey rsa:4096 -x509 -sha256 -days 365 -nodes -out ./backend/backend.cert -keyout ./backend/backend.key -subj "/C=DE/ST=Baden-Wuerttemberg/L=Heilbronn/O=42Heilbronn/"; \
		openssl req -newkey rsa:4096 -x509 -sha256 -days 365 -nodes -out ./frontend/frontend.cert -keyout ./frontend/frontend.key -subj "/C=DE/ST=Baden-Wuerttemberg/L=Heilbronn/O=42Heilbronn/"; \
	fi

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
