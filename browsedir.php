<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<title>welcome to Canvas</title>
	</head>
	<body>
		<h1>Canvas..</h1>
		<?php
		$current_dir = '.';
		$dir = opendir($current_dir);

		echo "$current_dir";
		echo '<ul>';

		while(false !== ($file = readdir($dir))) {
			if($file != '.' && $file != '..' && $file !='browsedir.php') {
				echo "<li><a href=\"". $file ."\">" . $file ."</a></li>";
			}
		}

		echo '</ul>';
		closedir($dir);
		?>
	</body>
</html>