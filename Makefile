.PHONY: all clean rebuild debug


# Find all .org files in the src directory, excluding temporary and backup files.
ORGFILES := $(shell find src -maxdepth 1 -name "*.org" ! -name "*.tmp*" ! -name "*~")

# Convert src/foo.org to foo/index.html
HTMLFILES := $(patsubst src/%.org,%/index.html,$(ORGFILES))

all:	clean	$(HTMLFILES) 
	
%/index.html: src/%.org
	@mkdir -p $(dir $@)
	@echo "Converting: $<"
	pandoc -f org -t html5 --quiet \
	-s \
	-o $@ $<

clean:
	rm -rf $(dir $(HTMLFILES)) 

debug:
	@echo $(ORGFILES)
	@echo $(HTMLFILES)
