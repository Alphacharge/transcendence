###			###			SOURCES			###			###
SRC_D	:=	./
SRC_F	:=	docker-compose.yml
SRC		:=	$(SRC_D)$(SRC_F)

ENV		:=	--env-file $(SRC_D).env
DB_D	:=	./data/sql
OS		:=	$(shell uname)

# Rule for MacOs @home or everybody else
ifeq ($(USER), marius)
	IP:=$(shell ifconfig | grep 'inet' | head -n5 | tail -n1 | cut -d' ' -f2)
else
	IP:=$(shell ifconfig | grep 'inet 10' | cut -d' ' -f2)
endif

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
all: ip certs
	@mkdir -p backend frontend data $(DB_D) data/pgadmin
ifeq ($(OS), Darwin)
	-@bash -c "chmod 600 data/pgadmin/pgadmin4.db || chown -R ${USER}:2021_heilbronn data/pgadmin"
else
	-@bash -c "sudo chmod 600 data/pgadmin/pgadmin4.db || sudo chown -R 5050:5050 data/pgadmin"
endif
	@echo "$(RED)##########################################\n$(WHITE)"
	@echo "$(BLUE)Server IP is: $(YELL)$(IP)$(WHITE)\n"
	@echo "$(RED)##########################################\n$(WHITE)"
	-@docker-compose -f $(SRC) $(ENV) up --build

postgre:
	-@mkdir -p $(DB_D)/pg_notify $(DB_D)/pg_tblspc $(DB_D)/pg_replslot $(DB_D)/pg_twophase $(DB_D)/pg_snapshots $(DB_D)/pg_logical/snapshots $(DB_D)/pg_logical/mappings $(DB_D)/pg_commit_ts

#replace IP in the .env file with the determined one
ip:
ifeq ($(OS), Darwin)
	-@sed -i '' 's/^VUE_APP_SERVER_IP=.*/VUE_APP_SERVER_IP=$(IP)/' .env
else
	-@sed -i -e 's/^VUE_APP_SERVER_IP=.*/VUE_APP_SERVER_IP=127.0.0.1/' .env
endif

#create https certificates
certs:
	@if [ ! -e ./certificate.cert ] || [ ! -e ./certificate.key ] ; then \
		openssl req -newkey rsa:4096 -x509 -sha256 -days 365 -nodes -out ./certificate.cert -keyout ./certificate.key -subj "/C=DE/ST=Baden-Wuerttemberg/L=Heilbronn/O=42Heilbronn/"; \
	fi

up: all

down: stop

#Check compose yaml file
check:
	docker-compose -f $(SRC) config -q

#Stop all containers
stop:
	-docker-compose -f $(SRC) down

help:
	@echo "$(BLUE)Manpage for this transcendence project.$(WHITE)\n"
	@echo "\tmake\t$(GREEN)[OPTION]$(WHITE)\n"
	@echo "\t\t$(YELL)[help]$(WHITE)\t\tPrints this help.\n"
	@echo "\t\t$(YELL)[],[all],[up]$(WHITE)\tCompiles the project.\n"
	@echo "\t\t$(YELL)[down],[stop]$(WHITE)\tShutdown the servers.\n"
	@echo "\t\t$(YELL)[check]$(WHITE)\t\tChecks the compose.yml for errors.\n"
	@echo "\t\t$(YELL)[status]$(WHITE)\tShows the status of the containers.\n"
	@echo "\t\t$(YELL)[clean]$(WHITE)\t\tStops and removes all containers, images, volumes and networks.\n"
	@echo "\t\t$(YELL)[fclean]$(WHITE)\tLike [clean] plus removes the node modules.\n"
	@echo "\t\t$(YELL)[sclean]$(WHITE)\tLike [fclean] plus removes the database.\n"
	@echo "\t\t$(YELL)[re]$(WHITE)\t\t[fclean] plus [all].\n"

status:
	docker ps

clean: stop
	-@docker stop $$(docker ps -qa)
	-@docker rm $$(docker ps -qa)
	-@docker rmi -f $$(docker images -qa)
	-@docker volume rm $$(docker volume ls -q)
	-@docker network rm $$(docker network ls -q)

fclean: clean
	-@rm -rf ./frontend/node_modules
	-@rm -rf ./backend/node_modules
	-@docker system prune -a --volumes --force
	@echo "$(BLUE)Hardcleaned docker.$(WHITE)"

sclean: fclean
ifdef CONFIRM
	@echo "$(YELL)Continuing with the operation...$(WHITE)"
	-sudo rm -rf $(DB_D) && mkdir -p $(DB_D); true;
	@echo "$(BLUE)Cleaned all data.$(WHITE)"
else
	@echo $(CONFIRM_MESSAGE)
endif

#stop all containers, force rebuild and start it
re: fclean all

.phony: sclean fclean clean status help stop certs build check down up ip postgre
