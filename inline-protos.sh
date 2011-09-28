#!/bin/bash

WIDGET_BASE_DIR="$1"

if test "x${WIDGET_BASE_DIR}x" = "xx"; then
  echo "Usage: $(basename $0) <widget_base_dir>"
  exit 1
fi

for FNAME in ${WIDGET_BASE_DIR}/js/*.js; do
  cat ${FNAME} | \
    sed -rn '1h;1!H;${;g;s/(\$\.mobile\.todons\.loadPrototype[^"]*)("[^"]*")/\1\n@\2@\n/g;p;}' | \
    awk -v 'doPrint=1' '
      /^@[^@]*@/{
        split($0, ar, /"/);
        protoName = ar[2];
        protoFile = "'"${WIDGET_BASE_DIR}"'/proto-html/" protoName ".prototype.html";
        insideTag = 0;
        printf("{ key: \"" protoName "\",\nproto:\n\"");
        while (1 == (getline inputLine < protoFile)) {
          for (Nix = 1 ; Nix <= length(inputLine) ; Nix++) {
            theChar = substr(inputLine, Nix, 1);
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
        doPrint=0;
      }
      {
        if (1 == doPrint)
          print;
        else
          doPrint = 1;
      }'
done
