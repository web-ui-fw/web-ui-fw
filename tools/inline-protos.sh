#!/bin/bash

WIDGET_BASE_DIR="$1"
VERBOSE=$(test "x$2x" != "xx" && echo "1" || echo "0")

rm_tmpfile() # No args
{
    if test $VERBOSE -eq 1; then
        echo "Removing ${TMP_FNAME}" > /dev/stderr
    fi
    rm -f "${TMP_FNAME}"
}

trap rm_tmpfile TERM INT

process_fname() # $1 = file name, n_pass
{
  FNAME="$1"
  N_PASS="$2"
  cat ${FNAME} | \
    sed -rn '1h;1!H;${;g;s!((\$|jQuery)([\n \t]|/\*.*\*/)*\.([\n \t]|/\*.*\*/)*widget([\n \t]|/\*.*\*/)*\(([\n \t]|/\*.*\*/)*")([^"]*)("[^{]*\{)!\1'$'\1''\7'$'\1''\8!g;p;}' | \
    sed -rn '1h;1!H;${;g;s!(/\*|\*/|//|[{}])!'$'\1''\1'$'\1''!g;p;}' | \
    gawk \
      -v 'nPass='"${N_PASS}" \
      -v 'inComment=0' \
      -v 'inWidgetBody=0' \
      -v 'inHtmlProto=0' \
      -v 'widgetName=' \
      -v 'braceCount=0' \
      -v 'sourceToken=0' \
      -v 'sourceValue=' \
      -v 'seenSource=0' \
      -v 'needAnotherPass=0' \
      -v 'needToAddComma=0' \
      '
      function dumpProto(protoName) {
        protoFile = "'"${WIDGET_BASE_DIR}"'/proto-html/" protoName ".prototype.html";
        if (system("test -r " protoFile)) {
          print "\033[7minline-protos.sh: Warning: " protoFile " not found\033[0m" > "/dev/stderr";
          printf("\"%s\"", protoName);
        }
        else {
          insideTag = 0;
          printf("\n$(\"<div>");
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
            printf("\" +\n  \"");
          }
          printf("</div>\")");
          close(protoFile);
        }
      }

      function establishInliningVariables(widgetName, token) {
        if (1 == inWidgetBody) {
          if (1 == braceCount) {
            if (match(token, /[ \t]([^: \t]*):/, arToken))
              inHtmlProto = ((arToken[1] == "_htmlProto") ? 1 : 0);
            printf("%s", token);
          }
          else {
            if (inHtmlProto == 1) {
              if (nPass == 1 && seenSource == 0) {
                printf("\nsource:\n");
                dumpProto(widgetName);
                seenSource = 1;
                needToAddComma = 1;
              }
              if (braceCount == 2) {
                sourceTokenHasMatched = 0;
                if (match(token, /[ \t]([a-zA-Z0-9_]*)[ \t]*:/, arToken)) {
                  sourceToken = ((arToken[1] == "source") ? 1 : 0);
                  sourceTokenHasMatched = 1;
                  if (needToAddComma == 1) {
                    printf(",");
                    needToAddComma = 0;
                  }
                }

                if (sourceToken == 0) {
                  if (sourceValue != "") {
                    if (match(sourceValue, /^[\n\t ]*("([^"]*)")/, sourceWidgetAr)) {
                      sourceWidgetName = sourceWidgetAr[2];
                      printf("%s", substr(sourceValue, 1, sourceWidgetAr[1, "start"] - 1));
                      dumpProto(sourceWidgetName);
                      printf("%s", substr(sourceValue, sourceWidgetAr[1, "start"] + sourceWidgetAr[1, "length"]));
                    }
                    else
                      printf("%s", sourceValue);
                    sourceValue = "";
                  }
                  printf("%s", token);
                }
                else {
                  if (sourceTokenHasMatched) {
                    nArSource = split(token, arSource, ":");
                    printf("%s:", arSource[1]);

                    for (idxArSource = 2 ; idxArSource <= nArSource ; idxArSource++) {
                      seenSource = 1;
                      sourceValue = sourceValue arSource[idxArSource];
                      if (idxArSource < nArSource)
                        sourceValue = sourceValue ":";
                    }
                  }
                  else {
                    seenSource = 1;
                    sourceValue = sourceValue token;
                  }
                }
              }
              else
                printf("%s", token);
            }
            else
              printf("%s", token);
          }
        }
        else
          printf("%s", token);
      }
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
            if (ar[Nix] == "//") {
              for (; Nix <= n ; Nix++)
                printf("%s", ar[Nix]);
            }
            else
            if (1 == inComment)
              printf("%s", ar[Nix]);
            else
            if (Nix % 2) {
              establishInliningVariables(widgetName, ar[Nix]);
            }
            else {
              /* ar[Nix] is an interesting token not inside comments */
              if ("{" == ar[Nix] || "}" == ar[Nix]) {
                if (widgetName != "" && inWidgetBody == 0) {
                  if ("{" == ar[Nix])
                    inWidgetBody = 1;
                  else
                    exit(1);
                }
                if (inWidgetBody == 1) {
                  if ("{" == ar[Nix])
                    braceCount++;
                  else
                  if ("}" == ar[Nix]) {
                    if (inHtmlProto == 1 && braceCount == 2) {
                      if (seenSource == 0)
                        needAnotherPass = 1;
                      seenSource = 0;
                    }
                    braceCount--;
                  }
                }
              }
              else {
                split(ar[Nix], arWidget, ".");
                widgetName = arWidget[2];
              }
              if (widgetName == "")
                printf("%s", ar[Nix]);
              else
                printf("%s", ar[Nix]);
            }
          }
          print("");
        }
        else
          if (inComment)
            print;
          else
            establishInliningVariables(widgetName, $0 "\n");
      }
      END { exit(needAnotherPass); }
    '
}

if test "x${WIDGET_BASE_DIR}x" = "xx"; then
  echo "Usage: $(basename $0) <widget_base_dir>"
  exit 1
fi

for FNAME in ${WIDGET_BASE_DIR}/js/*.js; do
  TMP_FNAME=`mktemp`
  N_PASS=0
  while ! process_fname $FNAME $N_PASS > $TMP_FNAME; do 
    if test $VERBOSE -eq 1; then
        echo "Going for another pass with ${TMP_FNAME}" > /dev/stderr
    fi
    N_PASS=`expr "$N_PASS" + 1`
  done
  cat $TMP_FNAME
  rm_tmpfile
done
