.PHONY: all clean rebuild debug

# Find all .org files in the src directory, excluding temporary and backup files.
ORGFILES := $(shell find src -maxdepth 1 -name "*.org" ! -name "*.tmp*" ! -name "*~")
# Convert src/example.org to example/index.html
HTMLFILES := $(patsubst src/%.org,%/index.html,$(ORGFILES))

all: 
	$(HTMLFILES)

%/index.html: src/%.org   	
	# Convert .org to .html
	@mkdir -p $(dir $@)   
	@echo "Converting: $<"
	pandoc -f org -t html5 --quiet \
	-s \ 
	-o $@ $<

# Clean up the generated HTML files
clean:
	rm -rf $(dir $(HTMLFILES)) # Remove recursively the directories

# Rebuild by cleaning and then running the all target
rebuild: 
	clean all

debug:
	@echo $(ORGFILES)
	@echo $(HTMLFILES)
