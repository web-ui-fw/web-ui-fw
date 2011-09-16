#!/bin/bash

### Prepare: set global variables ###
CWD=`pwd`
SCRIPTDIR="`cd \`dirname $0\`/; pwd`"
LIBDIR=/usr/share/slp-web-fw
DATA_FRAMEWORK_ROOT=


# Parse options 
# from parseopt.inc
# Parse commandline options, and export option variables
#
# Created by Youmin Ha <youmin.ha@samsung.com>
#
# Usage:
#   - Set option_list array like below:
#     option_list=( "--prelink" "--foo=" )
#   - Add this inc by following code:
#     . ${TOPDIR}/inc/parseopt.inc
#
#   After including parseopt.inc, argc and argv are set, excluding options in option_list.

function parseopt
{
	argv=( "$@" )
	argc=${#argv[@]}

	if test ! -n "${option_list}"; then
		local option_list=( );	# available option list, starting --
	fi

	local idx=0
	unset __changed
	while [ "$idx" -lt "$argc" ];
	do
		local arg=${argv[${idx}]}
		local tmp_idx=0
		
		for _valid_option in ${option_list[@]}
		do
			#echo "...for valid option:$_valid_option"
			#echo "   ...check arg:${arg:0:${#_valid_option}}"
			if [[ "$_valid_option" == "${arg:0:${#_valid_option}}" ]]; then
				#echo "...found valid option:$_valid_option"
				if [ ${_valid_option:${#_valid_option}-1} == "=" ]; then
					eval "export ${arg#--}"
						else
					eval "export ${arg#--}=1"
				fi

				# pull remained options
				let "tmp_idx = $idx + 1"
				while [ "$tmp_idx" -lt "${#argv[@]}" ]
				do
					argv[$tmp_idx-1]="${argv[$tmp_idx]}"
					let "tmp_idx = $tmp_idx + 1"
				done
				unset argv[${#argv[@]}-1]
				local __changed=1
				break
			fi
		done
		if [ ! -n "$__changed" ]; then
			let "idx = $idx + 1"
		fi
		unset __changed
	done
	argc=${#argv[@]}
}

option_list=( "--copylib" "--type=" )
parseopt $@

APP_NAME=${argv[0]}
INSTALL_DIR=${argv[1]}
DESTDIR="$INSTALL_DIR/$APP_NAME"


# Print usage and exit #
function usage
{
	local EXITCODE=1
	if [ -n "$1" ]; then local ERRMSG=$1; else local ERRMSG="Invalid arguments"; fi
	local NO_USAGE=$2

	if [ -n "$1" ]; then EXITCODE=1; echo "ERROR: $ERRMSG"; echo ""; fi

	if [ ! -n "$2" ]; then 
		echo "Usage: $0 <--copylib> <app-name> <install-dir>"
		echo ""
		echo "       app-name : Your application name. If whitespace is contained, wrap it "
		echo "                  by quote mark."
		echo "       install-dir : Directory which the template code directory with name of"
		echo "                  app-name is created in."
		echo "                  <install-dir>/<app-name>/ directory will be created."
		echo "       --copylib : When this option is used, all libs and resources will be "
		echo "                  copied into template directory, and all templates will refer"
		echo "                  those copied libs."
		echo "       --type=[w3c|wac]"
		echo "                  Set type of application template. If no --type= option is given,"
		echo "                  only default app template files will be copied."
		echo ""
	fi

	exit $EXITCODE
}


### Check argv ###
function check_argv
{
	if [ ! -d "$INSTALL_DIR" ]; then usage "No install-dir found; $INSTALL_DIR"; fi
	if [ -e "$DESTDIR" ]; then usage "$DESTDIR already exists"; fi
}


### Copy template files into installation directory ###
function copy_template
{
	local libpath=$LIBDIR
	local tplpath=$libpath/template

	# Check if this script is in src script
	if [ -f "${SCRIPTDIR}/../src/template/bootstrap.js" ]; then
		libpath="${SCRIPTDIR}/../build"
		tplpath=${SCRIPTDIR}/../src/template
	fi

	echo "Copying template files into $DESTDIR..."
	mkdir -p $DESTDIR || usage "ERROR: Failed to create directory: $DESTDIR"
	find $tplpath/ -maxdepth 1 -type f | xargs -i cp -a {} $DESTDIR/ ||  usage "ERROR: Failed to copy templates" ;
	if [[ -n "$type" && -d "$tplpath/$type" ]]; then	# Copy type-specific files
		cp -a $tplpath/$type/* $DESTDIR/ || usage "ERROR: Failed to copy templates"
	fi

	# copy lib if --copylib option is given
	if [ -n "$copylib" ]; then
		echo "Copying libs into $DESTDIR..."
		cp -a ${libpath}/web-ui-fw ${DESTDIR}/	|| usage "ERROR: Failed to copy libs"
		LIBDIR="."	# This new value is used by replace_template()
	else   # otherwise, just set framework-root
		DATA_FRAMEWORK_ROOT="data-framework-root=\"file://$LIBDIR/web-ui-fw\""
		LIBDIR="file://$LIBDIR/template"
	fi
}


### Replace filename & keywords ###
function replace_template
{
	echo "Replacing contents of template files..."

	local replace_keywords=( "APP_NAME" "LIBDIR" "DATA_FRAMEWORK_ROOT")

	local in_file_path_list=`find $DESTDIR -name '*.in' -type f -print`
	for in_file_path in ${in_file_path_list[@]}; do
		for keyword in "${replace_keywords[@]}"; do 
			eval "local val=\$$keyword"
			#echo "keyword=$keyword, val=$val"
			sed -i -e "s#@$keyword@#$val#g" $in_file_path
		done
	done
	rename 's/\.in//' $DESTDIR/*
}


### main ###
check_argv
copy_template
replace_template

