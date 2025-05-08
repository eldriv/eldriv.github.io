.PHONY: all clean rebuild debug

# Find all .org files in the src directory, excluding temporary and backup files.
ORGFILES := $(filter-out src/main.org, $(shell find src -maxdepth 1 -name "*.org" ! -name "*.tmp*" ! -name "*~"))

# Convert src/foo.org to html-files/foo/index.html
HTMLFILES := $(patsubst src/%.org,html-files/%/index.html,$(ORGFILES))
FILESTOPUSH := $(shell git status --porcelain | awk '{print $$2}')

all:	clean	$(HTMLFILES)

rebuild:	$(HTMLFILES)

# Update rule to store HTML files inside html-files directory
html-files/%/index.html: src/%.org
	@mkdir -p $(dir $@)
	@echo "Converting: $<"
	pandoc -f org -t html5 --quiet \
	-s \
	-o $@ $<

clean:
	rm -rf $(dir $(HTMLFILES))

ph:
	git add $(FILESTOPUSH)
	git commit -m "t"
	git push

delete-main:
	git rm -r main

# Debugging the .org and .html files
debug:
	@echo "ORGFILES:"
	@echo "---------"
	@$(foreach file, $(ORGFILES), echo $(file);)
	@echo ""
	@echo "HTMLFILES:"
	@echo "----------"
	@$(foreach file, $(HTMLFILES), echo $(file);)

serve: 
	screen -dmS eldriv.com python3 -m http.server 5000

kill-serve:
	screen -S eldriv.com -X quit
