CC = gcc
CFLAGS = -Wall -Wextra -O2 -g -I/opt/homebrew/include
LDFLAGS = -L/opt/homebrew/lib -lusb-1.0 -lpthread
TARGET = usb_regtool

all: $(TARGET)

$(TARGET): usb_regtool.c
	$(CC) $(CFLAGS) -o $@ $< $(LDFLAGS)

debug: CFLAGS += -DDEBUG -fsanitize=address
debug: LDFLAGS += -fsanitize=address -lpthread
debug: clean $(TARGET)

clean:
	rm -f $(TARGET)

.PHONY: all debug clean
