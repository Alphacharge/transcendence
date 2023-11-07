###			###			SOURCES			###			###
SRC_D	:=	./
SRC_F	:=	docker-compose.yml
SRC		:=	$(SRC_D)$(SRC_F)

ENV		:=	--env-file $(SRC_D).env
DB_D	:=	./data/sql
OS		:=	$(shell uname)
IP		:=	$(shell ifconfig | grep 'inet 10' | cut -d' ' -f2)

###			###			COLORS			###			###
RED		=	\033[1;31m
GREEN	=	\033[1;32m
YELL	=	\033[1;33m
BLUE	=	\033[1;34m
WHITE	=	\033[0m

###			###			SECURITY		###			###
ifndef CONFIRM
  CONFIRM_MESSAGE := "$(WHITE)Are you sure you want to continue? This will $(RED)DELETE ALL configs and databases!$(WHITE) (Write 'CONFIRM=1 make sclean' to continue.)"
endif

###			###			RULES			###			###
#Build changes or all if nothing is builded and run
all: ip
	@mkdir -p backend frontend data $(DB_D) data/myadmin data/mysql data/pgadmin
ifeq ($(OS), Darwin)
	-@bash -c "chmod 600 data/pgadmin/pgadmin4.db || chown -R ${USER}:2021_heilbronn data/pgadmin"
else
	-@bash -c "chmod 600 data/pgadmin/pgadmin4.db || sudo chown -R 5050:5050 data/pgadmin"
endif
	docker-compose -f $(SRC) $(ENV) up
	@echo "$(GREEN)Build changes and/or new containers.$(WHITE)"

postgre:
	@mkdir -p $(DB_D)/pg_notify $(DB_D)/pg_tblspc $(DB_D)/pg_replslot $(DB_D)/pg_twophase $(DB_D)/pg_snapshots $(DB_D)/pg_logical/snapshots $(DB_D)/pg_logical/mappings $(DB_D)/pg_commit_ts

ip:
ifeq ($(OS), Darwin)
	sed -i '' 's/^VUE_APP_BACKEND_IP=.*/VUE_APP_BACKEND_IP=$(IP)/' ./frontend/.env
else
	sed -i -e 's/^VUE_APP_BACKEND_IP=.*/VUE_APP_BACKEND_IP=127.0.0.1/' ./frontend/.env
endif

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
	@-docker stop $$(docker ps -qa)
	@-docker rm $$(docker ps -qa)
	@-docker rmi -f $$(docker images -qa)
	@-docker volume rm $$(docker volume ls -q)
	@-docker network rm $$(docker network ls -q)

fclean: clean
	@rm -rf ./frontend/node_modules
	@rm -rf ./backend/node_modules
	@-@docker system prune -a --volumes --force
	@echo "$(BLUE)Hardcleaned docker.$(WHITE)"

sclean: fclean
ifdef CONFIRM
	@echo "$(YELL)Continuing with the operation...$(WHITE)"
	-@sudo rm -rf $(DB_D) && mkdir -p $(DB_D); true;
	@echo "$(BLUE)Cleaned all data.$(WHITE)"
else
	@echo $(CONFIRM_MESSAGE)
endif

#stop all containers, force rebuild and start it
re: stop fclean all
