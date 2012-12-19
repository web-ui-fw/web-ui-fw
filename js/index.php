<?php
$type = 'text/javascript';
$files = array(
	'behaviors/optionDemultiplexer.js',
	'behaviors/setValue.js'
);

function getGitHeadPath() {
	$gitRoot = "../";
	$gitDir = ".git";
	$path = $gitRoot . $gitDir;

	if ( is_file( $path ) && is_readable( $path ) ) {
		$contents = file_get_contents( $path );
		if ( $contents ) {
			$contents = explode( " ", $contents );
			if ( count( $contents ) > 1 ) {
				$contents = explode( "\n", $contents[ 1 ] );
				if ( $contents && count( $contents ) > 0 ) {
					$path = $gitRoot . $contents[ 0 ];
				}
			}
		}
	}

	return $path . "/logs/HEAD";
}

function getCommitId() {
	$gitHeadPath = getGitHeadPath();

	if ( $gitHeadPath ) {
		$logs = ( is_readable( $gitHeadPath ) ? file_get_contents( $gitHeadPath ) : false );
		if ( $logs ) {
			$logs = explode( "\n", $logs );
			$n_logs = count( $logs );
			if ( $n_logs > 1 ) {
				$log = explode( " ", $logs[ $n_logs - 2 ] );
				if ( count( $log ) > 1 ) {
					return $log[ 1 ];
				}
			}
		}
	}

	return false;
}

$comment = getCommitId();
if ( !$comment ) {
	unset( $comment );
} else {
	$comment = "/* git commitid " . $comment . " */\n";
}

require_once('../jqm/combine.php');