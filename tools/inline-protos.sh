#!/bin/bash

WIDGET_BASE_DIR="$1"

process_fname() # $1 = file name
{
	FNAME="$1"
  cat ${FNAME} | \
    sed -rn '1h;1!H;${;g;s/(\$\.mobile\.todons\.loadPrototype[^"]*)("[^"]*")/\1'$'\1''\2'$'\1''/g;p;}' | \
    sed -rn '1h;1!H;${;g;s!(/\*|\*/)!'$'\1''\1'$'\1''!g;p;}' | \
		awk '
			{
				n = split($0, ar, /\001/);
				if (n > 1) {
					for (Nix = 1 ; Nix <= n ; Nix++) {
						if (ar[Nix] == "/*") {
							inComment = 1;
							printf("%s", ar[Nix]);
						}
						else
						if (ar[Nix] == "*/") {
							inComment = 0;
							printf("%s", ar[Nix]);
						}
						else
						if (1 == inComment || Nix % 2)
							printf("%s", ar[Nix]);
						else {
							split(ar[Nix], widgetAr, /"/);
							protoName = widgetAr[2];
        			protoFile = "'"${WIDGET_BASE_DIR}"'/proto-html/" protoName ".prototype.html";
        			insideTag = 0;
        			printf("{ key: \"" protoName "\",\nproto:\n\"");
        			while (1 == (getline inputLine < protoFile)) {
          			for (Nix1 = 1 ; Nix1 <= length(inputLine) ; Nix1++) {
            			theChar = substr(inputLine, Nix1, 1);
            			if ("<" == theChar)
              			insideTag = 1;
            			else
            			if (">" == theChar)
              			insideTag = 0;
            			if (insideTag && "\"" == theChar)
              			theChar = "'"'"'";
            			printf("%s", theChar);
          			}
          			printf("\" +\n\"");
        			}
        			printf("\"}");
        			close(protoFile);
						}
					}
					print("");
				}
				else
					print;
			}
		'
}

if test "x${WIDGET_BASE_DIR}x" = "xx"; then
  echo "Usage: $(basename $0) <widget_base_dir>"
  exit 1
fi

for FNAME in ${WIDGET_BASE_DIR}/js/*.js; do
	process_fname $FNAME
done
