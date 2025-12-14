.PHONY: all clean fclean re down restart
# .SILENT:

# **************************************************************************** #
#                                   Variable                                   #
# **************************************************************************** #

NAME	= camagru
DC		= docker compose

# **************************************************************************** #
#                                     Rules                                    #
# **************************************************************************** #

all: $(NAME)

$(NAME):
	mkdir -p db/ images/pictures images/superposables
	rm -f db/mysql.sock
	$(DC) up --build

down:
	$(DC) down

stop:
	$(DC) stop

restart: down all

clean:
	$(DC) down --volumes --rmi all

fclean: clean
	docker system prune --force --all;

re: fclean all
