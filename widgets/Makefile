OUTPUT = ../compiled

all: clean
	# Building
	@@ls -l | grep '^d' | awk '{ print $$NF;}' | \
	  while read REPLY; do \
	    echo "Making all in $$REPLY"; \
	    if ! $(MAKE) -C "$$REPLY" all; then \
              break; \
            fi; \
	  done

clean:
	# Removing destination directory
	@@rm -rf ${OUTPUT}

	@@ls -l | grep '^d' | awk '{ print $$NF;}' | \
	  while read REPLY; do \
	    echo "Making clean in $$REPLY"; \
	    if ! $(MAKE) -C "$$REPLY" clean; then \
              break; \
            fi; \
	  done
